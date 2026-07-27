# Aegis Frontend

<p align="center">
  <img src="./public/logo.png" alt="Aegis Logo" width="120" />
</p>

<p align="center">
  <strong>Modern Identity & Access Management Dashboard</strong>
</p>

<p align="center">
A production-ready React dashboard for managing authentication, authorization, applications, API keys, users, roles, permissions, organizations, tenants, sessions, and audit logs through the Aegis Identity Platform.
</p>

---

## Overview

Aegis Frontend is the official web dashboard for the **Aegis Identity Platform**.

It provides administrators and developers with a modern interface for managing identity infrastructure without directly interacting with backend services.

The frontend communicates with the Aegis REST API and is completely independent from the backend repository.

---

## Features

### Authentication

- Login
- Signup
- Forgot Password
- Reset Password
- Email Verification
- Automatic Session Recovery
- Logout
- Logout All Sessions

---

### Dashboard

- Analytics
- Recent Activity
- Statistics
- Quick Actions
- Session Overview

---

### Application Management

- Create Applications
- Update Applications
- Delete Applications
- Manage Redirect URIs
- Manage Allowed Origins
- View Secrets

---

### API Keys

- Create API Keys
- Rotate Keys
- Revoke Keys
- Copy Keys
- View Permissions

---

### User Management

- User List
- User Details
- Invite Users
- Edit Users
- Delete Users

---

### Authorization

- Roles
- Permissions
- Permission Assignment
- Role Assignment
- Permission-aware UI

---

### Organizations

- Organization Management
- Member Management
- Organization Settings

---

### Tenants

- Multi-tenant Dashboard
- Tenant Management
- Tenant Statistics

---

### Sessions

- Active Sessions
- Device Information
- Logout Current Session
- Logout All Devices

---

### Audit Logs

- Search
- Filter
- Timeline
- Export
- Security Events

---

### User Settings

- Profile
- Password
- Appearance
- Theme
- Localization
- Timezone
- Notifications

---

## Technology Stack

### Core

- React
- TypeScript
- Vite

### UI

- TailwindCSS
- shadcn/ui
- Radix UI
- Lucide React

### State Management

- TanStack Query
- Zustand

### Forms

- React Hook Form
- Zod

### Networking

- Axios

### Tables

- TanStack Table

### Calendar

- FullCalendar

### Charts

- Recharts

### Animation

- Framer Motion

### Notifications

- Sonner

### Utilities

- date-fns
- date-fns-tz
- clsx
- tailwind-merge

---

# Project Structure

```text
src/

├── app/
├── assets/
├── features/
├── layouts/
├── providers/
├── routes/
├── shared/
├── styles/
└── types/
```

---

## Architecture

The project follows a **Feature-Based Architecture**.

Each feature owns its own:

- Components
- Pages
- Hooks
- Queries
- Mutations
- Schemas
- Types
- Utilities

Reusable infrastructure lives inside:

```text
src/shared
```

Business logic never belongs inside the shared layer.

---

## State Management

Client State

- Zustand

Server State

- TanStack Query

UI State

- React State

---

## Authentication

Authentication is handled by the backend.

Frontend responsibilities include:

- Calling Authentication APIs
- Session Recovery
- Route Protection
- Permission-aware UI
- Automatic Refresh Handling

---

## Timezone Support

The backend stores every timestamp in **UTC**.

The frontend automatically converts timestamps into the user's selected timezone.

Supported preferences include:

- Country
- Locale
- Timezone
- Date Format
- Time Format

---

## Environment Variables

Create a `.env.local`

```env
VITE_APP_NAME=Aegis

VITE_API_BASE_URL=http://localhost:3000/api/v1

VITE_DEFAULT_TIMEZONE=UTC

VITE_ENABLE_DEVTOOLS=true

VITE_ENABLE_ANALYTICS=false

VITE_SENTRY_DSN=
```

Never commit local environment files.

---

# Getting Started

## Prerequisites

- Node.js (Active LTS)
- pnpm
- Git

---

## Clone

```bash
git clone https://github.com/<your-username>/Aegis-Frontend.git

cd Aegis-Frontend
```

---

## Install

```bash
pnpm install
```

---

## Start Development

```bash
pnpm dev
```

---

## Build

```bash
pnpm build
```

---

## Preview

```bash
pnpm preview
```

---

## Lint

```bash
pnpm lint
```

---

## Type Check

```bash
pnpm typecheck
```

---

# Design Principles

The project emphasizes:

- Scalability
- Maintainability
- Accessibility
- Security
- Performance
- Developer Experience
- User Experience

---

# UI Principles

The dashboard is inspired by modern SaaS products including:

- Clerk
- Auth0
- Stripe
- GitHub
- Supabase
- Vercel
- BetterAuth
- Linear

---

# Backend

This project requires the **Aegis Identity Platform Backend**.

The backend provides:

- Authentication
- Authorization
- Sessions
- Applications
- API Keys
- Audit Logs
- Organizations
- Tenants
- RBAC
- REST API

The frontend communicates with the backend using Axios and TanStack Query.

---

# Documentation

Project documentation can be found inside:

```text
docs/
```

Including:

- Project Architecture
- Shared Architecture
- Authentication & State
- API Integration
- UI Design System
- Pages & Components
- Implementation Roadmap
- Production Checklist

---

# Production Goals

The frontend is designed to support:

- Enterprise deployments
- Multiple organizations
- Multi-tenant environments
- Production-grade authentication
- Permission-based interfaces
- Timezone-aware experiences
- Responsive layouts
- Accessibility standards

---

# Roadmap

- Project Foundation
- Shared Infrastructure
- Authentication
- Dashboard
- Applications
- API Keys
- Users
- Roles & Permissions
- Organizations
- Audit Logs
- Settings
- Documentation
- Production Hardening

---

# License

This project is licensed under the **MIT License**.

---

# Author

**Aegis Identity Platform**

Production-ready Identity & Access Management built with modern web technologies.
