# Authentication & State Management

> Version: 1.0
>
> Purpose:
> This document defines the authentication architecture, authorization flow, state management strategy, session lifecycle, permission handling, timezone management, and global application state for the Aegis Frontend.

---

# Table of Contents

1. Authentication Overview
2. Authentication Flow
3. Session Lifecycle
4. Refresh Token Strategy
5. Axios Authentication
6. TanStack Query Responsibilities
7. Zustand Responsibilities
8. Permission Management
9. Route Protection
10. Global State Architecture
11. User Preferences
12. Timezone Management
13. Error Recovery
14. Logout Flow
15. Security Best Practices

---

# 1. Authentication Overview

Authentication is entirely managed by the backend.

The frontend never:

- generates JWTs
- validates JWT signatures
- creates refresh tokens
- creates sessions

The frontend only consumes authentication APIs.

---

## Backend Responsibilities

The backend is responsible for

- Login
- Signup
- Email Verification
- Password Reset
- Refresh Token Rotation
- Logout
- Logout All
- Session Creation
- Session Revocation

---

## Frontend Responsibilities

The frontend is responsible for

- Calling authentication APIs
- Storing authentication state
- Refreshing expired access tokens
- Protecting routes
- Displaying user information
- Hiding unauthorized UI
- Redirecting unauthenticated users

---

# 2. Authentication Flow

The authentication lifecycle should always follow this sequence.

```text
User

↓

Login Form

↓

Validation (Zod)

↓

Axios

↓

POST /auth/login

↓

Success

↓

Store User State

↓

Invalidate Queries

↓

Navigate Dashboard
```

No authentication logic should exist inside UI components.

---

# Authentication Module Structure

```text
features/

auth/

├── api/

├── components/

├── hooks/

├── mutations/

├── pages/

├── queries/

├── schemas/

├── types/

└── utils/
```

---

# Login Flow

```text
User

↓

Enter Credentials

↓

React Hook Form

↓

Zod Validation

↓

Axios

↓

Backend

↓

Authenticated

↓

Dashboard
```

---

# Signup Flow

```text
Signup

↓

Backend

↓

Verification Email

↓

Verify Email

↓

Login
```

---

# Forgot Password Flow

```text
Forgot Password

↓

Email

↓

Reset Email

↓

Reset Password Page

↓

New Password

↓

Login
```

---

# Verify Email Flow

```text
Verification Link

↓

Backend

↓

Email Verified

↓

Redirect Login
```

---

# 3. Session Lifecycle

Every login creates a backend session.

The frontend should never attempt to manage session persistence manually.

Instead it communicates with:

```text
/auth/sessions
```

Supported actions include

- List Sessions
- Current Session
- Logout Current Session
- Logout All Sessions

---

# Session Flow

```text
Login

↓

Backend Session

↓

Authenticated

↓

Refresh

↓

Logout

↓

Session Revoked
```

---

# Session Expiration

If authentication expires

```text
401

↓

Refresh

↓

Success

↓

Retry Request
```

If refresh fails

```text
Logout

↓

Clear Cache

↓

Redirect Login
```

---

# 4. Refresh Token Strategy

The backend already supports refresh token rotation.

Frontend responsibilities are limited to

- detecting 401 responses
- requesting refresh
- retrying the failed request

---

## Refresh Flow

```text
API Request

↓

401

↓

Refresh Endpoint

↓

New Access Token

↓

Retry Original Request
```

This process should happen automatically.

The user should not notice.

---

## Concurrent Refresh

If multiple requests fail simultaneously

```text
Request A

↓

Refresh

↓

Requests B,C,D Wait

↓

Refresh Success

↓

Retry All
```

Only one refresh request should exist at a time.

---

# 5. Axios Authentication

Only one axios instance should exist.

Example

```text
shared/api/axios.ts
```

Responsibilities

- Base URL
- Credentials
- Timeout
- Request Interceptor
- Response Interceptor
- Refresh Retry
- Error Normalization

Never create additional axios instances.

---

## Request Interceptor

Attach

- Authorization Header (if required)
- Locale
- Timezone
- Request ID

---

## Response Interceptor

Handle

- Unauthorized
- Forbidden
- Validation Errors
- Network Errors
- Retry Logic

---

# 6. TanStack Query Responsibilities

TanStack Query owns all server state.

Examples

- Current User
- Applications
- Sessions
- Roles
- Permissions
- API Keys
- Audit Logs
- Tenants

Never duplicate this data inside Zustand.

---

## Query Organization

Every feature owns

