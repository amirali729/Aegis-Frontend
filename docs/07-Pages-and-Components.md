# Pages & Components

> Version: 1.0
>
> Purpose:
> This document defines every page, layout, reusable component, feature module, and navigation flow for the Aegis Frontend. It acts as the blueprint for the entire user interface and should be followed throughout development.

---

# Table of Contents

1. Navigation Structure
2. Layouts
3. Authentication Pages
4. Dashboard Pages
5. Applications Module
6. API Keys Module
7. Users Module
8. Roles & Permissions Module
9. Sessions Module
10. Organizations & Tenants
11. Audit Logs
12. Settings
13. Documentation
14. Shared Components
15. Global Components

---

# 1. Navigation Structure

Authenticated users should access the application through a consistent dashboard layout.

```
Dashboard

├── Dashboard

├── Applications

├── API Keys

├── Users

├── Roles

├── Permissions

├── Sessions

├── Audit Logs

├── Organizations

├── Tenants

├── Documentation

└── Settings
```

Navigation visibility should depend on user permissions.

---

# 2. Layouts

The application consists of four layouts.

## Marketing Layout

Public pages.

Examples

- Landing
- Pricing
- Documentation

---

## Authentication Layout

Authentication pages.

Examples

- Login
- Signup
- Forgot Password
- Reset Password
- Verify Email

---

## Dashboard Layout

Contains

- Sidebar
- Header
- Breadcrumb
- Page Title
- Notification Menu
- User Menu

Every authenticated page should use this layout.

---

## Documentation Layout

Used only for API documentation and SDK guides.

---

# 3. Authentication Pages

```
/login

/signup

/forgot-password

/reset-password

/verify-email
```

---

Each page should contain

- Form
- Validation
- Loading State
- Success State
- Error State

---

## Login

Components

```
LoginForm

PasswordField

RememberMe

LoginButton

OAuthButtons (future)

AuthCard
```

---

## Signup

Components

```
SignupForm

TermsCheckbox

PasswordStrength

SignupButton
```

---

## Forgot Password

Components

```
ForgotPasswordForm

EmailInput

SubmitButton
```

---

## Reset Password

Components

```
ResetPasswordForm

NewPassword

ConfirmPassword
```

---

# 4. Dashboard

```
/dashboard
```

The landing page after login.

Widgets may include

- Active Users
- Applications
- API Requests
- Active Sessions
- Recent Audit Events
- Organization Summary
- Quick Actions

---

Dashboard Components

```
StatisticsCard

ActivityFeed

RecentSessions

UsageChart

QuickActionCard

DashboardHeader
```

---

# 5. Applications Module

```
/applications
```

Pages

```
Application List

Application Details

Create Application

Edit Application
```

---

Components

```
ApplicationTable

ApplicationCard

ApplicationFilters

ApplicationDialog

ApplicationForm

ApplicationOverview

RedirectURITable

AllowedOriginTable

SecretCard
```

---

# 6. API Keys Module

```
/api-keys
```

Pages

```
API Key List

Create API Key

API Key Details
```

---

Components

```
ApiKeyTable

ApiKeyDialog

ApiKeyCard

ApiKeyPermissions

CopyKeyButton

RevokeDialog
```

Sensitive values should only be displayed once when created.

---

# 7. Users Module

```
/users
```

Pages

```
User List

User Details

Invite User

Edit User
```

---

Components

```
UserTable

UserCard

InviteDialog

RoleSelector

PermissionBadge

UserAvatar

StatusBadge
```

---

# 8. Roles & Permissions

```
/roles

/permissions
```

---

Role Components

```
RoleTable

RoleForm

PermissionSelector

AssignRoleDialog

RoleStatistics
```

---

Permission Components

```
PermissionTable

PermissionBadge

PermissionMatrix

PermissionGroup
```

---

# 9. Sessions

```
/sessions
```

Pages

```
Current Sessions

All Sessions
```

---

Components

```
SessionTable

SessionCard

SessionMap

LogoutDeviceDialog

CurrentSessionBadge

DeviceCard
```

Support

- Revoke Session
- Logout All

---

# 10. Organizations & Tenants

Organizations

```
/organizations
```

Components

```
OrganizationTable

OrganizationCard

OrganizationMembers

OrganizationSettings

InviteMemberDialog
```

---

Tenants

```
/tenants
```

Components

```
TenantTable

TenantOverview

TenantStatistics

TenantSelector
```

These modules should be permission-aware.

---

# 11. Audit Logs

```
/audit
```

Pages

```
Audit List

Audit Details
```

---

Components

```
AuditTable

AuditFilters

AuditTimeline

AuditEventCard

ActorBadge

ExportAuditButton
```

Support

- Filtering
- Search
- Export
- Pagination

---

# 12. Settings

```
/settings
```

This page should be divided into multiple sections.

---

## Profile

Components

```
ProfileForm

AvatarUploader

EmailVerification

ChangePassword
```

---

## Appearance

Components

```
ThemeSelector

SidebarPreference

DensitySelector
```

---

## Localization

Components

```
CountrySelector

TimezoneSelector

LanguageSelector

DateFormatSelector

TimeFormatSelector
```

This page controls all frontend timezone conversions.

Backend remains UTC.

---

## Security

Components

```
ActiveSessions

TwoFactor (future)

TrustedDevices

RecentLogins
```

---

## Notifications

Components

```
EmailNotifications

SecurityAlerts

ProductUpdates

MarketingEmails
```

---

# 13. Documentation

```
/documentation
```

Pages

```
Getting Started

Authentication

SDK

API Reference

Examples
```

Components

```
SidebarNavigation

MarkdownRenderer

CodeBlock

CopyCodeButton

TableOfContents
```

---

# 14. Shared Components

Reusable components available to every feature.

```
Button

Card

Badge

Avatar

Dialog

Drawer

Modal

Input

Textarea

Select

Checkbox

Radio

Switch

Breadcrumb

Tabs

Accordion

Pagination

Table

SearchBar

FilterBar

Skeleton

Spinner

Alert

Tooltip

Popover

Dropdown

Toast

EmptyState

ErrorState

LoadingState

ConfirmDialog
```

These components belong inside

```
src/shared/components
```

---

# 15. Global Components

Application-wide components.

```
Sidebar

TopNavigation

CommandPalette

NotificationCenter

ThemeProvider

Breadcrumb

PageHeader

UserMenu

SearchOverlay

GlobalErrorBoundary

OfflineBanner

RouteGuard

PermissionGuard

LoadingOverlay
```

These components are initialized once and reused throughout the application.

---

# Page States

Every page should support four primary UI states.

```
Loading

↓

Success

↓

Empty

↓

Error
```

Every feature should also provide:

- Skeleton loading
- Pagination
- Search
- Filtering
- Sorting
- Responsive layout
- Permission-aware actions

---

# Component Organization

Every feature should follow the same structure.

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

Never mix business components with shared components.

---

# Pages & Components Summary

The Aegis Frontend is organized into feature-based modules centered around business domains such as Applications, Users, Roles, API Keys, Sessions, Organizations, Audit Logs, and Settings. Each module owns its own pages, components, queries, mutations, and utilities while sharing a common design system and reusable infrastructure. Every page follows consistent UX patterns with loading, success, empty, and error states, ensuring a cohesive, scalable, and enterprise-ready user experience.