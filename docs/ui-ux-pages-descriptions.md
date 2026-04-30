# UI/UX Pages Descriptions

## Page Descriptions

### login

| Field | Value |
| --- | --- |
| Page Name | `login` |
| Reference PNG | `ui-ux-pages-pngs/auth.png` |
| Purpose | Let an existing barber account sign in from the auth landing card. |
| Primary Actions | Login, Forgot Password, Sign Up |
| Flow Summary | Submitting the form attempts sign-in. Forgot Password moves into recovery. Sign Up opens registration. |
| Notes | Derived from the left-most auth card inside the composite auth PNG. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Heading | Login | - | Identifies the auth task. |
| Input Field | Email / Phone Number* | `rifa@example.com` | Captures the account identifier. |
| Input Field | Password | `••••••••` | Captures the secret credential. |
| Text Link | Forgot Password | - | Opens recovery. |
| Button | Login | - | Submits the form. |
| Footer Prompt | Don't have an account? | `Sign Up here` | Routes to register. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#63B476` | Auth page background from existing theme |
| `#F4F2E7` | Auth card surface |
| `#C4EB35` | Primary CTA and inline accent |
| `#BCC4B6` | Input border |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `auth-screen-shell` | Title + description | `Login` | Shared auth card layout |
| `auth-text-field` | Default, password | `Email / Phone Number*` | Shared auth input field |
| `auth-button` | Primary | `Login` | Primary auth action |
| `auth-footer-prompt` | Sign-up prompt | `Sign Up here` | Secondary auth navigation |

### register

| Field | Value |
| --- | --- |
| Page Name | `register` |
| Reference PNG | `ui-ux-pages-pngs/auth.png` |
| Purpose | Create a new barber account with identity and password fields. |
| Primary Actions | Create Account, Sign In |
| Flow Summary | Completing the fields creates an account, while the footer link returns to login. |
| Notes | Derived from the second auth card inside the composite auth PNG. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Heading | Create Account | - | Explains the entry point. |
| Input Field | Name | `Rifa` | Captures display name. |
| Input Field | Email / Phone Number* | `rifa@example.com` | Captures contact identity. |
| Input Field | Password | `••••••••` | Creates a password. |
| Input Field | Confirm Password | `••••••••` | Confirms password match. |
| Button | Create Account | - | Submits registration. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#63B476` | Auth page background |
| `#F4F2E7` | Card background |
| `#C4EB35` | Primary button fill |
| `#6E766C` | Secondary body text |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `auth-screen-shell` | Title + description | `Create Account` | Shared auth layout |
| `auth-text-field` | Text + password | `Confirm Password` | Shared auth inputs |
| `auth-button` | Primary | `Create Account` | Submit CTA |
| `auth-footer-prompt` | Sign-in prompt | `Sign In here` | Return navigation |

### verify-account

| Field | Value |
| --- | --- |
| Page Name | `verify-account` |
| Reference PNG | `ui-ux-pages-pngs/auth.png` |
| Purpose | Verify the original account contact before sensitive account changes. |
| Primary Actions | Send Again, Verify |
| Flow Summary | OTP entry validates the current account contact before moving forward. |
| Notes | Derived from the third auth card inside the composite auth PNG. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Heading | Verify Your Account | - | Explains the verification step. |
| Text Block | OTP helper text | `OTP sent to your email / phone number*` | Informs the destination. |
| OTP Input | 4 digits | `1 2 3 4` | Collects the verification code. |
| Countdown | Timer | `05:00` | Shows resend delay. |
| Button | Send Again | - | Requests another OTP. |
| Button | Verify | - | Validates the code. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#63B476` | Auth page background |
| `#F4F2E7` | Card surface |
| `#C4EB35` | Primary action fill |
| `#BCC4B6` | OTP input border |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `auth-screen-shell` | OTP screen | `Verify Your Account` | Shared auth wrapper |
| `otp-code-input` | 4-digit | `1 2 3 4` | Code entry control |
| `auth-button` | Secondary, primary | `Send Again`, `Verify` | Verification actions |

### forgot-password

| Field | Value |
| --- | --- |
| Page Name | `forgot-password` |
| Reference PNG | `ui-ux-pages-pngs/auth.png` |
| Purpose | Start password recovery by submitting the registered contact method. |
| Primary Actions | Continue |
| Flow Summary | Entering an email or phone number moves the user into OTP verification. |
| Notes | Derived from the fourth auth card inside the composite auth PNG. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Heading | Forgot Password | - | Announces recovery flow. |
| Text Block | Helper text | `Enter your email address to receive a reset link` | Explains the step. |
| Input Field | Email / Phone Number* | `rifa@example.com` | Captures the recovery contact. |
| Button | Continue | - | Advances to verification. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#63B476` | Auth page background |
| `#F4F2E7` | Card surface |
| `#C4EB35` | CTA fill |
| `#BCC4B6` | Input border |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `auth-screen-shell` | Recovery screen | `Forgot Password` | Shared auth wrapper |
| `auth-text-field` | Text | `Email / Phone Number*` | Recovery input |
| `auth-button` | Primary | `Continue` | Advance action |

### verify-otp

| Field | Value |
| --- | --- |
| Page Name | `verify-otp` |
| Reference PNG | `ui-ux-pages-pngs/auth.png` |
| Purpose | Validate the OTP that was sent during password recovery. |
| Primary Actions | Send Again, Continue |
| Flow Summary | OTP submission leads to the create-password screen. |
| Notes | Derived from the fifth auth card inside the composite auth PNG. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Heading | Verify Your OTP | - | Explains the recovery validation step. |
| Text Block | OTP helper text | `OTP sent to your email / phone number*` | Identifies the destination. |
| OTP Input | 4 digits | `5 8 2 1` | Captures recovery code. |
| Countdown | Timer | `05:00` | Displays resend delay. |
| Button | Send Again | - | Requests a new code. |
| Button | Continue | - | Moves to new password entry. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#63B476` | Auth page background |
| `#F4F2E7` | Card surface |
| `#C4EB35` | Primary CTA |
| `#BCC4B6` | Input borders |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `auth-screen-shell` | OTP screen | `Verify Your OTP` | Shared auth wrapper |
| `otp-code-input` | 4-digit | `5 8 2 1` | OTP entry control |
| `auth-button` | Secondary, primary | `Send Again`, `Continue` | Recovery actions |

### create-password

| Field | Value |
| --- | --- |
| Page Name | `create-password` |
| Reference PNG | `ui-ux-pages-pngs/auth.png` |
| Purpose | Set a fresh password after successful recovery verification. |
| Primary Actions | Continue, Forgot Password |
| Flow Summary | Password and confirmation fields finalize the recovery flow. |
| Notes | Derived from the sixth auth card inside the composite auth PNG. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Heading | Create New Password | - | Announces the final recovery step. |
| Input Field | Password | `••••••••` | Captures the new password. |
| Input Field | Confirm Password | `••••••••` | Confirms the new password. |
| Text Link | Forgot Password | - | Allows restarting recovery. |
| Button | Continue | - | Finishes the reset. |
| Footer Prompt | Don't have an account? | `Sign Up here` | Links to registration. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#63B476` | Auth page background |
| `#F4F2E7` | Card surface |
| `#C4EB35` | Primary CTA |
| `#6E766C` | Secondary copy |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `auth-screen-shell` | Password reset | `Create New Password` | Shared auth wrapper |
| `auth-text-field` | Password with icon | `Confirm Password` | Shared password field |
| `auth-button` | Primary | `Continue` | Submit action |
| `auth-footer-prompt` | Sign-up prompt | `Sign Up here` | Secondary navigation |

### onboarding-splash

| Field | Value |
| --- | --- |
| Page Name | `onboarding-splash` |
| Reference PNG | `ui-ux-pages-pngs/onboarding/ONBOARD.png` |
| Purpose | Minimal splash state that introduces the Cukkr brand before onboarding cards. |
| Primary Actions | None visible |
| Flow Summary | The logo lockup likely auto-advances into the onboarding carousel. |
| Notes | Auto-advance is an assumption based on the absence of controls. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Brand Mark | App name | `Cukkr` | Establishes product identity. |
| Background | Plain warm surface | - | Keeps the splash quiet and focused. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Splash background estimate |
| `#111111` | Brand wordmark |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `brand-splash` | Centered logo | `Cukkr` | Reusable launch state |

### onboarding-easy-booking

| Field | Value |
| --- | --- |
| Page Name | `onboarding-easy-booking` |
| Reference PNG | `ui-ux-pages-pngs/onboarding/ONBOARD 1.png` |
| Purpose | Explain the self-serve booking link value proposition. |
| Primary Actions | Love it |
| Flow Summary | CTA advances to the next onboarding card. |
| Notes | Illustration and indicator state imply slide 1 of 3. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Illustration Card | Booking link illustration | - | Visual explanation of the feature. |
| Indicator | 3 dots, first active | - | Shows carousel progress. |
| Heading | Easy Booking with One Link | - | Main marketing message. |
| Body Text | Booking link helper | `Share your booking link on social media...` | Supporting explanation. |
| Button | Love it | - | Advances onboarding. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4F0` | Screen background estimate |
| `#1A1A1A` | Button and main text |
| `#C6FF4D` | Accent illustration color |
| `#FFFFFF` | Illustration surface |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `onboarding-card` | Illustration card | - | Shared carousel surface |
| `onboarding-indicator` | First active | `● ○ ○` | Carousel progress |
| `onboarding-button` | Dark | `Love it` | Slide action |

