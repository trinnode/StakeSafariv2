// Loading spinner component - MANDATORY for all loading states

import React from "react";

export const LoadingSpinner = ({ size = "md", text = "", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      {/* Army green spinner with flat design */}
      <div
        className={`
          animate-spin border-2 border-army-green border-t-transparent
          ${sizeClasses[size]}
        `}
      />

      {/* Loading text */}
      {text && (
        <p className="font-gilbert text-army-green-lighter text-sm text-center">
          {text}
        </p>
      )}
    </div>
  );
};

// Loading states for different actions
export const StakingSpinner = () => (
  <LoadingSpinner
    size="lg"
    text="Processing staking transaction..."
    className="py-8"
  />
);

export const ApprovalSpinner = () => (
  <LoadingSpinner size="md" text="Approving tokens..." className="py-4" />
);

export const WithdrawalSpinner = () => (
  <LoadingSpinner size="lg" text="Processing withdrawal..." className="py-8" />
);

export const RewardsSpinner = () => (
  <LoadingSpinner size="md" text="Claiming rewards..." className="py-4" />
);

export const EmergencySpinner = () => (
  <LoadingSpinner
    size="lg"
    text="Processing emergency withdrawal..."
    className="py-8"
  />
);

export const MintSpinner = () => (
  <LoadingSpinner size="md" text="Minting tokens..." className="py-4" />
);
