# SponsorOps Code Quality Audit

**Date:** 2026-02-07
**Codebase:** ~9,000 lines across 17 source files

---

## Executive Summary

SponsorOps is a functional production application with a solid feature set. However, it has accumulated significant technical debt typical of a rapid-development project. The primary concerns are: **oversized components**, **missing input validation**, **no automated testing/linting** (now added), and **a runtime bug** in PhoneScriptPlayer (now fixed).

### Overall Scores

| Category | Score | Notes |
|----------|-------|-------|
| **Functionality** | 8/10 | Feature-rich, covers the use case well |
| **Architecture** | 5/10 | Monolithic components, no code splitting |
| **Security** | 5/10 | RLS is good, but client-side validation missing |
| **Maintainability** | 4/10 | Large files, no types, no tests |
| **Error Handling** | 4/10 | Inconsistent, many silent failures |
| **Accessibility** | 3/10 | No focus management, missing ARIA labels |
| **Performance** | 6/10 | Full data reloads, 543KB bundle, no code splitting |

---

## Critical Issues Found & Fixed

### 1. PhoneScriptPlayer Bug (FIXED)
- **File:** `PhoneScriptPlayer.jsx:176-177`
- **Issue:** `currentTeam` variable used but never declared or passed as prop
- **Impact:** Phone script player crashes on load (runtime `ReferenceError`)
- **Fix:** Added `currentTeam` to component props and passed it from `App.jsx`

### 2. ESLint Setup (ADDED)
- **449 warnings, 2 errors** found on initial scan (errors now fixed)
- ESLint config added with React, hooks, and security rules
- `npm run lint` / `npm run lint:fix` scripts added

---

## Lint Results Summary

**Total: 447 warnings across 17 files**

| Rule Category | Count | Priority |
|---------------|-------|----------|
| `react/prop-types` (missing prop validation) | ~350 | Medium |
| `react/no-unescaped-entities` (quotes in JSX) | ~40 | Low |
| `no-unused-vars` (dead imports/variables) | ~35 | Medium |
| `no-console` (console.log in production) | 8 | Low |
| `react-refresh/only-export-components` | 8 | Low |
| `react-hooks/exhaustive-deps` (missing deps) | 6 | High |

---

## Architecture Issues

### Oversized Components
| File | Lines | Recommendation |
|------|-------|----------------|
| `App.jsx` | 1,819 | Split into separate view files, extract data layer |
| `PlaybookSystem.jsx` | 1,253 | Extract PlaybookCard, PlaybookEditor, defaults data |
| `components.jsx` | 1,165 | Split into SponsorModal, TaskModal, etc. |
| `DetectiveWorksheet.jsx` | 838 | Extract step components, externalize data |
| `PhoneScriptPlayer.jsx` | 474 | Extract objection handlers to data file |
| `EmailComposer.jsx` | 472 | Extract templates to config, simplify merge logic |
| `TeamSettings.jsx` | 468 | Split into MembersList, InviteForm, LogoUpload |
| `TeamContext.jsx` | 429 | Extract team API functions to separate module |

### State Management
- **20+ separate `useState` hooks** in AppContent alone
- Modal states (`showAddSponsor`, `showAddInteraction`, etc.) should be consolidated
- No `useReducer` for complex state objects like research data
- No `useMemo`/`useCallback` for expensive operations

### Data Layer
- All Supabase calls inline in components
- No data abstraction layer or hooks (e.g., `useSponsor()`, `useTasks()`)
- Full data reload on every mutation instead of optimistic updates
- No caching strategy

### Bundle Size
- **543KB** minified JS (141KB gzipped) - above Vite's 500KB warning
- No code splitting or lazy loading
- All views loaded upfront regardless of navigation

---

## Security Concerns

### High Priority
1. **No webhook signature verification** - Both Cloudflare Workers accept unsigned requests. Any attacker can send fake emails or trigger notifications.
2. **XSS in merge fields** - User-provided content in templates, sponsor data, and research notes rendered without sanitization
3. **URL injection** - `DetectiveWorksheet.jsx` and `components.jsx` build URLs via string replacement without validation (`javascript:` protocol possible)
4. **No input validation** - Forms accept any data without client-side validation before storage

### Medium Priority
5. **Overly permissive CORS** - Task notifier uses `.startsWith()` check that can be bypassed
6. **File upload validation** - Client-side only MIME type check, easily bypassed
7. **Admin checks UI-only** - `TeamSettings` hides admin features but doesn't re-validate server-side
8. **Debug logging in production** - `TeamSetup.jsx` has `console.log` statements
9. **Open RLS policies** - Base schema has `USING (true)` policies (later migrations fix this, but ordering matters)

### Low Priority
10. **No rate limiting** on auth attempts, invitations, or worker endpoints
11. **Password requirements weak** - Only 6 character minimum
12. **localStorage** access without try/catch for QuotaExceededError

---

## Error Handling Issues

1. **Silent failures** - `sendTaskNotification()`, `generateAnnualTasks()`, playbook operations use `console.warn` but don't inform users
2. **No error boundaries** - React errors crash the entire app
3. **Inconsistent patterns** - Mix of `alert()`, `console.error()`, state-based error display
4. **Missing try/catch** - Several async operations lack error handling
5. **No retry logic** - Network failures are not retried
6. **Form submissions don't validate** - `onSave()` called without checking required fields

---

## Duplicate/Dead Code

1. **`getMemberName()`** - Defined twice in `App.jsx` (lines 1235, 1553) with identical logic
2. **`colorClasses`** - Defined twice in `PlaybookSystem.jsx` (lines 99-106, 573-578)
3. **Unused imports** - 16 files have unused `React` imports, plus ~20 unused icon imports
4. **Unused variables** - `hasPendingInvites`, `previewMode`, `setPreviewMode`, `getStatusIcon`, `getStatusColor`, `getPriorityColor`, `taskCategories`, `taskStatuses`
5. **Debug statements** - `console.log` calls left in `TeamSetup.jsx`

---

## Recommendations (Priority Order)

### Immediate (Bug Fixes)
- [x] Fix PhoneScriptPlayer crash (currentTeam prop)
- [x] Add ESLint configuration
- [ ] Remove unused imports and dead code (`npm run lint:fix` for easy ones)
- [ ] Add error boundaries around main views

### Short-Term (Quality)
- [ ] Add webhook signature verification to both workers
- [ ] Add URL validation (use `new URL()` constructor)
- [ ] Sanitize user content in merge field rendering
- [ ] Add client-side form validation to all modals
- [ ] Consolidate error handling with a notification system (replace `alert()`)

### Medium-Term (Architecture)
- [ ] Extract view components from App.jsx into separate files
- [ ] Create data hooks (e.g., `useSponsors()`, `useTasks()`)
- [ ] Add code splitting with `React.lazy()` for views
- [ ] Extract template/playbook data to JSON config files
- [ ] Add a proper state management pattern (useReducer or Zustand)

### Long-Term (Robustness)
- [ ] Add TypeScript incrementally (`.jsx` -> `.tsx`)
- [ ] Add unit tests with Vitest
- [ ] Add integration tests for critical flows
- [ ] Set up CI/CD pipeline with GitHub Actions
- [ ] Add Sentry or similar for production error tracking