### onboarding-run-barbershop

| Field | Value |
| --- | --- |
| Page Name | `onboarding-run-barbershop` |
| Reference PNG | `ui-ux-pages-pngs/onboarding/ONBOARD 4.png` |
| Purpose | Explain centralized operations management for barbershop owners. |
| Primary Actions | Next |
| Flow Summary | CTA moves to the final onboarding message. |
| Notes | Indicator state suggests slide 2 of 3. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Illustration Card | Operations dashboard illustration | - | Reinforces management theme. |
| Indicator | 3 dots, second active | - | Shows progress. |
| Heading | Run Your Barbershop with Full Control | - | Main message. |
| Body Text | Supporting copy | `Manage bookings, walk-ins, barbers, and services...` | Explains benefits. |
| Button | Next | - | Advances onboarding. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4F0` | Page background |
| `#1A1A1A` | CTA and headings |
| `#8FD04E` | Illustration green blocks estimate |
| `#FFFFFF` | Card surface |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `onboarding-card` | Illustration card | - | Shared slide layout |
| `onboarding-indicator` | Second active | `○ ● ○` | Carousel progress |
| `onboarding-button` | Dark | `Next` | Slide action |

### onboarding-customer-happy

| Field | Value |
| --- | --- |
| Page Name | `onboarding-customer-happy` |
| Reference PNG | `ui-ux-pages-pngs/onboarding/ONBOARD 5.png` |
| Purpose | Close the onboarding flow with customer and barber value framing. |
| Primary Actions | Get Started |
| Flow Summary | CTA should transition from onboarding into auth or the app shell. |
| Notes | Post-CTA destination is an assumption because no next screen is shown. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Illustration Card | Customer and barber illustration | - | Reinforces the two-sided value. |
| Indicator | 3 dots, third active | - | Final slide progress. |
| Heading | Customer Happy, Barber Happy | - | Final message. |
| Body Text | Supporting copy | `Smooth bookings for customers...` | Closes the story. |
| Button | Get Started | - | Exits onboarding. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4F0` | Page background |
| `#111111` | Headings and body text |
| `#C6FF4D` | Final CTA fill |
| `#FFFFFF` | Illustration card surface |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `onboarding-card` | Illustration card | - | Shared slide layout |
| `onboarding-indicator` | Third active | `○ ○ ●` | Carousel progress |
| `onboarding-button` | Accent | `Get Started` | Final onboarding action |

### home-dashboard

| Field | Value |
| --- | --- |
| Page Name | `home-dashboard` |
| Reference PNG | `ui-ux-pages-pngs/home/Home.png` |
| Purpose | Show the active workspace summary, walk-in PIN, KPIs, shortcuts, and booking activity. |
| Primary Actions | Open notifications, copy booking link, open shortcut modules, switch bottom tab |
| Flow Summary | The dashboard acts as the post-auth landing page for a selected barbershop. |
| Notes | Visible cards suggest a high-level owner dashboard rather than a barber-only view. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Workspace Selector | Barbershop picker | `Hendra Barbershop` | Shows current workspace. |
| Profile Summary | Greeting | `Good Morning, James Comberan` | Personalizes the dashboard. |
| Info Card | Walk-In PIN | `345678` | Exposes the in-store PIN and booking URL. |
| KPI Grid | Metrics | `Today's Schedule 5`, `Walk-In 2`, `Appoint. 2` | Gives operational counts. |
| Shortcut Row | Modules | `Barbers`, `Customers`, `Services` | Opens management features. |
| Activity Feed | Recent bookings | `Ethan James`, `12m ago`, `30 mins` | Lists live activity. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Page background estimate |
| `#FFFFFF` | Cards, pills, and bottom nav surface |
| `#CFE57C` | Walk-in PIN card accent |
| `#C6ED3C` | Active home tab highlight |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `workspace-pill` | Dropdown | `Hendra Barbershop` | Workspace selection |
| `metric-card` | Stat tile | `Walk-In / 2` | KPI display |
| `shortcut-tile` | Icon + label | `Customers` | Module launcher |
| `bottom-tab-bar` | Home active | - | Primary navigation |

### home-reset-walk-in-pin-modal

| Field | Value |
| --- | --- |
| Page Name | `home-reset-walk-in-pin-modal` |
| Reference PNG | `ui-ux-pages-pngs/home/Home-reset-walkin-pin.png` |
| Purpose | Confirm a destructive reset of the displayed walk-in PIN. |
| Primary Actions | No, Not Yet, Yes |
| Flow Summary | Selecting Yes likely regenerates the walk-in PIN and updates the dashboard card. |
| Notes | Regeneration is an assumption based on the modal copy. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Underlay Screen | Home dashboard | `Walk-In PIN 345678` | Keeps context visible behind the modal. |
| Modal Icon | Reset icon | - | Signals the reset action. |
| Modal Heading | Reset Walk-In PIN? | - | States the confirmation. |
| Modal Body | Helper copy | `Reset your walk-in PIN...` | Explains the impact. |
| Action Buttons | Confirmation actions | `No, Not Yet`, `Yes` | Cancel or confirm. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#FFFFFF` | Modal surface |
| `#111111` | Primary action fill and text |
| `#C6ED3C` | Accent chips visible on dashboard underlay |
| `#D9D9D9` | Soft shadow/highlight estimate |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `confirmation-modal` | Two-button | `Reset Walk-In PIN?` | Shared confirmation pattern |
| `metric-card` | Underlay state | `Walk-In PIN` | Context preservation |

### switch-barbershop

| Field | Value |
| --- | --- |
| Page Name | `switch-barbershop` |
| Reference PNG | `ui-ux-pages-pngs/home/Change Workspace.png` |
| Purpose | Let the user change the active barbershop workspace or create a new one. |
| Primary Actions | Select workspace, Create New Barbershop |
| Flow Summary | Tapping a row switches context. The bottom CTA starts workspace creation. |
| Notes | The selected workspace state is not shown; both rows appear neutral. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Heading | Switch Barbershop | - | Titles the context switcher. |
| Body Text | Subtitle | `Choose barbershop you're working on` | Explains the screen. |
| List Row | Workspace option | `Hendra Barbershop` | Selectable workspace. |
| List Row | Workspace option | `Matraman Barber` | Alternate workspace. |
| Button | Create New Barbershop | - | Starts new workspace creation. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#111111` | Headings and CTA fill |
| `#A9C35B` | Divider lines estimate |
| `#FFFFFF` | Surface accents |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `screen-header` | Back | - | Return navigation |
| `selection-row` | Chevron row | `Hendra Barbershop` | Workspace choice |
| `primary-button` | Dark pill | `Create New Barbershop` | Main action |

### create-barbershop-name-logo

| Field | Value |
| --- | --- |
| Page Name | `create-barbershop-name-logo` |
| Reference PNG | `ui-ux-pages-pngs/create-barbershop/Fill name & logo.png` |
| Purpose | Start the barbershop setup wizard with a name field and logo upload. |
| Primary Actions | Choose Image, Create |
| Flow Summary | Step 1 captures identity before the flow continues into service and invite steps. |
| Notes | Progress indicator shows 1 of 3 steps. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Progress Indicator | Step tracker | `1 / 3` | Shows wizard progress. |
| Heading | Create Barbershop | - | Titles the flow. |
| Input Field | Barbershop Name | `Barbershop name` | Captures business name. |
| Upload Field | Logo | `Choose Image` | Opens image picker. |
| Button | Create | - | Continues the setup. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#111111` | Headings and bottom CTA |
| `#D3D3D3` | Inactive progress segment and dashed border |
| `#FFFFFF` | Form fields |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `wizard-progress` | Step 1 active | `1 / 3` | Setup progress |
| `text-input-field` | Single line | `Barbershop name` | Form input |
| `image-upload-box` | Dashed | `Choose Image` | Asset upload |
| `primary-button` | Dark pill | `Create` | Continue action |

### create-barbershop-invite-barber-empty

| Field | Value |
| --- | --- |
| Page Name | `create-barbershop-invite-barber-empty` |
| Reference PNG | `ui-ux-pages-pngs/create-barbershop/Invite Barber 2.png` |
| Purpose | Optional step for inviting barbers before launching the workspace. |
| Primary Actions | Invite, Skip |
| Flow Summary | Inviting adds barbers to the list; skipping moves toward completion. |
| Notes | Progress indicator shows the middle step of the wizard. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Progress Indicator | Step tracker | `2 / 3` | Shows wizard progress. |
| Heading | Invite Barber | - | Titles the step. |
| Input Field | Add Barber | `email / phone number *` | Captures invite target. |
| Button | Invite | - | Adds an invite entry. |
| Button | Skip | - | Moves to the next step without inviting. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#111111` | Main CTA fill |
| `#D9D9D9` | Inactive progress segment |
| `#FFFFFF` | Inputs and secondary buttons |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `wizard-progress` | Step 2 active | `2 / 3` | Setup progress |
| `text-input-field` | Single line | `email / phone number *` | Invite input |
| `secondary-button` | Outline pill | `Invite` | Secondary action |
| `primary-button` | Dark pill | `Skip` | Continue action |

