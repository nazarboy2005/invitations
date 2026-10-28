interface Window {
  Telegram?: {
    WebApp?: {
      initData?: string;
      platform?: string;
      isVersionAtLeast?: (version: string) => boolean;
      openLink?: (url: string) => void;
      ready?: () => void;
      expand?: () => void;
    };
  };
}
