import type { PropsWithChildren, ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

type AuthScreenShellProps = PropsWithChildren<{
  title: string;
  description: string;
  footer?: ReactNode;
}>;

export function AuthScreenShell({
  children,
  description,
  footer,
  title,
}: AuthScreenShellProps) {
  return (
    <View className="flex-1 bg-[#63B476]">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", default: undefined })}
        className="flex-1"
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-[420px] self-center bg-[#F4F2E7] rounded-[32px] px-[32px] py-[40px]">
            <View className="gap-[12px] mb-[32px]">
              <Text className="text-[#2F3A2F] text-[34px] font-extrabold text-center">{title}</Text>
              <Text className="text-[#6E766C] text-[14px] leading-5 text-center">{description}</Text>
            </View>

            <View className="gap-[16px]">{children}</View>

            {footer ? <View className="mt-[24px]">{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}