```text
queries/

mutations/
```

Example

```text
applications/

queries/

use-applications.ts

use-application.ts

mutations/

use-create-application.ts

use-delete-application.ts
```

---

## Query Keys

Centralize keys.

Example

```text
auth.currentUser

applications.list

applications.details

users.list

roles.list

sessions.list
```

---

# 7. Zustand Responsibilities

Zustand should only store client state.

Examples

```text
Authentication Status

Theme

Sidebar

Language

Timezone

User Preferences

Notifications

Search Preferences
```

Do not store API responses permanently.

---

## Suggested Stores

```text
auth-store

theme-store

sidebar-store

settings-store

preference-store

notification-store
```

Each store should have one responsibility.

---

# 8. Permission Management

Permissions come from the backend.

Frontend only consumes them.

---

## Permission Flow

```text
Login

↓

Current User

↓

Roles

↓

Permissions

↓

Permission Context

↓

UI
```

---

## Permission Helpers

Create reusable helpers

```text
can()

cannot()

hasRole()

hasPermission()
```

These belong inside

```text
shared/permissions
```

---

## UI Permissions

Examples

Hide

```text
Delete Button
```

Disable

```text
Edit Button
```

Protect

```text
Routes
```

Never rely on frontend permissions for security.

Backend is authoritative.

---

# 9. Route Protection

Three route types.

---

## Public

Examples

```text
Landing

Pricing

Docs
```

---

## Guest

Examples

```text
Login

Signup

Forgot Password
```

Authenticated users should be redirected.

---

## Protected

Examples

```text
Dashboard

Applications

Users

Settings
```

Requires authentication.

---

## Permission Routes

Some routes require specific permissions.

Example

```text
roles.read

users.update

applications.delete
```

Unauthorized users should receive a

```text
403
```

page.

---

# 10. Global State Architecture

```text
App

↓

Providers

↓

Auth Store

↓

Query Client

↓

Router

↓

Dashboard
```

State should remain predictable.

---

## Client State

Stored in Zustand.

---

## Server State

Stored in TanStack Query.

---

## UI State

Stored locally whenever possible.

Avoid global state for temporary component behavior.

---

# 11. User Preferences

Every authenticated user should have preferences.

Examples

```text
Theme

Sidebar State

Timezone

Language

Date Format

Time Format

Default Page Size
```

Persist these preferences.

---

# 12. Timezone Management

This is a required feature.

The backend stores every timestamp in UTC.

The frontend converts timestamps to the user's preferred timezone.

---

## User Settings

Inside

```text
Settings

↓

Localization
```

Allow configuration of

- Country
- Locale
- Timezone
- Date Format
- Time Format

Example

```text
Country

Pakistan

Timezone

Asia/Karachi

Locale

en-PK
```

---

## Incoming Data

```text
Backend UTC

↓

Timezone Utility

↓

User Timezone

↓

Display
```

---

## Outgoing Data

```text
User Local Time

↓

Timezone Utility

↓

UTC

↓

API
```

All conversion logic belongs inside

```text
shared/timezone
```

Never duplicate conversion code.

---

# 13. Error Recovery

Every authentication error should have a defined recovery path.

Examples

```text
401

↓

Refresh

↓

Retry
```

```text
403

↓

Show Forbidden Page
```

```text
Network Error

↓

Retry

↓

Toast

↓

Offline Indicator
```

Users should never see raw backend errors.

---

# 14. Logout Flow

Current Session

```text
Logout

↓

Backend

↓

Clear Query Cache

↓

Clear Zustand

↓

Navigate Login
```

---

## Logout All

```text
Logout All

↓

Backend

↓

Invalidate Sessions

↓

Clear State

↓

Login
```

---

# 15. Security Best Practices

The frontend should never

- store secrets
- expose API URLs directly in code
- bypass permission checks
- trust local storage for authorization
- hardcode tokens

Always

- use environment variables
- sanitize user input
- validate forms with Zod
- protect routes
- gracefully recover from expired sessions

---

# Authentication & State Summary

Authentication in the Aegis Frontend is built around a clear separation of responsibilities. The backend owns identity, sessions, tokens, and permissions, while the frontend manages user experience through Axios, TanStack Query, and Zustand. Server state is cached with TanStack Query, client state is managed with Zustand, and authentication is handled transparently through automatic token refresh, protected routes, and permission-aware UI. User preferences, including timezone and localization, are managed entirely on the frontend, ensuring all timestamps are displayed according to the user's selected timezone while the backend remains standardized on UTC.