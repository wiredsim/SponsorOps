# SponsorOps

A comprehensive sponsor relationship management platform for FRC (FIRST Robotics Competition) teams. Built with React, Supabase, and Cloudflare.

**Live:** [sponsorops.net](https://sponsorops.net)

## Features

### Core CRM
- **Dashboard** - Overview of sponsor pipeline, tasks, team activity, and email queue alerts
- **Sponsor Management** - Full CRM for tracking companies, contacts, and relationships
- **Contact Management** - Multiple contacts per sponsor with roles, titles, and contact info
- **Task System** - Kanban-style task board with assignments, priorities, categories, and due dates
- **Task Notifications** - Email notifications when tasks are assigned to team members
- **Interaction History** - Log emails, calls, meetings, and visits
- **Donation Tracking** - Track donation history, amounts, and dates per sponsor
- **Search & Filter** - Find sponsors by status, name, or contact

### Outreach Tools
- **Playbook System** - Email templates, phone scripts, meeting guides, and tips
- **Email Composer** - Guided email composition with coaching tips
- **Phone Script Player** - Interactive phone script player with objection handling
- **Detective Worksheet** - Interactive sponsor research tool with lead scoring
- **Variables System** - Merge fields for personalized templates (`{{team_name}}`, `{{contact_name}}`, etc.)

### Team Features
- **Multi-team Support** - Invite-only teams with admin/member roles
- **Team Specs** - Centralized team info, achievements, goals, and annual task templates
- **Annual Tasks** - Auto-generate recurring tasks from templates
- **Activity Tracking** - Auto-log emails by BCC'ing `log@sponsorops.net`
- **Email Queue** - Review and assign unmatched inbound emails to sponsors

### Authentication
- Magic link sign-in
- Email/password sign-in
- Google OAuth
- Account settings for password setup

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Hosting | Cloudflare Pages |
| Email (Outbound) | Resend |
| Email (Inbound) | Resend + Cloudflare Workers |
| Styling | Tailwind CSS |
| Icons | Lucide React |

## Architecture

```
sponsorops.net (Cloudflare Pages)
    ↓
React SPA
    ↓
Supabase (Database + Auth + RLS)

log@sponsorops.net (Resend Inbound)
    ↓
Webhook → Cloudflare Worker
    ↓
Auto-log interaction in Supabase
```

## Project Structure

```
sponsorops/
├── src/
│   ├── App.jsx                # Main app component, routing, state, all views
│   ├── AuthContext.jsx        # Authentication provider
│   ├── TeamContext.jsx        # Team/membership provider
│   ├── components.jsx         # Shared UI components (modals, forms, utilities)
│   ├── PlaybookSystem.jsx     # Email/phone templates with merge fields
│   ├── EmailComposer.jsx      # Guided email composition
│   ├── PhoneScriptPlayer.jsx  # Interactive phone script player
│   ├── DetectiveWorksheet.jsx # Sponsor research tool with lead scoring
│   ├── VariablesEditor.jsx    # Merge field management
│   ├── EmailQueue.jsx         # Unmatched email queue management
│   ├── ContactsEditor.jsx     # Multi-contact editor for sponsors
│   ├── DonationsEditor.jsx    # Donation tracking per sponsor
│   ├── AccountSettings.jsx    # User password/profile settings
│   ├── TeamSettings.jsx       # Team admin settings
│   ├── TeamSetup.jsx          # New user team join flow
│   ├── LoginPage.jsx          # Authentication UI
│   ├── supabaseClient.js      # Supabase client config
│   └── auditLog.js            # Audit logging utility
├── workers/
│   ├── email-logger/          # Cloudflare Worker for inbound email
│   │   ├── src/index.js
│   │   ├── wrangler.toml
│   │   └── package.json
│   └── task-notifier/         # Cloudflare Worker for task assignment emails
│       ├── src/index.js
│       ├── wrangler.toml
│       └── package.json
├── supabase/
│   └── functions/
│       └── send-invite-email/ # Supabase Edge Function for invite emails
├── templates/
│   ├── Email_Templates.md     # Email template reference guide
│   └── Detective_Worksheet.md # Research worksheet guide
├── supabase-schema.sql        # Base database schema
├── supabase-migration-*.sql   # Schema migrations (14 files)
└── .env.local                 # Environment variables (not committed)
```

## Setup

### Prerequisites
- Supabase account
- Cloudflare account (for hosting)
- Resend account (for email)

### Environment Variables

Set these in Cloudflare Pages project settings:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Deployment

### Cloudflare Pages (Production)

The app auto-deploys from the `master` branch via Cloudflare Pages.

**Build settings:**
- Root directory: `sponsorops`
- Build command: `npm run build`
- Build output: `dist`

### Cloudflare Workers

**Email Logger Worker:**
```bash
cd sponsorops/workers/email-logger
npx wrangler deploy
```

**Task Notifier Worker:**
```bash
cd sponsorops/workers/task-notifier
npx wrangler deploy
```

**Required secrets (both workers):**
```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_KEY
```

## Database Migrations

SQL migrations are in the `sponsorops/` directory with `supabase-migration-*.sql` naming.

Run in Supabase SQL Editor in this order:
1. `supabase-schema.sql` - Initial schema (sponsors, interactions, tasks, team_info, audit_log)
2. `supabase-migration-auth.sql` - Authentication setup
3. `supabase-migration-teams.sql` - Multi-team support (teams, team_members, team_invites)
4. `supabase-migration-playbooks.sql` - Custom email/phone templates
5. `supabase-migration-tasks.sql` - Enhanced task system (categories, priorities, status)
6. `supabase-migration-contacts.sql` - Multi-contact per sponsor
7. `supabase-migration-donations.sql` - Donation tracking
8. `supabase-migration-research.sql` - Lead scoring and temperature
9. `supabase-migration-team-info-fields.sql` - Team variables and annual tasks
10. `supabase-migration-email-queue.sql` - Email queue for unmatched emails
11. `supabase-migration-task-notes.sql` - Task notes field
12. `supabase-migration-annual-tasks.sql` - Annual task templates
13. `supabase-migration-hidden-playbooks.sql` - Hide default templates
14. `supabase-fix-invite-rls.sql` - RLS policy fixes for invites

## Working with Claude

This project is actively developed with Claude Code. Claude has full context of:

### Codebase Knowledge
- Complete understanding of all React components and their relationships
- Database schema and RLS policies
- Authentication flow and team membership logic
- Email template system and merge fields
- Cloudflare Workers for inbound email processing

### Claude Can Help With
- **Feature Development** - Adding new features, components, or pages
- **Bug Fixes** - Debugging issues across the stack
- **Database Changes** - Schema migrations, RLS policies
- **Deployment** - Cloudflare Pages, Workers, Resend configuration
- **Refactoring** - Code organization, performance improvements
- **Documentation** - Updating docs, adding comments

### Key Context Files
When working with Claude, these files provide important context:
- `src/App.jsx` - Main app structure and state
- `src/components.jsx` - Shared components and utilities
- `src/AuthContext.jsx` & `src/TeamContext.jsx` - Auth/team state
- `supabase-schema.sql` - Database structure
- `.env.local` - Configuration (don't share secrets publicly)

### Example Prompts
- "Add a new field to the sponsor form for tracking donation amounts"
- "Fix the date picker showing wrong timezone"
- "Create a report view showing sponsor pipeline by status"
- "Add email open tracking to the activity log"

## API Reference

### Merge Fields (Variables)

Use in Playbook templates with `{{variable_name}}` syntax:

**Sponsor Variables:**
- `{{company_name}}` - Sponsor company name
- `{{contact_name}}` - Contact person's name
- `{{contact_title}}` - Contact's job title
- `{{contact_email}}` - Contact's email
- `{{industry}}` - Company industry

**Team Variables:**
- `{{team_name}}` - Your team's name
- `{{team_number}}` - FRC team number
- `{{team_location}}` - City/town
- `{{team_size}}` - Number of students
- `{{season_year}}` - Competition year

**List Variables (bullet points):**
- `{{past_achievements}}` - Accomplishments with sponsor help
- `{{future_goals}}` - What you can do with support
- `{{team_facts}}` - Quick facts about your team

**Sender Variables (filled manually):**
- `{{sender_name}}` - Person sending the email
- `{{sender_email}}` - Sender's email
- `{{personalization_sentence}}` - Custom hook for this company

## License

MIT

---

**Built for FRC teams who take sponsor relationships seriously.**
