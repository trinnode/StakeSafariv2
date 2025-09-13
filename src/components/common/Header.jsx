import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId } from "wagmi";
import { sepolia } from "wagmi/chains";
// Navigation header - MANDATORY on all pages

import React, { useState } from "react";
// import { WalletConnect } from "./WalletConnect.jsx";
import { Navigation } from "./Navigation.jsx";
import { formatTokenAmount } from "../../utils/formatters.js";

export const Header = ({ currentPage, appState }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Wagmi hooks for wallet state
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const isCorrectNetwork = chainId === sepolia.id;

  return (
    <header className="fixed top-0 left-0 right-0 backdrop-blur-md bg-black/70 border-b border-army-green/30 z-30">
      <div className="w-full px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between min-h-[3rem]">
          {/* Logo/Brand - Left side */}
          <div
            onClick={() => appState?.navigateTo?.("/")}
            className="cursor-pointer flex-shrink-0 flex items-center space-x-2 sm:space-x-3 max-w-[40%] md:max-w-none"
          >
            <img
              src="/StakeSafi.png"
              alt="StakeSafari Logo"
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="font-gilbert text-sm sm:text-lg md:text-xl font-bold text-army-green-lighter truncate">
                StakeSafari
              </h1>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative flex flex-col justify-center items-center w-8 h-8 p-1"
            aria-label="Toggle mobile menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : "translate-y-0"
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out my-1 ${
                isMobileMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : "translate-y-0"
              }`}
            />
          </button>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex flex-1 justify-center min-w-0 mx-4">
            <Navigation
              currentPage={currentPage}
              onNavigate={appState?.navigateTo}
              isWalletConnected={isConnected}
            />
          </div>

          {/* Wallet & Balance - Right side (Desktop) */}
          <div className="hidden md:flex items-center space-x-2 flex-shrink-0 min-w-0">
            {/* Token Balance Display */}
            {isConnected && (
              <div className="text-right min-w-0 max-w-[120px]">
                <div className="font-gilbert text-xs text-army-green-lighter">
                  Balance
                </div>
                <div className="font-gilbert text-xs font-bold text-white truncate">
                  {formatTokenAmount(
                    appState?.userData?.tokenBalance || BigInt(0)
                  )}{" "}
                  tNODE
                </div>
              </div>
            )}

            {/* Network Indicator */}
            {isConnected && (
              <div className="text-center min-w-0 max-w-[80px]">
                <div className="font-gilbert text-xs text-army-green-lighter">
                  Network
                </div>
                <div
                  className={`font-gilbert text-xs font-bold truncate ${
                    isCorrectNetwork ? "text-army-green" : "text-red-400"
                  }`}
                >
                  {isCorrectNetwork ? "Sepolia" : "Wrong"}
                </div>
              </div>
            )}

            {/* Wallet Connection */}
            <div className="flex-shrink-0">
              <ConnectButton showBalance={false} />
            </div>
          </div>

          {/* Wallet Connect Button (Mobile Only) */}
          <div className="md:hidden">
            <ConnectButton showBalance={false} />
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100 mt-4 border-t border-army-green/30 pt-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          {/* Mobile Navigation */}
          <Navigation
            currentPage={currentPage}
            onNavigate={(path) => {
              appState?.navigateTo(path);
              setIsMobileMenuOpen(false);
            }}
            isMobile={true}
          />

          {/* Mobile Wallet Info */}
          {isConnected && (
            <div className="mt-4 pt-4 border-t border-army-green/30">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="font-gilbert text-xs text-army-green-lighter">
                    Balance
                  </div>
                  <div className="font-gilbert text-sm font-bold text-white">
                    {formatTokenAmount(
                      appState?.userData?.tokenBalance || BigInt(0)
                    )}{" "}
                    tNODE
                  </div>
                </div>
                <div>
                  <div className="font-gilbert text-xs text-army-green-lighter">
                    Network
                  </div>
                  <div
                    className={`font-gilbert text-sm font-bold ${
                      isCorrectNetwork ? "text-army-green" : "text-red-400"
                    }`}
                  >
                    {isCorrectNetwork ? "Sepolia" : "Wrong Network"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
