# Track Pages And Components

## Phase 1 - Auth and onboarding foundation

Reason: the repo already contains auth routes and auth/onboarding primitives, so this phase should be stabilized first and used as the baseline for typography, spacing, buttons, and OTP behavior.

### Pages

| nama_halaman | dependency | kegunaan | slicing_implemented | functioning_api_implemented | lokasi | lokasi_referensi_png | implementation_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| login | auth-screen-shell, auth-text-field, auth-button, auth-footer-prompt | Sign in existing users | [x] | [] | app/(auth)/login.tsx; src/features/auth/screens/LoginScreen.tsx | ui-ux-pages-pngs/auth.png | Routed and sliced; verify visual parity against the auth composite PNG. |
| register | auth-screen-shell, auth-text-field, auth-button, auth-footer-prompt | Create a new account | [x] | [] | app/(auth)/register.tsx; src/features/auth/screens/RegisterScreen.tsx | ui-ux-pages-pngs/auth.png | Routed and sliced; confirm field order and helper copy against design. |
| verify-account | auth-screen-shell, otp-code-input, auth-button | Verify the original contact before account changes | [x] | [] | app/(auth)/verify-account.tsx; src/features/auth/screens/VerifyAccountScreen.tsx | ui-ux-pages-pngs/auth.png | Routed and sliced; reuse outside auth/profile flows later. |
| forgot-password | auth-screen-shell, auth-text-field, auth-button | Start password recovery | [x] | [] | app/(auth)/forgot-password.tsx; src/features/auth/screens/ForgotPasswordScreen.tsx | ui-ux-pages-pngs/auth.png | Routed and sliced; API wiring is still pending. |
| verify-otp | auth-screen-shell, otp-code-input, auth-button | Validate recovery OTP | [x] | [] | app/(auth)/verify-otp.tsx; src/features/auth/screens/VerifyOtpScreen.tsx | ui-ux-pages-pngs/auth.png | Routed and sliced; keep OTP behavior shared with verify-account. |
| create-password | auth-screen-shell, auth-text-field, auth-button, auth-footer-prompt | Set a new password after OTP validation | [x] | [] | app/(auth)/create-password.tsx; src/features/auth/screens/CreatePasswordScreen.tsx | ui-ux-pages-pngs/auth.png | Routed and sliced; no API integration visible in repo yet. |
| onboarding-splash | brand-splash, onboarding-container | Brand splash before onboarding | [x] | [] | app/(onboarding)/onboarding-splash.tsx; src/features/onboarding/screens/OnboardingSplashScreen.tsx | ui-ux-pages-pngs/onboarding/ONBOARD.png | Auto-advances to easy-booking after 2s via router.replace. |
| onboarding-easy-booking | onboarding-container, onboarding-card, onboarding-indicator, onboarding-button | First onboarding benefit slide | [x] | [] | app/(onboarding)/onboarding-easy-booking.tsx; src/features/onboarding/screens/OnboardingEasyBookingScreen.tsx | ui-ux-pages-pngs/onboarding/ONBOARD 1.png | Slide 1 of 3; indicator first active; button "Love it" advances to run-barbershop. |
| onboarding-run-barbershop | onboarding-container, onboarding-card, onboarding-indicator, onboarding-button | Second onboarding benefit slide | [x] | [] | app/(onboarding)/onboarding-run-barbershop.tsx; src/features/onboarding/screens/OnboardingRunBarbershopScreen.tsx | ui-ux-pages-pngs/onboarding/ONBOARD 4.png | Slide 2 of 3; indicator second active; button "Next" advances to customer-happy. |
| onboarding-customer-happy | onboarding-container, onboarding-card, onboarding-indicator, onboarding-button | Final onboarding slide with get-started CTA | [x] | [] | app/(onboarding)/onboarding-customer-happy.tsx; src/features/onboarding/screens/OnboardingCustomerHappyScreen.tsx | ui-ux-pages-pngs/onboarding/ONBOARD 5.png | Slide 3 of 3; indicator third active; button "Get Started" (accent) routes to login. |

### Components