### create-barbershop-invite-barber-filled

| Field | Value |
| --- | --- |
| Page Name | `create-barbershop-invite-barber-filled` |
| Reference PNG | `ui-ux-pages-pngs/create-barbershop/Invite Barber.png` |
| Purpose | Show invited barbers inline while the setup wizard is still in progress. |
| Primary Actions | Remove invite, Invite, Next |
| Flow Summary | Existing invite pills can be removed before moving on. |
| Notes | The visual is the filled-state companion to the empty invite step. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Invite List | Barbershop's barbers | `rifa@gmail.com`, `rifafaruqi@gmail.com` | Shows pending invite targets. |
| Input Field | Add Barber | `email / phone number *` | Adds another barber. |
| Icon Button | Remove invite | `x` | Removes a pending invite. |
| Button | Invite | - | Adds the typed invite. |
| Button | Next | - | Advances to the next step. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#111111` | Main CTA fill |
| `#FF4A4A` | Remove invite icon button |
| `#FFFFFF` | Input and invite rows |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `invite-row` | Removable | `rifa@gmail.com` | Pending invite display |
| `secondary-button` | Outline pill | `Invite` | Adds entry |
| `primary-button` | Dark pill | `Next` | Continue action |

### create-barbershop-first-service

| Field | Value |
| --- | --- |
| Page Name | `create-barbershop-first-service` |
| Reference PNG | `ui-ux-pages-pngs/create-barbershop/Create first service.png` |
| Purpose | Configure the first default service for a new barbershop. |
| Primary Actions | Finish |
| Flow Summary | Completing the form finalizes setup and leads to the success screen. |
| Notes | Progress indicator shows the last setup step. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Progress Indicator | Step tracker | `3 / 3` | Shows wizard completion. |
| Input Field | Name | `Service Name` | Captures service name. |
| Text Area | Description (Optional) | `Service Description` | Captures description. |
| Input Field | Price | `Rp 40000` | Captures price. |
| Input Field | Duration | `30` | Captures duration in minutes. |
| Button | Finish | - | Saves the service and completes setup. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#C6ED3C` | Primary finish CTA |
| `#111111` | Heading and labels |
| `#FFFFFF` | Form surfaces |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `wizard-progress` | Step 3 active | `3 / 3` | Setup progress |
| `text-input-field` | Currency, numeric | `Rp 40000` | Service configuration |
| `multiline-input-field` | Optional text | `Service Description` | Service description |
| `primary-button` | Accent fill | `Finish` | Final wizard action |

### create-barbershop-success

| Field | Value |
| --- | --- |
| Page Name | `create-barbershop-success` |
| Reference PNG | `ui-ux-pages-pngs/create-barbershop/Congrats.png` |
| Purpose | Confirm that the new barbershop has been created successfully. |
| Primary Actions | Open My Barbershop |
| Flow Summary | The CTA should enter the newly created workspace. |
| Notes | The CTA uses a gradient fill instead of the darker wizard button. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Success Heading | Congratulation | - | Announces success. |
| Body Text | Confirmation message | `Your barbershop, "Hendra Barbershop," has been created.` | Names the created workspace. |
| Button | Open My Barbershop | - | Enters the workspace. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#111111` | Heading and left side of CTA gradient |
| `#B7DF2B` | Right side of CTA gradient |
| `#FFFFFF` | Button icon accent |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `success-state` | Created | `Congratulation` | Shared success surface |
| `gradient-button` | Icon trailing | `Open My Barbershop` | Completion CTA |

### barbershop-settings

| Field | Value |
| --- | --- |
| Page Name | `barbershop-settings` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/Barbershop Settings.png` |
| Purpose | Central settings hub for shop information, booking link, operations, and deletion. |
| Primary Actions | Edit information rows, open operations modules, delete barbershop |
| Flow Summary | Tapping rows opens edit detail pages. Operation rows route to management screens. |
| Notes | The embedded bottom navigation shows the barbershop/settings area as active. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Header | Barbershop Settings | - | Titles the settings area. |
| Avatar Upload | Shop image | - | Displays current image with edit affordance. |
| Info Table | Information | `Barbershop Name`, `Barbershop Description`, `Address` | Summarizes business identity. |
| Link Row | Booking Web | `https://cukkr.com/hendra-...` | Shows public booking URL. |
| Operation Rows | Operations | `Barbers`, `Customers`, `Open Hours` | Opens management modules. |
| Danger Button | Delete This Barbershop | - | Destructive workspace action. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#D4E88F` | Settings info card fill estimate |
| `#FFFFFF` | Floating bottom nav |
| `#FF4747` | Destructive delete text |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `screen-header` | Back | `Barbershop Settings` | Return navigation |
| `info-row` | Label-value | `Name / Barbershop Name` | Compact settings summary |
| `operation-row` | Chevron | `Customers` | Module navigation |
| `bottom-tab-bar` | Settings active | - | App navigation |

### edit-barbershop-info-flow

| Field | Value |
| --- | --- |
| Page Name | `edit-barbershop-info-flow` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Barbershop Name.png`; `ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Barbershop Description.png`; `ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Barbershop Address.png` |
| Purpose | Edit the shop name, description, and address in dedicated single-purpose forms. |
| Primary Actions | Save changes via check action |
| Flow Summary | Each form isolates one editable field and returns to the settings hub on save. |
| Notes | The three forms share the same structure, with only title, placeholder, and helper copy changing. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Header | Name / Description / Address | - | Displays the field being edited. |
| Input Field | Barbershop Name | `Barbershop Name` | Single-line text edit. |
| Text Area | Barbershop Description | `Write a short description...` | Multi-line edit. |
| Input Field | Barbershop Address | `Barbershop Address` | Single-line address entry. |
| Helper Text | Field-specific guidance | `This helps customers find your location easily.` | Explains the change. |
| Action Icon | Checkmark | - | Saves the edited value. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | Form surfaces |
| `#111111` | Header text and action icon fill |
| `#9D9DA5` | Placeholder and secondary text |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `edit-field-header` | Back + save | `Description` | Single-field edit shell |
| `text-input-field` | Single-line, multi-line | `Barbershop Address` | Shared edit control |
| `helper-copy` | Field guidance | `This name will be shown...` | Contextual explanation |

### edit-booking-url

| Field | Value |
| --- | --- |
| Page Name | `edit-booking-url` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Book Url.png`; `ui-ux-pages-pngs/barbershop/barbershop-information/Input Text Book Url-1.png` |
| Purpose | Edit the public booking slug that appears after the fixed `https://cukkr.com/` prefix. |
| Primary Actions | Save changes, acknowledge availability error |
| Flow Summary | Submitting a slug either saves it or surfaces an unavailable-url modal. |
| Notes | The unavailable state is materially different because it interrupts the save flow. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Composite Input | Booking URL | `https://cukkr.com/hendra-barbershop` | Edits the public path. |
| Helper Text | Booking link guidance | `Use only letters, numbers, and hyphens.` | Explains validation. |
| Error Text | Validation warning | `Spaces are not allowed.` | Shows inline validation. |
| Modal | Url Not Available | `hendra-barbershop is already in use.` | Blocks save when slug is taken. |
| Button | Oke | - | Dismisses the error modal. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | Input and modal surfaces |
| `#111111` | Header text and primary button fill |
| `#FF4A4A` | Inline validation warning |
| `#E0B12A` | Modal warning icon and title estimate |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `prefixed-input-field` | URL slug | `https://cukkr.com/` | Public URL editor |
| `helper-copy` | Validation guidance | `Spaces are not allowed.` | Input guidance |
| `alert-modal` | Warning | `Url Not Available` | Blocking validation feedback |

### barbers-management

| Field | Value |
| --- | --- |
| Page Name | `barbers-management` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/barber-management/Barbers Management.png`; `ui-ux-pages-pngs/barbershop/barber-management/Barbers Management-1.png` |
| Purpose | Manage invited and active barbers within a workspace. |
| Primary Actions | Invite Barber, remove barber |
| Flow Summary | The list shows active and pending status pills. Removing opens a confirmation modal. |
| Notes | The confirmation modal is visually attached to the same management screen and shares its context. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Heading | Barbers Management | - | Titles the module. |
| Member Card | Barber item | `Pepe Julian`, `Active` | Shows an active barber. |
| Member Card | Barber item | `Julian Pepe`, `Pending` | Shows a pending invite. |
| Button | Invite Barber | - | Opens invite entry screen. |
| Modal | Remove User From Barber? | - | Confirms destructive removal. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#CFE57C` | Member card fill |
| `#55C46B` | Active badge |
| `#F0A11A` | Pending badge |
| `#FF4A4A` | Removal warning accent |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `member-card` | Active, pending | `Pepe Julian` | Staff list item |
| `status-badge` | Active, pending | `Pending` | Availability state |
| `confirmation-modal` | Destructive | `Remove User From Barber?` | Removal confirmation |
| `primary-button` | Dark | `Invite Barber` | Main action |

