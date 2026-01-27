# SponsorOps Edge Functions Setup Guide

This guide walks you through setting up email notifications for team invites.

## Overview

When someone invites a new member to a team, an email is automatically sent to the invitee with:
- Team name and number
- Who invited them
- Link to accept the invitation

## Prerequisites

1. **Resend Account** (free tier: 100 emails/day)
   - Sign up at https://resend.com
   - Get your API key from the dashboard

2. **Supabase CLI** (optional, for local development)
   ```bash
   npm install -g supabase
   ```

## Setup Steps

### Step 1: Get a Resend API Key

1. Go to https://resend.com and create an account
2. Go to **API Keys** in the dashboard
3. Create a new API key
4. Copy the key (starts with `re_`)

### Step 2: Verify Your Domain (Required for Production)

By default, Resend only lets you send from `onboarding@resend.dev`. For production:

1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `sponsorops.com`)
3. Add the DNS records they provide
4. Wait for verification (usually a few minutes)

For testing, you can use `onboarding@resend.dev` as the sender.

### Step 3: Deploy the Edge Function

#### Option A: Via Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions**
3. Click **New Function**
4. Name it `send-invite-email`
5. Copy the contents of `supabase/functions/send-invite-email/index.ts`
6. Paste it into the editor
7. Click **Deploy**

#### Option B: Via Supabase CLI

```bash
cd sponsorops
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy send-invite-email
```

### Step 4: Set Environment Variables

In Supabase Dashboard:

1. Go to **Edge Functions** > **send-invite-email**
2. Click **Manage Secrets**
3. Add these secrets:

| Name | Value |
|------|-------|
| `RESEND_API_KEY` | Your Resend API key (re_...) |
| `APP_URL` | Your app URL (e.g., `https://sponsorops.netlify.app`) |

Note: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available.

### Step 5: Create the Database Webhook

This triggers the Edge Function whenever a new invite is created.

1. Go to **Database** > **Webhooks** in Supabase Dashboard
2. Click **Create a new webhook**
3. Configure:
   - **Name**: `send-invite-email`
   - **Table**: `team_invites`
   - **Events**: `INSERT`
   - **Type**: `Supabase Edge Function`
   - **Edge Function**: `send-invite-email`
   - **HTTP Headers**: Leave default
4. Click **Create webhook**

### Step 6: Update the From Address

Edit the Edge Function to use your verified domain:

```typescript
// Change this line in index.ts
from: "SponsorOps <invites@sponsorops.com>",

// To this for testing:
from: "SponsorOps <onboarding@resend.dev>",

// Or your verified domain:
from: "SponsorOps <invites@yourdomain.com>",
```

## Testing

1. Go to Team Settings in your app
2. Invite a test email address
3. Check if the email arrives
4. Check Edge Function logs in Supabase Dashboard for any errors

## Troubleshooting

### Email not sending?

1. Check Edge Function logs: **Edge Functions** > **send-invite-email** > **Logs**
2. Verify RESEND_API_KEY is set correctly
3. Make sure the webhook is enabled and targeting the right function

### "Sender not verified" error?

- For testing, change the `from` address to `onboarding@resend.dev`
- For production, verify your domain in Resend

### Function timing out?

- Check if Supabase URL and Service Role Key are accessible
- Verify network connectivity to Resend API

## Email Template Customization

The email template is embedded in the Edge Function. To customize:

1. Edit `supabase/functions/send-invite-email/index.ts`
2. Modify the `emailHtml` template
3. Re-deploy the function

## Costs

- **Resend Free Tier**: 100 emails/day, 3,000 emails/month
- **Supabase Edge Functions**: 500,000 invocations/month free

For most FRC teams, the free tiers will be more than sufficient.

## Alternative: Use Supabase's Built-in Email (Limited)

If you don't want to set up Resend, you can use Supabase's Auth emails, but:
- They only work for auth flows (signup, magic link, reset password)
- They can't be triggered by custom events like team invites
- They have Supabase branding

For team invite emails, a third-party service like Resend is required.