| nama_komponen | dependency | kegunaan | slicing_implemented | functioning_api_implemented | lokasi | lokasi_referensi_png | implementation_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| auth-screen-shell | - | Shared auth page card and layout wrapper | [x] | [] | src/features/auth/components/AuthScreenShell.tsx | ui-ux-pages-pngs/auth.png | Existing implementation anchor for auth layout. |
| auth-text-field | - | Shared auth text and password field | [x] | [] | src/features/auth/components/AuthTextField.tsx | ui-ux-pages-pngs/auth.png | Existing implementation anchor for auth forms. |
| auth-button | - | Shared auth primary action button | [x] | [] | src/features/auth/components/AuthButton.tsx | ui-ux-pages-pngs/auth.png | Existing implementation anchor for auth CTA styling. |
| auth-footer-prompt | - | Shared bottom prompt with inline navigation link | [x] | [] | src/features/auth/components/AuthFooterPrompt.tsx | ui-ux-pages-pngs/auth.png | Existing prompt component; reuse instead of page-specific text rows. |
| otp-code-input | - | Four-digit verification input | [x] | [] | src/features/auth/components/OtpCodeInput.tsx | ui-ux-pages-pngs/auth.png | Existing OTP primitive; can be reused for contact verification later. |
| onboarding-container | - | Shared onboarding page wrapper | [x] | [] | src/features/onboarding/components/OnboardingContainer.tsx | ui-ux-pages-pngs/onboarding/ONBOARD 1.png | Present in repo even though no onboarding routes are implemented. |
| onboarding-card | - | Shared illustration card surface for onboarding slides | [x] | [] | src/features/onboarding/components/OnboardingCard.tsx | ui-ux-pages-pngs/onboarding/ONBOARD 1.png | Existing implementation anchor for carousel cards. |
| onboarding-indicator | - | Shared progress dots for onboarding | [x] | [] | src/features/onboarding/components/OnboardingIndicator.tsx | ui-ux-pages-pngs/onboarding/ONBOARD 1.png | Existing implementation anchor for page progress. |
| onboarding-button | - | Shared onboarding CTA button | [x] | [] | src/features/onboarding/components/OnboardingButton.tsx | ui-ux-pages-pngs/onboarding/ONBOARD 5.png | Existing implementation anchor for dark/accent CTA states. |
| brand-splash | - | Minimal centered launch brand presentation | [x] | [] | src/features/onboarding/components/BrandSplash.tsx | ui-ux-pages-pngs/onboarding/ONBOARD.png | Centered "Cukkr" wordmark on warm #F5F4E8 background; used by OnboardingSplashScreen. |

## Phase 2 - App shell and workspace setup

Reason: workspace switching, dashboard context, and barbershop setup share global shell elements like headers, cards, tabs, and wizard scaffolding that unlock most post-auth flows.

### Pages

| nama_halaman | dependency | kegunaan | slicing_implemented | functioning_api_implemented | lokasi | lokasi_referensi_png | implementation_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| home-dashboard | workspace-pill, metric-card, shortcut-tile, bottom-tab-bar | Show workspace summary, KPIs, and recent activity | [x] | [] | app/(home)/home-dashboard.tsx; src/features/home/screens/HomeDashboardScreen.tsx | ui-ux-pages-pngs/home/Home.png | PIN reset ConfirmationModal wired as state inside the screen. |
| home-reset-walk-in-pin-modal | home-dashboard, confirmation-modal | Confirm walk-in PIN reset | [x] | [] | src/features/home/screens/HomeDashboardScreen.tsx (modal state) | ui-ux-pages-pngs/home/Home-reset-walkin-pin.png | Implemented as showPinModal state toggle inside HomeDashboardScreen. |
| switch-barbershop | screen-header, selection-row, primary-button | Switch active workspace or create a new one | [x] | [] | app/(workspace)/switch-barbershop.tsx; src/features/workspace/screens/SwitchBarbershopScreen.tsx | ui-ux-pages-pngs/home/Change Workspace.png | Two SelectionRows with green divider; CTA navigates to create flow. |
| create-barbershop-name-logo | wizard-progress, text-input-field, image-upload-box, primary-button | Start workspace-creation flow | [x] | [] | app/(workspace)/create-barbershop-name-logo.tsx; src/features/workspace/screens/CreateBarbershopNameLogoScreen.tsx | ui-ux-pages-pngs/create-barbershop/Fill name & logo.png | Step 0 of 3-step wizard. |
| create-barbershop-invite-barber-empty | wizard-progress, text-input-field, secondary-button, primary-button | Invite barbers during setup when no invites exist yet | [x] | [] | app/(workspace)/create-barbershop-invite-barber-empty.tsx; src/features/workspace/screens/CreateBarbershopInviteBarberEmptyScreen.tsx | ui-ux-pages-pngs/create-barbershop/Invite Barber 2.png | Step 1 empty state; Skip CTA advances to service step. |
| create-barbershop-invite-barber-filled | wizard-progress, invite-row, secondary-button, primary-button | Show pending invites during setup | [x] | [] | app/(workspace)/create-barbershop-invite-barber-filled.tsx; src/features/workspace/screens/CreateBarbershopInviteBarberFilledScreen.tsx | ui-ux-pages-pngs/create-barbershop/Invite Barber.png | Step 1 filled state with two InviteRows. |
| create-barbershop-first-service | wizard-progress, service-form, primary-button | Capture the first default service in setup | [x] | [] | app/(workspace)/create-barbershop-first-service.tsx; src/features/workspace/screens/CreateBarbershopFirstServiceScreen.tsx | ui-ux-pages-pngs/create-barbershop/Create first service.png | Step 2; accent green Finish button routes to success screen. |
| create-barbershop-success | success-state, gradient-button | Confirm workspace creation success | [x] | [] | app/(workspace)/create-barbershop-success.tsx; src/features/workspace/screens/CreateBarbershopSuccessScreen.tsx | ui-ux-pages-pngs/create-barbershop/Congrats.png | GradientButton simulated with dark olive bg (no expo-linear-gradient). |
| barbershop-settings | screen-header, info-row, operation-row, bottom-tab-bar, danger-button | Central hub for barbershop information and operations | [x] | [] | app/(barbershop)/barbershop-settings.tsx; src/features/barbershop/screens/BarbershopSettingsScreen.tsx | ui-ux-pages-pngs/barbershop/Barbershop Settings.png | Sectioned with Information, Booking Web, Operations, and Delete. |
| edit-barbershop-info-flow | edit-field-header, text-input-field, multiline-input-field, helper-copy | Edit name, description, and address | [x] | [] | app/(barbershop)/edit-barbershop-info.tsx; src/features/barbershop/screens/EditBarbershopInfoScreen.tsx | ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Barbershop Name.png; ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Barbershop Description.png; ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Barbershop Address.png | Single screen handles name/description/address field editing. |
| edit-booking-url | edit-field-header, prefixed-input-field, helper-copy, alert-modal | Edit public booking slug and handle unavailable-state feedback | [x] | [] | app/(barbershop)/edit-booking-url.tsx; src/features/barbershop/screens/EditBookingUrlScreen.tsx | ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Book Url.png; ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Book Url-1.png | HelperCopy errorLine in red for spaces-not-allowed validation copy. |

