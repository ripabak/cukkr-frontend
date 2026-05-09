import { useEffect, useRef } from "react";
import {
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

type OtpCodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
};

export function OtpCodeInput({
  autoFocus = true,
  length = 4,
  onChange,
  value,
}: OtpCodeInputProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timeout);
  }, [autoFocus]);

  return (
    <Pressable onPress={() => inputRef.current?.focus()} className="items-center">
      <TextInput
        autoFocus={autoFocus}
        keyboardType="number-pad"
        maxLength={length}
        onChangeText={(nextValue) => onChange(nextValue.replace(/\D/g, ""))}
        ref={inputRef}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
        value={value}
      />

      <View className="flex-row justify-between w-full gap-[12px]">
        {Array.from({ length }).map((_, index) => {
          const digit = value[index] ?? "";
          const isActive = index === value.length && value.length < length;

          return (
            <View
              key={index}
              className={`flex-1 aspect-square max-w-[64px] rounded-lg border bg-[#FBFAF5] justify-center items-center ${
                isActive ? 'border-[#A7D92C]' : 'border-[#BCC4B6]'
              }`}
            >
              <Text className="text-[#2F3A2F] text-[24px] font-bold">{digit}</Text>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}