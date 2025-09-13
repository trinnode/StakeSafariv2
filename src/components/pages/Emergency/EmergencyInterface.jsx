// Emergency withdrawal interface - MANDATORY penalty calculator

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { LoadingSpinner } from "../../common/LoadingSpinner.jsx";
import {
  formatTokenAmount,
  parseTokenAmount,
  isValidAmount,
} from "../../../utils/formatters.js";
import { STAKING_CONFIG } from "../../../utils/constants.js";

export const EmergencyInterface = ({ appState }) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [penaltyAmount, setPenaltyAmount] = useState(BigInt(0));
  const [netReceived, setNetReceived] = useState(BigInt(0));
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(0);

  // Wagmi hook for wallet connection
  const { isConnected } = useAccount();

  // Calculate penalty whenever amount changes
  useEffect(() => {
    if (
      withdrawAmount &&
      isValidAmount(withdrawAmount, appState.userData.stakedAmount)
    ) {
      const amount = parseTokenAmount(withdrawAmount);
      const penalty =
        (amount * BigInt(STAKING_CONFIG.PENALTY_PERCENTAGE)) / BigInt(100);
      const net = amount - penalty;

      setPenaltyAmount(penalty);
      setNetReceived(net);
    } else {
      setPenaltyAmount(BigInt(0));
      setNetReceived(BigInt(0));
    }
  }, [withdrawAmount, appState.userData.stakedAmount]);

  // Validate withdrawal amount
  const validateAmount = () => {
    const errors = {};

    // Check if wallet is connected and userData is properly initialized
    if (!isConnected || !appState || !appState.userData) {
      errors.amount = "Please connect wallet to validate amount";
      return errors;
    }

    if (!withdrawAmount || withdrawAmount === "") {
      errors.amount = "Amount is required";
    } else if (!isValidAmount(withdrawAmount, appState.userData.stakedAmount)) {
      errors.amount = "Invalid amount format";
    } else {
      const amount = parseTokenAmount(withdrawAmount);
      const stakedAmount = appState.userData.stakedAmount;

      if (amount <= BigInt(0)) {
        errors.amount = "Amount must be greater than 0";
      } else if (amount > stakedAmount) {
        errors.amount = `Insufficient stake. You have ${formatTokenAmount(
          stakedAmount
        )} tNODE staked`;
      }
    }

    return errors;
  };

  // Handle emergency withdrawal
  const handleEmergencyWithdraw = async () => {
    if (confirmationStep < 2) {
      // Move to next confirmation step
      setConfirmationStep(confirmationStep + 1);
      return;
    }

    const validationErrors = validateAmount();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await appState.contractFunctions.emergencyWithdraw();

      if (result && result.hash) {
        setTxHash(result.hash);
        setShowSuccess(true);
        setWithdrawAmount("");
        setConfirmationStep(0);

        // Refresh user data
        appState.refresh();
      } else {
        setErrors({ withdrawal: "Emergency withdrawal transaction failed" });
      }
    } catch (error) {
      console.error("Emergency withdrawal error:", error);
      setErrors({
        withdrawal: error.message || "Failed to execute emergency withdrawal",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setShowSuccess(false);
    setWithdrawAmount("");
    setErrors({});
    setTxHash("");
    setConfirmationStep(0);
  };

  if (showSuccess) {
    return (
      <div className="bg-red-900 bg-opacity-20 border border-red-500 p-8 text-center">
        <div className="w-24 h-24 border-2 border-red-500 mx-auto mb-6 flex items-center justify-center">
          <span className="font-gilbert text-4xl text-red-400">✓</span>
        </div>
        <h2 className="font-gilbert text-2xl font-bold text-red-400 mb-4">
          Emergency Withdrawal Complete
        </h2>
        <p className="font-gilbert text-red-300 mb-6">
          Your emergency withdrawal has been processed
        </p>
        <div className="bg-dark border border-red-500 p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-gilbert text-red-300 mb-1">
                Amount Withdrawn:
              </p>
              <p className="font-gilbert text-red-400 font-bold">
                {withdrawAmount} STAKE
              </p>
            </div>
            <div>
              <p className="font-gilbert text-red-300 mb-1">
                Penalty (Slashed):
              </p>
              <p className="font-gilbert text-red-400 font-bold">
                {formatTokenAmount(penaltyAmount)} STAKE
              </p>
            </div>
            <div>
              <p className="font-gilbert text-red-300 mb-1">Net Received:</p>
              <p className="font-gilbert text-red-400 font-bold text-lg">
                {formatTokenAmount(netReceived)} STAKE
              </p>
            </div>
            <div>
              <p className="font-gilbert text-red-300 mb-1">Transaction:</p>
              <p className="font-gilbert text-red-400 text-xs">
                {txHash && typeof txHash === "string"
                  ? `${txHash.slice(0, 10)}...${txHash.slice(-8)}`
                  : "Processing..."}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={resetForm}
          className="font-gilbert px-8 py-3 bg-red-700 text-white border border-red-500 hover:bg-red-600"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="bg-dark-light border border-red-500 p-8">
      <h2 className="font-gilbert text-2xl font-bold text-red-400 mb-6">
        Emergency Withdrawal Interface
      </h2>

      {/* Current Position */}
      <div className="bg-dark border border-red-500 p-6 mb-6">
        <h3 className="font-gilbert text-lg font-bold text-red-400 mb-4">
          Your Current Position
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-gilbert text-red-300 mb-1">Staked Amount:</p>
            <p className="font-gilbert text-red-400 font-bold text-xl">
              {formatTokenAmount(appState.userData.stakedAmount)} STAKE
            </p>
          </div>
          <div>
            <p className="font-gilbert text-red-300 mb-1">Pending Rewards:</p>
            <p className="font-gilbert text-red-400 font-bold text-xl">
              {formatTokenAmount(appState.userData.pendingRewards)} STAKE
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Withdrawal Form */}
      <div className="space-y-6">
        <div>
          <label className="font-gilbert text-red-300 mb-2 block">
            Emergency Withdrawal Amount
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="0.00"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full px-4 py-3 bg-dark border border-red-500 text-white font-gilbert text-lg focus:border-red-400 focus:outline-none"
              disabled={isLoading}
            />
            <div className="absolute right-4 top-3 text-red-300 font-gilbert">
              STAKE
            </div>
          </div>
          {errors.amount && (
            <p className="text-red-400 font-gilbert mt-2">{errors.amount}</p>
          )}
        </div>

        {/* Quick Amount Buttons */}
        <div className="bg-dark border border-red-500 p-4">
          <p className="font-gilbert text-red-300 mb-3">Quick Select:</p>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setWithdrawAmount(
                  formatTokenAmount(
                    (appState.userData.stakedAmount * BigInt(25)) / BigInt(100)
                  )
                )
              }
              disabled={isLoading}
              className="font-gilbert px-3 py-1 bg-red-700 text-white border border-red-500 hover:bg-red-600 text-sm disabled:opacity-50"
            >
              25%
            </button>
            <button
              onClick={() =>
                setWithdrawAmount(
                  formatTokenAmount(
                    (appState.userData.stakedAmount * BigInt(50)) / BigInt(100)
                  )
                )
              }
              disabled={isLoading}
              className="font-gilbert px-3 py-1 bg-red-700 text-white border border-red-500 hover:bg-red-600 text-sm disabled:opacity-50"
            >
              50%
            </button>
            <button
              onClick={() =>
                setWithdrawAmount(
                  formatTokenAmount(
                    (appState.userData.stakedAmount * BigInt(75)) / BigInt(100)
                  )
                )
              }
              disabled={isLoading}
              className="font-gilbert px-3 py-1 bg-red-700 text-white border border-red-500 hover:bg-red-600 text-sm disabled:opacity-50"
            >
              75%
            </button>
            <button
              onClick={() =>
                setWithdrawAmount(
                  formatTokenAmount(appState.userData.stakedAmount)
                )
              }
              disabled={isLoading}
              className="font-gilbert px-3 py-1 bg-red-700 text-white border border-red-500 hover:bg-red-600 text-sm disabled:opacity-50"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Penalty Calculator */}
        {withdrawAmount && !errors.amount && (
          <div className="bg-red-900 bg-opacity-30 border border-red-500 p-6">
            <h3 className="font-gilbert text-red-400 font-bold mb-4 flex items-center gap-2">
              <span className="text-xl">💰</span>
              Penalty Calculation
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-gilbert text-red-300">
                  Withdrawal Amount:
                </span>
                <span className="font-gilbert text-red-400 font-bold">
                  {withdrawAmount} STAKE
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-gilbert text-red-300">
                  Penalty ({STAKING_CONFIG.PENALTY_PERCENTAGE}%):
                </span>
                <span className="font-gilbert text-red-400 font-bold">
                  -{formatTokenAmount(penaltyAmount)} STAKE (Slashed)
                </span>
              </div>
              <div className="border-t border-red-500 pt-3">
                <div className="flex justify-between">
                  <span className="font-gilbert text-red-400 font-bold">
                    Net Amount Received:
                  </span>
                  <span className="font-gilbert text-red-400 font-bold text-lg">
                    {formatTokenAmount(netReceived)} STAKE
                  </span>
                </div>
              </div>
              <div className="bg-red-800 bg-opacity-50 p-3 mt-4">
                <p className="font-gilbert text-red-200 text-sm">
                  <strong>IMPORTANT:</strong> The penalty tokens are permanently
                  Slashed and cannot be recovered. Your pending rewards (
                  {formatTokenAmount(appState.userData.pendingRewards)} STAKE)
                  CANNOT be claimed separately.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Steps */}
        {confirmationStep > 0 && (
          <div className="bg-red-900 bg-opacity-30 border border-red-500 p-6">
            <h3 className="font-gilbert text-red-400 font-bold mb-4">
              Confirmation Required ({confirmationStep}/2)
            </h3>
            {confirmationStep === 1 && (
              <div className="space-y-4">
                <p className="font-gilbert text-red-300">
                  Are you sure you want to proceed with emergency withdrawal?
                </p>
                <div className="bg-red-800 bg-opacity-50 p-4">
                  <p className="font-gilbert text-red-200 font-bold">
                    {formatTokenAmount(penaltyAmount)} STAKE tokens will be
                    permanently Slashed INCLUDING THE REWARDS!
                  </p>
                </div>
              </div>
            )}
            {confirmationStep === 2 && (
              <div className="space-y-4">
                <p className="font-gilbert text-red-300 font-bold">
                  FINAL CONFIRMATION: This action cannot be undone!
                </p>
                <div className="bg-red-800 bg-opacity-50 p-4">
                  <p className="font-gilbert text-red-200">
                    You will lose {formatTokenAmount(penaltyAmount)} STAKE
                    tokens and your REWARDS permanently. Only{" "}
                    {formatTokenAmount(netReceived)} STAKE will be returned to
                    you.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {errors.withdrawal && (
          <div className="bg-red-900 border border-red-500 p-4">
            <p className="text-red-400 font-gilbert">{errors.withdrawal}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {confirmationStep > 0 && (
            <button
              onClick={() => setConfirmationStep(confirmationStep - 1)}
              disabled={isLoading}
              className="font-gilbert px-6 py-3 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-50"
            >
              Back
            </button>
          )}

          <button
            onClick={handleEmergencyWithdraw}
            disabled={
              isLoading || !withdrawAmount || Object.keys(errors).length > 0
            }
            className="flex-1 font-gilbert px-8 py-4 bg-red-700 text-white border border-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <LoadingSpinner size="small" />}
            {isLoading
              ? "Processing..."
              : confirmationStep === 0
              ? "Review Emergency Withdrawal"
              : confirmationStep === 1
              ? "Confirm Penalty"
              : "Execute Emergency Withdrawal"}
          </button>
        </div>
      </div>
    </div>
  );
};