### Components

| nama_komponen | dependency | kegunaan | slicing_implemented | functioning_api_implemented | lokasi | lokasi_referensi_png | implementation_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| screen-header | - | Shared top bar with back icon and optional trailing action | [x] | [] | src/components/ScreenHeader.tsx | ui-ux-pages-pngs/home/Change Workspace.png | 36px circle back button + centered title + optional right slot. |
| bottom-tab-bar | - | Shared bottom navigation for post-auth app shell | [x] | [] | src/components/BottomTabBar.tsx | ui-ux-pages-pngs/home/Home.png | 4 tabs; active gets #C6FF4D circle; used in home-dashboard and barbershop-settings. |
| workspace-pill | - | Dropdown-like current workspace selector | [x] | [] | src/components/WorkspacePill.tsx | ui-ux-pages-pngs/home/Home.png | White pill with name + chevron-down. |
| metric-card | - | KPI card for counts, links, or PIN summary | [x] | [] | src/components/MetricCard.tsx | ui-ux-pages-pngs/home/Home.png | Optional accentColor left border for In Progress/Waiting states. |
| shortcut-tile | - | Icon + label quick access tile | [x] | [] | src/components/ShortcutTile.tsx | ui-ux-pages-pngs/home/Home.png | 48px icon circle on #F0F0E8 + label below. |
| wizard-progress | - | Multi-step progress bar for setup | [x] | [] | src/components/WizardProgress.tsx | ui-ux-pages-pngs/create-barbershop/Fill name & logo.png | 3 step bars; dark for completed/current, light for upcoming. |
| image-upload-box | - | Dashed or filled media upload surface | [x] | [] | src/components/ImageUploadBox.tsx | ui-ux-pages-pngs/create-barbershop/Fill name & logo.png | Dashed border, image-outline icon, "Choose Image" placeholder. |
| text-input-field | - | Shared single-line text, numeric, and currency input | [x] | [] | src/components/TextInputField.tsx | ui-ux-pages-pngs/create-barbershop/Create first service.png | Pill shape, optional label above, placeholder color #B0ADA0. |
| multiline-input-field | text-input-field | Shared long-form input | [x] | [] | src/components/MultilineInputField.tsx | ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Barbershop Description.png | borderRadius 16, minHeight 100, textAlignVertical top. |
| info-row | - | Shared label-value row for detail summaries | [x] | [] | src/components/InfoRow.tsx | ui-ux-pages-pngs/barbershop/Barbershop Settings.png | Bold label + right-aligned value + optional chevron + bottom border unless isLast. |
| operation-row | info-row | Chevron row that navigates to submodules | [x] | [] | src/components/OperationRow.tsx | ui-ux-pages-pngs/barbershop/Barbershop Settings.png | Always-chevron touchable row. |
| selection-row | - | Simple avatar/text row with chevron for choosing one item | [x] | [] | src/components/SelectionRow.tsx | ui-ux-pages-pngs/home/Change Workspace.png | Green #C6FF4D bottom divider per row. |
| confirmation-modal | - | Shared two-action confirmation dialog | [x] | [] | src/components/ConfirmationModal.tsx | ui-ux-pages-pngs/home/Home-reset-walkin-pin.png | Transparent overlay, white card, icon + title + description + two buttons. |
| alert-modal | - | Shared single-action blocking or success feedback dialog | [x] | [] | src/components/AlertModal.tsx | ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Book Url-1.png | Same overlay structure as ConfirmationModal, single action button. |
| helper-copy | - | Short instructional copy block under inputs | [x] | [] | src/components/HelperCopy.tsx | ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Barbershop Name.png | Array of gray lines + optional red errorLine. |
| edit-field-header | screen-header | Shared shell for field-specific edit screens with save action | [x] | [] | src/components/EditFieldHeader.tsx | ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Barbershop Name.png | Back circle outline + centered title + dark save circle with checkmark. |
| prefixed-input-field | text-input-field | Input with fixed prefix like booking URL domain | [x] | [] | src/components/PrefixedInputField.tsx | ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Book Url.png | Fixed prefix text + flex TextInput inside pill container. |
| invite-row | - | Pending invite row with remove affordance | [x] | [] | src/components/InviteRow.tsx | ui-ux-pages-pngs/create-barbershop/Invite Barber.png | Bullet dot + email + red remove circle. |
| success-state | - | Minimal success summary block | [x] | [] | src/components/SuccessState.tsx | ui-ux-pages-pngs/create-barbershop/Congrats.png | Centered flex column, title + subtitle. |
| gradient-button | primary-button | CTA with gradient fill and trailing icon | [x] | [] | src/components/GradientButton.tsx | ui-ux-pages-pngs/create-barbershop/Congrats.png | Dark olive #2D3A20 bg (no expo-linear-gradient); login icon on right. |
| danger-button | primary-button | Destructive CTA treatment | [x] | [] | src/components/DangerButton.tsx | ui-ux-pages-pngs/barbershop/Barbershop Settings.png | #FFE4E4 bg, red label, borderRadius 12. |

