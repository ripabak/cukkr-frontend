import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Colors } from "@/src/theme/colors";
import { LabeledInput } from "@/src/components/LabeledInput";
import { MultilineInputField } from "@/src/components/MultilineInputField";
import { PriceInput } from "@/src/components/PriceInput";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import { ToggleRow } from "@/src/features/barbershop/components/ToggleRow";
import {
  useCreateService,
} from "@/src/features/barbershop/hooks";
import { servicesService } from "@/src/features/barbershop/services/services.service";
import {
  validateDiscount,
  validateDuration,
  validatePrice,
  validateServiceName,
} from "@/src/features/barbershop/utils/form-validators";
import { useImagePicker } from "@/src/hooks";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useToast } from "@/src/lib/providers";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function AddOrEditServiceScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();

  const { mutate: createService, isPending: isCreating } = useCreateService();

  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const { pickAndGetFile, isPicking } = useImagePicker();
  const pendingImageRef = useRef<{ uri: string; name: string; type: string } | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [discount, setDiscount] = useState("");

  const isPending = isCreating;

  const handleImagePress = async () => {
    if (isPicking) return;
    const file = await pickAndGetFile();
    if (!file) return;

    setImageUri(file.uri);
    pendingImageRef.current = file;
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
        onSuccess: async (newService) => {
          const serviceId = newService.id;
          if (pendingImageRef.current && serviceId) {
            setIsUploadingImage(true);
            try {
              await servicesService.uploadImage(serviceId, pendingImageRef.current);
              toast.success(t("toast.imageUploadSuccess"));
            } catch (e) {
              const message = e instanceof Error ? e.message : String(e);
              if (message.startsWith("MAX_SIZE_EXCEEDED:")) {
                const size = message.split(":")[1];
                toast.error(t("toast.imageTooLarge", { size }));
              } else {
                toast.error(message || t("toast.unknownError"));
              }
            } finally {
              setIsUploadingImage(false);
            }
          }
          toast.success(t("services.addSuccess"));
          router.back();
        },
        onError: (e) => toast.error(e.message || t("toast.unknownError")),
      },
    );
  };

  return (
    <ScreenShell
      keyboardAvoid
      hideAppHeader
      headerSlot={
        <ScreenHeader
          title={t("services.addService")}
          onBack={() => router.back()}
        />
      }
    >
      <View style={styles.imageWrapper}>
        <TouchableOpacity
          onPress={isUploadingImage ? undefined : handleImagePress}
          activeOpacity={0.8}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.serviceImageContent}
              contentFit="cover"
            />
          ) : (
            <View style={styles.serviceImagePlaceholder}>
              <Ionicons
                name="camera-outline"
                size={24}
                color={Colors.icon.muted}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TextInputField
        label={t("services.serviceName")}
        placeholder={t("services.namePlaceholder")}
        value={name}
        onChangeText={setName}
        style={styles.field}
      />

      <MultilineInputField
        label={t("services.descriptionLabel")}
        placeholder={t("services.descriptionPlaceholder")}
        value={description}
        onChangeText={setDescription}
        style={styles.field}
      />

      <PriceInput
        value={price}
        onChangeText={setPrice}
        style={styles.field}
      />

      <LabeledInput
        label={t("services.duration")}
        placeholder={t("services.durationPlaceholder")}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={styles.field}
      />

      <View style={styles.card}>
        <ToggleRow
          label={t("services.active")}
          value={isActive}
          onValueChange={setIsActive}
          isLast
        />
      </View>

      <LabeledInput
        label={t("services.discount")}
        placeholder="0"
        value={discount}
        onChangeText={setDiscount}
        keyboardType="numeric"
        style={styles.field}
      />

      <PrimaryButton
        label={isPending ? t("common.saving") : t("common.create")}
        onPress={handleSubmit}
        disabled={isPending}
        style={styles.submitBtn}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  serviceImageContent: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
  },
  serviceImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: Colors.bg.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.border.default,
  },
  field: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.brand.primarySurface,
    borderRadius: 16,
    marginBottom: 16,
  },
  submitBtn: {
    marginTop: 16,
  },
});
