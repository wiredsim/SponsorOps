# SponsorOps

A comprehensive sponsor relationship management platform for FRC (FIRST Robotics Competition) teams. Built with React, Supabase, and Cloudflare.

**Live:** [sponsorops.net](https://sponsorops.net)

## Features

### Core CRM
- **Dashboard** - Overview of sponsor pipeline, tasks, and team activity
- **Sponsor Management** - Full CRM for tracking companies, contacts, and relationships
- **Task System** - Kanban-style task board with assignments and due dates
- **Interaction History** - Log emails, calls, meetings, and visits
- **Search & Filter** - Find sponsors by status, name, or contact

### Outreach Tools
- **Playbook System** - Email templates, phone scripts, meeting guides, and tips
- **Email Composer** - Guided email composition with coaching tips
- **Detective Worksheet** - Interactive sponsor research tool with lead scoring
- **Variables System** - Merge fields for personalized templates (`{{team_name}}`, `{{contact_name}}`, etc.)

### Team Features
- **Multi-team Support** - Invite-only teams with admin/member roles
- **Team Specs** - Centralized team info, achievements, and goals
- **Activity Tracking** - Auto-log emails by BCC'ing `log@sponsorops.net`

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
│   ├── App.jsx              # Main app component, routing, state
│   ├── AuthContext.jsx      # Authentication provider
│   ├── TeamContext.jsx      # Team/membership provider
│   ├── components.jsx       # Shared UI components
│   ├── PlaybookSystem.jsx   # Email/phone templates
│   ├── EmailComposer.jsx    # Guided email composition
│   ├── DetectiveWorksheet.jsx # Sponsor research tool
│   ├── VariablesEditor.jsx  # Merge field management
│   ├── AccountSettings.jsx  # User password/profile settings
│   ├── TeamSettings.jsx     # Team admin settings
│   ├── TeamSetup.jsx        # New user team join flow
│   ├── LoginPage.jsx        # Authentication UI
│   ├── supabaseClient.js    # Supabase client config
│   └── auditLog.js          # Audit logging utility
├── workers/
│   └── email-logger/        # Cloudflare Worker for inbound email
│       ├── src/index.js
│       ├── wrangler.toml
│       └── package.json
├── supabase-schema.sql      # Database schema
├── supabase-migration-*.sql # Schema migrations
└── .env.local               # Environment variables (not committed)
```

## Development Setup

### Prerequisites
- Node.js 18+
- npm
- Supabase account
- Cloudflare account (for deployment)
- Resend account (for email)

### Local Development

1. **Clone and install:**
   ```bash
   git clone https://github.com/wiredsim/SponsorOps.git
   cd SponsorOps/sponsorops
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173)

### Environment Variables

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

### Email Logger Worker

```bash
cd sponsorops/workers/email-logger
npx wrangler deploy
```

**Required secrets:**
```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_KEY
```

## Database Migrations

SQL migrations are in the project root with `supabase-migration-*.sql` naming.

Run in Supabase SQL Editor:
1. `supabase-schema.sql` - Initial schema
2. `supabase-migration-teams.sql` - Multi-team support
3. `supabase-migration-team-info-fields.sql` - Team variables
4. `supabase-migration-playbooks.sql` - Custom playbooks
5. `supabase-migration-research.sql` - Research/lead scoring

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