## Phase 3 - Barber, service, and operating-hours management

Reason: these modules share card rows, toggles, overflow menus, and field-editing flows; implementing them together reduces duplicated state and list-layout work.

### Pages

| nama_halaman | dependency | kegunaan | slicing_implemented | functioning_api_implemented | lokasi | lokasi_referensi_png | implementation_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| barbers-management | screen-header, member-card, status-badge, primary-button, confirmation-modal | Manage active and pending barbers in a workspace | [] | [] | - | ui-ux-pages-pngs/barbershop/barber-management/Barbers Management.png; ui-ux-pages-pngs/barbershop/barber-management/Barbers Management-1.png | Share list item structure with the setup invite step where possible. |
| invite-barber | screen-header, text-input-field, icon-action-button, helper-copy | Send a barber invitation by email or phone | [] | [] | - | ui-ux-pages-pngs/barbershop/barber-management/Invite Barber.png | Lightweight input page once the shared field + icon action exists. |
| services-management | screen-header, search-input, service-card, sort-menu, toggle-switch, icon-action-button | Browse, sort, search, and activate services | [] | [] | - | ui-ux-pages-pngs/barbershop/service-management/Service Management.png; ui-ux-pages-pngs/barbershop/service-management/Service Management-1.png; ui-ux-pages-pngs/barbershop/service-management/Search Service.png | Build only after list rows and toggles are stable. |
| service-detail | screen-header, info-row, toggle-row, overflow-menu, status-pill | Show service details, operational state, and destructive options | [] | [] | - | ui-ux-pages-pngs/barbershop/service-management/Service Management - Detail.png; ui-ux-pages-pngs/barbershop/service-management/Service Management - Detail-1.png | Depends on info-row and shared overflow menu. |
| set-service-default-confirmation | service-detail, confirmation-modal | Confirm making a service the default | [] | [] | - | ui-ux-pages-pngs/barbershop/service-management/Service Management - Detail - Set As Default.png | Specialized confirmation overlay, but should reuse the generic modal shell. |
| add-or-edit-service-form | service-form, image-upload-box, text-input-field, multiline-input-field, toggle-row, computed-summary-row, primary-button | Add a service and edit its fields | [] | [] | - | ui-ux-pages-pngs/barbershop/service-management/Service Management - Add New.png; ui-ux-pages-pngs/barbershop/service-management/Input Text Service Name.png; ui-ux-pages-pngs/barbershop/service-management/Input Text Service Description.png; ui-ux-pages-pngs/barbershop/service-management/Input Text Cost.png; ui-ux-pages-pngs/barbershop/service-management/Input Text Duration.png; ui-ux-pages-pngs/barbershop/service-management/Input Text Discount.png | Keep the full add form and the field-specific edit screens on one shared model. |
| open-hours | screen-header, day-hours-row, toggle-switch, time-picker-modal | Configure days and open/close times | [] | [] | - | ui-ux-pages-pngs/barbershop/open-hours/Open Hours.png; ui-ux-pages-pngs/barbershop/open-hours/Open Hours-1.png | Reuses toggle and time-picker primitives rather than inventing a module-specific control. |

