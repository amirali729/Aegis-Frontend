# UI Design System

> Version: 1.0
>
> Purpose:
> This document defines the design language, reusable UI components, design tokens, responsiveness, accessibility standards, and UX principles for the Aegis Frontend. Every page and component must follow this document to ensure a consistent, modern, and professional user experience.

---

# Table of Contents

1. Design Philosophy
2. Design Principles
3. Design Tokens
4. Color System
5. Typography
6. Spacing System
7. Icons
8. Component Library
9. Layout System
10. Tables
11. Forms
12. Charts & Data Visualization
13. Feedback Components
14. Responsive Design
15. Dark Mode
16. Accessibility
17. Motion & Animation
18. UX Guidelines

---

# 1. Design Philosophy

The Aegis dashboard should feel like a modern SaaS platform.

Primary inspirations include:

- Clerk
- Auth0 Dashboard
- Vercel
- GitHub
- Stripe
- Supabase
- BetterAuth
- Linear

The UI should prioritize:

- Simplicity
- Clarity
- Consistency
- Fast navigation
- Minimal distractions
- Professional appearance

Every screen should communicate information clearly without overwhelming the user.

---

# 2. Design Principles

The design system follows these principles.

## Consistency

Every page should look like it belongs to the same application.

Buttons, forms, tables, dialogs, and cards should behave consistently.

---

## Reusability

Every commonly used UI element should become a reusable component.

Never duplicate UI.

---

## Accessibility

Every component should be keyboard accessible.

Every interactive element should include:

- Focus state
- Hover state
- Disabled state
- Loading state

---

## Responsiveness

Every screen must work on:

- Desktop
- Laptop
- Tablet
- Mobile

Desktop is the primary experience.

---

## Minimalism

Avoid unnecessary decorations.

Whitespace improves readability.

---

# 3. Design Tokens

All visual values should come from reusable tokens.

Examples

```
Colors

Typography

Spacing

Radius

Shadow

Animation

Breakpoints

Z-Index
```

Never hardcode repeated values.

---

## Border Radius

Use a consistent radius system.

Examples

```
Small

Medium

Large

Full
```

Cards, buttons, dialogs, and inputs should follow the same radius scale.

---

## Shadows

Only use shadows where necessary.

Examples

```
Card

Dropdown

Modal

Popover
```

Avoid excessive shadow usage.

---

# 4. Color System

Use semantic colors rather than hardcoded colors.

Primary

```
Primary
```

Success

```
Green
```

Warning

```
Amber
```

Danger

```
Red
```

Information

```
Blue
```

Neutral

```
Gray
```

---

## Status Colors

Success

- Active
- Verified
- Healthy

Warning

- Pending
- Expiring Soon

Danger

- Revoked
- Deleted
- Failed

Information

- Processing
- Loading

---

## Theme Tokens

Support

- Light
- Dark
- System

Every component should automatically adapt.

---

# 5. Typography

Use a modern sans-serif font for the application.

Use

```
@fontsource-variable/fira-code
```

only for:

- Code blocks
- API Keys
- Tokens
- IDs
- JSON
- Terminal Output

---

## Typography Scale

Examples

```
Display

Heading

Subheading

Body

Caption

Label

Code
```

Typography hierarchy should remain consistent across all pages.

---

# 6. Spacing System

Use a consistent spacing scale.

Examples

```
4

8

12

16

24

32

48

64
```

Avoid arbitrary spacing values.

Whitespace should improve readability and grouping.

---

# 7. Icons

Use

```
Lucide React
```

throughout the application.

Icons should:

- Match text size
- Be consistent
- Improve recognition
- Never replace labels

Avoid mixing icon libraries.

---

# 8. Component Library

Use

```
shadcn/ui
```

built on

```
Radix UI
```

Every component should be customized to match the provided design.

---

## Core Components

Reusable components include:

```
Button

Input

Textarea

Checkbox

Switch

Radio

Select

Badge

Avatar

Card

Alert

Tooltip

Popover

Dropdown

Dialog

Drawer

Tabs

Accordion

Breadcrumb

Pagination

Command Palette

Toast

Separator

Skeleton

Spinner

Empty State
```

---

## Buttons

