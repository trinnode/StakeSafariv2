// RainbowKit configuration for StakeSafari

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "StakeSafari",
  projectId: "2f5ba7a2e4b9bb8db62c4ae4d5bc6d1f", // Demo project ID - you should get your own from WalletConnect Cloud
  chains: [sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

// Custom theme for StakeSafari
export const customTheme = {
  blurs: {
    modalOverlay: "blur(4px)",
  },
  colors: {
    accentColor: "#4ade80", // army-green
    accentColorForeground: "#000000",
    actionButtonBorder: "#374151",
    actionButtonBorderMobile: "#374151",
    actionButtonSecondaryBackground: "#1f2937",
    closeButton: "#9ca3af",
    closeButtonBackground: "#374151",
    connectButtonBackground: "#1f2937",
    connectButtonBackgroundError: "#ef4444",
    connectButtonInnerBackground: "#111827",
    connectButtonText: "#ffffff",
    connectButtonTextError: "#ffffff",
    connectionIndicator: "#4ade80",
    downloadBottomCardBackground: "#1f2937",
    downloadTopCardBackground: "#111827",
    error: "#ef4444",
    generalBorder: "#374151",
    generalBorderDim: "#1f2937",
    menuItemBackground: "#1f2937",
    modalBackdrop: "rgba(0, 0, 0, 0.8)",
    modalBackground: "#111827",
    modalBorder: "#374151",
    modalText: "#ffffff",
    modalTextDim: "#9ca3af",
    modalTextSecondary: "#d1d5db",
    profileAction: "#1f2937",
    profileActionHover: "#374151",
    profileForeground: "#111827",
    selectedOptionBorder: "#4ade80",
    standby: "#fbbf24",
  },
  fonts: {
    body: "Gilbert, system-ui, sans-serif",
  },
  radii: {
    actionButton: "8px",
    connectButton: "8px",
    menuButton: "8px",
    modal: "12px",
    modalMobile: "12px",
  },
};
