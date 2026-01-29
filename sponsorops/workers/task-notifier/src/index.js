export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    // Verify request origin
    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = ['https://sponsorops.net', 'http://localhost:5173', 'http://localhost:4173'];
    if (!allowedOrigins.some(o => origin.startsWith(o))) {
      return jsonResponse({ error: 'Forbidden' }, 403);
    }

    try {
      const body = await request.json();
      const { assigneeEmail, assigneeName, taskDescription, sponsorName, assignedByEmail, teamName } = body;

      if (!assigneeEmail || !taskDescription) {
        return jsonResponse({ error: 'Missing required fields' }, 400);
      }

      // Send email via Resend
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `SponsorOps <notifications@${env.FROM_DOMAIN || 'sponsorops.net'}>`,
          to: [assigneeEmail],
          subject: `New task assigned: ${taskDescription}`,
          html: buildEmailHtml({
            assigneeName: assigneeName || assigneeEmail.split('@')[0],
            taskDescription,
            sponsorName,
            assignedByEmail,
            teamName,
          }),
        }),
      });

      if (!emailResponse.ok) {
        const err = await emailResponse.text();
        console.error('Resend API error:', err);
        return jsonResponse({ success: false, error: 'Failed to send email' }, 500);
      }

      return jsonResponse({ success: true, message: 'Notification sent' });
    } catch (err) {
      console.error('Error:', err);
      return jsonResponse({ error: 'Internal server error' }, 500);
    }
  },
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function buildEmailHtml({ assigneeName, taskDescription, sponsorName, assignedByEmail, teamName }) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">SponsorOps</h1>
        ${teamName ? `<p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 13px;">${teamName}</p>` : ''}
      </div>
      <div style="background: #1e293b; padding: 24px; border-radius: 0 0 12px 12px; color: #e2e8f0;">
        <p style="margin: 0 0 16px; font-size: 15px;">Hey ${assigneeName},</p>
        <p style="margin: 0 0 16px; font-size: 15px;">You've been assigned a new task:</p>
        <div style="background: #0f172a; border-left: 4px solid #f97316; padding: 16px; border-radius: 8px; margin: 0 0 16px;">
          <p style="margin: 0; font-size: 16px; font-weight: 600; color: white;">${taskDescription}</p>
          ${sponsorName ? `<p style="margin: 8px 0 0; font-size: 13px; color: #94a3b8;">Sponsor: ${sponsorName}</p>` : ''}
        </div>
        ${assignedByEmail ? `<p style="margin: 0 0 16px; font-size: 13px; color: #94a3b8;">Assigned by: ${assignedByEmail}</p>` : ''}
        <a href="https://sponsorops.net" style="display: inline-block; background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">View in SponsorOps</a>
      </div>
    </div>
  `;
}