### Components

| nama_komponen | dependency | kegunaan | slicing_implemented | functioning_api_implemented | lokasi | lokasi_referensi_png | implementation_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| member-card | - | Staff list row with avatar, name, and status badge | [] | [] | - | ui-ux-pages-pngs/barbershop/barber-management/Barbers Management.png | Barber-management specific identity row. |
| status-badge | - | Shared state chip for waiting, in-progress, completed, canceled, active, pending | [] | [] | - | ui-ux-pages-pngs/barbershop/barber-management/Barbers Management.png | Should be token-based and reused across modules. |
| primary-button | - | Shared pill CTA for non-auth pages | [x] | [] | src/components/PrimaryButton.tsx | ui-ux-pages-pngs/create-barbershop/Fill name & logo.png | Built early in Phase 2; dark #1A1A1A pill, optional disabled state. |
| secondary-button | primary-button | Shared outline CTA | [x] | [] | src/components/SecondaryButton.tsx | ui-ux-pages-pngs/create-barbershop/Invite Barber 2.png | Built early in Phase 2; transparent bg with dark border pill. |
| icon-action-button | - | Circular icon-only CTA such as send or add | [] | [] | - | ui-ux-pages-pngs/barbershop/barber-management/Invite Barber.png | Reused by invite, add-service, and selection-confirm actions. |
| search-input | text-input-field | Shared search field with trailing icon | [] | [] | - | ui-ux-pages-pngs/barbershop/service-management/Search Service.png | Needed across service, customer, and picker screens. |
| service-card | - | Service row with image, pricing, default badge, and optional checkbox/toggle | [] | [] | - | ui-ux-pages-pngs/barbershop/service-management/Service Management.png | Reuse later in booking creation pickers. |
| sort-menu | - | Floating option menu for sort order | [] | [] | - | ui-ux-pages-pngs/barbershop/service-management/Service Management-1.png | One shared menu should serve services, customers, and booking history. |
| toggle-switch | - | Shared boolean switch control | [] | [] | - | ui-ux-pages-pngs/barbershop/service-management/Service Management.png | Needed for services and open hours. |
| overflow-menu | - | Floating three-dot menu with one or more actions | [] | [] | - | ui-ux-pages-pngs/barbershop/service-management/Service Management - Detail-1.png | Also required by booking detail flows. |
| toggle-row | info-row, toggle-switch | Label row with embedded switch | [] | [] | - | ui-ux-pages-pngs/barbershop/service-management/Service Management - Detail.png | Keep row spacing identical to other detail sections. |
| status-pill | status-badge | Small default badge or non-destructive pill | [] | [] | - | ui-ux-pages-pngs/barbershop/service-management/Service Management - Detail.png | Separate from status-badge only if visual treatment meaningfully differs. |
| service-form | text-input-field, multiline-input-field, image-upload-box | Shared service create/edit form model | [] | [] | - | ui-ux-pages-pngs/barbershop/service-management/Service Management - Add New.png | Centralize validation and shared field layout. |
| computed-summary-row | - | Derived value row such as final price after discount | [] | [] | - | ui-ux-pages-pngs/barbershop/service-management/Input Text Discount.png | Small but reusable summary pattern. |
| day-hours-row | toggle-switch, time-picker-modal | Weekly operating-hours row | [] | [] | - | ui-ux-pages-pngs/barbershop/open-hours/Open Hours.png | Each row should remain identical across weekdays. |
| time-picker-modal | - | Wheel-based time selection overlay | [] | [] | - | ui-ux-pages-pngs/barbershop/open-hours/Open Hours-1.png | Reused later by appointment time selection. |

