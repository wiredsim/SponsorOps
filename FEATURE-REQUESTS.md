# Feature Requests & Bug Reports

**Date:** 2026-02-07

---

## Bug Reports

### 1. "Play phone script" isn't working
- **Status:** FIXED
- **Root cause:** `PhoneScriptPlayer.jsx` referenced `currentTeam` variable that was never declared or passed as a prop, causing a `ReferenceError` crash
- **Fix:** Added `currentTeam` to the component's prop destructuring and passed it from `App.jsx`

### 2. Tasks blanks the whole screen
- **Status:** Open - Needs investigation
- **Likely cause:** The Tasks view (`TasksView` component in `App.jsx:1552`) may have a rendering issue when task data is empty, missing, or when a filter returns no results. Could also be an error in the Kanban board layout that causes a blank render without an error boundary catching it.
- **Investigation steps:**
  1. Check if `tasks` array is null/undefined when passed to TasksView
  2. Check if `taskFilter` state causes empty render
  3. Add error boundary around TasksView
  4. Test with empty tasks list, tasks with no sponsor_id, etc.

---

## Feature Requests

### 3. Selectable email templates for all templates
- **Status:** Open
- **Description:** Users want to be able to select from all available templates (both default and custom playbooks) when composing emails, not just the hardcoded `emailTemplates` array in `EmailComposer.jsx`
- **Current behavior:** `EmailComposer.jsx` has its own hardcoded `emailTemplates` array (144 lines) that is separate from the Playbook system
- **Proposed solution:**
  1. Pass custom playbooks to EmailComposer as a prop
  2. Merge custom playbooks with default templates in the template selector
  3. Allow filtering by template type (initial outreach, follow-up, thank you, etc.)
  4. Show both system defaults and user-created playbooks in one unified picker

### 4. Trigger email to Gmail via template / Better template-to-email flow
- **Status:** Open
- **Description:** Users want a smoother flow from selecting a template to actually sending an email, ideally opening Gmail with the content pre-filled
- **Current behavior:** EmailComposer generates text that users manually copy/paste
- **Proposed solution options:**
  - **Option A (Simple):** Generate a `mailto:` link with subject and body pre-filled, which opens the user's default email client (Gmail, Outlook, etc.)
  - **Option B (Medium):** Add a "Open in Gmail" button that constructs a Gmail compose URL: `https://mail.google.com/mail/?view=cm&to=EMAIL&su=SUBJECT&body=BODY`
  - **Option C (Complex):** Integrate with Gmail API via OAuth for direct sending
  - **Recommendation:** Start with Option B (Gmail compose URL) as it requires no backend changes and covers the primary use case

### 5. Add other key contact types - not just sponsors
- **Status:** Open
- **Description:** Users need to track contacts beyond sponsors - mentors, vendors, venue contacts, judges, volunteers, etc.
- **Current behavior:** The `contacts` table is scoped to sponsors (`sponsor_id` foreign key). Contact types are limited.
- **Proposed solution:**
  1. Add a `contact_type` enum/column to contacts table (sponsor, mentor, vendor, venue, judge, volunteer, other)
  2. Allow contacts to exist independently (make `sponsor_id` nullable or add an `organization` field)
  3. Add a dedicated Contacts view/tab in the main navigation
  4. Update search and filters to include contact types
  5. Database migration needed: `ALTER TABLE contacts ADD COLUMN contact_type TEXT DEFAULT 'sponsor';`
