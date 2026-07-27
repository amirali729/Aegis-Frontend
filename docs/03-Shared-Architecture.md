# Shared Architecture

> Version: 1.0
>
> Purpose:
> This document defines the shared layer of the Aegis Frontend. The `shared` directory contains reusable infrastructure that is independent of any business feature. It is the foundation that every feature builds upon.

---

# Table of Contents

1. Shared Layer Philosophy
2. Design Principles
3. Shared Folder Structure
4. Configuration
5. API Layer
6. Authentication Helpers
7. Query Layer
8. Timezone System
9. Utilities
10. Validation
11. Error Handling
12. Storage
13. UI Components
14. Custom Hooks
15. Types
16. Constants
17. Helpers
18. Logging
19. Shared Rules

---

# 1. Shared Layer Philosophy

The shared layer contains reusable infrastructure.

It **must never contain business logic**.

Good examples include:

- Buttons
- Dialogs
- Tables
- Toasts
- Axios Client
- Date Utilities
- Timezone Helpers
- Local Storage Helpers

Bad examples include:

- User CRUD
- Application CRUD
- Tenant CRUD
- API Key CRUD

Business logic belongs inside feature modules.

---

# 2. Design Principles

The shared layer should be:

- Reusable
- Stateless whenever possible
- Framework-independent
- Well typed
- Well documented
- Fully tested

Every file should have one clear responsibility.

---

# 3. Shared Folder Structure

```
src/

shared/

├── api/

├── auth/

├── components/

├── config/

├── constants/

├── date/

├── errors/

├── events/

├── forms/

├── hooks/

├── icons/

├── lib/

├── logger/

├── permissions/

├── query/

├── schemas/

├── storage/

├── table/

├── timezone/

├── types/

├── utils/

└── validators/
```

Every directory has a single responsibility.

---

# 4. Configuration

```
shared/config
```

Contains application configuration.

Example

```
app.ts

api.ts

auth.ts

routes.ts

theme.ts
```

Configuration should always read from environment variables.

Never hardcode URLs.

---

# 5. API Layer

```
shared/api
```

Contains the global API infrastructure.

Example

```
axios.ts

interceptors.ts

api-error.ts

request.ts

response.ts
```

Responsibilities:

- Axios Instance
- Request Interceptors
- Response Interceptors
- Refresh Retry
- Global Headers
- Request Cancellation
- Timeout Configuration

No feature-specific endpoints belong here.

---

# 6. Authentication Helpers

```
shared/auth
```

Contains reusable authentication utilities.

Examples

```
token-manager.ts

auth-storage.ts

auth-constants.ts

cookie.ts

jwt.ts
```

Responsibilities

- Store tokens
- Remove tokens
- Decode JWT
- Check expiration
- Session helpers

Authentication business logic remains inside the Auth feature.

---

# 7. Query Layer

```
shared/query
```

Contains TanStack Query infrastructure.

Examples

```
query-client.ts

query-keys.ts

query-options.ts

mutation-options.ts
```

Responsibilities

- Global Query Client
- Default Retry Logic
- Cache Configuration
- Devtools Configuration
- Shared Query Helpers

Individual queries belong to their features.

---

# 8. Timezone System

One of the most important shared modules.

```
shared/timezone
```

Contains

```
timezone.ts

convert.ts

format.ts

locale.ts

preferences.ts
```

---

## Backend Rule

Backend stores

```
UTC
```

only.

---

## Frontend Rule

Frontend stores

```
User Timezone

Locale

Date Format

Time Format
```

Example

```
Asia/Karachi

Europe/London

America/New_York
```

---

## Incoming Flow

```
UTC

↓

Convert

↓

User Timezone

↓

Display
```

---

## Outgoing Flow

```
User Time

↓

Convert

↓

UTC

↓

API
```

This conversion should happen automatically through shared utilities.

No feature should implement timezone conversion independently.

---

# 9. Utilities

```
shared/utils
```

Contains generic helper functions.

