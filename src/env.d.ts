/// <reference types="astro/client" />

interface Window {
  [key: `ga-disable-${string}`]: boolean | undefined;
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
}