### invite-barber

| Field | Value |
| --- | --- |
| Page Name | `invite-barber` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/barber-management/Invite Barber.png` |
| Purpose | Enter a single email or phone number and send a barbershop invitation. |
| Primary Actions | Send invite |
| Flow Summary | Submitting sends an invitation and likely returns to the management list. |
| Notes | The action is represented by a circular send icon in the top-right. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Header | Invite Barber | - | Names the task. |
| Input Field | Email / phone number * | `barber@example.com` | Captures invite target. |
| Helper Text | Invitation guidance | `They will receive an invitation to join your barbershop on the app.` | Explains the outcome. |
| Icon Button | Send | - | Sends the invitation. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | Input field surface |
| `#111111` | Send button fill and header text |
| `#A0A0A8` | Placeholder text |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `screen-header` | Title + icon action | `Invite Barber` | Top chrome |
| `text-input-field` | Single line | `email / phone number *` | Invite input |
| `icon-action-button` | Send | - | Submit without footer CTA |

### customer-management

| Field | Value |
| --- | --- |
| Page Name | `customer-management` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/customer-management/Customer Management.png`; `ui-ux-pages-pngs/barbershop/customer-management/Customer Management Filter.png`; `ui-ux-pages-pngs/barbershop/customer-management/Search Customer.png` |
| Purpose | Browse all customers, search them, and sort the list. |
| Primary Actions | Search, open filter/sort menu, enter select mode |
| Flow Summary | Search narrows the list and sort changes ordering. Select mode prepares bulk actions like messaging. |
| Notes | The filter menu is a floating menu rather than a full-screen modal. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Heading | Customer Management | - | Names the module. |
| Helper Text | Subtitle | `Manage all your customers in one place.` | Explains scope. |
| Search Field | Search | `Pepe Julian` | Filters customers. |
| Customer Card | Customer list row | `Pepe Julian`, `Total Book 3`, `Book Value Rp. 120,000` | Summarizes each customer. |
| Floating Menu | Sort options | `Sort by Name`, `Sort by Book Value` | Changes list order. |
| Action Button | Select / Cancel | - | Toggles multi-select mode. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#C6ED3C` | Select-mode background and accent state |
| `#F5F4E8` | Default background |
| `#CFE57C` | Customer card fill |
| `#FFFFFF` | Search and menu surfaces |
| `#111111` | Header and footer action text |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `search-input` | Leading text, trailing icon | `Search` | List filtering |
| `customer-card` | Default row | `Pepe Julian` | Customer summary |
| `sort-menu` | Floating | `Sort by Total Book` | Sort controls |
| `selection-toolbar` | Default / selected | `Select`, `Cancel` | Bulk-action mode toggle |

### customer-management-selection-flow

| Field | Value |
| --- | --- |
| Page Name | `customer-management-selection-flow` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select.png`; `ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - selected one.png`; `ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - Search & Select.png` |
| Purpose | Select one or more customers for a bulk action, with search available during selection mode. |
| Primary Actions | Select customer, search, send to selected customers |
| Flow Summary | Selection count updates in the footer and enables the send action. |
| Notes | The green background distinguishes selection mode from default browse mode. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Selection Footer | Selected Customers | `(0)` or `(1)` | Tracks current selection count. |
| Customer Card | Selected state | `Pepe Julian` | Indicates selected target. |
| Search Field | Search | `Pepe Julian` | Searches within selection mode. |
| Floating Action Button | Send | - | Starts bulk messaging. |
| Top Actions | Filter, Cancel | - | Controls the selection context. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#C6ED3C` | Selection-mode page background |
| `#FFFFFF` | Search bar and selected customer border |
| `#111111` | Footer label and action button fill |
| `#CFE57C` | Unselected customer card fill |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `customer-card` | Selected, unselected | `Pepe Julian` | Bulk selection item |
| `floating-action-button` | Send | - | Bulk-action submit |
| `selection-footer` | Counted | `Select Customers (1)` | Persistent bulk status |

### send-messages-to-customers

| Field | Value |
| --- | --- |
| Page Name | `send-messages-to-customers` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - Send Messages.png`; `ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - Send Messages-1.png`; `ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - Send Messages-2.png`; `ui-ux-pages-pngs/barbershop/customer-management/Customer Management Select - Send Messages-3.png` |
| Purpose | Compose and send a promotional or operational broadcast to selected customers. |
| Primary Actions | Type message, send message |
| Flow Summary | The screen exists in both neutral and selected-mode color themes, with empty and drafted textarea states. |
| Notes | The text area content is example promo copy and should be treated as placeholder content. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Header | Send Messages / Send Messages To Ethan James | - | Names the recipient scope. |
| Text Area | Message composer | `Dapatkan diskon khusus untuk hari ini...` | Drafts broadcast content. |
| Helper Text | Delivery guidance | `It will send the message through registered email or mobile phone` | Explains delivery channel. |
| Icon Button | Send | - | Sends the drafted message. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#C6ED3C` | Selected-mode background variant |
| `#F5F4E8` | Neutral detail background variant |
| `#FFFFFF` | Text area surface |
| `#111111` | Primary send icon background |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `message-composer` | Empty, drafted | `Messages to selected customers` | Shared multi-line input pattern |
| `icon-action-button` | Send | - | Submit action |
| `helper-copy` | Messaging guidance | `Keep them informed...` | Context text |

### customer-detail-general

| Field | Value |
| --- | --- |
| Page Name | `customer-detail-general` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/customer-management/Customer Management - Detail - General.png` |
| Purpose | Show high-level customer metrics and lifetime behavior. |
| Primary Actions | Switch tabs, message customer, go back |
| Flow Summary | Tabs swap between general stats, books, and messages for the same customer. |
| Notes | The chart is visible-only; no interaction pattern is shown. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Header | Customer Details | - | Titles the screen. |
| Customer Identity | Name and phone | `Ethan James`, `+6289283746464 (verified)` | Identifies the customer. |
| Segmented Tabs | General / Books / Messages | `General` active | Navigates detail views. |
| Stat Cards | Book Value, Books, Walk-In, Appoint. | `Rp. 500,000`, `5`, `2` | Summarizes history. |
| Chart Card | Book Stats | `avg comeback every 2 month` | Shows value trend. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#C6ED3C` | Active tab fill |
| `#FFFFFF` | Stat and chart cards |
| `#B8E031` | Trend line estimate |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `screen-header` | Back + send | `Customer Details` | Detail chrome |
| `segmented-tabs` | General active | `General / Books / Messages` | Detail navigation |
| `stat-card` | Numeric | `Books / 5` | KPI tiles |
| `chart-card` | Line chart | `Book Stats` | Trend visualization |

### customer-detail-books

| Field | Value |
| --- | --- |
| Page Name | `customer-detail-books` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/customer-management/Customer Management - Detail - Books.png`; `ui-ux-pages-pngs/barbershop/customer-management/Customer Management - Detail - Books - Filter.png` |
| Purpose | Show the customer's booking history grouped by status with an optional status filter menu. |
| Primary Actions | Switch tabs, filter status, open booking row |
| Flow Summary | The filter menu narrows the books list to waiting, in progress, completed, or canceled records. |
| Notes | The examples use the same booking number across multiple colored status rows. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Segmented Tabs | General / Books / Messages | `Books` active | Navigates within customer detail. |
| Section Heading | Booking | `(5)` | Counts visible bookings. |
| Filter Control | Status dropdown | `All` | Opens status menu. |
| Booking Card | Booking summary | `BOOK-12345`, `Sunday, 11 May 2025 8:30`, `Rp. 40,000` | Represents a single booking. |
| Floating Menu | Status options | `Waiting`, `In Progress`, `Completed`, `Canceled` | Filters the list. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#C6ED3C` | Active tab fill |
| `#FFFFFF` | Booking card and filter menu surface |
| `#F0A11A` | Waiting row and badge color |
| `#0D78FF` | In-progress row color |
| `#4CC76B` | Completed row color |
| `#FF4A4A` | Canceled row color |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `booking-card` | Multi-status | `BOOK-12345` | Booking history row |
| `status-filter-menu` | Floating | `All` | Status filter |
| `segmented-tabs` | Books active | `Books` | Detail navigation |

### customer-detail-messages

| Field | Value |
| --- | --- |
| Page Name | `customer-detail-messages` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/customer-management/Customer Management - Detail - Messages.png` |
| Purpose | Show a one-to-many message history associated with a single customer. |
| Primary Actions | Switch tabs, send message shortcut, go back |
| Flow Summary | The message list is read-only in the design; composition happens on separate send-message pages. |
| Notes | Messages appear as outbound bubbles aligned to the right. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Segmented Tabs | General / Books / Messages | `Messages` active | Navigates within detail. |
| Message Bubble | Outbound promo text | `Promo Besok Pagi Hair Cut Basic Discount Sebesar 30%` | Shows prior communications. |
| Timestamp | Delivery time | `15 Dec 2025, 12.47` | Anchors each message. |
| Customer Identity | Name and phone | `Ethan James`, `+6289283746464` | Keeps context visible. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#C6ED3C` | Active tab fill and message bubble tint |
| `#FFFFFF` | Message board surface |
| `#8E8E97` | Timestamp text |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `segmented-tabs` | Messages active | `Messages` | Detail navigation |
| `message-thread` | Outbound bubbles | Promo copy | Communication history |

