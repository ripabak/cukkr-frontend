import React from "react";
import { ImageUploadBox } from "@/src/components/ImageUploadBox";
import { Alert } from "react-native";

interface Props {
  label?: string;
  imageUri?: string;
  style?: any;
}

export function ImagePickerButton({ label, imageUri, style }: Props) {
  const handlePress = async () => {
    try {
      console.log(
        "TODO: Implement image picker using react-native-image-picker or expo-image-picker",
      );
      Alert.alert("Info", "Image picker will be implemented soon");
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  return (
    <ImageUploadBox
      label={label}
      onPress={handlePress}
      imageUri={imageUri}
      style={style}
    />
  );
}
