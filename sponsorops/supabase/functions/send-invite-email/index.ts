import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
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

    const { team_id, email } = payload.record;

    // Create Supabase admin client with service role
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get team details for the email template data
    const { data: team, error: teamError } = await supabaseAdmin
      .from("teams")
      .select("name, team_number")
      .eq("id", team_id)
      .single();

    if (teamError) {
      console.error("Error fetching team:", teamError);
      throw teamError;
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(u => u.email?.toLowerCase() === email.toLowerCase());

    if (userExists) {
      // User already has an account - they'll see the pending invite when they log in
      console.log(`User ${email} already exists, skipping invite email`);
      return new Response(
        JSON.stringify({
          success: true,
          message: "User already exists, invite will show on login"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Send invite using Supabase Auth's built-in invite
    // This uses the "Invite User" email template configured in Supabase Dashboard
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: APP_URL,
      data: {
        team_name: team.name,
        team_number: team.team_number,
        invited_to_team: team_id,
      },
    });

    if (error) {
      console.error("Error sending invite:", error);
      throw error;
    }

    console.log(`Invite sent successfully to ${email} for team ${team.name}`);

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
