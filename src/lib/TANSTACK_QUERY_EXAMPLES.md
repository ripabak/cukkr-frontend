# TanStack Query Implementation Examples

## Refactoring Existing Code

### Before: Manual async handling
```tsx
export function CreateBarbershopNameLogoScreen() {
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const slug = generateSlug(name);
    setIsCheckingSlug(true);
    const available = await barbershopService.checkSlugAvailability(slug);
    setSlugAvailable(available);
    setIsCheckingSlug(false);
  }, [name]);

  return (
    <TextInputField
      label="Barbershop Name"
      value={name}
      onChangeText={setName}
    />
  );
}
```

### After: Using TanStack Query
```tsx
import { useBarbershopSlugCheck } from '@/src/features/workspace/hooks';
import { generateSlug } from '../utils/slug-generator';

export function CreateBarbershopNameLogoScreen() {
  const [name, setName] = useState("");
  const slug = generateSlug(name);
  
  // TanStack Query handles debouncing, loading, caching automatically
  const { data: isAvailable, isLoading } = useBarbershopSlugCheck(slug);

  return (
    <TextInputField
      label="Barbershop Name"
      value={name}
      onChangeText={setName}
      helperText={
        isLoading ? "Checking..." : isAvailable ? "Available" : "Already taken"
      }
    />
  );
}
```

## Complete Screen Examples

### Example 1: Query + Mutation
```tsx
import { 
  useBarbershopCurrent,
  useUpdateBarbershopSettings 
} from '@/src/features/workspace/hooks';
import { useToast } from '@/src/lib/providers';

export function SettingsScreen() {
  const { data: barbershop, isLoading: isLoadingBarbershop } = useBarbershopCurrent();
  const { mutate: updateSettings, isPending } = useUpdateBarbershopSettings();
  const toast = useToast();
  const [name, setName] = useState("");

  // Initialize form when data loads
  useEffect(() => {
    if (barbershop?.name) {
      setName(barbershop.name);
    }
  }, [barbershop?.name]);

  const handleSave = () => {
    updateSettings({ name }, {
      onSuccess: () => {
        toast.show({ title: 'Saved successfully!' });
      },
      onError: (error) => {
        toast.show({ 
          title: 'Error', 
          message: error.message,
          type: 'error'
        });
      },
    });
  };

  if (isLoadingBarbershop) return <LoadingScreen />;
  if (!barbershop) return <ErrorScreen />;

  return (
    <ScreenShell>
      <TextInputField
        label="Business Name"
        value={name}
        onChangeText={setName}
      />
      <PrimaryButton
        onPress={handleSave}
        disabled={isPending}
        title={isPending ? 'Saving...' : 'Save Changes'}
      />
    </ScreenShell>
  );
}
```

### Example 2: List with Infinite Queries
```tsx
import { useBarbersList } from '@/src/features/workspace/hooks';
import { useState } from 'react';

export function BarbersListScreen() {
  const [search, setSearch] = useState("");
  const { data: barbers, isLoading, error } = useBarbersList(search);

  return (
    <ScreenShell>
      <SearchInput value={search} onChangeText={setSearch} />
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <FlatList
          data={barbers}
          renderItem={({ item }) => <BarberCard barber={item} />}
          keyExtractor={(item) => item.id}
        />
      )}
    </ScreenShell>
  );
}
```

### Example 3: Multiple Mutations in Sequence
```tsx
import { 
  useCreateOrganization,
  useSetActiveOrganization 
} from '@/src/features/workspace/hooks';

export function CreateOrganizationFlow() {
  const { mutate: createOrg, isPending: isCreating } = useCreateOrganization();
  const { mutate: setActive, isPending: isActivating } = useSetActiveOrganization();

  const handleCreateAndActivate = (name: string, slug: string) => {
    createOrg(
      { name, slug, metadata: { description: "" } },
      {
        onSuccess: (newOrg) => {
          setActive(newOrg.id);
        },
        onError: (error) => {
          showToast('Failed to create organization: ' + error.message);
        },
      }
    );
  };

  const isLoading = isCreating || isActivating;

  return (
    <CreateOrgForm 
      onSubmit={handleCreateAndActivate}
      isLoading={isLoading}
    />
  );
}
```

### Example 4: Dependent Queries
```tsx
import { useBarbershopCurrent, useBarbersList } from '@/src/features/workspace/hooks';

export function DashboardScreen() {
  // First query: fetch current barbershop
  const { data: barbershop, isLoading: loading1 } = useBarbershopCurrent();

  // Second query: depends on first query
  // Barbers are automatically disabled until barbershop is loaded
  const { data: barbers, isLoading: loading2 } = useBarbersList();

  const isLoading = loading1 || loading2;

  return (
    <>
      <BarbershopHeader barbershop={barbershop} isLoading={loading1} />
      <BarbersList barbers={barbers} isLoading={loading2} />
    </>
  );
}
```

### Example 5: Mutation with Optimistic Update
```tsx
import { useInviteBarber } from '@/src/features/workspace/hooks';
import { useQueryClient } from '@tanstack/react-query';

export function InviteBarberModal() {
  const queryClient = useQueryClient();
  const { mutate: inviteBarber, isPending } = useInviteBarber();

  const handleInvite = (email: string) => {
    // Optional: optimistic update
    // queryClient.setQueryData(['barbers', 'list'], (old) => [...old, { email, status: 'pending' }]);

    inviteBarber({ email }, {
      onSuccess: () => {
        showToast('Invitation sent!');
        // Query automatically refetches due to invalidation in hook
      },
      onError: (error) => {
        showToast('Failed: ' + error.message);
        // If using optimistic update, rollback here if needed
      },
    });
  };

  return (
    <InviteForm
      onSubmit={handleInvite}
      isLoading={isPending}
    />
  );
}
```

## Migration Checklist

When migrating screens to use TanStack Query:

- [ ] Replace useState + useEffect untuk data fetching dengan useQuery hook
- [ ] Replace async function calls dalam handlers dengan useMutation hook
- [ ] Update loading states dari isPending/isLoading dari hooks
- [ ] Add onSuccess callback untuk post-mutation actions
- [ ] Add onError callback untuk error handling
- [ ] Remove manual error state management (hooks provide error)
- [ ] Remove manual retry logic (configured globally)
- [ ] Test caching behavior (data should be cached and reused)

## Performance Tips

1. **Minimize Re-renders**: Query data is memoized, won't cause re-renders unless it changes

2. **Use Proper Keys**: Same component using different params creates separate cache entries
   ```tsx
   const { data: search1 } = useBarbersList("john");
   const { data: search2 } = useBarbersList("jane");
   // Separate cache entries, efficient!
   ```

3. **Stale While Revalidate**: Queries serve cached data immediately while revalidating in background
   ```tsx
   // User sees cached list instantly, updates in background
   const { data: barbers } = useBarbersList();
   ```

4. **Selective Invalidation**: Only invalidate related queries
   ```tsx
   onSuccess: () => {
     // Good: only invalidate current barbershop
     queryClient.invalidateQueries({ queryKey: BARBERSHOP_QUERY_KEYS.current() });
     
     // Avoid: invalidating everything
     // queryClient.invalidateQueries();
   }
   ```
