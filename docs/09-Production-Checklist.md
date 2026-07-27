# Production Checklist

> Version: 1.0
>
> Purpose:
> This document defines the final checklist that must be completed before the Aegis Frontend is considered production-ready. Every item in this checklist should be verified before releasing a new version.

---

# Table of Contents

1. Project Quality
2. Code Quality
3. Security
4. Performance
5. Accessibility
6. Responsive Design
7. Authentication
8. API Integration
9. State Management
10. Timezone & Localization
11. UI & UX
12. Error Handling
13. Monitoring
14. Build & Deployment
15. Release Checklist

---

# 1. Project Quality

Before every release ensure:

- Project builds successfully
- No TypeScript errors
- No ESLint errors
- No unused files
- No dead code
- No TODOs for production features
- No debug code
- Documentation is up to date

---

## Folder Structure

Verify that every feature follows the standard structure.

```
feature/

components/

pages/

hooks/

queries/

mutations/

schemas/

types/

constants/

utils/
```

---

# 2. Code Quality

The project should maintain a consistent codebase.

Verify:

- Strict TypeScript
- No `any` unless absolutely necessary
- Reusable components
- Reusable hooks
- Reusable utilities
- Consistent naming
- Consistent formatting

---

## Imports

Avoid

```
../../../../../
```

Use path aliases instead.

---

## Duplication

Search for duplicate logic before introducing new code.

Move shared logic into

```
src/shared
```

whenever appropriate.

---

# 3. Security

Frontend security should be reviewed before every release.

Verify:

- No secrets committed
- No API keys in source code
- No passwords stored
- No hardcoded URLs
- Environment variables used correctly
- Protected routes enforced
- Permission guards working

---

## Authentication

Confirm

- Login
- Logout
- Logout All
- Session Recovery
- Refresh Flow
- Token Expiration
- Unauthorized Redirect

all work correctly.

---

# 4. Performance

Verify

- Lazy loaded routes
- Code splitting
- Optimized bundle size
- Minimal unnecessary re-renders
- Cached server state
- Optimized images
- Optimized fonts

---

## Query Performance

Confirm

- Appropriate cache times
- Proper invalidation
- Debounced searches
- Efficient pagination

---

# 5. Accessibility

Every release should satisfy accessibility requirements.

Verify:

- Keyboard navigation
- Screen reader support
- Semantic HTML
- Focus indicators
- Color contrast
- Accessible dialogs
- Accessible dropdowns

---

## Forms

Ensure

- Labels
- Error messages
- Help text
- Required indicators

are accessible.

---

# 6. Responsive Design

Test the application on:

- Mobile
- Tablet
- Laptop
- Desktop

---

Verify:

- Sidebar behavior
- Tables
- Forms
- Dialogs
- Navigation
- Charts

All should remain usable.

---

# 7. Authentication

Verify the complete authentication lifecycle.

```
Login

↓

Dashboard

↓

Refresh

↓

Protected Requests

↓

Logout
```

---

## Session Management

Confirm

- Active Sessions
- Logout Current Session
- Logout All Sessions

operate correctly.

---

## Permission Checks

Verify

- Hidden navigation
- Disabled actions
- Protected routes
- Permission-aware UI

Backend authorization remains the source of truth.

---

# 8. API Integration

Confirm every feature communicates correctly with the backend.

Verify

- Axios instance
- Interceptors
- Retry logic
- Error normalization
- Request cancellation
- Timeout handling

---

## Features

Verify API integration for

- Authentication
- Dashboard
- Applications
- API Keys
- Users
- Roles
- Permissions
- Sessions
- Organizations
- Tenants
- Audit Logs
- Settings

---

# 9. State Management

Confirm state is stored in the correct location.

---

## Zustand

Should only contain:

- Theme
- Sidebar
- Preferences
- Authentication Status
- Local UI State

---

## TanStack Query

Should contain:

