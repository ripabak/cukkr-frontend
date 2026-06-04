# Workspace Feature - Quick Start

## 5 Steps to Get Started

### Step 1: Wrap Your Routes with Provider

```tsx
// app/(auth)/workspace/_layout.tsx
import { CreateBarbershopProvider } from "@/src/features/workspace";
import { Stack } from "expo-router";

export default function WorkspaceLayout() {
  return (
    <CreateBarbershopProvider>
      <Stack />
    </CreateBarbershopProvider>
  );
}
```

### Step 2: Create Route Files

Create these files in `app/(authenticated)/workspace/`:

```tsx
// create-barbershop-name-logo.tsx
import { CreateBarbershopNameLogoScreen } from "@/src/features/workspace";
export default CreateBarbershopNameLogoScreen;

// create-barbershop-first-service.tsx
import { CreateBarbershopFirstServiceScreen } from "@/src/features/workspace";
export default CreateBarbershopFirstServiceScreen;

// create-barbershop-invite-barber-empty.tsx
import { CreateBarbershopInviteBarberEmptyScreen } from "@/src/features/workspace";
export default CreateBarbershopInviteBarberEmptyScreen;

// create-barbershop-invite-barber-filled.tsx
import { CreateBarbershopInviteBarberFilledScreen } from "@/src/features/workspace";
export default CreateBarbershopInviteBarberFilledScreen;

// create-barbershop-success.tsx
import { CreateBarbershopSuccessScreen } from "@/src/features/workspace";
export default CreateBarbershopSuccessScreen;

// switch-barbershop.tsx
import { SwitchBarbershopScreen } from "@/src/features/workspace";
export default SwitchBarbershopScreen;
```

### Step 3: Link From Your Navigation

```tsx
// In your main navigation or menu
import { useRouter } from "expo-router";

const router = useRouter();

// Start wizard
<Button
  onPress={() => router.push("/create-barbershop-name-logo")}
  label="Create Barbershop"
/>

// Switch barbershop
<Button
  onPress={() => router.push("/switch-barbershop")}
  label="Switch Workspace"
/>
```

### Step 4: Test the Wizard

1. Navigate to `/create-barbershop-name-logo`
2. Follow the 3-step wizard:
   - Enter name (auto validates slug)
   - Create first service
   - Invite team members
3. Complete and return to home

### Step 5: Use the Services in Custom Screens

```tsx
import {
  barbershopService,
  servicesService,
  barbersService,
} from "@/src/features/workspace";

// Get current barbershop
const barbershop = await barbershopService.getCurrent();

// List services
const services = await servicesService.getList({ activeOnly: true });

// Get barbers
const team = await barbersService.getList();
```

## Common Tasks

### Handle Image Upload (TODO)

Currently, the image picker is a placeholder. To enable:

```tsx
// 1. Install library
npx expo install expo-image-picker

// 2. Update components/ImagePickerButton.tsx
import * as ImagePicker from "expo-image-picker";

const handlePress = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });
  if (!result.canceled) {
    onImageSelect?.(result.assets[0].uri);
  }
};

// 3. Update screens to pass onImageSelect
<ImagePickerButton onImageSelect={(uri) => setLogo(uri)} />
```

### Validate Form Input

```tsx
import {
  validateBarbershopName,
  validateServiceName,
  validatePrice,
  validateDuration,
} from "@/src/features/workspace/utils/form-validators";

const validation = validateBarbershopName(name);
if (!validation.isValid) {
  Alert.alert("Error", validation.message);
}
```

### Access Wizard State

```tsx
import { useCreateBarbershopForm } from "@/src/features/workspace";

function MyScreen() {
  const { formData, updateFormData, resetFormData } = useCreateBarbershopForm();

  // Read current state
  console.log(formData.name, formData.serviceName);

  // Update state
  updateFormData({ name: "New Name" });

  // Reset on completion
  resetFormData();

  return <View>...</View>;
}
```

## API Reference

### Services Available

```tsx
// Barbershop Operations
barbershopService.create(data); // POST /api/barbershop
barbershopService.getCurrent(); // GET /api/barbershop
barbershopService.getList(); // GET /api/barbershop/list
barbershopService.checkSlugAvailability(slug); // GET /api/barbershop/slug-check
barbershopService.uploadLogo(file); // POST /api/barbershop/logo
barbershopService.updateSettings(data); // PATCH /api/barbershop/settings
barbershopService.leave(orgId); // DELETE /api/barbershop/:orgId/leave

// Service Management
servicesService.create(data); // POST /api/services
servicesService.getList(options); // GET /api/services
servicesService.getById(id); // GET /api/services/:id
servicesService.update(id, data); // PATCH /api/services/:id
servicesService.delete(id); // DELETE /api/services/:id
servicesService.toggleActive(id); // PATCH /api/services/:id/toggle-active
servicesService.setDefault(id); // PATCH /api/services/:id/set-default

// Team Management
barbersService.getList(search); // GET /api/barbers
barbersService.inviteSingle(data); // POST /api/barbers/invite
barbersService.inviteBulk(targets); // POST /api/barbers/bulk-invite
barbersService.cancelInvitation(id); // DELETE /api/barbers/invite/:id
barbersService.removeMember(id); // DELETE /api/barbers/:id
barbersService.acceptInvitation(id); // POST /api/barbers/invitations/:id/accept
barbersService.declineInvitation(id); // POST /api/barbers/invitations/:id/decline
```

## File Locations

- **Services**: `@/src/features/workspace/services/`
- **Screens**: `@/src/features/workspace/screens/`
- **Context**: `@/src/features/workspace/context/`
- **Utils**: `@/src/features/workspace/utils/`
- **Components**: `@/src/features/workspace/components/`

## Troubleshooting

**Q: Slug validation not working?**
A: Make sure the backend API is running and accessible at `EXPO_PUBLIC_ENV_API_URL`

**Q: "Cannot read property of undefined" on formData?**
A: Ensure the screen is wrapped with `CreateBarbershopProvider`

**Q: Images not uploading?**
A: Image picker is currently a placeholder. See "Handle Image Upload" section above.
