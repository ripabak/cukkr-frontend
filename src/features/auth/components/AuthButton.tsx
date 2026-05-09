import { Pressable, Text } from "react-native";

type AuthButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export function AuthButton({
  label,
  onPress,
  variant = "primary",
  disabled,
}: AuthButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({ opacity: pressed ? 0.86 : disabled ? 0.5 : 1 })}
      className={`min-h-[56px] rounded-full justify-center items-center px-[24px] ${
        isPrimary ? 'bg-[#C4EB35]' : 'bg-[#F4F2E7] border border-[#A7D92C]'
      }`}
    >
      <Text className={`text-[16px] font-extrabold ${isPrimary ? 'text-[#1F2A18]' : 'text-[#A7D92C]'}`}>
        {label}
      </Text>
    </Pressable>
  );
}