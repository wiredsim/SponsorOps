import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const APP_URL = Deno.env.get("APP_URL") || "https://sponsorops.netlify.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitePayload {
  type: "INSERT";
  table: "team_invites";
  record: {
    id: string;
    team_id: string;
    email: string;
    invited_by: string;
    created_at: string;
    expires_at: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: InvitePayload = await req.json();

    if (!payload.record) {
      throw new Error("No record in payload");
    }

    const { team_id, email, invited_by } = payload.record;

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get team details
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("name, team_number")
      .eq("id", team_id)
      .single();

    if (teamError) throw teamError;

    // Get inviter details from user_profiles
    const { data: inviter, error: inviterError } = await supabase
      .from("user_profiles")
      .select("display_name, email")
      .eq("id", invited_by)
      .single();

    // Fallback if no profile found
    const inviterName = inviter?.display_name || inviter?.email || "A team member";

    // Send email via Resend
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; padding: 40px; border: 1px solid #334155; }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo-icon { background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; }
    h1 { color: #ffffff; font-size: 24px; margin: 0 0 10px 0; text-align: center; }
    .subtitle { color: #94a3b8; text-align: center; margin-bottom: 30px; }
    p { color: #cbd5e1; line-height: 1.6; margin: 0 0 20px 0; }
    .button { display: block; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: #ffffff !important; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; text-align: center; margin: 30px 0; }
    .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
    .team-card { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
    .team-name { color: #ffffff; font-size: 20px; font-weight: bold; margin: 0 0 5px 0; }
    .team-number { color: #94a3b8; font-size: 14px; margin: 0; }
    ul { color: #cbd5e1; padding-left: 20px; }
    li { margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <div class="logo-icon">S</div>
      </div>
      <h1>You're Invited!</h1>
      <p class="subtitle">Join your team on SponsorOps</p>

      <div class="team-card">
        <p class="team-name">${team.name}</p>
        ${team.team_number ? `<p class="team-number">FRC Team #${team.team_number}</p>` : ''}
      </div>

      <p><strong>${inviterName}</strong> has invited you to join their team on SponsorOps, the sponsor management platform for FRC teams.</p>

      <p>With SponsorOps, you'll be able to:</p>
      <ul>
        <li>Track sponsor relationships and interactions</li>
        <li>Manage tasks and follow-ups</li>
        <li>Collaborate with your team</li>
      </ul>

      <a href="${APP_URL}" class="button">Accept Invitation</a>

      <p style="font-size: 14px; color: #94a3b8;">This invitation expires in 7 days. Simply sign in with this email address (${email}) to join the team.</p>

      <div class="footer">
        <p>SponsorOps - FRC Sponsor Management</p>
        <p>If you don't recognize this team, you can safely ignore this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SponsorOps <invites@sponsorops.com>",
        to: [email],
        subject: `You've been invited to join ${team.name} on SponsorOps`,
        html: emailHtml,
      }),
    });

    const resendData = await res.json();

    if (!res.ok) {
      console.error("Resend error:", resendData);
      throw new Error(`Failed to send email: ${JSON.stringify(resendData)}`);
    }

    console.log("Email sent successfully:", resendData);

    return new Response(JSON.stringify({ success: true, data: resendData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