### services-management

| Field | Value |
| --- | --- |
| Page Name | `services-management` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/service-management/Service Management.png`; `ui-ux-pages-pngs/barbershop/service-management/Service Management-1.png`; `ui-ux-pages-pngs/barbershop/service-management/Search Service.png` |
| Purpose | List all services, search them, change activation, and identify the default service. |
| Primary Actions | Search, sort, add service, toggle active state |
| Flow Summary | Search and sort operate on the list; selecting a service opens its detail page. |
| Notes | One variant shows the floating sort menu; another shows the plain list state. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Heading | Services Management | - | Titles the module. |
| Search Field | Search | `Hair Cut` | Filters the list. |
| Service Card | Service row | `Hair Cut`, `Rp. 40,000`, `Default` | Summarizes a service. |
| Service Card | Discounted row | `Hair Dyinh`, `20% OFF`, `Rp. 80,000` | Shows discount presentation. |
| Sort Menu | Sort options | `Sort by Highest` | Changes list order. |
| Icon Button | Add | `+` | Opens add-service form. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#CFE57C` | Service card fill |
| `#FFFFFF` | Search and menu surfaces |
| `#111111` | Plus button and active toggle fill |
| `#B7DF2B` | Active toggle accent |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `search-input` | Services | `Search` | List filtering |
| `service-card` | Default, discounted | `Hair Cut` | Service summary row |
| `sort-menu` | Floating | `Sort by Lowest` | Sorting controls |
| `toggle-switch` | On, off | Active status | Activation state |

### service-detail

| Field | Value |
| --- | --- |
| Page Name | `service-detail` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/service-management/Service Management - Detail.png`; `ui-ux-pages-pngs/barbershop/service-management/Service Management - Detail-1.png` |
| Purpose | Show service information, pricing, duration, and operational state. |
| Primary Actions | Edit fields, toggle active state, set default, open more menu |
| Flow Summary | The default service has extra restrictions, while inactive services can be deleted or promoted to default. |
| Notes | The second detail variant includes a delete menu and inactive-state copy. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Image Tile | Service image | - | Displays the service photo. |
| Info Rows | Name, Description | `Hair Cut`, `Clean cuts, Confident Style ...` | Summarize the service. |
| Pricing Rows | Duration, Price, Discount | `30 minutes`, `Rp. 40,000`, `0%` | Shows financial details. |
| Operational Rows | Active, Default Service | `Default` | Shows operational state. |
| Overflow Menu | Delete this Service | - | Destructive action for non-default service. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#D4E88F` | Detail cards fill |
| `#111111` | Overflow action icon and text |
| `#B7DF2B` | Toggle accent |
| `#9D9DA5` | Disabled/inactive helper text |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `info-row` | Label-value | `Duration / 30 minutes` | Detail presentation |
| `toggle-row` | Active | `Active` | Operational state control |
| `status-pill` | Default | `Default` | Identifies protected default service |
| `overflow-menu` | Delete option | `Delete this Service` | Secondary actions |

### set-service-default-confirmation

| Field | Value |
| --- | --- |
| Page Name | `set-service-default-confirmation` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/service-management/Service Management - Detail - Set As Default.png` |
| Purpose | Confirm making a non-default service the new default service. |
| Primary Actions | No, Not Yet, Yes |
| Flow Summary | Confirming promotes the service and preserves the rule that the default must stay active. |
| Notes | The modal explains the dependency between default status and active state. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Underlay Screen | Service detail | `Hair Dyinh`, `20% -> Rp. 80,000` | Keeps context visible. |
| Modal Icon | Warning | `!` | Signals importance. |
| Modal Heading | Set As Default? | - | States the decision. |
| Modal Body | Helper copy | `To deactivate, set another service as default.` | Explains the rule. |
| Action Buttons | Confirmation actions | `No, Not Yet`, `Yes` | Cancel or confirm. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#FFFFFF` | Modal surface |
| `#111111` | Primary button fill |
| `#D4E88F` | Underlay cards |
| `#E0B12A` | Warning icon estimate |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `confirmation-modal` | Warning | `Set As Default?` | High-impact confirmation |
| `toggle-row` | Underlay state | `Active` | Context underlay |

### add-or-edit-service-form

| Field | Value |
| --- | --- |
| Page Name | `add-or-edit-service-form` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/service-management/Service Management - Add New.png`; `ui-ux-pages-pngs/barbershop/service-management/Input Text Service Name.png`; `ui-ux-pages-pngs/barbershop/service-management/Input Text Service Description.png`; `ui-ux-pages-pngs/barbershop/service-management/Input Text Cost.png`; `ui-ux-pages-pngs/barbershop/service-management/Input Text Duration.png`; `ui-ux-pages-pngs/barbershop/service-management/Input Text Discount.png` |
| Purpose | Create a new service and edit the same fields later in dedicated single-field forms. |
| Primary Actions | Save via check action, Create New Service |
| Flow Summary | The add screen captures all attributes; the edit screens isolate one attribute at a time. |
| Notes | Discount editing also shows computed final price feedback. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Image Picker | Service image | - | Uploads a service image. |
| Input Fields | Name, Price, Duration | `Hair Cut`, `Rp 40000`, `30` | Core service fields. |
| Text Area | Description (Optional) | `Service Description` | Multi-line details. |
| Toggle Row | Active | `Active` | Controls visibility. |
| Discount Field | Percentage | `20` | Computes final price. |
| Button | New Service | - | Submits the full add form. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | Form fields |
| `#111111` | Header and dark CTA |
| `#B7DF2B` | Active toggle accent |
| `#A9C35B` | Final price divider line |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `service-form` | Add, edit-field | `Service Name` | Reusable service editor |
| `image-upload-box` | Filled / empty | Service image | Asset upload |
| `toggle-row` | Active | `Active` | Visibility control |
| `computed-summary-row` | Discount result | `Final Price / Rp. 80,000` | Derived feedback |

### open-hours

| Field | Value |
| --- | --- |
| Page Name | `open-hours` |
| Reference PNG | `ui-ux-pages-pngs/barbershop/open-hours/Open Hours.png`; `ui-ux-pages-pngs/barbershop/open-hours/Open Hours-1.png` |
| Purpose | Configure which days are open and what start/end times apply to each day. |
| Primary Actions | Toggle day availability, pick start time, pick end time |
| Flow Summary | Switching a day on enables its time range. Selecting a time opens a wheel-style time picker modal. |
| Notes | Sunday is the only day shown with the toggle turned off in the default state. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Heading | Open Hours | - | Titles the module. |
| Body Text | Subtitle | `Set the opening hours for each day.` | Explains the goal. |
| Day Row | Monday | `09:00 AM - 09:00 AM` | Defines hours for a day. |
| Toggle Switch | Day active state | On / Off | Controls whether the day is open. |
| Time Picker Modal | Wheel picker | `06 28 PM` | Changes the selected time. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#CFE57C` | Main schedule card fill |
| `#FFFFFF` | Time input and modal surfaces |
| `#111111` | Active toggles and confirm button |
| `#B7DF2B` | Inactive-light toggle accent |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `day-hours-row` | Enabled, disabled | `Monday / 09:00 AM - 09:00 AM` | Weekly schedule control |
| `toggle-switch` | On, off | Day availability | Open/closed state |
| `time-picker-modal` | Wheel picker | `06 28 PM` | Time selection |

### schedule-active-bookings

| Field | Value |
| --- | --- |
| Page Name | `schedule-active-bookings` |
| Reference PNG | `ui-ux-pages-pngs/schedule/Schedule.png`; `ui-ux-pages-pngs/schedule/Schedule - Calendar.png`; `ui-ux-pages-pngs/schedule/Schedule - Filter.png` |
| Purpose | Show the active day schedule with horizontal date chips, status-filtered booking cards, and a date picker. |
| Primary Actions | Change date, filter status, create booking, open booking detail |
| Flow Summary | Status filter narrows the active list while the calendar modal changes the selected day. |
| Notes | The active-bookings count appears next to the section title. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Date Pill | Current date | `Sun, 11 May 25` | Shows the selected day. |
| Day Chips | Daily selector | `Sun 11`, `Mon 12`, `Tue 13` | Quickly changes day. |
| Section Heading | Active Booking | `(5)` | Counts active bookings. |
| Booking Card | Active booking row | `Ethan James`, `12m ago`, `30 mins` | Shows an active appointment. |
| Filter Menu | Status options | `All`, `Waiting`, `In Progress` | Filters active list. |
| Calendar Modal | Month grid | `September 2021` | Picks a different date. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | Booking cards, date pill, menus |
| `#111111` | Selected day chip and plus button |
| `#F0A11A` | Waiting booking color |
| `#0D78FF` | In-progress booking color |
| `#C6ED3C` | Active bottom-tab highlight |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `date-selector-pill` | Current day | `Sun, 11 May 25` | Day navigation |
| `day-chip-row` | Selected, unselected | `Sun 11` | Fast date switch |
| `booking-card` | Waiting, in-progress | `Ethan James` | Active booking row |
| `status-filter-menu` | Floating | `All` | Status filter |
| `calendar-modal` | Date picker | `September 2021` | Date selection |

