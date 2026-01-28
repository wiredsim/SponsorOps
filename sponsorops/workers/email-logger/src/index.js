/**
 * SponsorOps Email Logger Worker
 *
 * Receives inbound email webhooks from Resend and logs them as interactions.
 *
 * Supports:
 * - BCC: BCC log@sponsorops.net when emailing a sponsor
 * - Forward: Forward sent emails to log@sponsorops.net
 *
 * The worker matches recipients to sponsors/contacts and auto-logs interactions.
 */

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Health check
    if (request.method === 'GET') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'SponsorOps Email Logger',
        usage: 'BCC or forward emails to log@sponsorops.net to log sponsor interactions'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle Resend webhook
    if (request.method === 'POST') {
      try {
        const payload = await request.json();
        console.log('Received webhook:', JSON.stringify(payload, null, 2));

        // Resend inbound email structure varies - let's handle multiple formats
        const data = payload.data || payload;
        const type = payload.type || 'email.received';

        // Extract email details - handle various formats
        const from = extractEmail(data.from || data.sender || data.envelope?.from);
        const to = extractEmailList(data.to || data.envelope?.to || []);
        const cc = extractEmailList(data.cc || []);
        const subject = data.subject || '(no subject)';
        const textBody = data.text || data.body || data.html || '';

        // Get all direct recipients (exclude our log address)
        let allRecipients = [...to, ...cc]
          .filter(addr => addr && !addr.toLowerCase().includes('log@sponsorops.net'));

        console.log('Direct recipients:', allRecipients);

        // If no direct recipients, this might be a forwarded email
        // Try to extract original recipients from the email body
        if (allRecipients.length === 0 && textBody) {
          const forwardedRecipients = extractEmailsFromForward(textBody);
          allRecipients = forwardedRecipients;
          console.log('Extracted from forwarded email:', allRecipients);
        }

        console.log('Processing email:', {
          from,
          recipients: allRecipients,
          subject,
          bodyLength: textBody.length
        });

        if (allRecipients.length === 0) {
          // Queue for manual review
          await queueEmail(env, {
            from,
            to: '',
            subject,
            body: textBody,
            payload
          });

          return new Response(JSON.stringify({
            success: true,
            message: 'Email queued for manual assignment (no recipients found)',
            hint: 'For forwards, make sure the original email headers are included'
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Try to find a matching sponsor via contacts table first, then sponsors table
        const match = await findSponsorByEmail(env, allRecipients);

        if (match) {
          // Log the interaction
          await logInteraction(env, {
            sponsor_id: match.sponsor_id,
            team_id: match.team_id,
            type: 'email',
            notes: `Subject: ${subject}\n\n(Logged via log@sponsorops.net)`,
            date: new Date().toISOString().split('T')[0],
            email_from: from,
            email_to: allRecipients.join(', '),
            email_subject: subject,
            contact_name: match.contact_name
          });

          console.log(`Logged interaction for sponsor: ${match.sponsor_name}`);

          return new Response(JSON.stringify({
            success: true,
            message: `Logged interaction for ${match.sponsor_name}`,
            contact: match.contact_name,
            matchedEmail: match.matched_email
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          console.log('No matching sponsor/contact found for:', allRecipients);

          // Queue for manual assignment
          await queueEmail(env, {
            from,
            to: allRecipients.join(', '),
            subject,
            body: textBody,
            payload
          });

          return new Response(JSON.stringify({
            success: true,
            message: 'Email queued for manual assignment',
            recipients: allRecipients,
            hint: 'Check the email queue in SponsorOps to assign to a sponsor'
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

      } catch (error) {
        console.error('Error processing webhook:', error);
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Method not allowed', { status: 405 });
  }
};

/**
 * Extract a single email address from various formats
 */
function extractEmail(input) {
  if (!input) return null;
  if (typeof input === 'string') {
    // Handle "Name <email@example.com>" format
    const match = input.match(/<([^>]+)>/) || input.match(/([^\s<>]+@[^\s<>]+)/);
    return match ? match[1].toLowerCase() : input.toLowerCase();
  }
  if (typeof input === 'object') {
    return (input.email || input.address || '').toLowerCase();
  }
  return null;
}

/**
 * Extract list of email addresses
 */
function extractEmailList(input) {
  if (!input) return [];
  if (typeof input === 'string') {
    // Could be comma-separated
    return input.split(',').map(e => extractEmail(e.trim())).filter(Boolean);
  }
  if (Array.isArray(input)) {
    return input.map(e => extractEmail(e)).filter(Boolean);
  }
  return [];
}

/**
 * Extract email addresses from forwarded email body
 * Looks for patterns like "To: email@example.com" in the body
 */
function extractEmailsFromForward(body) {
  const emails = new Set();

  // Common patterns in forwarded emails
  const patterns = [
    /To:\s*<?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>?/gi,
    /Cc:\s*<?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>?/gi,
    /mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi,
    // Generic email pattern as fallback (but exclude common false positives)
    /\b([a-zA-Z0-9._%+-]+@(?!sponsorops\.net)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/gi
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(body)) !== null) {
      const email = match[1].toLowerCase();
      // Exclude our own addresses and common noreply addresses
      if (!email.includes('sponsorops.net') &&
          !email.includes('noreply') &&
          !email.includes('no-reply') &&
          !email.includes('mailer-daemon')) {
        emails.add(email);
      }
    }
  }

  return Array.from(emails);
}

/**
 * Find a sponsor by checking contacts table first, then sponsors table
 */
async function findSponsorByEmail(env, recipientEmails) {
  if (!recipientEmails || recipientEmails.length === 0) return null;

  try {
    // First, search the contacts table
    for (const email of recipientEmails) {
      const contactResponse = await fetch(
        `${env.SUPABASE_URL}/rest/v1/contacts?email=ilike.${encodeURIComponent(email)}&select=id,name,email,sponsor_id,team_id`,
        {
          headers: {
            'apikey': env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (contactResponse.ok) {
        const contacts = await contactResponse.json();
        if (contacts.length > 0) {
          const contact = contacts[0];
          // Get sponsor name
          const sponsorResponse = await fetch(
            `${env.SUPABASE_URL}/rest/v1/sponsors?id=eq.${contact.sponsor_id}&select=name`,
            {
              headers: {
                'apikey': env.SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );
          const sponsors = await sponsorResponse.json();
          return {
            sponsor_id: contact.sponsor_id,
            team_id: contact.team_id,
            sponsor_name: sponsors[0]?.name || 'Unknown',
            contact_name: contact.name,
            matched_email: email
          };
        }
      }
    }

    // Fallback: search sponsors table directly
    for (const email of recipientEmails) {
      const response = await fetch(
        `${env.SUPABASE_URL}/rest/v1/sponsors?email=ilike.${encodeURIComponent(email)}&deleted_at=is.null&select=id,name,team_id,contact_name`,
        {
          headers: {
            'apikey': env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const sponsors = await response.json();
        if (sponsors.length > 0) {
          const sponsor = sponsors[0];
          return {
            sponsor_id: sponsor.id,
            team_id: sponsor.team_id,
            sponsor_name: sponsor.name,
            contact_name: sponsor.contact_name,
            matched_email: email
          };
        }
      }
    }

    return null;

  } catch (error) {
    console.error('Error querying Supabase:', error);
    return null;
  }
}

/**
 * Log an interaction in Supabase
 */
async function logInteraction(env, interaction) {
  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/interactions`,
      {
        method: 'POST',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          sponsor_id: interaction.sponsor_id,
          team_id: interaction.team_id,
          type: interaction.type,
          notes: interaction.notes,
          date: interaction.date,
          created_by: null, // System-created
          metadata: {
            logged_via: 'email',
            email_from: interaction.email_from,
            email_to: interaction.email_to,
            email_subject: interaction.email_subject,
            contact_name: interaction.contact_name
          }
        })
      }
    );

    if (!response.ok) {
      console.error('Failed to log interaction:', await response.text());
      return false;
    }

    return true;

  } catch (error) {
    console.error('Error logging interaction:', error);
    return false;
  }
}

/**
 * Queue an unmatched email for manual assignment
 */
async function queueEmail(env, email) {
  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/email_queue`,
      {
        method: 'POST',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          email_from: email.from,
          email_to: email.to,
          email_subject: email.subject,
          email_body_preview: (email.body || '').substring(0, 500),
          status: 'pending',
          raw_payload: email.payload
        })
      }
    );

    if (!response.ok) {
      console.error('Failed to queue email:', await response.text());
      return false;
    }

    console.log('Email queued for manual assignment');
    return true;

  } catch (error) {
    console.error('Error queuing email:', error);
    return false;
  }
}
