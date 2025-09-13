// Main layout wrapper - MANDATORY design system compliance

import React, { useEffect, useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { Header } from "./Header.jsx";
import { ErrorBoundary } from "./ErrorBoundary.jsx";
import { UI_CONSTANTS } from "../../utils/constants.js";

export const Layout = ({ children, currentPage, appState }) => {
  const [scrollY, setScrollY] = useState(0);

  // Wagmi hooks for wallet state
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isCorrectNetwork = chainId === sepolia.id;

  // Track scroll position for dynamic background
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic background based on page and scroll
  const getBackgroundStyle = () => {
    const scrollProgress = Math.min(scrollY / 1000, 1); // Normalize to 0-1

    let baseColor = "#000000"; // Black
    let targetColor = "#004700"; // Green

    // Different color schemes for different pages
    switch (currentPage) {
      case UI_CONSTANTS.ROUTES.STAKE:
        targetColor = "#4B5320"; // Army green
        break;
      case UI_CONSTANTS.ROUTES.EMERGENCY:
        targetColor = "#8B0000"; // Dark red
        break;
      case UI_CONSTANTS.ROUTES.REWARDS:
        targetColor = "#006400"; // Dark green
        break;
      default:
        targetColor = "#004700"; // Default green
    }

    // Interpolate between colors based on scroll
    const r = Math.floor(
      parseInt(baseColor.slice(1, 3), 16) +
        (parseInt(targetColor.slice(1, 3), 16) -
          parseInt(baseColor.slice(1, 3), 16)) *
          scrollProgress
    );
    const g = Math.floor(
      parseInt(baseColor.slice(3, 5), 16) +
        (parseInt(targetColor.slice(3, 5), 16) -
          parseInt(baseColor.slice(3, 5), 16)) *
          scrollProgress
    );
    const b = Math.floor(
      parseInt(baseColor.slice(5, 7), 16) +
        (parseInt(targetColor.slice(5, 7), 16) -
          parseInt(baseColor.slice(5, 7), 16)) *
          scrollProgress
    );

    return {
      background: `linear-gradient(135deg, rgb(${r}, ${g}, ${b}) 0%, #000000 100%)`,
      transition: "background 0.3s ease-out",
    };
  };

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen font-gilbert text-white"
        style={getBackgroundStyle()}
      >
        {/* Fixed header with navigation */}
        <Header currentPage={currentPage} appState={appState} />

        {/* Main content area - Responsive */}
        <main className="min-h-screen pt-20 sm:pt-24 lg:pt-20">
          <div className="w-full max-w-full px-2 sm:px-4 lg:px-6">
            {children}
          </div>
        </main>

        {/* Notifications overlay - Responsive */}
        {appState?.notifications && appState.notifications.length > 0 && (
          <div className="fixed top-24 sm:top-28 lg:top-24 right-2 sm:right-4 z-50 space-y-2 max-w-[90vw] sm:max-w-sm">
            {appState.notifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  p-3 sm:p-4 border font-gilbert text-xs sm:text-sm
                  backdrop-blur-sm bg-opacity-95
                  ${
                    notification.type === "error"
                      ? "bg-dark-light border-red-500 text-red-400"
                      : notification.type === "success"
                      ? "bg-dark-light border-army-green text-army-green-lighter"
                      : "bg-dark-light border-army-green-light text-white"
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <span className="pr-3 sm:pr-4 break-words">
                    {notification.message}
                  </span>
                  <button
                    onClick={() => appState.removeNotification(notification.id)}
                    className="text-white hover:text-army-green-lighter flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Global loading overlay */}
        {appState?.globalLoading?.initialData && (
          <div className="fixed inset-0 bg-dark bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-dark-light border border-army-green p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-army-green border-t-transparent mx-auto mb-4"></div>
              <p className="font-gilbert text-army-green-lighter">
                Loading application data...
              </p>
            </div>
          </div>
        )}

        {/* Network warning */}
        {isConnected && !isCorrectNetwork && (
          <div className="fixed bottom-0 left-0 right-0 bg-red-900 border-t border-red-500 p-4 z-40">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div>
                <p className="font-gilbert text-red-200 font-bold">
                  Wrong Network Detected
                </p>
                <p className="font-gilbert text-red-300 text-sm">
                  Please switch to Sepolia testnet to use this application.
                </p>
              </div>
              <button
                onClick={() => switchChain?.({ chainId: sepolia.id })}
                className="bg-red-700 hover:bg-red-600 text-white font-gilbert px-6 py-2 border border-red-500"
              >
                Switch Network
              </button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
