# Workspace Feature Integration Guide

## Overview

The workspace feature provides a complete barbershop creation wizard and management system, fully integrated with the backend API using the Eden Treaty client.

## Directory Structure

```
@/src/features/workspace/
├── context/
│   └── CreateBarbershopContext.tsx    # Wizard state management
├── services/
│   ├── barbershop.service.ts          # Barbershop CRUD operations
│   ├── services.service.ts            # Service management (haircut, etc.)
│   ├── barbers.service.ts             # Team member management
│   └── index.ts
├── screens/
│   ├── CreateBarbershopNameLogoScreen.tsx      # Step 1: Name + slug validation
│   ├── CreateBarbershopFirstServiceScreen.tsx  # Step 2: Default service
│   ├── CreateBarbershopInviteBarberEmptyScreen.tsx    # Step 3: Team invite (empty)
│   ├── CreateBarbershopInviteBarberFilledScreen.tsx   # Step 3: Team invite (filled)
│   ├── CreateBarbershopSuccessScreen.tsx       # Success screen
│   └── SwitchBarbershopScreen.tsx              # Switch between barbershops
├── components/
│   └── ImagePickerButton.tsx                   # Image selection wrapper
├── utils/
│   ├── slug-generator.ts                       # URL slug generation
│   └── form-validators.ts                      # Form validation helpers
└── index.tsx                                   # Public exports
```

## Setup in App Router

### 1. Wrap with Context Provider

Add the `CreateBarbershopProvider` to your root layout or route group:

```tsx
// app/(authenticated)/workspace/_layout.tsx
import { CreateBarbershopProvider } from "@/src/features/workspace";

export default function WorkspaceLayout() {
  return (
    <CreateBarbershopProvider>
      <Stack />
    </CreateBarbershopProvider>
  );
}
```

### 2. Create Routes

Add the following routes in your app router:

```tsx
// app/(authenticated)/workspace/
├── create-barbershop-name-logo.tsx
├── create-barbershop-first-service.tsx
├── create-barbershop-invite-barber-empty.tsx
├── create-barbershop-invite-barber-filled.tsx
├── create-barbershop-success.tsx
└── switch-barbershop.tsx
```

Each route should export the corresponding screen:

```tsx
// app/(authenticated)/workspace/create-barbershop-name-logo.tsx
import { CreateBarbershopNameLogoScreen } from "@/src/features/workspace";

export default function CreateBarbershopNameLogo() {
  return <CreateBarbershopNameLogoScreen />;
}
```

## Wizard Flow

1. **Name & Logo Screen** (`CreateBarbershopNameLogoScreen`)
   - User enters barbershop name
   - Slug is auto-generated and validated in real-time
   - Optional logo upload
   - Navigates to: Service creation

2. **First Service Screen** (`CreateBarbershopFirstServiceScreen`)
   - Create the default service (haircut, etc.)
   - Set price and duration
   - Creates both barbershop and service
   - Navigates to: Invite barbers

3. **Invite Barbers Screens** (Empty/Filled)
   - Empty state: No invites yet, add first barber
   - Filled state: List of invited barbers with add more option
   - Send team invitations
   - Can skip and go directly to success
   - Navigates to: Success

4. **Success Screen** (`CreateBarbershopSuccessScreen`)
   - Shows congratulations message
   - Button to open barbershop dashboard
   - Resets wizard state

## API Endpoints Used

### Barbershop Management
- `POST /api/barbershop` - Create new barbershop
- `GET /api/barbershop` - Get current barbershop
- `GET /api/barbershop/list` - List user's barbershops
- `GET /api/barbershop/slug-check?slug=xxx` - Check slug availability
- `POST /api/barbershop/logo` - Upload logo

### Service Management
- `POST /api/services` - Create service
- `GET /api/services` - List services
- `PATCH /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Team Management
- `POST /api/barbers/invite` - Invite single barber
- `POST /api/barbers/bulk-invite` - Invite multiple barbers
- `DELETE /api/barbers/invite/:invitationId` - Cancel invitation
- `GET /api/barbers` - List team members

## Usage Examples

### Using Services Directly

```tsx
import { barbershopService, servicesService, barbersService } from "@/src/features/workspace";

// Create barbershop
const barbershop = await barbershopService.create({
  name: "My Barber Shop",
  slug: "my-barber-shop",
  description: "Best barbershop in town",
});

// Create service
const service = await servicesService.create({
  name: "Haircut",
  price: 50000,
  duration: 30,
  description: "Classic haircut",
});

// Invite barbers
await barbersService.inviteBulk([
  { email: "barber1@example.com" },
  { email: "barber2@example.com" },
]);
```

### Using Form Context

```tsx
import { useCreateBarbershopForm } from "@/src/features/workspace";

function MyComponent() {
  const { formData, updateFormData } = useCreateBarbershopForm();

  const handleUpdate = () => {
    updateFormData({
      name: "Updated Name",
      serviceName: "Haircut Deluxe",
      servicePrice: 75000,
    });
  };

  return (
    <View>
      <Text>Current name: {formData.name}</Text>
      <PrimaryButton onPress={handleUpdate} label="Update" />
    </View>
  );
}
```

## Validators

### Available Validators

```tsx
import {
  validateBarbershopName,
  validateServiceName,
  validatePrice,
  validateDuration,
  validateEmail,
  validatePhoneNumber,
} from "@/src/features/workspace/utils/form-validators";

// Returns { isValid: boolean; message: string }
const nameValidation = validateBarbershopName("My Shop");
if (!nameValidation.isValid) {
  Alert.alert("Error", nameValidation.message);
}
```

## Image Handling

Currently, the image picker is a placeholder. To implement:

1. Install image picker library:
   ```bash
   npx expo install expo-image-picker
   ```

2. Update `ImagePickerButton.tsx`:
   ```tsx
   import * as ImagePicker from "expo-image-picker";

   const handlePress = async () => {
     const result = await ImagePicker.launchImageLibraryAsync({
       mediaTypes: ImagePicker.MediaTypeOptions.Images,
       allowsEditing: true,
       aspect: [1, 1],
     });
     // Handle result...
   };
   ```

## Slug Generation

The slug generator automatically:
- Converts to lowercase
- Replaces spaces with hyphens
- Removes special characters
- Validates against API (checks availability)

Example:
```
Input: "My Awesome Barber Shop!"
Output slug: "my-awesome-barber-shop"
```

## Error Handling

All services throw errors that are caught and displayed to users via `Alert.alert()`. Each screen has error handling for:
- Network failures
- Validation errors
- Duplicate entries
- Server errors

## Testing Checklist

- [ ] Name input with real-time slug validation
- [ ] Service creation with price/duration validation
- [ ] Single barber invitation
- [ ] Bulk barber invitations
- [ ] Remove invited barber
- [ ] Skip wizard and go to success
- [ ] Success screen navigation
- [ ] Context state persists across screens
- [ ] Error alerts on API failures

## Known Limitations

1. **Image Upload**: Currently placeholder implementation
2. **Logo Upload**: Needs FormData handling in Eden client
3. **Phone Validation**: Basic regex validation, may need refinement

## Future Enhancements

- [ ] Implement real image picker
- [ ] Add progress bar/percentage to wizard
- [ ] Save draft barbershop (local storage backup)
- [ ] Edit barbershop after creation
- [ ] Batch operations for barber management
- [ ] Service categories
- [ ] Business hours configuration in wizard
