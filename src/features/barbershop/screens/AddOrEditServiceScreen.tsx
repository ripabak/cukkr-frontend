import { Colors } from "@/src/theme/colors";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { ServiceForm } from "@/src/features/barbershop/components/ServiceForm";
import {
  useCreateService,
  useServiceById,
  useUpdateService,
  useUploadServiceImage,
} from "@/src/features/barbershop/hooks";
import {
  validateDiscount,
  validateDuration,
  validatePrice,
  validateServiceName,
} from "@/src/features/barbershop/utils/form-validators";
import { useImagePicker } from "@/src/hooks";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useToast } from "@/src/lib/providers";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export function AddOrEditServiceScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();
  const params = useLocalSearchParams<{
    serviceId?: string;
    isEdit?: string;
  }>();
  const isEdit = params.isEdit === "true";
  const serviceId = params.serviceId ?? "";

  const { data: existing, isLoading: isFetching } = useServiceById(serviceId);
  const { mutate: createService, isPending: isCreating } = useCreateService();
  const { mutate: updateService, isPending: isUpdating } = useUpdateService();

  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const { pickAndGetFile } = useImagePicker();
  const { mutate: uploadServiceImage, isPending: isUploadingImage } =
    useUploadServiceImage(serviceId);

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
      if (existing.imageUrl) {
        setImageUri(existing.imageUrl);
      }
      setInitialized(true);
    }
  }, [existing, isEdit, initialized]);

  const isPending = isCreating || isUpdating;

  const handleImagePress = async () => {
    const file = await pickAndGetFile();
    if (!file) return;

    setImageUri(file.uri);
    uploadServiceImage(file, {
      onSuccess: () => {
        toast.success(t("toast.imageUploadSuccess"));
      },
      onError: (e) => {
        const message = e.message;
        if (message.startsWith("MAX_SIZE_EXCEEDED:")) {
          const size = message.split(":")[1];
          toast.error(t("toast.imageTooLarge", { size }));
        } else {
          toast.error(e.message || t("toast.unknownError"));
        }
      },
    });
  };

  const handleSubmit = () => {
    const nameVal = validateServiceName(name);
    if (!nameVal.isValid) {
      toast.error(nameVal.message);
      return;
    }

    const priceNum = parseFloat(price);
    const priceVal = validatePrice(priceNum);
    if (!priceVal.isValid) {
      toast.error(priceVal.message);
      return;
    }

    const durationNum = parseInt(duration, 10);
    const durationVal = validateDuration(durationNum);
    if (!durationVal.isValid) {
      toast.error(durationVal.message);
      return;
    }

    const discountNum = discount ? parseFloat(discount) : 0;
    const discountVal = validateDiscount(discountNum);
    if (!discountVal.isValid) {
      toast.error(discountVal.message);
      return;
    }

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
            toast.success(t("services.editSuccess"));
            router.back();
          },
          onError: (e) => toast.error(e.message || t("toast.unknownError")),
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
            toast.success(t("services.addSuccess"));
            router.back();
          },
          onError: (e) => toast.error(e.message || t("toast.unknownError")),
        },
      );
    }
  };

  return (
    <ScreenShell
      keyboardAvoid
      hideAppHeader
      headerSlot={
        <ScreenHeader
          title={isEdit ? t("services.editService") : t("services.addService")}
          onBack={() => router.back()}
        />
      }
    >
      {isEdit && isFetching && !initialized ? (
        <ActivityIndicator
          size="large"
          color={Colors.brand.primary}
          style={styles.loader}
        />
      ) : (
        <>
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
            onImagePress={isUploadingImage ? undefined : handleImagePress}
            imageUri={imageUri}
            showDiscount={isEdit}
          />

          <PrimaryButton
            label={
              isPending
                ? t("common.saving")
                : isEdit
                  ? t("common.save")
                  : t("common.create")
            }
            onPress={handleSubmit}
            disabled={isPending}
            style={styles.submitBtn}
          />
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginTop: 80,
  },
  submitBtn: {
    marginTop: 16,
  },
});
