import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa_install_banner_dismissed';

function isRunningStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  const isWeb = Platform.OS === 'web';
  const isIOS = isWeb && isIOSDevice();

  useEffect(() => {
    if (!isWeb) return;

    if (isRunningStandalone()) {
      setIsInstalled(true);
      return;
    }

    const dismissed = localStorage.getItem(DISMISSED_KEY) === '1';
    if (dismissed) setIsDismissed(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [isWeb]);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    setIsDismissed(true);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DISMISSED_KEY, '1');
    }
  };

  const showBanner =
    isWeb &&
    !isInstalled &&
    !isDismissed &&
    (!!deferredPrompt || isIOS);

  return {
    showBanner,
    isIOS,
    promptInstall,
    dismiss,
    showIOSModal,
    openIOSModal: () => setShowIOSModal(true),
    closeIOSModal: () => setShowIOSModal(false),
  };
}
