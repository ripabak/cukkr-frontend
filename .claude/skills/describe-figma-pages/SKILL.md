---
name: describe-figma-pages
description: Analyze UI design images and turn them into structured page descriptions, reusable component descriptions, and implementation tracking documents.
---

# Describe Figma Pages

Use this skill to turn UI design images into structured documentation that is useful for slicing, implementation planning, and reusable component mapping.

## Purpose

This skill produces two outputs:

1. `docs/ui-ux-pages-descriptions.md`
2. `docs/track_pages_and_components.md`

If the task also includes slicing work, the same structure should be used to update implementation status and preview routing.

## Expected Input

- A folder of UI screenshots or PNG files
- A project structure that may later receive slicing work
- Optional user constraints about naming, scope, or target files

## Working Principles

- Focus on visible UI only.
- Do not invent hidden product logic, backend behavior, or API details.
- Mark uncertain conclusions as `Assumption` or `Estimate`.
- Use clear `kebab-case` names for pages and reusable components.
- Always reference exact image file paths.
- Split different visual states into separate page entries when the state materially changes content, layout, or action flow.
- Keep page descriptions separate from reusable component descriptions.
- Prefer tables over long bullet lists so the result is easier to scan and reuse.

## Workflow

1. Inventory the design files.
Collect all relevant images and group them by flow, feature, or state.

2. Define unique page names.
Name each page in `kebab-case` using the screen purpose, not only the folder name.

3. Describe pages.
For each page, capture purpose, visible content, colors, actions, likely flow, and page-level reusable components.

4. Describe reusable components.
Create a separate component inventory that abstracts repeated UI patterns across pages.

5. Build implementation tracking.
Map pages and components into implementation phases ordered by shared structure and delivery efficiency.

6. Update implementation status when needed.
If slicing already exists, update the tracking file and add preview entries only when the task explicitly includes slicing work.

## Output 1

Target file: `docs/ui-ux-pages-descriptions.md`

This document must have two sections:

1. `Page Descriptions`
2. `Component Descriptions`

### Page Descriptions

Each page entry should include:

- page metadata
- visible content inventory with example values
- important colors
- visible actions and likely flow
- reusable components used on that page

When describing visible content, include concrete example values whenever possible.

Good examples:

- `Input Field (label: Name, example value: "Rifa")`
- `Input Field (label: Email, example value: "rifa@example.com")`
- `Button (label: Submit)`
- `Badge (label: Confirmed)`
- `Text Block (label: Shop Name, example value: "Cukkr Barbershop")`

### Recommended page entry format

```md
# UI/UX Pages Descriptions

## Page Descriptions

### booking-detail

| Field | Value |
| --- | --- |
| Page Name | `booking-detail` |
| Reference PNG | `ui-ux-pages-pngs/booking-detail/booking-detail-main.png` |
| Purpose | Show booking details and next available actions. |
| Primary Actions | Back, Reschedule, Cancel Booking |
| Flow Summary | Back returns to the previous screen. Reschedule opens schedule selection. Cancel opens a confirmation modal. |
| Notes | Color values may be estimated from the PNG if no design tokens are available. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| App Bar | Booking Detail | - | Displays screen title and back navigation. |
| Text Block | Customer Name | `Rifa Saputra` | Shows the customer identity. |
| Text Block | Service | `Haircut + Beard Trim` | Shows the selected service package. |
| Text Block | Schedule | `Tue, 14 May 2026 - 13:30` | Shows booking time. |
| Badge | Status | `Confirmed` | Indicates the current booking state. |
| Button | Reschedule | - | Starts the reschedule flow. |
| Button | Cancel Booking | - | Opens a destructive confirmation step. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#111827` | Primary text and headings |
| `#F59E0B` | Accent action or status highlight |
| `#FFFFFF` | Main background |
| `#E5E7EB` | Borders and dividers |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `app-bar` | Back button | `Booking Detail` | Top navigation header |
| `info-row` | Label-value row | `Service / Haircut + Beard Trim` | Compact detail presentation |
| `status-badge` | Confirmed | `Confirmed` | Status display |
| `primary-button` | Filled | `Reschedule` | Main action |
| `confirmation-modal` | Destructive | `Cancel Booking` | Confirm destructive actions |
```

### Component Descriptions

This section must describe reusable components independently from any single page.

Each component entry should include:

- component name
- component type or pattern
- variants or states
- example content
- pages where it is used
- implementation notes

### Recommended component table format

```md
## Component Descriptions

