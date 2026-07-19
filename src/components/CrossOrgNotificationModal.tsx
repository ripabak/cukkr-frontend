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
  return (
    <ConfirmationModal
      visible={visible}
      icon="swap-horizontal"
      title={`Notification from ${organizationName}`}
      description="You have a new notification in another barbershop."
      cancelLabel="Switch"
      confirmLabel="Stay here"
      onCancel={onSwitch}
      onConfirm={onDismiss}
    />
  );
}
