/**
 * SponsorOps Email Logger Worker
 *
 * Receives inbound email webhooks from Resend and logs them as interactions.
 *
 * Usage:
 * - BCC log@sponsorops.net when emailing a sponsor
 * - Forward a sent email to log@sponsorops.net
 * - Resend sends webhook to this worker
 * - Worker matches recipient to a sponsor and logs the interaction
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

        // Resend inbound email webhook structure
        // https://resend.com/docs/dashboard/webhooks/event-types#email-received
        const { type, data } = payload;

        if (type === 'email.received' || type === 'email.delivered' || data?.from) {
          // Handle inbound email
          const email = data;

          // Extract email details
          const from = email.from || email.sender;
          const to = email.to || [];
          const cc = email.cc || [];
          const subject = email.subject || '(no subject)';
          const text = email.text || email.body || '';

          // Get all recipients to find the sponsor (exclude our log address)
          const allRecipients = [...to, ...cc]
            .map(r => typeof r === 'string' ? r : r.email || r.address)
            .filter(addr => addr && !addr.toLowerCase().includes('log@sponsorops.net'));

          // Also check the "from" in case this was forwarded
          const fromEmail = typeof from === 'string' ? from : from?.email || from?.address;

          console.log('Processing email:', {
            from: fromEmail,
            recipients: allRecipients,
            subject
          });

          // Try to find a matching sponsor
          const sponsor = await findSponsorByEmail(env, allRecipients);

          if (sponsor) {
            // Log the interaction
            await logInteraction(env, {
              sponsor_id: sponsor.id,
              team_id: sponsor.team_id,
              type: 'email',
              notes: `Subject: ${subject}\n\n(Logged via log@sponsorops.net)`,
              date: new Date().toISOString().split('T')[0],
              email_from: fromEmail,
              email_to: allRecipients.join(', '),
              email_subject: subject,
            });

            console.log(`Logged interaction for sponsor: ${sponsor.name}`);

            return new Response(JSON.stringify({
              success: true,
              message: `Logged interaction for ${sponsor.name}`
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            console.log('No matching sponsor found for recipients:', allRecipients);

            return new Response(JSON.stringify({
              success: true,
              message: 'Email received but no matching sponsor found',
              recipients: allRecipients
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }

        // Unknown webhook type - acknowledge it
        return new Response(JSON.stringify({
          success: true,
          message: 'Webhook received',
          type: type
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

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
 * Find a sponsor by checking if any of the email recipients match a sponsor's email
 */
async function findSponsorByEmail(env, recipientEmails) {
  if (!recipientEmails || recipientEmails.length === 0) return null;

  try {
    // Query Supabase for sponsors matching any of the recipient emails
    // Using OR filter for multiple emails
    const emailFilters = recipientEmails
      .map(email => `email.ilike.${encodeURIComponent(email)}`)
      .join(',');

    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/sponsors?or=(${emailFilters})&deleted_at=is.null&limit=1`,
      {
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error('Supabase query failed:', await response.text());
      return null;
    }

    const sponsors = await response.json();
    return sponsors.length > 0 ? sponsors[0] : null;

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
            email_subject: interaction.email_subject
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
