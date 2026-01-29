# Claude Code Context for SponsorOps

This file provides context for Claude Code when working on this project.

## Project Overview

SponsorOps is a sponsor relationship management platform for FRC robotics teams. It helps teams track sponsors, manage outreach, and maintain relationships through a comprehensive CRM with email templates, task management, and activity tracking.

## Architecture

### Frontend (React + Vite)
- **Location:** `sponsorops/src/`
- **Entry point:** `main.jsx` → `App.jsx`
- **State management:** React Context (AuthContext, TeamContext)
- **Styling:** Tailwind CSS with custom dark theme
- **Icons:** Lucide React

### Backend (Supabase)
- **Database:** PostgreSQL with Row Level Security (RLS)
- **Auth:** Supabase Auth (magic link, password, OAuth)
- **Storage:** Team logos in `team-logos` bucket

### Email (Resend)
- **Outbound:** Supabase uses Resend SMTP for auth emails
- **Inbound:** Resend receives `log@sponsorops.net`, webhooks to Cloudflare Worker

### Hosting (Cloudflare)
- **Pages:** React app at sponsorops.net
- **Workers:** Email logger at `sponsorops-email-logger.wiredsim.workers.dev`

## Key Files

### Core Application
| File | Purpose |
|------|---------|
| `src/App.jsx` | Main component, navigation, data loading, all views |
| `src/AuthContext.jsx` | Auth state, sign in/out methods |
| `src/TeamContext.jsx` | Team membership, switching, invites |
| `src/components.jsx` | Shared components: modals, forms, utilities |

### Features
| File | Purpose |
|------|---------|
| `src/PlaybookSystem.jsx` | Email/phone templates with merge fields |
| `src/EmailComposer.jsx` | Guided email composition |
| `src/DetectiveWorksheet.jsx` | Interactive sponsor research with lead scoring |
| `src/VariablesEditor.jsx` | Team variables for templates |
| `src/PhoneScriptPlayer.jsx` | Interactive phone script player with objection handling |
| `src/EmailQueue.jsx` | Email queue UI for managing unmatched inbound emails |
| `src/ContactsEditor.jsx` | Multi-contact editor for sponsors |
| `src/DonationsEditor.jsx` | Donation tracking per sponsor |

### Settings
| File | Purpose |
|------|---------|
| `src/AccountSettings.jsx` | User password/profile |
| `src/TeamSettings.jsx` | Team admin: members, logo, invites |
| `src/TeamSetup.jsx` | New user team join flow |
| `src/LoginPage.jsx` | Auth UI with multiple methods |

### Infrastructure
| File | Purpose |
|------|---------|
| `workers/email-logger/src/index.js` | Cloudflare Worker for inbound email webhooks |
| `workers/task-notifier/src/index.js` | Cloudflare Worker for task assignment email notifications |
| `supabase/functions/send-invite-email/` | Supabase Edge Function for team invite emails |
| `supabase-schema.sql` | Base database schema |
| `supabase-migration-*.sql` | Schema updates (14 migration files) |
| `templates/` | Email and research template guides |

## Database Schema

### Main Tables
- `sponsors` - Company/contact info, status, lead scoring, lead temperature
- `contacts` - Multiple contacts per sponsor (name, title, email, phone, role)
- `interactions` - Activity log (email, call, meeting, visit)
- `tasks` - To-dos with status, priority, category, assignment, due dates, notes
- `donations` - Donation records per sponsor (amount, date, type)
- `team_info` - Team details, achievements, variables (JSONB), annual task templates
- `teams` - Team accounts
- `team_members` - User-team relationships with roles
- `team_invites` - Pending invitations
- `playbooks` - Custom email/phone templates
- `email_queue` - Unmatched inbound emails pending manual assignment
- `user_profiles` - Display names
- `audit_log` - Change history

### Key Patterns
- **Soft deletes:** `deleted_at`, `deleted_by` columns
- **Audit fields:** `created_by`, `updated_by`, `created_at`, `updated_at`
- **Team scoping:** Most tables have `team_id` for multi-tenancy
- **RLS:** Row Level Security policies based on `team_members`

## Common Tasks

### Adding a New Field to Sponsors
1. Create migration SQL: `ALTER TABLE sponsors ADD COLUMN field_name TYPE;`
2. Update `src/components.jsx` SponsorModal form
3. Update `src/App.jsx` saveSponsor function
4. Run migration in Supabase SQL Editor

### Adding a New View/Tab
1. Add navigation item in `App.jsx` nav array
2. Create view component or add conditional render in main
3. Add any required state variables

### Adding a New Merge Field
1. Add to `variableReference` in `PlaybookSystem.jsx`
2. Add mapping in `EmailComposer.jsx` getMergeValue function
3. Document in Variables Guide

### Modifying Auth Flow
1. Update methods in `AuthContext.jsx`
2. Update UI in `LoginPage.jsx`
3. Configure in Supabase Dashboard if needed

### Deploying Changes
- **Frontend:** Push to `master` branch, auto-deploys via Cloudflare Pages
- **Worker:** Run `npx wrangler deploy` in `workers/email-logger/`
- **Database:** Run SQL in Supabase SQL Editor

## Environment

### Local Development
```bash
cd sponsorops
npm install
npm run dev
```

### Required Environment Variables
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

### Worker Secrets
```bash
cd workers/email-logger
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_KEY
```

## Code Style

- **React:** Functional components with hooks
- **State:** useState for local, Context for global
- **Async:** async/await with try/catch
- **Styling:** Tailwind utility classes, consistent color scheme
- **Components:** Self-contained with props, avoid prop drilling

## Color Scheme

- **Primary:** Orange (`orange-500`, `orange-600`)
- **Secondary:** Blue (`blue-300`, `blue-500`)
- **Background:** Slate gradients (`slate-800`, `slate-900`)
- **Success:** Green (`green-400`, `green-500`)
- **Warning:** Amber/Yellow (`amber-400`, `yellow-500`)
- **Error:** Red (`red-400`, `red-500`)

## Testing Changes

1. Run `npm run dev` locally
2. Test the specific feature/fix
3. Check browser console for errors
4. Test on mobile viewport (responsive)
5. Push to master for production deploy

## IMPORTANT: Deployment Workflow

**Every code change MUST be pushed to git.** The user does not run locally — the app only runs on Cloudflare Pages, which deploys from the `master` branch. If you don't push, your changes don't exist.

After completing any code changes:
1. `git add` the changed files
2. `git commit` with a descriptive message
3. `git push` to trigger Cloudflare Pages deployment

Do NOT wait for the user to ask you to push. Do NOT tell the user to push. Just push it yourself as part of finishing the work.

Similarly, if you create or modify a Cloudflare Worker, deploy it with `npx wrangler deploy`.

### Workers
| Worker | Location | URL |
|--------|----------|-----|
| email-logger | `workers/email-logger/` | `sponsorops-email-logger.wiredsim.workers.dev` |
| task-notifier | `workers/task-notifier/` | `sponsorops-task-notifier.wiredsim.workers.dev` |

## Gotchas

- **Dates:** Use local date helpers (`getLocalDateString`, `formatLocalDate`) to avoid timezone issues
- **RLS:** New tables need RLS policies or queries will fail silently
- **Auth state:** Compare `user?.id` not `user` object to prevent re-renders on token refresh
- **Team context:** Always check `currentTeam` before making team-scoped queries