### history-bookings

| Field | Value |
| --- | --- |
| Page Name | `history-bookings` |
| Reference PNG | `ui-ux-pages-pngs/schedule/History Bookings.png`; `ui-ux-pages-pngs/schedule/History Bookings - Filter.png` |
| Purpose | Review past bookings in a flatter list layout with date and status filters. |
| Primary Actions | Filter, sort, change date, open booking detail |
| Flow Summary | The history list changes status color and ordering based on the floating menus. |
| Notes | Date and status filters are both visible in the filtered-state mock. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Header | All Booking | - | Titles the historical list. |
| Date Filter | Date pill | `11 May 25` | Limits the list to a date. |
| Status Filter | All | - | Opens the status menu. |
| Sort Menu | Sort options | `Sort by Recently Added` | Changes order. |
| Booking Row | Booking history item | `James Comberan`, `Pepe Julian`, `30 mins` | Lists historical booking info. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | Row cards and menus |
| `#4CC76B` | Completed booking color |
| `#F0A11A` | Waiting booking color |
| `#0D78FF` | In-progress booking color |
| `#FF4A4A` | Canceled booking color |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `history-booking-row` | Multi-status | `James Comberan` | History item |
| `sort-menu` | Floating | `Sort by Oldest First` | Ordering control |
| `status-filter-menu` | Floating | `Completed` | Status filtering |

### booking-detail-request-flow

| Field | Value |
| --- | --- |
| Page Name | `booking-detail-request-flow` |
| Reference PNG | `ui-ux-pages-pngs/notification/Notification - Appointment Detail.png`; `ui-ux-pages-pngs/notification/Notification - Appointment Detail - Requested.png`; `ui-ux-pages-pngs/notification/Notification - Appointment Detail - Declined.png` |
| Purpose | Show requested appointment details from the notification flow, including accept and decline outcomes. |
| Primary Actions | Accept, Decline, open WhatsApp, go back |
| Flow Summary | The requested state offers both actions, while the declined state shows the result badge without footer controls. |
| Notes | `Notification - Appointment Detail.png` is treated as the base requested detail because it matches the same layout family. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Customer Header | Booking owner | `James Comberan` | Identifies the customer. |
| Meta Block | Schedule details | `Scheduled at 8:15 am`, `Duration 30m` | Summarizes the booking. |
| Status Badge | Requested / Declined | `Requested` | Shows decision state. |
| Detail Rows | Book No, Requested | `#BOOK-12345`, `Pepe Julian` | Shows compact booking facts. |
| Service Card | Services and Notes | `Hair Cut (20m)`, `Hair Dying (10m)` | Shows service mix. |
| Footer Buttons | Decision actions | `Decline`, `Accept` | Responds to a request. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | Detail cards |
| `#F2E88B` | Requested badge outline estimate |
| `#FF4A4A` | Declined badge and decline action |
| `#55C46B` | Accept action text |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `status-badge` | Requested, declined | `Declined` | Status display |
| `info-row` | Label-value | `Requested / Pepe Julian` | Compact detail layout |
| `dual-action-footer` | Accept/decline | `Decline`, `Accept` | Decision control |

### booking-detail-waiting-flow

| Field | Value |
| --- | --- |
| Page Name | `booking-detail-waiting-flow` |
| Reference PNG | `ui-ux-pages-pngs/booking-detail/Schedule - Calendar - Waiting.png`; `ui-ux-pages-pngs/booking-detail/Schedule - Calendar - Waiting-1.png`; `ui-ux-pages-pngs/booking-detail/Schedule - Calendar - Waiting-2.png`; `ui-ux-pages-pngs/booking-detail/Schedule - Calendar - Wrong Preffered.png` |
| Purpose | Handle arrived walk-ins that are waiting and may need a takeover confirmation before service starts. |
| Primary Actions | Handle this, Cancel Book, confirm start, confirm takeover |
| Flow Summary | The waiting row can open a cancel menu, then either start service directly or require a takeover confirmation if the preferred barber differs. |
| Notes | The arrival timestamp and customer-assigned barber appear in all waiting-state variants. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Customer Header | Booking owner | `Ethan James` | Identifies the customer. |
| Arrival Meta | Arrival time | `Arrived at 8:15 am (12m ago)` | Shows waiting age. |
| Status Badge | Waiting | `Waiting` | Current queue state. |
| Service Card | Services and Notes | `Hair Cut (20m)`, `Rp. 40,000` | Shows booked services. |
| Bottom CTA | Handle this | - | Starts the handling flow. |
| Modal / Menu | Cancel Book, Start this booking?, Take Over This Booking? | - | Branches the waiting flow. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | Cards and modal surfaces |
| `#F0A11A` | Waiting badge and takeover warning title |
| `#111111` | Primary buttons and overflow menu icon |
| `#55C46B` | Positive confirm accent |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `booking-detail-card` | Waiting | `Ethan James` | Main detail layout |
| `overflow-menu` | Cancel option | `Cancel Book` | Secondary action menu |
| `confirmation-modal` | Start, takeover | `Start this booking?` | Flow confirmation |
| `sticky-cta` | Bottom pill | `Handle this` | Queue action |

### booking-detail-in-progress-flow

| Field | Value |
| --- | --- |
| Page Name | `booking-detail-in-progress-flow` |
| Reference PNG | `ui-ux-pages-pngs/booking-detail/Schedule - Calendar - In Progress.png`; `ui-ux-pages-pngs/booking-detail/Schedule - Calendar - In Progress-1.png`; `ui-ux-pages-pngs/booking-detail/Schedule - Calendar - In Progress - Pop Up.png` |
| Purpose | Show an actively handled booking and the completion flow. |
| Primary Actions | Complete, Mark as Waiting, confirm completion |
| Flow Summary | The overflow menu exposes a transition back to waiting, while the bottom CTA opens a swipe-to-complete confirmation modal. |
| Notes | The completion confirmation uses a swipe affordance instead of simple buttons. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Customer Header | Booking owner | `Ethan James` | Identifies the customer. |
| Schedule Meta | Scheduled time | `Scheduled at 8:15 am` | Keeps appointment context visible. |
| Status Badge | In Progress | `In Progress` | Current handling state. |
| Bottom CTA | Complete | - | Starts completion flow. |
| Overflow Menu | Mark as Waiting | - | Returns the job to waiting. |
| Modal | Complete Booking? | `Swipe to complete` | Finalizes the booking. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#0D78FF` | In-progress badge and row color |
| `#55C46B` | Completion CTA and success icon |
| `#FFFFFF` | Cards and modal surface |
| `#111111` | Overflow menu icon |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `booking-detail-card` | In-progress | `Ethan James` | Main detail layout |
| `overflow-menu` | Single option | `Mark as Waiting` | State management |
| `swipe-confirmation-modal` | Completion | `Swipe to complete` | High-confidence finish action |

### booking-detail-result-states

| Field | Value |
| --- | --- |
| Page Name | `booking-detail-result-states` |
| Reference PNG | `ui-ux-pages-pngs/booking-detail/Schedule - Calendar - Completed.png`; `ui-ux-pages-pngs/booking-detail/Schedule - Calendar - Completed-1.png` |
| Purpose | Show read-only outcomes for completed and canceled bookings. |
| Primary Actions | Go back, open WhatsApp |
| Flow Summary | Once the booking is finished or canceled, the screen becomes informational rather than actionable. |
| Notes | The two result states share the same layout with only status color and label changes. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Customer Header | Booking owner | `Ethan James` | Identifies the customer. |
| Status Badge | Completed / Canceled | `Completed` | Shows final outcome. |
| Detail Rows | Book No, Requested, Handled By | `#BOOK-12345`, `Pepe Julian` | Summarizes the booking. |
| Service Card | Services and Notes | `Hair Dying (10m)` | Displays completed work. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#55C46B` | Completed badge outline |
| `#FF4A4A` | Canceled badge outline |
| `#FFFFFF` | Detail cards |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `status-badge` | Completed, canceled | `Canceled` | Final-state indicator |
| `booking-detail-card` | Read-only | `Ethan James` | Final detail layout |

### notifications-list

| Field | Value |
| --- | --- |
| Page Name | `notifications-list` |
| Reference PNG | `ui-ux-pages-pngs/notification/Notification.png` |
| Purpose | Aggregate incoming appointment and invitation notifications with inline actions. |
| Primary Actions | Accept, Decline, open notification, open more menu |
| Flow Summary | Actionable notifications expose inline accept/decline controls, while informational items remain passive. |
| Notes | The right-side menu icon suggests more filtering or batch actions, but no menu state is shown. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Notification Card | Appointment Requested | `James Comberan`, `50s ago` | Shows a recent request. |
| Notification Card | Walk-In Arrival | `30m ago` | Shows non-actionable arrival info. |
| Notification Card | Barbershop Invitation | `Pepe Julian` | Shows an invitation with inline actions. |
| Inline Buttons | Decline, Accept | - | Respond directly from the list. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | Notification card surface |
| `#55C46B` | Accept action text |
| `#FF4A4A` | Decline action text |
| `#DADAE1` | Right-side icon tint |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `notification-card` | Requested, invitation, passive | `Appointment Requested` | Notification list row |
| `inline-decision-buttons` | Accept/decline | `Accept` | Direct response pattern |