## Phase 4 - Scheduling, booking detail, and notification states

Reason: schedule views, booking details, and notifications all depend on shared booking metadata, status colors, filters, and confirmation surfaces.

### Pages

| nama_halaman | dependency | kegunaan | slicing_implemented | functioning_api_implemented | lokasi | lokasi_referensi_png | implementation_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| schedule-active-bookings | date-selector-pill, day-chip-row, booking-card, status-filter-menu, calendar-modal, bottom-tab-bar | Show active daily bookings with status filtering | [] | [] | - | ui-ux-pages-pngs/schedule/Schedule.png; ui-ux-pages-pngs/schedule/Schedule - Calendar.png; ui-ux-pages-pngs/schedule/Schedule - Filter.png | Build after booking-row and bottom-tab shell exist. |
| history-bookings | booking-card, sort-menu, status-filter-menu, date-selector-pill | Show historical bookings with date and sort controls | [] | [] | - | ui-ux-pages-pngs/schedule/History Bookings.png; ui-ux-pages-pngs/schedule/History Bookings - Filter.png | Shares list and filter primitives with schedule-active-bookings. |
| booking-detail-request-flow | booking-detail-card, status-badge, info-row, dual-action-footer | Review requested bookings and accept or decline them | [] | [] | - | ui-ux-pages-pngs/notification/Notification - Appointment Detail.png; ui-ux-pages-pngs/notification/Notification - Appointment Detail - Requested.png; ui-ux-pages-pngs/notification/Notification - Appointment Detail - Declined.png | Keep notification-entry and booking-detail views visually aligned. |
| booking-detail-waiting-flow | booking-detail-card, status-badge, sticky-cta, overflow-menu, confirmation-modal | Handle waiting bookings, cancel them, or take over them | [] | [] | - | ui-ux-pages-pngs/booking-detail/Schedule - Calendar - Waiting.png; ui-ux-pages-pngs/booking-detail/Schedule - Calendar - Waiting-1.png; ui-ux-pages-pngs/booking-detail/Schedule - Calendar - Waiting-2.png; ui-ux-pages-pngs/booking-detail/Schedule - Calendar - Wrong Preffered.png | Group the waiting detail state and its modal variants into one slice. |
| booking-detail-in-progress-flow | booking-detail-card, status-badge, sticky-cta, overflow-menu, swipe-confirmation-modal | Track active service handling and complete the booking | [] | [] | - | ui-ux-pages-pngs/booking-detail/Schedule - Calendar - In Progress.png; ui-ux-pages-pngs/booking-detail/Schedule - Calendar - In Progress-1.png; ui-ux-pages-pngs/booking-detail/Schedule - Calendar - In Progress - Pop Up.png | Swiping to complete is the only specialized interaction in this phase. |
| booking-detail-result-states | booking-detail-card, status-badge, info-row | Show completed or canceled final booking outcomes | [] | [] | - | ui-ux-pages-pngs/booking-detail/Schedule - Calendar - Completed.png; ui-ux-pages-pngs/booking-detail/Schedule - Calendar - Completed-1.png | Read-only variant of the shared detail layout. |
| notifications-list | notification-card, inline-decision-buttons, overflow-menu | Aggregate appointment requests, walk-in arrivals, and invitations | [] | [] | - | ui-ux-pages-pngs/notification/Notification.png | Implement after booking status colors and action buttons are in place. |

### Components