- Users
- Sessions
- Applications
- API Keys
- Roles
- Permissions
- Organizations
- Tenants
- Audit Logs

Server state should never be duplicated in Zustand.

---

# 10. Timezone & Localization

This is a mandatory production requirement.

The backend stores timestamps in UTC.

The frontend converts timestamps based on the user's preferences.

---

## Verify

Settings allow users to configure:

- Country
- Locale
- Timezone
- Date Format
- Time Format

---

## Confirm

Incoming timestamps

```
UTC

↓

User Timezone

↓

Display
```

Outgoing timestamps

```
User Timezone

↓

UTC

↓

API
```

Every page displaying dates should use the shared timezone utilities.

---

# 11. UI & UX

Every page should support

- Loading
- Success
- Empty
- Error

---

## Verify

- Skeleton loaders
- Error boundaries
- Empty states
- Toast notifications
- Confirmation dialogs
- Pagination
- Search
- Filtering
- Sorting

---

## Consistency

Ensure

- Typography
- Colors
- Icons
- Buttons
- Cards
- Tables
- Forms

match the design system.

---

# 12. Error Handling

Every error should be handled gracefully.

Verify

- Network failures
- Validation errors
- Unauthorized requests
- Forbidden requests
- Server errors
- Unknown errors

Users should receive clear, actionable feedback.

---

## Offline Behavior

When appropriate

- Detect offline state
- Notify users
- Recover automatically when connection returns

---

# 13. Monitoring

Production builds should integrate with monitoring tools when enabled.

Examples

- Sentry
- Analytics
- Performance Monitoring

Logging should be centralized through the shared logger.

Avoid leaving development logging enabled.

---

# 14. Build & Deployment

Before deployment verify

```bash
pnpm lint

pnpm typecheck

pnpm build
```

All commands should complete successfully.

---

## Environment Variables

Confirm every required variable exists.

Examples

```env
VITE_API_BASE_URL

VITE_APP_NAME

VITE_DEFAULT_TIMEZONE

VITE_ENABLE_ANALYTICS

VITE_SENTRY_DSN
```

Provide a complete

```
.env.example
```

for new developers.

---

## Deployment Targets

The application should deploy cleanly to:

- Vercel
- Netlify
- Cloudflare Pages
- Docker
- Nginx

No code changes should be required between environments.

---

# 15. Release Checklist

Before every production release verify the following:

## Code

- TypeScript passes
- ESLint passes
- Formatting passes
- Build succeeds

---

## Functionality

- Authentication works
- API integration works
- Permission guards work
- Timezone conversion works
- User preferences persist

---

## UI

- Responsive layouts
- Dark mode
- Accessibility
- Design consistency

---

## Performance

- Lazy loading
- Code splitting
- Query caching
- Optimized assets

---

## Security

- No secrets committed
- Environment variables validated
- Protected routes enforced
- Sensitive data not exposed

---

## Documentation

- README updated
- Environment documentation updated
- API changes documented
- Changelog prepared (if applicable)

---

# Final Acceptance Criteria

The Aegis Frontend is considered production-ready when:

- Every page from the approved designs has been implemented.
- Every backend API has been integrated successfully.
- Authentication, authorization, and session management operate correctly.
- Timezone and localization work consistently across the application.
- Shared architecture is fully reusable and free of business logic.
- All features support loading, success, empty, and error states.
- The application is responsive, accessible, and performant.
- No TypeScript or ESLint errors remain.
- The project builds successfully for production.
- The application can be deployed independently of the backend without code modifications.

---

# Production Checklist Summary

This checklist serves as the final quality gate before every release of the Aegis Frontend. It covers architecture, security, authentication, API integration, state management, timezone handling, accessibility, responsiveness, performance, deployment, and documentation. Completing every item ensures the application is stable, maintainable, secure, and ready for production deployment while remaining fully aligned with the existing Aegis backend.