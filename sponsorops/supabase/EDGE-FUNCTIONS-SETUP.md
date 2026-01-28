# SponsorOps Edge Functions Setup Guide

This guide walks you through setting up email notifications for team invites.

## Overview

When someone invites a new member to a team:
1. An invite record is created in `team_invites`
2. The Edge Function triggers and sends an email via Supabase Auth
3. New users get the "Invite User" email template you configured
4. Existing users see the pending invite when they log in

## Quick Start (No Edge Function Needed)

**For immediate testing**, you can skip the Edge Function setup entirely:

1. Invite a user via Team Settings
2. Share your app URL with them: `https://sponsorops.netlify.app`
3. They sign up/log in with the invited email
4. They'll see the pending invite and can accept it

The Edge Function just automates sending the invite email.

---

## Full Setup: Automatic Invite Emails

### Step 1: Configure the Invite Email Template

In **Supabase Dashboard** > **Authentication** > **Email Templates** > **Invite User**:

You can use template variables in the email:
- `{{ .Email }}` - The invited email address
- `{{ .ConfirmationURL }}` - The magic link to accept
- `{{ .Data.team_name }}` - Team name (passed from Edge Function)
- `{{ .Data.team_number }}` - Team number (passed from Edge Function)

### Step 2: Deploy the Edge Function

In **Supabase Dashboard**:

1. Go to **Edge Functions** → **New Function**
2. Name: `send-invite-email`
3. Copy contents from `supabase/functions/send-invite-email/index.ts`
4. Click **Deploy**

### Step 3: Add the APP_URL Secret

In **Edge Functions** → **send-invite-email** → **Manage Secrets**:

| Name | Value |
|------|-------|
| `APP_URL` | `https://sponsorops.netlify.app` |

Note: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available.

### Step 4: Create Database Webhook

Go to **Database** → **Webhooks** → **Create webhook**:

- **Name**: `send-invite-email`
- **Table**: `team_invites`
- **Events**: ✓ INSERT
- **Type**: Supabase Edge Function
- **Function**: `send-invite-email`

Click **Create webhook**.

---

## How It Works

```
Admin invites user@email.com
         ↓
  team_invites INSERT
         ↓
   Webhook triggers
         ↓
  Edge Function runs
         ↓
  ┌─────────────────────┐
  │ User already exists?│
  │                     │
  │  YES → Skip email   │
  │  (they'll see it    │
  │   when they log in) │
  │                     │
  │  NO → Send Supabase │
  │  Auth invite email  │
  └─────────────────────┘
         ↓
 User clicks link in email
         ↓
 Redirected to app, logged in
         ↓
 Sees pending invite, accepts
         ↓
    Added to team!
```

---

## Testing

1. Go to Team Settings in your app
2. Invite a test email address
3. Check if the email arrives (check spam folder too)
4. Click the link in the email
5. You should land on the app and see the team invite

### Check Edge Function Logs

**Edge Functions** → **send-invite-email** → **Logs**

Look for:
- `Invite sent successfully to email@example.com for team Team Name`
- Or any error messages

---

## Troubleshooting

### Email not arriving?

1. Check spam/junk folder
2. Check Edge Function logs for errors
3. Verify the webhook is enabled and pointing to the right function
4. Make sure your Supabase email sending is configured (check Auth settings)

### "User already exists" in logs?

This is normal! Existing users don't get an invite email - they'll see the pending invite when they log in to the app.

### Function not triggering?

1. Check webhook is enabled: **Database** → **Webhooks**
2. Check webhook targets correct function
3. Try re-creating the webhook

---

## Email Template Example

Here's a sample "Invite User" template using the team data:

**Subject:**
```
You're invited to join {{ .Data.team_name }} on SponsorOps
```

**Body:**
```html
<h2>You're invited!</h2>
<p>You've been invited to join <strong>{{ .Data.team_name }}</strong>
   (Team #{{ .Data.team_number }}) on SponsorOps.</p>
<p><a href="{{ .ConfirmationURL }}">Click here to accept</a></p>
```

---

## Costs

- **Supabase Auth Emails**: Included in free tier (limited volume)
- **Supabase Edge Functions**: 500,000 invocations/month free

For most FRC teams, the free tier is plenty.