| nama_komponen | dependency | kegunaan | slicing_implemented | functioning_api_implemented | lokasi | lokasi_referensi_png | implementation_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| date-selector-pill | - | Compact pill showing the selected date | [] | [] | - | ui-ux-pages-pngs/schedule/Schedule.png | Reuse between schedule and history. |
| day-chip-row | - | Horizontal day selector strip | [] | [] | - | ui-ux-pages-pngs/schedule/Schedule.png | Needed before the active schedule screen can match the design. |
| booking-card | - | Shared booking row with customer, barber, time, and status styling | [] | [] | - | ui-ux-pages-pngs/schedule/Schedule.png | Central reusable list row for schedule, history, and customer detail books. |
| booking-detail-card | info-row, status-badge | Shared booking detail summary layout | [] | [] | - | ui-ux-pages-pngs/booking-detail/Schedule - Calendar - Waiting.png | Use one structural layout for all booking detail states. |
| status-filter-menu | - | Floating filter menu for booking status | [] | [] | - | ui-ux-pages-pngs/schedule/Schedule - Filter.png | Reuse across schedule, history, and customer books. |
| calendar-modal | - | Month-grid date picker overlay | [] | [] | - | ui-ux-pages-pngs/schedule/Schedule - Calendar.png | Reuse later in new-appointment flow. |
| sticky-cta | primary-button | Bottom-anchored single CTA for detail flows | [] | [] | - | ui-ux-pages-pngs/booking-detail/Schedule - Calendar - Waiting.png | Needed by waiting and in-progress booking states. |
| swipe-confirmation-modal | confirmation-modal | Specialized completion modal with swipe action | [] | [] | - | ui-ux-pages-pngs/booking-detail/Schedule - Calendar - In Progress - Pop Up.png | Only create after generic confirmation shell exists. |
| dual-action-footer | primary-button, secondary-button | Paired accept/decline footer action group | [] | [] | - | ui-ux-pages-pngs/notification/Notification - Appointment Detail - Requested.png | Reuse for request/decision states. |
| notification-card | booking-card | Compact notification row with timestamp and inline CTA area | [] | [] | - | ui-ux-pages-pngs/notification/Notification.png | Share as much typography and spacing as possible with booking cards. |
| inline-decision-buttons | secondary-button | Accept and decline actions inside a card | [] | [] | - | ui-ux-pages-pngs/notification/Notification.png | Can be reused in booking-request detail if needed. |
| history-booking-row | booking-card | Slightly flatter booking row for history lists | [] | [] | - | ui-ux-pages-pngs/schedule/History Bookings.png | May collapse into booking-card if the visual delta remains small. |

## Phase 5 - Customer management and messaging

Reason: customer browsing, selection, detail tabs, and messaging all share identity rows, search/filter affordances, and data-heavy card layouts.

### Pages

| nama_halaman | dependency | kegunaan | slicing_implemented | functioning_api_implemented | lokasi | lokasi_referensi_png | implementation_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| customer-management | screen-header, search-input, customer-card, sort-menu, selection-toolbar | Browse and sort customers | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management.png; ui-ux-pages-pngs/barbershop/customer-management/Customer Management Filter.png; ui-ux-pages-pngs/barbershop/customer-management/Search Customer.png | Build only after search and sort primitives are stable. |
| customer-management-selection-flow | customer-card, selection-footer, floating-action-button, search-input | Select one or more customers for bulk actions | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select.png; ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - selected one.png; ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - Search & Select.png | Green selection mode should reuse the same card component with a selected state. |
| send-messages-to-customers | message-composer, icon-action-button, helper-copy | Draft and send customer broadcasts | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - Send Messages.png; ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - Send Messages-1.png; ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - Send Messages-2.png; ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - Send Messages-3.png | One screen with theme variants for selected and neutral modes. |
| customer-detail-general | screen-header, segmented-tabs, stat-card, chart-card | Show customer lifetime summary and trend data | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management - Detail - General.png | Tabs and stat cards should later power the books/messages screens too. |
| customer-detail-books | screen-header, segmented-tabs, booking-card, status-filter-menu | Show customer booking history by status | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management - Detail - Books.png; ui-ux-pages-pngs/barbershop/customer-management/Customer Management - Detail - Books - Filter.png | Reuses booking card and status filter from schedule pages. |
| customer-detail-messages | screen-header, segmented-tabs, message-thread | Show sent-message history for a single customer | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management - Detail - Messages.png | Should reuse the same segmented tab shell as the other detail views. |

### Components

| nama_komponen | dependency | kegunaan | slicing_implemented | functioning_api_implemented | lokasi | lokasi_referensi_png | implementation_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| customer-card | - | Customer list row with name, totals, and optional selected state | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management.png | Main reusable identity row for customer workflows. |
| selection-toolbar | screen-header | Top actions for select/cancel/filter mode | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select.png | Keep consistent with green selection-mode background. |
| selection-footer | - | Bottom counter showing how many customers are selected | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - selected one.png | Simple persistent count component. |
| floating-action-button | icon-action-button | Circular send action pinned to the bottom-right | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - selected one.png | Only needed in selection mode. |
| segmented-tabs | - | Shared three-tab control for detail subviews | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management - Detail - General.png | Reused by all customer-detail pages. |
| stat-card | metric-card | Compact numeric summary card | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management - Detail - General.png | Can likely share a base style with dashboard metric cards. |
| chart-card | - | Chart container with title and summary line | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management - Detail - General.png | Keep visual shell separate from charting implementation. |
| message-thread | - | Read-only outbound message bubble list | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management - Detail - Messages.png | Reuse if two-way messaging is added later. |
| message-composer | multiline-input-field | Message draft area with helper copy | [] | [] | - | ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - Send Messages-2.png | Shared between neutral and selection-mode send-message pages. |

