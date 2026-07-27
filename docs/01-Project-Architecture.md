# Project Architecture

> Version: 1.0
>
> Purpose:
> This document defines the complete architecture of the Aegis Frontend. It explains how the application should be organized, how features communicate with each other, how modules should be separated, and which architectural principles must always be followed.

---

# Table of Contents

1. Project Overview
2. Architecture Goals
3. Core Principles
4. High-Level Architecture
5. Feature-Based Architecture
6. Folder Structure
7. Module Responsibilities
8. Routing Architecture
9. Layout Architecture
10. Feature Communication
11. Data Flow
12. Dependency Rules
13. Scalability Guidelines
14. Naming Conventions

---

# 1. Project Overview

The Aegis Frontend is a production-grade React application that communicates with the Aegis Identity Platform REST API.

The frontend is responsible for:

- User Interface
- Authentication Experience
- Session Management
- Permission-aware Navigation
- API Integration
- Dashboard
- Applications
- API Keys
- Users
- Roles
- Permissions
- Tenants
- Organizations
- Audit Logs
- Documentation
- Billing
- Settings

The frontend never communicates directly with the database.

Everything goes through the REST API.

---

# Overall Architecture

```
Browser

↓

React Application

↓

Axios Client

↓

REST API

↓

Backend Services

↓

MongoDB
```

The frontend is only responsible for presentation and user interaction.

---

# 2. Architecture Goals

The project should be designed for:

- Scalability
- Maintainability
- Reusability
- Separation of Concerns
- Testability
- Developer Experience
- Performance
- Accessibility

The codebase should remain understandable even after years of development.

---

# 3. Core Principles

## Feature First

Everything belongs to a feature.

Example

```
Applications

Users

Roles

Settings

Dashboard
```

Each feature owns:

- pages
- components
- hooks
- queries
- mutations
- schemas
- types

---

## Shared Only When Truly Shared

Only reusable code belongs inside

```
src/shared
```

Examples

```
Button

Modal

Table

Toast

Axios

Date Utilities

Permission Helpers
```

Business logic never belongs inside shared.

---

## Separation of Concerns

Every layer has one responsibility.

Example

```
Page

↓

Feature Component

↓

Hook

↓

TanStack Query

↓

Axios

↓

Backend
```

Pages should not call axios directly.

---

## Composition Over Inheritance

Build applications by composing reusable components.

Avoid large components containing hundreds of lines.

---

## Single Responsibility

One file.

One purpose.

Examples

```
ApplicationTable

ApplicationCard

CreateApplicationDialog

ApplicationFilters
```

Not

```
ApplicationEverything.tsx
```

---

# 4. High-Level Architecture

```
src

├── app

├── layouts

├── features

├── shared

├── routes

├── providers

├── assets

└── styles
```

---

## App Layer

Responsible for:

- bootstrapping
- providers
- router
- theme
- application initialization

Contains no business logic.

---

## Features Layer

Contains business features.

Examples

```
auth

dashboard

applications

users

roles

permissions

api-keys

tenants

organizations

sessions

oauth

audit

billing

settings
```

Every feature is isolated.

---

## Shared Layer

Contains reusable infrastructure.

Examples

```
Button

Modal

Table

Toast

Axios

Timezone

Logger

Utils
```

Never place business-specific logic here.

---

# 5. Feature-Based Architecture

Every feature should follow the same structure.

Example

```
features/

applications/

components/

pages/

hooks/

api/

queries/

mutations/

schemas/

types/

utils/

constants/
```

Every feature remains independent.

---

## Feature Ownership

Each feature owns:

- API hooks
- UI
- Validation
- Types
- Constants

Other features should consume only the public API exposed by the feature.

---

# 6. Folder Structure

Recommended structure

```
src/

app/

assets/

features/

layouts/

providers/

routes/

shared/

styles/
```

Feature example

```
features/

applications/

components/

pages/

hooks/

queries/

mutations/

schemas/

types/

constants/
```

---

# 7. Module Responsibilities

## App

Application startup.

---

## Providers

Global providers.

Examples

- QueryClient
- Theme
- Router
- Authentication
- Toast

---

## Layouts

Contains layouts.

Examples

```
DashboardLayout

AuthLayout

MarketingLayout

DocumentationLayout
```

---

## Routes

Defines application routing.

No business logic belongs here.

---

## Features

Contains business logic.

---

## Shared

Reusable utilities.

---

# 8. Routing Architecture

```
/

↓

Marketing

/login

/signup

/dashboard

/applications

/users

/roles

/settings

/documentation
```

Every route should be lazy loaded.

---

## Protected Routes

Protected routes require authentication.

```
Guest

↓

Login

↓

Authenticated

↓

Dashboard
```

---

## Permission Routes

Some pages require permissions.

Example

```
roles.read

permissions.read

users.update

applications.create
```

The frontend should prevent navigation when the user lacks permission.

The backend remains the final authority.

---

# 9. Layout Architecture

The project uses multiple layouts.

## Marketing Layout

Landing pages.

---

## Authentication Layout

Login

Signup

Forgot Password

Verify Email

---

## Dashboard Layout

Contains:

- Sidebar
- Header
- Breadcrumbs
- Notifications
- User Menu
- Main Content

Every dashboard page uses this layout.

---

## Documentation Layout

Used only for documentation pages.

---

# 10. Feature Communication

Features should not communicate directly.

Instead

```
Feature

↓

Query

↓

API

↓

Backend

↓

Query Cache

↓

Feature
```

Never share state between unrelated features unless absolutely necessary.

---

# 11. Data Flow

The application follows a predictable flow.

```
User

↓

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

Response

↓

Component

↓

UI
```

This flow should remain consistent across every feature.

---

# 12. Dependency Rules

Allowed

```
Page

↓

Feature

↓

Shared
```

Allowed

```
Feature

↓

Shared
```

Allowed

```
Shared

↓

External Libraries
```

Forbidden

```
Shared

↓

Feature
```

Forbidden

```
Feature A

↓

Private Files of Feature B
```

Every feature should expose only a public API when sharing functionality.

---

# 13. Scalability Guidelines

The architecture should support:

- Hundreds of components
- Dozens of pages
- Multiple developers
- Future plugins
- Enterprise features

Adding a new feature should require minimal changes to existing code.

Example

```
Create Feature

↓

Register Route

↓

Done
```

No existing features should require modification.

---

# 14. Naming Conventions

## Components

Use PascalCase.

Examples

```
ApplicationTable

UserCard

CreateUserDialog
```

---

## Hooks

Always begin with

```
use
```

Examples

```
useApplications

useUsers

usePermissions
```

---

## Files

Prefer kebab-case.

Examples

```
application-table.tsx

create-user-dialog.tsx

dashboard-layout.tsx
```

---

## Types

Use PascalCase.

Examples

```
Application

User

Role

Permission
```

---

## Constants

Use UPPER_SNAKE_CASE.

Example

```
DEFAULT_PAGE_SIZE

MAX_UPLOAD_SIZE

SESSION_TIMEOUT
```

---

## Routes

Use lowercase.

Example

```
/applications

/users

/roles

/settings
```

---

# Architecture Summary

The Aegis frontend follows a **feature-based, modular architecture** where every business domain is isolated into its own feature while reusable infrastructure is centralized in the `shared` layer. Pages communicate with the backend exclusively through TanStack Query and Axios, with layouts, routing, providers, and shared utilities separated from business logic.

This architecture is designed to support long-term growth, multiple contributors, and enterprise-scale features while maintaining a clean separation of concerns, predictable data flow, and a highly maintainable codebase.