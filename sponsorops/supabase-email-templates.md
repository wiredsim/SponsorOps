# SponsorOps Email Templates

Configure these in your Supabase Dashboard:
**Authentication > Email Templates**

---

## 1. Magic Link (Sign In)

**Subject:**
```
Sign in to SponsorOps
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; padding: 40px; border: 1px solid #334155; }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo-icon { background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; }
    h1 { color: #ffffff; font-size: 24px; margin: 0 0 10px 0; text-align: center; }
    .subtitle { color: #94a3b8; text-align: center; margin-bottom: 30px; }
    p { color: #cbd5e1; line-height: 1.6; margin: 0 0 20px 0; }
    .button { display: block; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: #ffffff !important; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; text-align: center; margin: 30px 0; }
    .button:hover { box-shadow: 0 10px 25px rgba(249, 115, 22, 0.3); }
    .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
    .link { color: #f97316; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <div class="logo-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3"/>
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
          </svg>
        </div>
      </div>
      <h1>Sign in to SponsorOps</h1>
      <p class="subtitle">FRC Sponsor Management</p>

      <p>Click the button below to sign in to your SponsorOps account. This link will expire in 1 hour.</p>

      <a href="{{ .ConfirmationURL }}" class="button">Sign In to SponsorOps</a>

      <p style="font-size: 14px; color: #94a3b8;">If you didn't request this email, you can safely ignore it.</p>

      <div class="footer">
        <p>SponsorOps - FRC Sponsor Management</p>
        <p>If the button doesn't work, copy and paste this link:<br>
        <a href="{{ .ConfirmationURL }}" class="link">{{ .ConfirmationURL }}</a></p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## 2. Confirm Signup

**Subject:**
```
Confirm your SponsorOps account
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; padding: 40px; border: 1px solid #334155; }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo-icon { background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; }
    h1 { color: #ffffff; font-size: 24px; margin: 0 0 10px 0; text-align: center; }
    .subtitle { color: #94a3b8; text-align: center; margin-bottom: 30px; }
    p { color: #cbd5e1; line-height: 1.6; margin: 0 0 20px 0; }
    .button { display: block; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: #ffffff !important; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; text-align: center; margin: 30px 0; }
    .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
    .link { color: #f97316; }
    .welcome { background: linear-gradient(135deg, #22c55e20 0%, #16a34a20 100%); border: 1px solid #22c55e40; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .welcome-text { color: #4ade80; font-weight: 500; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <div class="logo-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3"/>
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
          </svg>
        </div>
      </div>
      <h1>Welcome to SponsorOps!</h1>
      <p class="subtitle">FRC Sponsor Management</p>

      <div class="welcome">
        <p class="welcome-text">Your account is almost ready!</p>
      </div>

      <p>Thanks for signing up. Click the button below to confirm your email address and get started managing your team's sponsors.</p>

      <a href="{{ .ConfirmationURL }}" class="button">Confirm My Account</a>

      <p style="font-size: 14px; color: #94a3b8;">If you didn't create this account, you can safely ignore this email.</p>

      <div class="footer">
        <p>SponsorOps - FRC Sponsor Management</p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## 3. Team Invite Email (Custom - send via your app)

This isn't a Supabase auth template, but you can use it when sending invite notifications.
You would need to implement this using Supabase Edge Functions or a separate email service.

**Subject:**
```
You've been invited to join {{ team_name }} on SponsorOps
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; padding: 40px; border: 1px solid #334155; }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo-icon { background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; }
    h1 { color: #ffffff; font-size: 24px; margin: 0 0 10px 0; text-align: center; }
    .subtitle { color: #94a3b8; text-align: center; margin-bottom: 30px; }
    p { color: #cbd5e1; line-height: 1.6; margin: 0 0 20px 0; }
    .button { display: block; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: #ffffff !important; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; text-align: center; margin: 30px 0; }
    .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
    .team-card { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
    .team-name { color: #ffffff; font-size: 20px; font-weight: bold; margin: 0 0 5px 0; }
    .team-number { color: #94a3b8; font-size: 14px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <div class="logo-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3"/>
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
          </svg>
        </div>
      </div>
      <h1>You're Invited!</h1>
      <p class="subtitle">Join your team on SponsorOps</p>

      <div class="team-card">
        <p class="team-name">{{ team_name }}</p>
        <p class="team-number">FRC Team #{{ team_number }}</p>
      </div>

      <p><strong>{{ inviter_name }}</strong> has invited you to join their team on SponsorOps, the sponsor management platform for FRC teams.</p>

      <p>With SponsorOps, you'll be able to:</p>
      <ul style="color: #cbd5e1; padding-left: 20px;">
        <li>Track sponsor relationships and interactions</li>
        <li>Manage tasks and follow-ups</li>
        <li>Collaborate with your team</li>
      </ul>

      <a href="{{ app_url }}" class="button">Accept Invitation</a>

      <p style="font-size: 14px; color: #94a3b8;">This invitation expires in 7 days. If you don't recognize this team, you can ignore this email.</p>

      <div class="footer">
        <p>SponsorOps - FRC Sponsor Management</p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## 4. Reset Password (Optional)

**Subject:**
```
Reset your SponsorOps password
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; padding: 40px; border: 1px solid #334155; }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo-icon { background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; }
    h1 { color: #ffffff; font-size: 24px; margin: 0 0 10px 0; text-align: center; }
    .subtitle { color: #94a3b8; text-align: center; margin-bottom: 30px; }
    p { color: #cbd5e1; line-height: 1.6; margin: 0 0 20px 0; }
    .button { display: block; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: #ffffff !important; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; text-align: center; margin: 30px 0; }
    .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
    .link { color: #f97316; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <div class="logo-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3"/>
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
          </svg>
        </div>
      </div>
      <h1>Reset Your Password</h1>
      <p class="subtitle">SponsorOps</p>

      <p>We received a request to reset your password. Click the button below to choose a new password.</p>

      <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>

      <p style="font-size: 14px; color: #94a3b8;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

      <div class="footer">
        <p>SponsorOps - FRC Sponsor Management</p>
        <p>If the button doesn't work, copy and paste this link:<br>
        <a href="{{ .ConfirmationURL }}" class="link">{{ .ConfirmationURL }}</a></p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## Setup Instructions

1. Go to **Supabase Dashboard** > **Authentication** > **Email Templates**

2. For each template type (Confirm signup, Magic Link, Reset Password, etc.):
   - Copy the **Subject** line
   - Copy the **Body (HTML)** content
   - Paste into the corresponding template editor
   - Click **Save**

3. For **Team Invites**: These are not Supabase auth emails. To send these, you would need to:
   - Use Supabase Edge Functions with a service like Resend, SendGrid, or Postmark
   - Or integrate with your own email sending service

The invite flow currently works by:
1. Admin invites email via the app
2. Record is created in `team_invites` table
3. When that user signs up/logs in, they see pending invites in the TeamSetup screen
4. They can accept to join the team

If you want actual email notifications for invites, let me know and I can help set up an Edge Function for that.
