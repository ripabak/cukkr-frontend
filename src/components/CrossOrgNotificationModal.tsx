import { useI18nContext } from "@/src/lib/i18n/provider";
import React from "react";
import { ConfirmationModal } from "./ConfirmationModal";

interface Props {
  visible: boolean;
  organizationName: string;
  onSwitch: () => void;
  onDismiss: () => void;
}

export function CrossOrgNotificationModal({
  visible,
  organizationName,
  onSwitch,
  onDismiss,
}: Props) {
  const { t } = useI18nContext();
  return (
    <ConfirmationModal
      visible={visible}
      icon="swap-horizontal"
      title={t("notifications.crossOrgTitle", { name: organizationName })}
      description={t("notifications.crossOrgDesc")}
      cancelLabel={t("notifications.switch")}
      confirmLabel={t("notifications.stayHere")}
      onCancel={onSwitch}
      onConfirm={onDismiss}
    />
  );
}
