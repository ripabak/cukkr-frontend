import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Pressable,
    Text,
    TextInput,
    type TextInputProps,
    View,
} from "react-native";

type AuthTextFieldProps = TextInputProps & {
  label: string;
  secureToggle?: boolean;
};

export function AuthTextField({
  label,
  secureTextEntry,
  secureToggle = false,
  ...props
}: AuthTextFieldProps) {
  const [isSecure, setIsSecure] = useState(Boolean(secureTextEntry));

  return (
    <View className="gap-[8px]">
      <Text className="text-[#6E766C] text-[14px] font-semibold">{label}</Text>

      <View className="flex-row items-center min-h-[54px] border border-[#BCC4B6] rounded-lg bg-[#FBFAF5] px-[16px]">
        <TextInput
          placeholderTextColor="#6E766C"
          className="flex-1 text-[#2F3A2F] text-[15px] py-[12px]"
          secureTextEntry={secureToggle ? isSecure : secureTextEntry}
          {...props}
        />

        {secureToggle ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => setIsSecure((current) => !current)}
            className="ml-[12px]"
          >
            <Ionicons
              color="#6E766C"
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={20}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}