Examples

```
copy.ts

download.ts

sleep.ts

format.ts

number.ts

string.ts

array.ts

object.ts

promise.ts

url.ts
```

Utilities should be completely independent from business features.

---

# 10. Validation

```
shared/validators
```

Contains reusable validators.

Examples

```
email.ts

password.ts

url.ts

hostname.ts

uuid.ts
```

Use Zod wherever validation schemas are required.

---

# 11. Error Handling

```
shared/errors
```

Contains frontend error models.

Example

```
api-error.ts

validation-error.ts

network-error.ts

unauthorized-error.ts

forbidden-error.ts
```

These mirror backend responses but are implemented independently.

Never import backend code.

---

# 12. Storage

```
shared/storage
```

Contains browser storage helpers.

Examples

```
local-storage.ts

session-storage.ts

indexed-db.ts
```

Responsibilities

- Safe parsing
- Versioning
- Serialization
- Expiration
- Cleanup

Never call browser storage APIs directly from feature code.

---

# 13. UI Components

```
shared/components
```

Contains reusable components.

Examples

```
Button

Card

Badge

Avatar

Table

Pagination

Dialog

Drawer

Tooltip

Popover

Breadcrumb

Empty State

Error State

Loading Spinner

Skeleton

Search Input

Filter Bar

Confirm Dialog
```

Business-specific components belong inside their feature.

---

# 14. Custom Hooks

```
shared/hooks
```

Reusable hooks.

Examples

```
useDebounce

useClipboard

useMediaQuery

useLocalStorage

usePrevious

useBoolean

useMounted

useKeyboardShortcut

usePageTitle
```

Feature hooks belong inside feature folders.

---

# 15. Types

```
shared/types
```

Contains reusable types.

Examples

```
ApiResponse

Pagination

Option

SelectItem

TableColumn

SortDirection

Theme

Timezone

Locale
```

Avoid duplicate type definitions.

---

# 16. Constants

```
shared/constants
```

Contains global constants.

Examples

```
API_TIMEOUT

DEFAULT_PAGE_SIZE

MAX_UPLOAD_SIZE

SUPPORTED_TIMEZONES

SUPPORTED_LOCALES

DATE_FORMAT

TIME_FORMAT
```

Never hardcode repeated values.

---

# 17. Helpers

```
shared/helpers
```

Contains complex reusable helper logic.

Examples

```
pagination.ts

sorting.ts

filtering.ts

csv.ts

export.ts

import.ts
```

Helpers may compose utilities but should remain feature-independent.

---

# 18. Logging

```
shared/logger
```

Contains logging abstraction.

Examples

```
logger.ts

console.ts

sentry.ts
```

Responsibilities

- Development Logging
- Production Logging
- Error Reporting
- Analytics Integration

Never use `console.log` directly throughout the application.

---

# 19. Shared Rules

The following rules must always be followed.

## Rule 1

Shared code must never import feature code.

Allowed

```
Feature

↓

Shared
```

Forbidden

```
Shared

↓

Feature
```

---

## Rule 2

Do not duplicate shared logic.

If multiple features need the same functionality, move it into the shared layer.

---

## Rule 3

Never import backend shared files.

The frontend lives in a separate repository.

For example:

❌

```
backend/src/shared/errors
```

Instead create:

```
frontend/src/shared/errors
```

with equivalent frontend functionality.

---

## Rule 4

Every reusable utility should be well typed.

Avoid `any`.

Prefer generic types when appropriate.

---

## Rule 5

Shared modules should be documented and independently testable.

Features should rely on them rather than reimplementing common functionality.

---

# Shared Architecture Summary

The `shared` layer serves as the reusable foundation of the Aegis Frontend. It contains framework-level infrastructure such as API clients, timezone conversion, storage, validation, reusable UI components, utilities, hooks, and configuration. By keeping this layer completely independent of business features, the application remains modular, maintainable, and scalable while allowing the frontend to evolve independently from the backend repository.