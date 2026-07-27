# API Integration

> Version: 1.0
>
> Purpose:
> This document defines how the frontend communicates with the Aegis backend. It specifies the API architecture, Axios configuration, TanStack Query integration, endpoint organization, request lifecycle, caching strategy, optimistic updates, error handling, and best practices.
>
> **The backend API is the single source of truth. The frontend must never reimplement backend business logic.**

---

# Table of Contents

1. API Philosophy
2. API Architecture
3. Axios Configuration
4. Request Lifecycle
5. Authentication Integration
6. TanStack Query Architecture
7. Query Organization
8. Mutation Organization
9. API Module Structure
10. Error Handling
11. Pagination
12. Search & Filtering
13. Cache Strategy
14. File Uploads
15. Endpoint Mapping
16. API Standards

---

# 1. API Philosophy

The frontend communicates **only** with the REST API.

Never:

- access MongoDB
- bypass backend validation
- recreate backend business logic
- generate IDs
- calculate permissions
- validate authorization

Everything goes through the backend.

---

## Communication Flow

```text
Component

↓

Hook

↓

TanStack Query

↓

Axios

↓

REST API

↓

Backend

↓

Response

↓

Query Cache

↓

Component
```

No component should call Axios directly.

---

# 2. API Architecture

Create a shared API layer.

```
shared/

api/

axios.ts

client.ts

interceptors.ts

api-error.ts

request.ts

response.ts

retry.ts
```

Business endpoints belong inside feature folders.

Example

```
features/

applications/

api/

application-api.ts
```

---

# 3. Axios Configuration

Create **one** Axios instance.

Responsibilities

- Base URL
- Credentials
- Headers
- Timeout
- Interceptors
- Retry
- Error Parsing

Never create multiple Axios instances.

---

## Base Configuration

Use

```env
VITE_API_BASE_URL
```

Never hardcode URLs.

---

## Timeout

Configure a global timeout.

Example

```
30 seconds
```

Long-running operations should use polling instead.

---

## Default Headers

Automatically send

```
Accept

Content-Type

Accept-Language

Timezone

Request ID
```

Only attach Authorization headers if required by the backend.

---

# 4. Request Lifecycle

Every request follows this flow.

```text
Component

↓

Mutation / Query

↓

Axios

↓

Interceptor

↓

Backend

↓

Response

↓

Cache

↓

Component
```

No business logic belongs inside Axios.

---

# 5. Authentication Integration

Authentication already exists.

Frontend should call:

```
POST /auth/login

POST /auth/signup

POST /auth/logout

POST /auth/logout-all

POST /auth/refresh

POST /auth/forgot-password

POST /auth/reset-password

POST /auth/verify-email
```

Never change authentication endpoints.

---

## 401 Handling

When

```
401 Unauthorized
```

is received

```text
401

↓

Refresh

↓

Retry Request

↓

Continue
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

# 6. TanStack Query Architecture

TanStack Query owns all server state.

Examples

- Users
- Applications
- Sessions
- Roles
- Permissions
- API Keys
- Audit Logs
- Organizations
- Tenants

Do not duplicate this data in Zustand.

---

## Query Client

Create one global Query Client.

Responsibilities

- Retry
- Cache
- Devtools
- Persistence (optional)
- Global Error Handling

---

# 7. Query Organization

Each feature owns its own queries.

Example

```
applications/

queries/

use-applications.ts

use-application.ts

use-application-statistics.ts
```

Never place feature queries inside `shared`.

---

## Query Naming

Examples

```
useApplications()

useApplication()

useUsers()

useRoles()

useSessions()
```

Always prefix hooks with `use`.

---

## Query Keys

Centralize query keys.

Example

```
auth.currentUser

applications.list

applications.detail

users.list

roles.list

permissions.list

sessions.list
```

Never hardcode query keys.

---

# 8. Mutation Organization

Mutations belong to features.

Example

```
applications/