### new-appointment-flow

| Field | Value |
| --- | --- |
| Page Name | `new-appointment-flow` |
| Reference PNG | `ui-ux-pages-pngs/schedule-new-book-by-admin/Schedule - New Appointment.png`; `ui-ux-pages-pngs/schedule-new-book-by-admin/Schedule - New Appointment - Filled.png`; `ui-ux-pages-pngs/schedule-new-book-by-admin/Schedule - New Appointment - Select Date.png`; `ui-ux-pages-pngs/schedule-new-book-by-admin/Schedule - New Appointment - Select Time.png` |
| Purpose | Create a new scheduled appointment from the admin side with customer, barber, date-time, and service selections. |
| Primary Actions | Pick date, pick time, choose barber, submit new appointment |
| Flow Summary | The base form progressively fills in customer details and opens date/time pickers as overlays. |
| Notes | The time picker is separate from the calendar picker and both appear as floating overlays above the same form. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Toggle Header | Appointment / Walk-In | Appointment active | Chooses booking type. |
| Input Fields | Customer Name, Email / Phone Number | `Jokowi`, `jokowiasli@gmail.com` | Captures customer identity. |
| Selector Field | Preferred Barber | `Julian Pepe` | Optional barber assignment. |
| Date-Time Field | Schedule | `Sunday, 11 May 2025 14:00 am` | Sets appointment time. |
| Service Selector | Service card | `Hair Cut`, `Rp. 40,000`, `Default` | Chooses the service. |
| Button | New Appointment | - | Creates the appointment. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | Form fields and overlays |
| `#111111` | Submit button fill |
| `#CFE57C` | Selected service card fill |
| `#B7DF2B` | Active appointment toggle outline |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `booking-type-toggle` | Appointment active | - | Booking mode selector |
| `selector-input` | Barber, date-time | `Select preferred barber` | Opens pickers |
| `calendar-modal` | Date picker | `September 2021` | Date selection |
| `time-picker-modal` | Wheel picker | `06 28 PM` | Time selection |
| `service-selection-card` | Default | `Hair Cut` | Service chooser |

### new-walk-in

| Field | Value |
| --- | --- |
| Page Name | `new-walk-in` |
| Reference PNG | `ui-ux-pages-pngs/schedule-new-book-by-admin/Schedule - New Walk-in.png` |
| Purpose | Create a new walk-in booking without a future date-time picker. |
| Primary Actions | Choose barber, choose service, submit new walk-in |
| Flow Summary | The walk-in variant removes the date-time selector but keeps the customer and service inputs. |
| Notes | The header toggle flips to the walk-in icon as active. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Toggle Header | Appointment / Walk-In | Walk-In active | Chooses booking mode. |
| Input Fields | Customer Name, Email / Phone Number | `Customer Name` | Captures identity. |
| Selector Field | Preferred Barber | `Select preferred barber` | Optional assignment. |
| Service Card | Selected service | `Hair Cut`, `Rp. 40,000` | Shows chosen service. |
| Button | New Walk-In | - | Creates the queue entry. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | Form fields |
| `#111111` | Submit button fill |
| `#B7DF2B` | Active walk-in toggle accent |
| `#CFE57C` | Service card fill |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `booking-type-toggle` | Walk-in active | - | Booking mode selector |
| `service-selection-card` | Default | `Hair Cut` | Service chooser |
| `primary-button` | Dark | `New Walk-In` | Submit action |

### select-barber

| Field | Value |
| --- | --- |
| Page Name | `select-barber` |
| Reference PNG | `ui-ux-pages-pngs/schedule-new-book-by-admin/Search Barber.png` |
| Purpose | Search and choose one barber from a simple selection list. |
| Primary Actions | Search, select barber |
| Flow Summary | Selecting a row returns the chosen barber to the booking form. |
| Notes | The design shows two identical sample rows for the same barber. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Header | Select Barber | - | Names the picker. |
| Search Field | Search | `Pepe Julian` | Filters barbers. |
| Barber Row | Barber item | `Pepe Julian` | Selects one barber. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | Search field |
| `#CFE57C` | Barber row fill |
| `#111111` | Header text |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `search-input` | Picker search | `Search` | Filters list |
| `selection-row` | Avatar + chevron | `Pepe Julian` | Choice row |

### select-services

| Field | Value |
| --- | --- |
| Page Name | `select-services` |
| Reference PNG | `ui-ux-pages-pngs/schedule-new-book-by-admin/Search Service.png` |
| Purpose | Search and multi-select services before returning to the booking form. |
| Primary Actions | Search, toggle service selection, confirm via check action |
| Flow Summary | Service rows support selected and unselected checkbox states before confirmation. |
| Notes | The top-right check icon behaves as the confirm action. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Header | Select Services | - | Names the picker. |
| Search Field | Search | `Hair` | Filters services. |
| Service Row | Unselected / selected | `Hair Cut`, `Hair Dyinh` | Chooses one or more services. |
| Check Icon | Confirm selection | - | Returns selected services. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | Search field |
| `#CFE57C` | Service row fill |
| `#111111` | Confirm icon fill and selected checkbox |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `search-input` | Picker search | `Search` | Filters list |
| `service-card` | Checkbox selected / unselected | `Hair Cut` | Service selection |
| `icon-action-button` | Confirm | - | Apply selection |

### user-profile

| Field | Value |
| --- | --- |
| Page Name | `user-profile` |
| Reference PNG | `ui-ux-pages-pngs/user-profile/User Profile.png`; `ui-ux-pages-pngs/user-profile/User Profile - Confirm.png`; `ui-ux-pages-pngs/user-profile/User Profile - Confirm-1.png` |
| Purpose | Show barber profile details, account contact data, and logout actions. |
| Primary Actions | Edit image, open change password, logout, confirm logout, acknowledge contact update |
| Flow Summary | The profile overview links into edit screens. Modals handle logout confirmation and contact-change success. |
| Notes | Two overlays are shown: one success alert and one logout confirmation. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Header | User Profile | - | Titles the profile module. |
| Avatar Upload | Profile image | - | Shows editable profile photo. |
| Info Rows | Your Name, Bio, Email, Phone Number | `Pepe Julian`, `julianpepe@gmail.com` | Summarize profile data. |
| Action Row | Change Password | - | Opens password update flow. |
| Button | Logout | - | Starts logout. |
| Modal / Alert | Confirm Log out?, Email / phone number changed | - | Confirms or acknowledges account actions. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#D4E88F` | Profile info card fill |
| `#FFFFFF` | Logout button and modal surfaces |
| `#111111` | Primary text and confirm button fill |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `info-row` | Label-value | `Bio / Fade Specialist` | Profile summary |
| `confirmation-modal` | Logout | `Confirm Log out?` | Account confirmation |
| `alert-modal` | Success | `Your contact has been changed` | Feedback pattern |

### edit-user-profile-fields

| Field | Value |
| --- | --- |
| Page Name | `edit-user-profile-fields` |
| Reference PNG | `ui-ux-pages-pngs/user-profile/Input Text Your Name.png`; `ui-ux-pages-pngs/user-profile/Input Text Bio.png`; `ui-ux-pages-pngs/user-profile/Change Password.png` |
| Purpose | Edit profile name, biography, and password in dedicated field-specific forms. |
| Primary Actions | Save via check action, Change Password, Forgot Password |
| Flow Summary | Name and bio save from a top-right check action. Password change uses a bottom CTA. |
| Notes | The password screen is visually distinct but belongs to the same profile-editing flow. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Header | Your Name / Bio / Change Password | - | Shows the field being edited. |
| Input Field | Your Name | `Your Name` | Single-line profile edit. |
| Text Area | Bio | `Bio` | Multi-line profile summary. |
| Input Fields | Current Password, New Password | `••••••••` | Change-password inputs. |
| Text Link | Forgot Password | - | Secondary password recovery. |
| Button | Change Password | - | Saves the new password. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | Input surfaces |
| `#111111` | Header text |
| `#C6ED3C` | Password CTA and small recovery link |
| `#9D9DA5` | Placeholder text |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `edit-field-header` | Back + save | `Your Name` | Single-field editor |
| `text-input-field` | Single-line, password | `Current Password` | Input control |
| `multiline-input-field` | Bio | `Bio` | Long-form text edit |
| `primary-button` | Accent fill | `Change Password` | Password submit |

### verify-contact-flow

| Field | Value |
| --- | --- |
| Page Name | `verify-contact-flow` |
| Reference PNG | `ui-ux-pages-pngs/user-profile/Verify Old Contact.png`; `ui-ux-pages-pngs/user-profile/Verify New Contact.png` |
| Purpose | Verify both the old and new contact method during a profile contact update. |
| Primary Actions | Send Again, Continue / Verify |
| Flow Summary | The old-contact OTP step comes first, followed by verification of the replacement contact. |
| Notes | The two screens share the same layout with only heading and final CTA label changing. |

