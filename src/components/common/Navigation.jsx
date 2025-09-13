// Navigation menu component - MANDATORY routes

import React, { useState, useEffect, useRef } from "react";
import { UI_CONSTANTS } from "../../utils/constants.js";

export const Navigation = ({
  currentPage,
  onNavigate,
  isMobile = false,
  isWalletConnected = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigationItems = [
    { path: UI_CONSTANTS.ROUTES.HOME, label: "Home" },
    { path: UI_CONSTANTS.ROUTES.STAKE, label: "Stake" },
    { path: UI_CONSTANTS.ROUTES.REWARDS, label: "Rewards" },
    { path: UI_CONSTANTS.ROUTES.WITHDRAW, label: "Withdraw" },
    {
      path: UI_CONSTANTS.ROUTES.EMERGENCY,
      label: "Emergency",
      type: "emergency",
    },
    { path: UI_CONSTANTS.ROUTES.FAUCET, label: "Faucet", type: "special" },
    { path: UI_CONSTANTS.ROUTES.FAQ, label: "FAQ" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // For desktop when wallet is connected, show core items + dropdown for others
  const coreItems =
    isWalletConnected && !isMobile
      ? [
          { path: UI_CONSTANTS.ROUTES.HOME, label: "Home" },
          { path: UI_CONSTANTS.ROUTES.STAKE, label: "Stake" },
          { path: UI_CONSTANTS.ROUTES.REWARDS, label: "Rewards" },
          { path: UI_CONSTANTS.ROUTES.WITHDRAW, label: "Withdraw" },
        ]
      : navigationItems;

  const dropdownItems =
    isWalletConnected && !isMobile
      ? [
          {
            path: UI_CONSTANTS.ROUTES.EMERGENCY,
            label: "Emergency",
            type: "emergency",
          },
          {
            path: UI_CONSTANTS.ROUTES.FAUCET,
            label: "Faucet",
            type: "special",
          },
          { path: UI_CONSTANTS.ROUTES.FAQ, label: "FAQ" },
        ]
      : [];

  // When wallet is connected, use more compact styling
  const getButtonClasses = (item) => {
    const isActive = currentPage === item.path;
    const isCompactMode = isWalletConnected && !isMobile;

    // Special styling for Emergency button
    if (item.type === "emergency") {
      if (isMobile) {
        return `font-gilbert transition-colors w-full text-left px-3 py-3 border-l-2 mb-2 text-sm ${
          isActive
            ? "bg-red-900/30 text-red-400 border-red-500"
            : "bg-transparent text-red-400 border-transparent hover:bg-red-900/20"
        }`;
      }

      if (isCompactMode) {
        return `font-gilbert transition-all duration-200 ease-in-out border ${
          isActive
            ? "px-3 lg:px-4 py-2 text-sm lg:text-base bg-red-900 text-white border-red-500 scale-100"
            : "px-2 py-1.5 text-xs lg:text-sm bg-transparent text-red-400 border-red-600 hover:px-3 hover:py-2 hover:text-sm lg:hover:text-base hover:bg-red-900 hover:text-white hover:scale-100 scale-90"
        }`;
      }

      return `font-gilbert transition-colors px-3 lg:px-4 py-2 border text-sm lg:text-base ${
        isActive
          ? "bg-red-900 text-white border-red-500"
          : "bg-transparent text-red-400 border-red-600 hover:bg-red-900 hover:text-white"
      }`;
    }

    // Special styling for Faucet button
    if (item.type === "special") {
      if (isMobile) {
        return `font-gilbert transition-colors w-full text-left px-3 py-3 border-l-2 mb-2 text-sm ${
          isActive
            ? "bg-army-green-light/20 text-army-green-light border-army-green-light"
            : "bg-transparent text-army-green border-transparent hover:bg-army-green-light/20"
        }`;
      }

      if (isCompactMode) {
        return `font-gilbert transition-all duration-200 ease-in-out border ${
          isActive
            ? "px-3 lg:px-4 py-2 text-sm lg:text-base bg-army-green-light text-white border-army-green-light scale-100"
            : "px-2 py-1.5 text-xs lg:text-sm bg-transparent text-army-green border-army-green-light hover:px-3 hover:py-2 hover:text-sm lg:hover:text-base hover:bg-army-green-light hover:text-white hover:scale-100 scale-90"
        }`;
      }

      return `font-gilbert transition-colors px-3 lg:px-4 py-2 border text-sm lg:text-base ${
        isActive
          ? "bg-army-green-light text-white border-army-green-light"
          : "bg-transparent text-army-green border-army-green-light hover:bg-army-green-light hover:text-white"
      }`;
    }

    // Regular button styling
    if (isMobile) {
      return `font-gilbert transition-colors w-full text-left px-3 py-3 border-l-2 mb-2 text-sm ${
        isActive
          ? "bg-army-green/20 text-army-green border-army-green"
          : "bg-transparent text-army-green-lighter border-transparent hover:bg-army-green-light/20"
      }`;
    }

    // Desktop compact mode - smaller inactive tabs that expand on hover
    if (isCompactMode) {
      return `font-gilbert transition-all duration-200 ease-in-out border ${
        isActive
          ? "px-3 lg:px-4 py-2 text-sm lg:text-base bg-army-green text-white border-army-green scale-100"
          : "px-2 py-1.5 text-xs lg:text-sm bg-transparent text-army-green-lighter border-army-green-light hover:px-3 hover:py-2 hover:text-sm lg:hover:text-base hover:bg-army-green-light hover:text-white hover:scale-100 scale-90"
      }`;
    }

    // Desktop normal mode
    return `font-gilbert transition-colors px-3 lg:px-4 py-2 border text-sm lg:text-base ${
      isActive
        ? "bg-army-green text-white border-army-green"
        : "bg-transparent text-army-green-lighter border-army-green-light hover:bg-army-green-light hover:text-white"
    }`;
  };

  return (
    <nav
      className={
        isMobile
          ? "flex flex-col space-y-0"
          : "flex items-center gap-1 lg:gap-2"
      }
    >
      {/* Core navigation items */}
      <div
        className={isMobile ? "flex flex-col space-y-0" : "flex gap-1 lg:gap-2"}
      >
        {coreItems.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate?.(item.path)}
            className={getButtonClasses(item)}
            title={
              item.type === "emergency"
                ? "Emergency Withdrawal (30% penalty)"
                : undefined
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Dropdown for additional items (desktop with wallet connected) */}
      {dropdownItems.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`font-gilbert transition-colors px-2 py-1.5 border text-xs lg:text-sm ${
              dropdownItems.some((item) => item.path === currentPage)
                ? "bg-army-green text-white border-army-green"
                : "bg-transparent text-army-green-lighter border-army-green-light hover:bg-army-green-light hover:text-white"
            }`}
          >
            ⋯
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-dark-light border border-army-green-light shadow-lg min-w-[120px] z-50">
              {dropdownItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate?.(item.path);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm font-gilbert transition-colors ${
                    currentPage === item.path
                      ? item.type === "emergency"
                        ? "bg-red-900/30 text-red-400"
                        : item.type === "special"
                        ? "bg-army-green-light/20 text-army-green-light"
                        : "bg-army-green/20 text-army-green"
                      : item.type === "emergency"
                      ? "text-red-400 hover:bg-red-900/20"
                      : item.type === "special"
                      ? "text-army-green hover:bg-army-green-light/20"
                      : "text-army-green-lighter hover:bg-army-green-light/20"
                  }`}
                  title={
                    item.type === "emergency"
                      ? "Emergency Withdrawal (30% penalty)"
                      : undefined
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
