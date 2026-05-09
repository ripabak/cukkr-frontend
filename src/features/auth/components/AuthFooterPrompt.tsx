import { Link } from "expo-router";
import { Text, View } from "react-native";

type AuthFooterPromptProps = {
  prompt: string;
  actionLabel: string;
  href: "/login" | "/register";
};

export function AuthFooterPrompt({
  actionLabel,
  href,
  prompt,
}: AuthFooterPromptProps) {
  return (
    <View className="flex-row justify-center items-center gap-[8px]">
      <Text className="text-[#6E766C] text-[14px]">{prompt}</Text>
      <Link href={href} className="text-[#A7D92C] text-[14px] font-bold">
        {actionLabel}
      </Link>
    </View>
  );
}