mutations/

use-create-application.ts

use-update-application.ts

use-delete-application.ts
```

---

## Mutation Lifecycle

```text
Mutation

↓

Backend

↓

Success

↓

Invalidate Cache

↓

Refetch

↓

Update UI
```

---

## Optimistic Updates

Only use optimistic updates when safe.

Good examples

- Favorites
- Theme
- Preferences

Avoid optimistic updates for

- Permissions
- Billing
- Authentication
- Security Settings

---

# 9. API Module Structure

Every feature owns an API module.

Example

```
features/

users/

api/

users-api.ts
```

Responsibilities

- Request builders
- Endpoint definitions
- DTO mapping

No UI logic.

---

# 10. Error Handling

Backend already returns standardized responses.

Frontend should normalize errors into reusable models.

Example

```
ApiError

ValidationError

ForbiddenError

UnauthorizedError

NetworkError
```

Never expose raw Axios errors to components.

---

## UI States

Every request should support

Loading

↓

Success

↓

Empty

↓

Error

Every page should gracefully recover from failures.

---

# 11. Pagination

Backend pagination should be respected.

Never paginate on the client when server pagination exists.

---

## Supported Pagination

```
Page Number

↓

Limit

↓

Sort

↓

Filter
```

Frontend should preserve pagination state in the URL where appropriate.

---

# 12. Search & Filtering

Search and filtering should be server-driven.

Examples

```
Applications

Users

Sessions

Audit Logs

Organizations
```

Debounce search requests.

Avoid firing a request on every keystroke.

---

## Sorting

Sorting should also be performed by the backend whenever supported.

---

# 13. Cache Strategy

Different resources require different cache lifetimes.

Examples

Frequently changing

```
Sessions

Audit Logs

Statistics
```

Use shorter stale times.

Slow-changing

```
Roles

Permissions

Countries

Timezones
```

Use longer stale times.

---

## Cache Invalidation

Invalidate only affected queries.

Example

```
Create Application

↓

Invalidate

applications.list
```

Avoid invalidating the entire cache unnecessarily.

---

# 14. File Uploads

Support uploads using

```
multipart/form-data
```

Examples

- Logos
- Avatars
- Organization Images

Display

- upload progress
- success state
- failure state

Validate file size and type before uploading.

---

# 15. Endpoint Mapping

Each feature should have a dedicated API module corresponding to backend endpoints.

Example structure

```
Auth

↓

Applications

↓

Users

↓

Roles

↓

Permissions

↓

Sessions

↓

API Keys

↓

Organizations

↓

Tenants

↓

Audit Logs

↓

Settings
```

Each module should expose:

- Query Hooks
- Mutation Hooks
- DTO Types
- Endpoint Functions

---

## Backend Contracts

Do not modify

- Request DTOs
- Response DTOs
- Error Shapes
- Header Requirements

If backend changes, update the frontend implementation accordingly rather than introducing incompatible abstractions.

---

# 16. API Standards

Every API implementation should follow these rules.

## Always

- Use Axios
- Use TanStack Query
- Use feature-local API modules
- Use centralized query keys
- Normalize errors
- Handle loading states
- Handle empty states
- Handle retry behavior
- Respect backend pagination
- Validate forms before sending requests

---

## Never

- Call Axios directly from components
- Hardcode API URLs
- Duplicate query keys
- Store server state in Zustand
- Ignore backend error responses
- Bypass authentication
- Implement business rules on the client

---

# API Integration Summary

The Aegis Frontend communicates exclusively through a centralized Axios client integrated with TanStack Query. Each feature owns its API modules, queries, and mutations while sharing common infrastructure such as interceptors, error handling, and caching. Server state is managed entirely by TanStack Query, client state remains in Zustand, and all communication strictly follows the backend API contracts. This architecture keeps the frontend modular, scalable, and easy to maintain while ensuring a clear separation between presentation logic and backend business rules.