## Phase 6 - Admin booking creation and profile/account flows

Reason: these flows share picker overlays, field-edit shells, and account-specific edit/verification patterns that can be built after the broader app shell and data-heavy modules are in place.

### Pages

| nama_halaman | dependency | kegunaan | slicing_implemented | functioning_api_implemented | lokasi | lokasi_referensi_png | implementation_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| new-appointment-flow | booking-type-toggle, selector-input, calendar-modal, time-picker-modal, service-selection-card, primary-button | Create scheduled appointments from inside the app | [] | [] | - | ui-ux-pages-pngs/schedule-new-book-by-admin/Schedule - New Appointment.png; ui-ux-pages-pngs/schedule-new-book-by-admin/Schedule - New Appointment - Filled.png; ui-ux-pages-pngs/schedule-new-book-by-admin/Schedule - New Appointment - Select Date.png; ui-ux-pages-pngs/schedule-new-book-by-admin/Schedule - New Appointment - Select Time.png | Reuse picker overlays from schedule/open-hours before building this flow. |
| new-walk-in | booking-type-toggle, selector-input, service-selection-card, primary-button | Create walk-ins without a future date/time | [] | [] | - | ui-ux-pages-pngs/schedule-new-book-by-admin/Schedule - New Walk-in.png | Shares almost all structure with the appointment form. |
| select-barber | screen-header, search-input, selection-row | Search and choose one barber | [] | [] | - | ui-ux-pages-pngs/schedule-new-book-by-admin/Search Barber.png | Simple picker screen; build after shared search and selection row exist. |
| select-services | screen-header, search-input, service-card, icon-action-button | Multi-select services for an appointment or walk-in | [] | [] | - | ui-ux-pages-pngs/schedule-new-book-by-admin/Search Service.png | Shares service-card with the service-management module. |
| user-profile | screen-header, info-row, confirmation-modal, alert-modal, image-upload-box | Show barber profile details and account actions | [] | [] | - | ui-ux-pages-pngs/user-profile/User Profile.png; ui-ux-pages-pngs/user-profile/User Profile - Confirm.png; ui-ux-pages-pngs/user-profile/User Profile - Confirm-1.png | Reuses shop-info row pattern and generic modal shells. |
| edit-user-profile-fields | edit-field-header, text-input-field, multiline-input-field, primary-button, helper-copy | Edit name, bio, and password | [] | [] | - | ui-ux-pages-pngs/user-profile/Input Text Your Name.png; ui-ux-pages-pngs/user-profile/Input Text Bio.png; ui-ux-pages-pngs/user-profile/Change Password.png | Shares structure with the barbershop info edit flow. |
| verify-contact-flow | otp-code-input, primary-button, secondary-button | Verify old and new contact values during account updates | [] | [] | - | ui-ux-pages-pngs/user-profile/Verify Old Contact.png; ui-ux-pages-pngs/user-profile/Verify New Contact.png | Best implemented by extending the existing OTP component rather than rebuilding it. |

### Components

| nama_komponen | dependency | kegunaan | slicing_implemented | functioning_api_implemented | lokasi | lokasi_referensi_png | implementation_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| booking-type-toggle | - | Switch between appointment and walk-in modes | [] | [] | - | ui-ux-pages-pngs/schedule-new-book-by-admin/Schedule - New Appointment.png | Shared by both admin booking forms. |
| selector-input | text-input-field | Field that opens a picker or overlay instead of direct text entry | [] | [] | - | ui-ux-pages-pngs/schedule-new-book-by-admin/Schedule - New Appointment.png | Needed for barber and date/time selectors. |
| service-selection-card | service-card | Selected service card used inside booking forms | [] | [] | - | ui-ux-pages-pngs/schedule-new-book-by-admin/Schedule - New Appointment - Filled.png | Reuse existing service-card visuals where possible. |
| booking-form | booking-type-toggle, text-input-field, selector-input, service-selection-card | Shared base form for new appointment and walk-in flows | [] | [] | - | ui-ux-pages-pngs/schedule-new-book-by-admin/Schedule - New Appointment.png | Avoid duplicating the appointment and walk-in page structure. |
| profile-summary-card | info-row | Shared grouped card for profile/account details | [] | [] | - | ui-ux-pages-pngs/user-profile/User Profile.png | Reuse layout conventions from barbershop settings. |
| logout-row | primary-button | Dedicated logout action row | [] | [] | - | ui-ux-pages-pngs/user-profile/User Profile.png | Can stay simple if it fits the shared button system. |
