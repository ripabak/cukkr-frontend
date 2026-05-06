# Component Index

> Quick reference for all UI components in cukkr-frontend, organized by category.
> For implementation status, see `docs/track_pages_and_components.md`.
> For usage rules, see `docs/project-conventions.md`.

---

## Feature-Specific Components

These live inside their feature module and must **not** be imported from outside that feature.

### `src/features/auth/components/`

| Component          | Purpose                                   |
| ------------------ | ----------------------------------------- |
| `AuthScreenShell`  | Full-page auth layout card and wrapper    |
| `AuthTextField`    | Auth-styled text and password field       |
| `AuthButton`       | Auth primary CTA button                   |
| `AuthFooterPrompt` | Bottom prompt with inline navigation link |
| `OtpCodeInput`     | Four-digit OTP verification input         |

### `src/features/onboarding/components/`

| Component             | Purpose                                       |
| --------------------- | --------------------------------------------- |
| `BrandSplash`         | Centered brand wordmark for the splash screen |
| `OnboardingContainer` | Full-page onboarding wrapper                  |
| `OnboardingCard`      | Illustration card surface for benefit slides  |
| `OnboardingIndicator` | Progress dots (step 1/2/3)                    |
| `OnboardingButton`    | Dark / accent CTA for onboarding slides       |

---

## Shared Components (`src/components/`)

Used across two or more features.

---

### Navigation & Shell

| Component         | Purpose                                            |
| ----------------- | -------------------------------------------------- |
| `ScreenHeader`    | Back circle + centered title + optional right slot |
| `EditFieldHeader` | Back + centered title + checkmark save button      |
| `BottomTabBar`    | 4-tab post-auth navigation bar                     |
| `WorkspacePill`   | Current workspace selector pill (dropdown-style)   |

---

### Buttons & CTAs

| Component               | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| `PrimaryButton`         | Main dark pill CTA                             |
| `SecondaryButton`       | Outline pill CTA                               |
| `DangerButton`          | Destructive action button (`#FFE4E4` bg)       |
| `GradientButton`        | CTA with gradient fill and trailing icon       |
| `IconActionButton`      | Circular icon-only button (send, add, confirm) |
| `StickyCta`             | Full-width bottom-anchored single CTA          |
| `DualActionFooter`      | Side-by-side accept / decline footer           |
| `InlineDecisionButtons` | Approve + decline buttons embedded in a card   |

---

### Inputs & Forms

| Component             | Purpose                                                     |
| --------------------- | ----------------------------------------------------------- |
| `TextInputField`      | Single-line text, numeric, or currency input                |
| `MultilineInputField` | Long-form textarea input                                    |
| `PrefixedInputField`  | Input with a fixed prefix (e.g. booking URL domain)         |
| `SelectorInput`       | Tap-to-open picker input (chevron, no keyboard)             |
| `SearchInput`         | Search bar with trailing icon                               |
| `ToggleSwitch`        | Standalone boolean switch                                   |
| `ImageUploadBox`      | Dashed or filled media upload surface                       |
| `HelperCopy`          | Instructional copy block under inputs (optional error line) |
| `BookingTypeToggle`   | Switch between appointment and walk-in modes                |
| `ServiceForm`         | Shared create/edit service form layout                      |
| `BookingForm`         | Shared base form for appointment and walk-in flows          |
| `MessageComposer`     | Draft area for sending customer messages                    |
| `DateSelectorPill`    | Compact pill showing the selected date                      |
| `DayChipRow`          | Horizontal weekday selector strip                           |

---

### Cards & List Items

| Component              | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `BookingCard`          | Booking row: customer, barber, time, status          |
| `BookingDetailCard`    | Detailed booking summary layout                      |
| `ServiceCard`          | Service row: image, pricing, default badge, toggle   |
| `ServiceSelectionCard` | Selected service card inside booking forms           |
| `CustomerCard`         | Customer row: name, totals, optional selection state |
| `MemberCard`           | Barber/team member row with status badge             |
| `NotificationCard`     | Notification item with timestamp and inline CTA      |
| `HistoryBookingRow`    | Flatter booking row for history lists                |
| `StatCard`             | Compact numeric summary card                         |
| `ChartCard`            | Chart container with title and summary               |
| `MetricCard`           | KPI card with optional accent left border            |
| `ShortcutTile`         | Icon + label quick-access tile                       |

---

### Rows & Detail Sections

| Component            | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| `InfoRow`            | Label–value row with optional chevron and bottom border  |
| `OperationRow`       | Always-chevron touchable navigation row                  |
| `ToggleRow`          | Label row with embedded toggle switch                    |
| `SelectionRow`       | Avatar + text row with chevron for single-item selection |
| `InviteRow`          | Pending invite row with remove affordance                |
| `LogoutRow`          | Logout action row                                        |
| `ComputedSummaryRow` | Derived-value row (e.g. price after discount)            |
| `DayHoursRow`        | Operating-hours row per weekday                          |
| `ProfileSummaryCard` | Grouped card wrapper for profile / account info rows     |
| `SuccessState`       | Centered success illustration block                      |
| `MessageThread`      | Read-only outbound message bubble list                   |

---

### Modals & Overlays

| Component                | Purpose                                           |
| ------------------------ | ------------------------------------------------- |
| `AlertModal`             | Single-action blocking or success feedback dialog |
| `ConfirmationModal`      | Two-action confirmation dialog                    |
| `SwipeConfirmationModal` | Swipe-to-confirm completion modal                 |
| `CalendarModal`          | Month-grid date picker overlay                    |
| `TimePickerModal`        | Wheel-based time selection overlay                |

---

### Menus

| Component          | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| `SortMenu`         | Floating sort-order options menu                |
| `OverflowMenu`     | Three-dot context menu with one or more actions |
| `StatusFilterMenu` | Floating booking-status filter menu             |

---

### Status & Progress

| Component        | Purpose                                                |
| ---------------- | ------------------------------------------------------ |
| `StatusBadge`    | Colored status chip (waiting, in_progress, completed…) |
| `StatusPill`     | Small inline status pill                               |
| `WizardProgress` | Multi-step progress bar for setup wizards              |
| `SegmentedTabs`  | Horizontal pill tab switcher                           |

---

### Selection & Bulk Actions

| Component              | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `SelectionToolbar`     | Top bar for select / cancel / filter mode  |
| `SelectionFooter`      | Bottom bar showing selected item count     |
| `FloatingActionButton` | Bottom-right pinned circular action button |

---

### Dev Tools

| Component     | Purpose                                                                         |
| ------------- | ------------------------------------------------------------------------------- |
| `DevNavFloat` | Bottom-left floating dev button → nav modal → `/dev-nav`. Hidden in production. |

---

## Locating a Component Quickly

```
src/
├── components/         ← shared (2+ features)
└── features/
    ├── auth/components/         ← auth-only
    └── onboarding/components/   ← onboarding-only
```

All other feature modules (`barbershop`, `home`, `schedule`, `profile`, `workspace`, `notifications`) do not have a `components/` subfolder yet — their screen-level UI is built entirely from shared components in `src/components/`.
