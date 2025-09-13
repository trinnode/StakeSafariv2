// Rewards claiming interface - MANDATORY reward claiming

import React, { useState, useEffect, useCallback } from "react";
import { LoadingSpinner } from "../../common/LoadingSpinner.jsx";
import { formatTokenAmount } from "../../../utils/formatters.js";

export const RewardsInterface = ({ appState }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [claimedAmount, setClaimedAmount] = useState(BigInt(0));

  // Helper function to safely convert to BigInt
  const safeToBigInt = (value) => {
    if (value === null || value === undefined) return BigInt(0);
    if (typeof value === "bigint") return value;
    if (typeof value === "string" || typeof value === "number") {
      try {
        return BigInt(value);
      } catch {
        return BigInt(0);
      }
    }
    return BigInt(0);
  };

  // Helper function to safely compare with BigInt
  const safeCompareBigInt = useCallback((value, comparison) => {
    try {
      const bigIntValue = safeToBigInt(value);
      return bigIntValue > comparison;
    } catch {
      return false;
    }
  }, []);

  // Handle rewards claiming
  const handleClaimRewards = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await appState.contractFunctions.claimRewards();

      if (result && result.hash) {
        setClaimedAmount(appState.userData.pendingRewards);
        setTxHash(result.hash);
        setShowSuccess(true);

        // Refresh user data
        appState.refresh();
      } else {
        setError("Reward claiming transaction failed");
      }
    } catch (error) {
      console.error("Claim rewards error:", error);
      setError(error.message || "Failed to claim rewards");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setShowSuccess(false);
    setTxHash("");
    setError("");
    setClaimedAmount(BigInt(0));
  };

  // Auto-update rewards every 10 seconds
  useEffect(() => {
    if (
      !appState.isConnected ||
      !appState.userData.stakedAmount ||
      safeCompareBigInt(appState.userData.stakedAmount, BigInt(0)) === false
    ) {
      return;
    }

    const updateRewards = async () => {
      try {
        // Refresh pending rewards without triggering notifications
        if (appState.contractFunctions?.getPendingRewards) {
          await appState.contractFunctions.getPendingRewards();
        }
      } catch (error) {
        console.error("Failed to update rewards:", error);
      }
    };

    // Update immediately
    updateRewards();

    // Set up interval
    const interval = setInterval(updateRewards, 10000);

    return () => clearInterval(interval);
  }, [
    appState.isConnected,
    appState.userData.stakedAmount,
    appState.contractFunctions,
    safeCompareBigInt,
  ]);

  if (showSuccess) {
    return (
      <div className="bg-army-green bg-opacity-10 border border-army-green p-8 text-center">
        <div className="w-24 h-24 border-2 border-army-green mx-auto mb-6 flex items-center justify-center bg-army-green">
          <span className="font-gilbert text-4xl text-white">✓</span>
        </div>
        <h2 className="font-gilbert text-2xl font-bold text-army-green mb-4">
          Rewards Claimed Successfully!
        </h2>
        <p className="font-gilbert text-army-green-lighter mb-6">
          Your rewards have been transferred to your wallet
        </p>
        <div className="bg-dark border border-army-green p-6 mb-6">
          <p className="font-gilbert text-army-green-lighter mb-2">
            Rewards Claimed:
          </p>
          <p className="font-gilbert text-army-green font-bold text-3xl">
            {formatTokenAmount(claimedAmount)} STAKE
          </p>
          {txHash && typeof txHash === "string" && (
            <p className="font-gilbert text-army-green-lighter text-sm mt-4">
              Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </p>
          )}
        </div>
        <button
          onClick={resetForm}
          className="font-gilbert px-8 py-3 bg-army-green text-white border border-army-green hover:bg-army-green-light"
        >
          Continue Staking
        </button>
      </div>
    );
  }

  return (
    <div className="bg-dark-light border border-army-green p-8">
      <h2 className="font-gilbert text-2xl font-bold text-army-green mb-6">
        Claim Your Rewards
      </h2>

      {/* Rewards Summary */}
      <div className="bg-army-green bg-opacity-10 border border-army-green p-6 mb-6">
        <h3 className="font-gilbert text-xl font-bold text-army-green mb-4">
          Available Rewards
        </h3>
        <div className="text-center">
          <p className="font-gilbert text-army-green-lighter mb-2">
            Pending Rewards:
          </p>
          <p className="font-gilbert text-army-green font-bold text-4xl mb-4">
            {formatTokenAmount(safeToBigInt(appState.userData.pendingRewards))}{" "}
            STAKE
          </p>
          <p className="font-gilbert text-army-green-lighter text-sm">
            ≈ $
            {(() => {
              try {
                const pendingRewards = safeToBigInt(
                  appState.userData.pendingRewards
                );
                return (
                  Number(formatTokenAmount(pendingRewards)) * 1.0
                ).toFixed(2);
              } catch {
                return "0.00";
              }
            })()}{" "}
            USD
          </p>
        </div>
      </div>

      {/* Staking Position Overview */}
      <div className="bg-dark border border-army-green-light p-6 mb-6">
        <h3 className="font-gilbert text-lg font-bold text-army-green-lighter mb-4">
          Your Staking Position
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-gilbert text-army-green-lighter mb-1">
              Staked Amount:
            </p>
            <p className="font-gilbert text-army-green font-bold text-xl">
              {formatTokenAmount(safeToBigInt(appState.userData.stakedAmount))}{" "}
              STAKE
            </p>
          </div>
          <div>
            <p className="font-gilbert text-army-green-lighter mb-1">
              Stake Duration:
            </p>
            <p className="font-gilbert text-army-green font-bold text-xl">
              {appState.userData.stakeTimestamp > 0
                ? Math.floor(
                    (Date.now() / 1000 - appState.userData.stakeTimestamp) /
                      (24 * 60 * 60)
                  )
                : 0}{" "}
              days
            </p>
          </div>
          <div>
            <p className="font-gilbert text-army-green-lighter mb-1">
              Daily Rewards:
            </p>
            <p className="font-gilbert text-army-green font-bold text-xl">
              {appState.userData.stakeTimestamp > 0 &&
              safeCompareBigInt(appState.userData.pendingRewards, BigInt(0))
                ? (
                    Number(
                      formatTokenAmount(
                        safeToBigInt(appState.userData.pendingRewards)
                      )
                    ) /
                    Math.max(
                      1,
                      Math.floor(
                        (Date.now() / 1000 - appState.userData.stakeTimestamp) /
                          (24 * 60 * 60)
                      )
                    )
                  ).toFixed(4)
                : "0.0000"}{" "}
              STAKE
            </p>
          </div>
          <div>
            <p className="font-gilbert text-army-green-lighter mb-1">
              Total Earned:
            </p>
            <p className="font-gilbert text-army-green font-bold text-xl">
              {(() => {
                try {
                  const totalClaimed = safeToBigInt(
                    appState.userData.totalRewardsClaimed
                  );
                  const pending = safeToBigInt(
                    appState.userData.pendingRewards
                  );
                  return formatTokenAmount(totalClaimed + pending);
                } catch (error) {
                  console.error("Error calculating total earned:", error);
                  return "0";
                }
              })()}{" "}
              STAKE
            </p>
          </div>
        </div>
      </div>

      {/* Claim Information */}
      <div className="bg-dark border border-army-green-light p-6 mb-6">
        <h3 className="font-gilbert text-lg font-bold text-army-green-lighter mb-4">
          📋 Claiming Information
        </h3>
        <div className="space-y-2 font-gilbert text-army-green-lighter text-sm">
          <p>• Claiming rewards does not affect your staked balance</p>
          <p>
            • Rewards are calculated based on your staking duration and amount
          </p>
          <p>• Gas fees apply for the claiming transaction</p>
          <p>• Claimed rewards are immediately available in your wallet</p>
          <p>• You can claim rewards as often as you like</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 border border-red-500 p-4 mb-6">
          <p className="text-red-400 font-gilbert">{error}</p>
        </div>
      )}

      {/* Claim Button */}
      <button
        onClick={handleClaimRewards}
        disabled={
          isLoading ||
          !safeCompareBigInt(appState.userData.pendingRewards, BigInt(0))
        }
        className="w-full font-gilbert px-8 py-4 bg-army-green text-white border border-army-green hover:bg-army-green-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
      >
        {isLoading && <LoadingSpinner size="small" />}
        {isLoading ? "Claiming Rewards..." : "Claim Rewards"}
      </button>

      {/* Additional Actions */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => appState.navigateTo("/staking")}
          className="flex-1 font-gilbert px-6 py-3 border border-army-green-light text-army-green-lighter hover:bg-army-green-light hover:text-white"
        >
          Stake More Tokens
        </button>
        <button
          onClick={() => appState.refresh()}
          className="flex-1 font-gilbert px-6 py-3 border border-army-green-light text-army-green-lighter hover:bg-army-green-light hover:text-white"
        >
          Refresh Data
        </button>
      </div>

      {/* Pro Tip */}
      <div className="mt-6 bg-army-green bg-opacity-10 border border-army-green p-4">
        <h4 className="font-gilbert font-bold text-army-green mb-2">
          💡 Pro Tip
        </h4>
        <p className="font-gilbert text-army-green-lighter text-sm">
          You can compound your rewards by claiming them and then staking the
          claimed tokens to earn even more rewards!
        </p>
      </div>
    </div>
  );
};