| Component Name | Type | Variants or States | Example Content | Used By Pages | Notes |
| --- | --- | --- | --- | --- | --- |
| `primary-button` | Action button | Filled, outlined, disabled | `Submit`, `Continue`, `Save` | `login`, `register`, `booking-detail` | Keep height, radius, and text style consistent across features. |
| `status-badge` | Status indicator | Confirmed, pending, cancelled | `Confirmed` | `booking-detail`, `schedule-list` | Should support color variants from a shared token set. |
| `info-row` | Label-value row | Default, multi-line | `Phone Number / +62 812 3456 7890` | `booking-detail`, `user-profile` | Useful for compact detail summary screens. |
```

## Output 2

Target file: `docs/track_pages_and_components.md`

This document is the slicing tracker and implementation plan.

It must include:

- implementation phases ordered by efficiency
- a short reason for each phase
- a pages table
- a components table
- implementation status for slicing and API wiring

### Required table schema

Use the same 8 columns for both pages and components tables:

1. `nama_halaman` or `nama_komponen`
2. `dependency`
3. `kegunaan`
4. `slicing_implemented`
5. `functioning_api_implemented`
6. `lokasi`
7. `lokasi_referensi_png`
8. `implementation_notes`

Use plain text checklist values: `[]` or `[x]`.

### Recommended tracking format

```md
# Track Pages And Components

## Phase 1 - Shared UI foundation

Reason: shared layout, buttons, cards, rows, and badges should be built first because they unlock several screens with minimal repeated effort.

### Pages

| nama_halaman | dependency | kegunaan | slicing_implemented | functioning_api_implemented | lokasi | lokasi_referensi_png | implementation_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| booking-detail | info-row, status-badge, primary-button, confirmation-modal | Shows booking details and actions | [] | [] | - | ui-ux-pages-pngs/booking-detail/booking-detail-main.png | Build after shared detail rows and action footer patterns are ready. |
| notification-empty | app-bar, empty-state-illustration, primary-button | Shows empty notification state | [] | [] | - | ui-ux-pages-pngs/notification/notification-empty.png | Can be implemented quickly once the shared empty-state pattern exists. |

### Components

| nama_komponen | dependency | kegunaan | slicing_implemented | functioning_api_implemented | lokasi | lokasi_referensi_png | implementation_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| primary-button | - | Main CTA across many flows | [] | [] | - | ui-ux-pages-pngs/onboarding/onboarding-01.png | High-priority shared component. |
| info-row | - | Compact label-value layout | [] | [] | - | ui-ux-pages-pngs/booking-detail/booking-detail-main.png | Reusable across detail-heavy pages. |
```

## Naming Rules

- Use stable, descriptive page names based on screen purpose.
- Use reusable component names based on UI pattern, not only one page context.
- Split empty, loading, success, error, modal, and filled-form states when they are visually distinct.

## Prioritization Heuristics

Build these first:

1. Shared layout, app bars, buttons, cards, rows, chips, badges, and inputs.
2. Pages that share the same structural pattern.
3. Empty states, modals, status indicators, and summary rows that can be reused broadly.
4. Pages that differ mostly by content, not by structure.

## Quality Criteria

- Page descriptions are separated from component descriptions.
- Tables are used consistently for metadata, content, colors, actions, and components.
- Visible content rows include example values whenever possible.
- Colors include hex values and clear usage notes.
- Action flow stays plausible and does not invent unsupported behavior.
- Reusable components are abstract enough to be implemented once and reused across pages.
- Tracking phases are practical for implementation order.

## Implementation Notes

- If the user only asks for documentation, update documentation files only.
- If the user also asks for slicing, update tracking status to match actual implementation progress.
- Add entries to `app/index.tsx` only when that file is intentionally used as a visual preview surface for completed pages.