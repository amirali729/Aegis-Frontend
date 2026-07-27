# Project Setup

> Version: 1.0
>
> Purpose:
> This document defines how the Aegis Frontend should be initialized, configured, and structured before any feature development begins. It establishes the project's dependencies, tooling, coding standards, environment configuration, and development workflow.

---

# Table of Contents

1. Project Initialization
2. Technology Stack
3. Required Dependencies
4. Project Structure
5. Environment Variables
6. TypeScript Configuration
7. Path Aliases
8. Code Quality
9. Git Workflow
10. Application Bootstrap
11. Global Providers
12. Styling Configuration
13. Asset Organization
14. Build & Deployment

---

# 1. Project Initialization

The frontend should be created using Vite with React and TypeScript.

```bash
npm create vite@latest aegis-dashboard
```

Select

```
React

↓

TypeScript
```

After creation install all dependencies.

---

# Package Manager

Use

```
pnpm
```

throughout the project.

Do not mix

- npm
- yarn
- bun

unless absolutely necessary.

---

# Node Version

Use the latest Active LTS version.

Maintain compatibility through `.nvmrc`.

Example

```
22.x
```

---

# 2. Technology Stack

The project must use the following technologies.

## Core

- React
- TypeScript
- Vite

---

## Routing

- React Router

---

## Styling

- TailwindCSS

---

## Components

- shadcn/ui
- Radix UI

---

## State

- Zustand

---

## Server State

- TanStack Query

---

## API

- Axios

---

## Forms

- React Hook Form
- Zod

---

## Tables

- TanStack Table

---

## Calendar

- FullCalendar

---

## Charts

- Recharts

---

## Icons

- Lucide React

---

## Notifications

- Sonner

---

## Animation

- Framer Motion

---

## Date Handling

- date-fns
- date-fns-tz

---

## Utilities

- clsx
- tailwind-merge

---

## Error Handling

- react-error-boundary

---

## Code Font

- @fontsource-variable/fira-code

---

# 3. Required Dependencies

## Production

Examples include

```
react

react-dom

react-router-dom

axios

zustand

@tanstack/react-query

@tanstack/react-table

react-hook-form

zod

@hookform/resolvers

shadcn/ui

@radix-ui/*

tailwindcss

lucide-react

sonner

framer-motion

recharts

date-fns

date-fns-tz

clsx

tailwind-merge

@fullcalendar/core

@fullcalendar/react
```

---

## Development

```
typescript

vite

eslint

prettier

husky

lint-staged

@types/react

@types/node
```

---

# 4. Project Structure

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

types/

main.tsx
```

---

## Assets

```
assets/

images/

logos/

illustrations/

icons/

fonts/
```

---

## Styles

```
styles/

globals.css

tailwind.css

theme.css

animations.css
```

---

# 5. Environment Variables

Never hardcode configuration values.

All configuration should come from environment variables.

Example

```env
VITE_APP_NAME=Aegis

VITE_APP_VERSION=1.0.0

VITE_API_BASE_URL=http://localhost:5000/api/v1

VITE_DEFAULT_TIMEZONE=UTC

VITE_ENABLE_DEVTOOLS=true

VITE_ENABLE_ANALYTICS=false

VITE_SENTRY_DSN=

VITE_DOCUMENTATION_URL=https://docs.aegis.dev
```

---

## Rules

Never commit

```
.env.local
```

Create

```
.env.example
```

containing every required variable.

---

# 6. TypeScript Configuration

Enable strict mode.

Use:

```
strict

noUnusedLocals

noUnusedParameters

noImplicitReturns

noFallthroughCasesInSwitch
```

The application should compile with zero TypeScript errors.

Avoid using

```
any
```

Use

```
unknown
```

or proper types instead.

---

# 7. Path Aliases

Avoid deep relative imports.

❌

```
../../../../../shared/utils
```

Use aliases.

Example

```
@/

@/shared

@/features

@/layouts

@/routes

@/assets

@/providers
```

---

# 8. Code Quality

Every commit should pass:

- ESLint
- TypeScript
- Formatting

before being committed.

---

## Formatting

Use

```
Prettier
```

Do not manually format files.

---

## Linting

Use ESLint with TypeScript support.

Important rules include:

- no unused variables
- no console.log in production
- no implicit any
- consistent imports

---

## Git Hooks

Use

```
Husky
```

with

```
lint-staged
```

Before every commit execute

```
ESLint

↓

Type Check

↓

Prettier
```

Reject commits when checks fail.

---

# 9. Git Workflow

Use feature branches.

Example

```
main

↓

feature/auth

↓

feature/dashboard

↓

feature/settings
```

Do not develop directly on

```
main
```

---

## Commit Style

Follow Conventional Commits.

Examples

```
feat:

fix:

docs:

refactor:

style:

test:

build:

ci:
```

---

# 10. Application Bootstrap

Application startup order should remain consistent.

```
main.tsx

↓

Global Styles

↓

Router

↓

Providers

↓

App
```

Application initialization belongs only in

```
app/
```

---

# 11. Global Providers

All providers should be registered in one location.

Example

```
AppProviders

↓

ThemeProvider

↓

QueryProvider

↓

RouterProvider

↓

AuthProvider

↓

ToastProvider

↓

Application
```

Avoid provider nesting throughout the application.

---

# 12. Styling Configuration

Use TailwindCSS for styling.

Prefer utility classes over custom CSS.

---

## Design Tokens

Create reusable tokens for:

- Colors
- Border Radius
- Shadows
- Font Sizes
- Font Weights
- Spacing
- Z-index
- Breakpoints

Never hardcode repeated values.

---

## Dark Mode

Support

- Light
- Dark
- System

Theme preference should persist between sessions.

---

# 13. Asset Organization

Images

```
assets/images
```

Icons

```
assets/icons
```

Illustrations

```
assets/illustrations
```

Fonts

```
assets/fonts
```

Avoid scattering assets throughout feature folders.

---

# 14. Build & Deployment

The application should support production builds using Vite.

Example

```bash
pnpm build
```

Preview production output with

```bash
pnpm preview
```

---

## Deployment Targets

The frontend should be deployable to platforms such as:

- Vercel
- Netlify
- Cloudflare Pages
- Docker
- Nginx

No platform-specific logic should exist within the application.

---

## Build Requirements

Before every production build:

- TypeScript must pass.
- ESLint must pass.
- The project must build successfully.
- Environment variables must be validated.
- No development-only code should remain.

---

# Project Setup Summary

The Aegis Frontend should start from a clean, production-ready foundation using Vite, React, and TypeScript, with a carefully selected ecosystem including TailwindCSS, shadcn/ui, TanStack Query, Zustand, Axios, Zod, and React Hook Form. The setup emphasizes strict typing, consistent tooling, automated code quality checks, environment-based configuration, and a scalable project structure that supports long-term maintenance and enterprise-level development.