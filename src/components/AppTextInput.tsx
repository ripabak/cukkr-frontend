import { forwardRef } from "react";
import { TextInput, type TextInputProps } from "react-native";

export const AppTextInput = forwardRef<TextInput, TextInputProps>(
  function AppTextInput({ style, ...props }, ref) {
    return (
      <TextInput
        ref={ref}
        style={[{ fontFamily: "PlusJakartaSans_400Regular" }, style]}
        {...props}
      />
    );
  },
);
