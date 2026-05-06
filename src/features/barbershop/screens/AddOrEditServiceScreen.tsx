import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ServiceForm } from "@/src/components/ServiceForm";
import {
  useCreateService,
  useServiceById,
  useUpdateService,
} from "@/src/features/barbershop/hooks";
import {
  validateDiscount,
  validateDuration,
  validatePrice,
  validateServiceName,
} from "@/src/features/barbershop/utils/form-validators";
import { useToast } from "@/src/lib/providers";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function AddOrEditServiceScreen() {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{ serviceId?: string; isEdit?: string }>();
  const isEdit = params.isEdit === "true";
  const serviceId = params.serviceId ?? "";

  const { data: existing, isLoading: isFetching } = useServiceById(serviceId);
  const { mutate: createService, isPending: isCreating } = useCreateService();
  const { mutate: updateService, isPending: isUpdating } = useUpdateService();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [discount, setDiscount] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (existing && isEdit && !initialized) {
      setName(existing.name);
      setDescription(existing.description ?? "");
      setPrice(String(existing.price));
      setDuration(String(existing.duration));
      setIsActive(existing.isActive);
      setDiscount(existing.discount > 0 ? String(existing.discount) : "");
      setInitialized(true);
    }
  }, [existing, isEdit, initialized]);

  const isPending = isCreating || isUpdating;

  const handleSubmit = () => {
    const nameVal = validateServiceName(name);
    if (!nameVal.isValid) { toast.error(nameVal.message); return; }

    const priceNum = parseFloat(price);
    const priceVal = validatePrice(priceNum);
    if (!priceVal.isValid) { toast.error(priceVal.message); return; }

    const durationNum = parseInt(duration, 10);
    const durationVal = validateDuration(durationNum);
    if (!durationVal.isValid) { toast.error(durationVal.message); return; }

    const discountNum = discount ? parseFloat(discount) : 0;
    const discountVal = validateDiscount(discountNum);
    if (!discountVal.isValid) { toast.error(discountVal.message); return; }

    if (isEdit && serviceId) {
      updateService(
        {
          id: serviceId,
          data: {
            name: name.trim(),
            description: description.trim() || null,
            price: priceNum,
            duration: durationNum,
            discount: discountNum,
          },
        },
        {
          onSuccess: () => {
            toast.success("Service updated");
            router.back();
          },
          onError: (e) => toast.error(e.message || "Failed to update service"),
        },
      );
    } else {
      createService(
        {
          name: name.trim(),
          description: description.trim() || null,
          price: priceNum,
          duration: durationNum,
          discount: discountNum || undefined,
          isActive,
        },
        {
          onSuccess: () => {
            toast.success("Service created");
            router.back();
          },
          onError: (e) => toast.error(e.message || "Failed to create service"),
        },
      );
    }
  };

  if (isEdit && isFetching && !initialized) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#C6FF4D" style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        <ScreenHeader
          title={isEdit ? "Edit Service" : "New Service"}
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ServiceForm
            name={name}
            onNameChange={setName}
            description={description}
            onDescriptionChange={setDescription}
            price={price}
            onPriceChange={setPrice}
            duration={duration}
            onDurationChange={setDuration}
            isActive={isActive}
            onActiveChange={setIsActive}
            discount={discount}
            onDiscountChange={setDiscount}
            onImagePress={() => {}}
            showDiscount={isEdit}
          />

          <PrimaryButton
            label={isPending ? "Saving..." : isEdit ? "Save Service" : "Create Service"}
            onPress={handleSubmit}
            disabled={isPending}
            style={styles.submitBtn}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEEEE0",
  },
  outer: {
    flex: 1,
  },
  loader: {
    marginTop: 80,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
  submitBtn: {
    marginTop: 8,
  },
});
