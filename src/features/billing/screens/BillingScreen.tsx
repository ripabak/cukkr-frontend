import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { AppText } from "@/src/components/AppText";
import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import { usePlans, useSubscription, usePayments } from "../hooks";
import { PAYMENT_GROUPS, PAYMENT_METHODS } from "../methods";
import { billingService, type PlanDto } from "../services";
import { formatIDR } from "../utils/format";

// Channels the backend currently accepts (see billing ENABLED_PAYMENT_METHODS).
// Only QRIS is open in the sandbox MVP — expand here + in backend to enable more.
const ENABLED_METHOD_IDS = ["qris"];

export function BillingScreen() {
  const { t, language } = useI18nContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  // Preselect dari handoff landing: /d/billing?plan=premium|business
  const { plan: preselectedPlan } = useLocalSearchParams<{ plan?: string }>();
  const {
    data: plans,
    isLoading: plansLoading,
    error: plansError,
  } = usePlans();
  const { data: subscription } = useSubscription();
  const { data: payments } = usePayments();

  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    preselectedPlan === "premium" || preselectedPlan === "business"
      ? preselectedPlan
      : "premium"
  );
  const [methodId, setMethodId] = useState<string>("qris");
  const [submitting, setSubmitting] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [payError, setPayError] = useState<{ title: string; body: string } | null>(
    null
  );

  const methods = useMemo(
    () => PAYMENT_METHODS.filter((m) => ENABLED_METHOD_IDS.includes(m.id)),
    []
  );
  const groups = useMemo(
    () => PAYMENT_GROUPS.filter((g) => methods.some((m) => m.group === g)),
    [methods]
  );

  const activePlanId = subscription?.planId ?? "free";
  const activePlan = plans?.find((p) => p.id === activePlanId);
  const selectedPlan = plans?.find((p) => p.id === selectedPlanId);
  const isPaidPlan =
    !!selectedPlan && selectedPlan.id !== "free" && !selectedPlan.requiresContact;
  const isContactPlan = !!selectedPlan && selectedPlan.requiresContact;
  const selectedPlanPrice = selectedPlan ? formatIDR(selectedPlan.price) : "";
  const isSubscribed = subscription?.status === "active";
  const pendingPayments =
    payments?.filter((p) => p.status === "pending" && p.invoiceUrl) ?? [];

  const planBadge = (plan: PlanDto) => t(`billing.planCopy.${plan.id}.badge`);
  const planDesc = (plan: PlanDto) => t(`billing.planCopy.${plan.id}.desc`);
  const featureLabel = (key: string) => t(`billing.features.${key}`);

  const formatDate = (iso: string | null) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handlePay = async () => {
    if (!selectedPlan || selectedPlan.id === "free" || submitting) return;
    setSubmitting(true);
    try {
      const checkout = await billingService.startCheckout(
        selectedPlan.id as "premium" | "business",
        methodId.toUpperCase()
      );
      // Open the Xendit-hosted payment page (QRIS sandbox).
      await Linking.openURL(checkout.invoiceUrl);
      // The webhook will flip the subscription server-side; refresh when the
      // user comes back or closes the pending dialog.
      queryClient.invalidateQueries({ queryKey: ["billing", "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["billing", "payments"] });
      setShowPending(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Payment could not be processed";
      // Backend reports "not configured" when XENDIT_SECRET_API_KEY is missing.
      const notConfigured = message.includes("XENDIT_SECRET_API_KEY");
      setPayError(
        notConfigured
          ? { title: t("billing.unavailableTitle"), body: t("billing.unavailableBody") }
          : { title: t("billing.payFailedTitle"), body: message }
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (plansLoading) {
    return (
      <ScreenShell
        backgroundColor={Colors.bg.default}
        contentStyle={{ justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={Colors.text.primary} />
      </ScreenShell>
    );
  }

  if (plansError || !plans) {
    return (
      <ScreenShell
        hideAppHeader
        headerSlot={
          <ScreenHeader title={t("billing.title")} onBack={() => router.back()} />
        }
        backgroundColor={Colors.bg.default}
        contentStyle={{ justifyContent: "center", alignItems: "center", gap: 12 }}
      >
        <AppText style={styles.errorText}>{t("billing.loadFailed")}</AppText>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      hideAppHeader
      headerSlot={
        <ScreenHeader title={t("billing.title")} onBack={() => router.back()} />
      }
      backgroundColor={Colors.bg.default}
      contentStyle={{ paddingTop: 20, gap: 12 }}
    >
      {/* Current plan banner — from the live subscription, not hardcoded */}
      {activePlan ? (
        <View style={[styles.currentPlanCard, Neu.soft(Colors.brand.primarySurface)]}>
          <View style={styles.currentPlanRow}>
            <View style={styles.currentPlanIcon}>
              <Ionicons name="sparkles" size={16} color={Colors.brand.primaryDark} />
            </View>
            <View style={styles.currentPlanText}>
              <AppText style={styles.currentPlanLabel}>
                {isSubscribed ? t("billing.currentLabel") : t("profile.plan")}
              </AppText>
              <AppText style={styles.currentPlanName}>{activePlan.name}</AppText>
              {isSubscribed && subscription?.currentPeriodEnd ? (
                <AppText style={styles.currentPlanExpiry}>
                  {t("billing.expiresAt")}:{" "}
                  {formatDate(subscription.currentPeriodEnd)}
                </AppText>
              ) : null}
            </View>
          </View>
        </View>
      ) : null}

      {/* Pending invoices — tagihan yang belum dibayar, bisa dilanjutkan */}
      {pendingPayments.length > 0 ? (
        <>
          <AppText style={styles.sectionLabel}>{t("billing.unpaidTitle")}</AppText>
          {pendingPayments.map((p) => {
            const planName =
              plans?.find((pl) => pl.id === p.planId)?.name ?? p.planId;
            return (
              <View
                key={p.id}
                style={[styles.pendingCard, Neu.raised(Colors.bg.surface)]}
              >
                <View style={styles.pendingRow}>
                  <View style={styles.pendingInfo}>
                    <AppText style={styles.pendingPlan}>{planName}</AppText>
                    <AppText style={styles.pendingMeta}>
                      {formatIDR(p.amount)} · {t("billing.expiresAt")}:{" "}
                      {formatDate(p.expiresAt)}
                    </AppText>
                  </View>
                  <Pressable
                    style={styles.pendingButton}
                    onPress={() => {
                      if (p.invoiceUrl) void Linking.openURL(p.invoiceUrl);
                    }}
                  >
                    <AppText style={styles.pendingButtonText}>
                      {t("billing.continuePay")}
                    </AppText>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </>
      ) : null}

      <AppText style={styles.sectionLabel}>{t("billing.choosePlan")}</AppText>

      {/* Plan cards */}
      {plans.map((plan) => {
        const isCurrent = plan.id === activePlanId;
        const selected = plan.id === selectedPlanId;
        const popular = plan.id === "premium";
        const price = formatIDR(plan.price);
        return (
          <Pressable
            key={plan.id}
            disabled={isCurrent}
            onPress={() => {
              setSelectedPlanId(plan.id);
            }}
            style={[
              styles.planCard,
              Neu.raised(Colors.bg.surface),
              selected && styles.planCardSelected,
              isCurrent && styles.planCardDisabled,
            ]}
          >
            <View style={styles.planCardHeader}>
              <View style={styles.planCardTitles}>
                {planBadge(plan) !== `billing.planCopy.${plan.id}.badge` ? (
                  <AppText style={[styles.planBadge, selected && styles.planBadgeSelected]}>
                    {planBadge(plan)}
                  </AppText>
                ) : null}
                <View style={styles.planNameRow}>
                  <AppText style={styles.planName}>{plan.name}</AppText>
                  {isCurrent ? (
                    <View style={styles.currentBadge}>
                      <AppText style={styles.currentBadgeText}>{t("billing.currentLabel")}</AppText>
                    </View>
                  ) : popular ? (
                    <View style={[styles.currentBadge, styles.popularBadge]}>
                      <AppText style={[styles.currentBadgeText, styles.popularBadgeText]}>
                        {t("billing.popular")}
                      </AppText>
                    </View>
                  ) : null}
                </View>
                <View style={styles.priceRow}>
                  <AppText style={styles.planPrice}>{price}</AppText>
                  <AppText style={styles.planMonthly}>{t("billing.monthly")}</AppText>
                </View>
                <AppText style={styles.planDesc}>{planDesc(plan)}</AppText>
              </View>
              {!isCurrent ? (
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected ? <View style={styles.radioDot} /> : null}
                </View>
              ) : (
                <View style={styles.radio}>
                  <Ionicons name="checkmark" size={14} color={Colors.brand.primaryDark} />
                </View>
              )}
            </View>

            {/* Features of the selected plan */}
            {selected && !isCurrent ? (
              <View style={styles.featuresBox}>
                <AppText style={styles.featuresLabel}>{t("billing.planFeatures")}</AppText>
                {plan.features.map((key) => (
                  <View key={key} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.brand.primaryDark} />
                    <AppText style={styles.featureText}>{featureLabel(key)}</AppText>
                  </View>
                ))}
              </View>
            ) : null}
          </Pressable>
        );
      })}

      {/* Plan enterprise — tidak bisa bayar langsung, hubungi tim Cukkr */}
      {isContactPlan && selectedPlan ? (
        <View style={[styles.contactCard, Neu.raised(Colors.bg.surface)]}>
          <AppText style={styles.contactTitle}>
            {t("billing.contactPlanTitle")}
          </AppText>
          <AppText style={styles.contactBody}>
            {t("billing.contactPlanBody")}
          </AppText>
          <Pressable
            style={styles.contactButton}
            onPress={() =>
              Linking.openURL(
                "mailto:hello@cukkr.com?subject=" +
                  encodeURIComponent("Business Plan Cukkr")
              )
            }
          >
            <AppText style={styles.contactButtonText}>
              {t("billing.contactCta")}
            </AppText>
          </Pressable>
        </View>
      ) : null}

      {/* Checkout section for paid plans */}
      {isPaidPlan && selectedPlan ? (
        <>
          <AppText style={styles.sectionLabel}>{t("billing.paymentHeading")}</AppText>
          <AppText style={styles.paymentNote}>{t("billing.paymentNote")}</AppText>

          {groups.map((group) => (
            <View key={group} style={styles.methodGroup}>
              <AppText style={styles.methodGroupLabel}>{t(`billing.groups.${group}`)}</AppText>
              <View style={styles.methodGrid}>
                {methods
                  .filter((m) => m.group === group)
                  .map((m) => {
                    const active = m.id === methodId;
                    return (
                      <Pressable
                        key={m.id}
                        onPress={() => setMethodId(m.id)}
                        style={[
                          styles.methodCard,
                          Neu.raised(Colors.bg.surface),
                          active && styles.methodCardActive,
                        ]}
                      >
                        <AppText style={[styles.methodName, active && styles.methodNameActive]}>
                          {m.name}
                        </AppText>
                        <View style={[styles.radio, active && styles.radioSelected]}>
                          {active ? <View style={styles.radioDot} /> : null}
                        </View>
                      </Pressable>
                    );
                  })}
              </View>
            </View>
          ))}

          {/* Order summary */}
          <View style={[styles.summaryCard, Neu.raised(Colors.bg.surface)]}>
            <View style={styles.summaryRow}>
              <AppText style={styles.summaryLabel}>Cukkr {selectedPlan.name}</AppText>
              <AppText style={styles.summaryValue}>
                {selectedPlanPrice}
                <AppText style={styles.summaryMonthly}>{t("billing.monthly")}</AppText>
              </AppText>
            </View>
            <View style={styles.summaryRow}>
              <AppText style={styles.summaryLabel}>{t("billing.billingCycle")}</AppText>
              <AppText style={styles.summaryValue}>{t("billing.monthlyCycle")}</AppText>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotalRow]}>
              <AppText style={styles.summaryTotalLabel}>{t("billing.total")}</AppText>
              <AppText style={styles.summaryTotalValue}>
                {selectedPlanPrice}
                <AppText style={styles.summaryMonthly}>{t("billing.monthly")}</AppText>
              </AppText>
            </View>
            <AppText style={styles.taxNote}>{t("billing.taxIncluded")}</AppText>
          </View>

          <PrimaryButton
            label={submitting ? "…" : t("billing.payNow")}
            disabled={submitting}
            onPress={handlePay}
          />

          <AppText style={styles.planNote}>{t("billing.planNote")}</AppText>
        </>
      ) : null}

      {/* Awaiting payment — invoice URL already opened */}
      <ConfirmationModal
        visible={showPending}
        icon="time-outline"
        title={t("billing.pendingTitle")}
        description={t("billing.pendingBody")}
        confirmLabel={t("common.ok")}
        onConfirm={() => {
          setShowPending(false);
          queryClient.invalidateQueries({ queryKey: ["billing", "subscription"] });
          queryClient.invalidateQueries({ queryKey: ["billing", "payments"] });
        }}
      />

      {/* Payment error / gateway not configured */}
      <ConfirmationModal
        visible={!!payError}
        icon="alert-circle-outline"
        title={payError?.title ?? ""}
        description={payError?.body ?? ""}
        confirmLabel={t("common.ok")}
        onConfirm={() => setPayError(null)}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  currentPlanCard: {
    borderRadius: 20,
    padding: 16,
  },
  currentPlanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  currentPlanIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  currentPlanText: {
    flex: 1,
  },
  currentPlanLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  currentPlanName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  currentPlanExpiry: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  pendingCard: {
    borderRadius: 16,
    padding: 14,
  },
  pendingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  pendingInfo: {
    flex: 1,
    gap: 2,
  },
  pendingPlan: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  pendingMeta: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  pendingButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: Colors.brand.primary,
  },
  pendingButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  contactCard: {
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  contactBody: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.text.secondary,
  },
  contactButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.brand.primary,
  },
  contactButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.secondary,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  planCard: {
    borderRadius: 20,
    padding: 18,
    gap: 4,
  },
  planCardSelected: {
    borderWidth: 2,
    borderColor: Colors.brand.primary,
    padding: 16,
  },
  planCardDisabled: {
    opacity: 0.85,
  },
  planCardHeader: {
    flexDirection: "row",
    gap: 12,
  },
  planCardTitles: {
    flex: 1,
    gap: 4,
  },
  planBadge: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  planBadgeSelected: {
    color: Colors.brand.primaryDark,
  },
  planNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: Colors.bg.surface,
  },
  popularBadge: {
    backgroundColor: Colors.brand.primary,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  popularBadgeText: {
    color: Colors.text.primary,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  planPrice: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text.primary,
  },
  planMonthly: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  planDesc: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 19,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: Colors.brand.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.brand.primary,
  },
  featuresBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    gap: 8,
  },
  featuresLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: Colors.text.primary,
    flex: 1,
  },
  paymentNote: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: -6,
  },
  methodGroup: {
    gap: 8,
  },
  methodGroupLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  methodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    minWidth: 130,
    flexGrow: 1,
  },
  methodCardActive: {
    borderWidth: 2,
    borderColor: Colors.brand.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  methodName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  methodNameActive: {
    color: Colors.brand.primaryDark,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 18,
    gap: 10,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  summaryMonthly: {
    fontSize: 11,
    fontWeight: "400",
    color: Colors.text.secondary,
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: 10,
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text.primary,
  },
  taxNote: {
    fontSize: 11,
    color: Colors.text.muted,
  },
  planNote: {
    fontSize: 12,
    color: Colors.text.muted,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.status.danger,
    textAlign: "center",
  },
});