Every button should support:

- Default
- Secondary
- Outline
- Ghost
- Destructive
- Loading
- Disabled

Buttons should include optional icons.

---

## Cards

Cards are the primary layout container.

Examples

Dashboard cards

Statistics

Analytics

Applications

Settings

Cards should support:

- Header
- Content
- Footer
- Actions

---

## Dialogs

Use dialogs for:

- Delete confirmation
- Create forms
- Edit forms
- API key generation
- User invitations

Dialogs should trap keyboard focus.

---

# 9. Layout System

Dashboard Layout

```
Sidebar

↓

Top Navigation

↓

Breadcrumb

↓

Page Header

↓

Content
```

The layout should remain consistent across all authenticated pages.

---

## Sidebar

Sidebar contains:

- Logo
- Navigation
- Workspace
- Settings
- User Profile

Support:

- Expanded
- Collapsed
- Mobile Drawer

---

## Top Navigation

Contains:

- Search
- Notifications
- Theme Toggle
- User Menu
- Breadcrumb

---

# 10. Tables

Use

```
TanStack Table
```

Every table should support:

- Pagination
- Sorting
- Filtering
- Search
- Column Visibility
- Sticky Headers
- Loading State
- Empty State
- Error State

---

## Row Actions

Use dropdown menus.

Examples

```
Edit

Delete

View

Duplicate

Disable

Revoke
```

Avoid placing too many buttons directly inside table rows.

---

# 11. Forms

Use

```
React Hook Form

+

Zod
```

Every form should include:

- Labels
- Help Text
- Validation
- Error Messages
- Loading Button
- Success Feedback

Never create manual form validation.

---

## Input Types

Support

- Text
- Password
- Email
- Number
- Select
- Multi Select
- Date
- Time
- Timezone
- Country
- File Upload

---

# 12. Charts & Data Visualization

Use

```
Recharts
```

Supported charts include:

- Line
- Area
- Bar
- Pie
- Donut

Charts should be responsive.

---

## Dashboard Widgets

Examples

- Active Users
- API Requests
- Session Count
- Login Activity
- Application Usage

Every widget should support loading and empty states.

---

# 13. Feedback Components

The application should always communicate system status.

Examples

Loading

```
Skeleton
```

Success

```
Toast
```

Warning

```
Alert
```

Error

```
Error Boundary
```

Empty

```
Illustrated Empty State
```

---

## Notifications

Use

```
Sonner
```

for toast notifications.

Support

- Success
- Error
- Warning
- Information

---

# 14. Responsive Design

Support four breakpoints.

```
Mobile

Tablet

Laptop

Desktop
```

---

## Mobile Behavior

Sidebar becomes a drawer.

Tables become horizontally scrollable or card-based when appropriate.

Dialogs adapt to screen size.

Forms remain usable without zooming.

---

# 15. Dark Mode

Support:

- Light
- Dark
- System

User preference should be stored inside Settings.

Every component must support both themes.

Never use colors that are unreadable in dark mode.

---

# 16. Accessibility

Every interactive component should support:

- Keyboard navigation
- Focus management
- ARIA labels
- Screen readers
- High contrast
- Semantic HTML

Dialogs must trap focus.

Dropdowns should be fully keyboard accessible.

---

# 17. Motion & Animation

Use

```
Framer Motion
```

sparingly.

Examples

- Sidebar transitions
- Modal transitions
- Dropdown animations
- Page transitions
- Skeleton fade-in

Animations should improve usability rather than distract.

Respect the user's reduced motion preference.

---

# 18. UX Guidelines

Every page should support:

Loading State

↓

Success State

↓

Empty State

↓

Error State

Users should always know:

- What is happening
- What succeeded
- What failed
- What they should do next

Avoid dead ends.

Provide actionable error messages whenever possible.

---

# UI Design System Summary

The Aegis Frontend follows a unified design system built on TailwindCSS, shadcn/ui, and Radix UI, with reusable design tokens, consistent typography, semantic colors, and accessible components. Every interface should mirror the provided designs while maintaining production-grade usability, responsiveness, and accessibility. By centralizing UI decisions into a shared design system, the application remains visually consistent, scalable, and easy to extend as new features are added.