#### Visible Content

| Item Type | Label or Title | Example Value | Purpose or Behavior |
| --- | --- | --- | --- |
| Heading | Verify Old Contact / Verify New Contact | - | Clarifies which contact is being validated. |
| Helper Text | OTP sent to email/phone | `julianpepe@gmail.com` | Shows contact destination. |
| OTP Input | 4 digits | `1 2 3 4` | Collects the code. |
| Countdown | Timer | `05:00` | Shows resend delay. |
| Buttons | Send Again, Continue / Verify | - | Resend or submit the code. |

#### Colors

| Hex | Usage |
| --- | --- |
| `#F5F4E8` | Background |
| `#FFFFFF` | OTP boxes and secondary button |
| `#C6ED3C` | Primary verify CTA |
| `#BCC4B6` | OTP borders |

#### Reusable Components Used On This Page

| Component Name | Variant or State | Example Content | Purpose |
| --- | --- | --- | --- |
| `otp-code-input` | 4-digit | `1 2 3 4` | Code entry |
| `primary-button` | Accent | `Verify` | Submit action |
| `secondary-button` | Outline accent | `Send Again` | Resend action |

## Component Descriptions

| Component Name | Type | Variants or States | Example Content | Used By Pages | Notes |
| --- | --- | --- | --- | --- | --- |
| `auth-screen-shell` | Screen layout | Title + description + footer | `Login`, `Create Account` | `login`, `register`, `verify-account`, `forgot-password`, `verify-otp`, `create-password` | Already exists in code as `AuthScreenShell`; use it as the base auth layout token source. |
| `auth-text-field` | Form input | Text, password, password with toggle | `Email / Phone Number*` | `login`, `register`, `forgot-password`, `create-password` | Already exists in code as `AuthTextField`. |
| `auth-button` | Action button | Primary, secondary | `Login`, `Send Again` | Auth flow pages | Already exists in code as `AuthButton`; secondary usage may need a visible variant if not implemented. |
| `auth-footer-prompt` | Inline navigation | Sign-up prompt, sign-in prompt | `Sign Up here` | `login`, `register`, `create-password` | Already exists in code as `AuthFooterPrompt`. |
| `otp-code-input` | OTP control | 4-digit | `1 2 3 4` | `verify-account`, `verify-otp`, `verify-contact-flow` | Already exists in code as `OtpCodeInput`; can likely be reused outside auth with prop tweaks. |
| `onboarding-card` | Marketing slide card | Illustration card | `Easy Booking with One Link` | Onboarding pages | Existing `OnboardingCard` is the closest implementation anchor. |
| `onboarding-button` | Marketing CTA | Dark, accent | `Next`, `Get Started` | Onboarding pages | Existing `OnboardingButton` provides the core pattern. |
| `onboarding-indicator` | Progress indicator | First, second, third active | `● ○ ○` | Onboarding pages | Existing `OnboardingIndicator` covers this pattern. |
| `wizard-progress` | Setup progress | Step 1, 2, 3 active | `1 / 3` | Create-barbershop flow | Shared by workspace setup screens. |
| `screen-header` | Top chrome | Back only, back + action, back + send | `User Profile` | Most post-auth pages | Use for consistent spacing, icon size, and title placement. |
| `primary-button` | Main CTA | Dark, accent, gradient | `Create`, `Finish`, `Logout` | Many post-auth pages | Should unify bottom CTAs across feature modules. |
| `secondary-button` | Secondary CTA | Outline, outline-accent | `Invite`, `Send Again` | Setup, messaging, verification flows | Needed for non-primary actions that still require pill styling. |
| `icon-action-button` | Circular icon CTA | Send, confirm, plus | `send`, `+` | `invite-barber`, `select-services`, `services-management`, messaging pages | Repeated top-right circular action pattern. |
| `text-input-field` | Form control | Single-line, prefixed, currency, numeric, password | `Barbershop Name`, `Rp 40000` | Settings, service forms, profile edit, booking creation | Core shared form primitive outside auth. |
| `multiline-input-field` | Long-form input | Description, bio, message draft | `Service Description` | Service forms, profile edit, messaging pages | Should keep consistent padding and radius. |
| `image-upload-box` | Media picker | Dashed empty, filled tile | `Choose Image` | Create barbershop, add/edit service, profile, settings | Common upload affordance across the product. |
| `info-row` | Label-value row | Single-line, multi-line, chevron | `Phone Number / +62838383833` | `barbershop-settings`, `service-detail`, `user-profile`, booking details | High-value shared component for detail-heavy screens. |
| `operation-row` | Navigation row | Chevron | `Customers` | `barbershop-settings` | Could be a thin variant of `info-row` with navigation affordance. |
| `status-badge` | Status indicator | Requested, waiting, in-progress, completed, canceled, active, pending | `Waiting` | Booking detail, booking history, barber management | Keep color variants tokenized, not hard-coded per screen. |
| `toggle-switch` | Boolean control | On, off | Active / inactive | Services, open hours | A consistent switch component would remove repeated one-off styling. |
| `confirmation-modal` | Blocking modal | Warning, destructive, success-confirm | `Confirm Log out?` | Home reset, barber removal, service default, booking flows, logout | One modal shell with icon/title/body/actions can cover most overlays. |
| `alert-modal` | Feedback modal | Warning, success | `Url Not Available` | Booking URL validation, contact changed | Similar shell to confirmation but with a single acknowledgement action. |
| `overflow-menu` | Floating action menu | Single action, two actions | `Cancel Book` | Booking detail, service detail, notifications | Needed for the repeated three-dot popover pattern. |
| `search-input` | Search field | Plain, in select mode | `Search` | Customer, barber, service pickers | Shared list filtering control. |
| `sort-menu` | Floating menu | Customer sort, service sort, history sort | `Sort by Name` | Customer management, services management, history bookings | Simple floating menu list with shadow. |
| `status-filter-menu` | Floating filter menu | All, waiting, in-progress, completed, canceled | `All` | Schedule, history, customer detail books | Repeated across booking-heavy views. |
| `customer-card` | List item card | Default, selected | `Pepe Julian` | Customer management and selection flows | Shared identity row with metrics and chevron/selection affordance. |
| `member-card` | Staff list item | Active, pending | `Pepe Julian` | Barber management | Staff-specific variant of an identity card. |
| `service-card` | Service list item | Default, discounted, checkbox-selectable | `Hair Cut / Rp. 40,000` | Services management, select-services, booking forms | Strong candidate for a single reusable row with slots. |
| `booking-card` | Booking row | Waiting, in-progress, completed, canceled | `BOOK-12345` | Schedule, history, customer detail books | Use shared color/status tokens and time metadata slots. |
| `booking-detail-card` | Detail layout | Requested, waiting, in-progress, result | `Ethan James` | Booking detail flows | Same structural shell with state-dependent CTA/footer. |
| `message-thread` | Messaging history | Outbound bubble list | Promo copy with timestamps | `customer-detail-messages` | Shared if direct customer conversations are added later. |
| `message-composer` | Message entry | Empty, drafted | `Messages to selected customers` | Send-message flows | Can share internals with multiline field plus helper copy. |
| `metric-card` | KPI tile | Count, link, PIN | `Today's Schedule / 5` | Home dashboard | Repeated stat surfaces on dashboard and customer detail. |
| `stat-card` | Numeric summary | Value-first | `Books / 5` | `customer-detail-general` | Similar family to `metric-card`; may share a base card. |
| `chart-card` | Visualization container | Line chart | `Book Stats` | `customer-detail-general` | Separate from logic; treat the chart as pluggable content. |
| `workspace-pill` | Selector pill | Dropdown | `Hendra Barbershop` | `home-dashboard` | Also reusable for shop/date selectors elsewhere. |
| `shortcut-tile` | Icon tile | Barbers, customers, services | `Services` | `home-dashboard` | Shared quick-action launcher. |
| `bottom-tab-bar` | App navigation | Home active, schedule active, settings active | - | Home, settings, schedule | A core app-shell primitive for post-auth pages. |
| `segmented-tabs` | In-page tab switcher | General, books, messages | `Books` | Customer detail pages | Needed for dense detail modules. |
| `calendar-modal` | Date picker overlay | Month grid | `September 2021` | Schedule and new-appointment flow | Shared across booking creation and filtering. |
| `time-picker-modal` | Time picker overlay | Wheel picker | `06 28 PM` | Open hours and new-appointment flow | Shared modal for time-only selection. |
| `day-chip-row` | Horizontal day selector | Selected and unselected chips | `Sun 11` | Schedule active bookings | Pair with date picker for calendar navigation. |
| `sticky-cta` | Bottom anchored CTA | Handle, complete | `Handle this` | Booking detail waiting/in-progress | Good shared pattern for action-first detail pages. |
| `swipe-confirmation-modal` | Gesture confirmation | Swipe to complete | `Swipe to complete` | Booking completion flow | Specialized enough to track separately from standard confirmation modal. |