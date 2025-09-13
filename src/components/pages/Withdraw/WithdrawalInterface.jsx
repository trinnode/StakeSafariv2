// Withdrawal interface component - MANDATORY standard withdrawal

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { LoadingSpinner } from "../../common/LoadingSpinner.jsx";
import {
  formatTokenAmount,
  parseTokenAmount,
  isValidAmount,
} from "../../../utils/formatters.js";

export const WithdrawalInterface = ({ appState }) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Wagmi hook for wallet connection
  const { isConnected } = useAccount();

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

  // Handle withdrawal
  const handleWithdraw = async () => {
    const validationErrors = validateAmount();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await appState.contractFunctions.withdrawTokens(
        withdrawAmount
      );

      if (result && result.hash) {
        setTxHash(result.hash);
        setShowSuccess(true);
        setWithdrawAmount("");

        // Refresh user data
        appState.refresh();
      } else {
        setErrors({ withdrawal: "Withdrawal transaction failed" });
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      setErrors({ withdrawal: error.message || "Failed to withdraw tokens" });
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
  };

  if (showSuccess) {
    return (
      <div className="bg-dark-light border border-army-green p-8 text-center">
        <div className="w-24 h-24 border-2 border-army-green mx-auto mb-6 flex items-center justify-center bg-army-green">
          <span className="font-gilbert text-4xl text-white">✓</span>
        </div>
        <h2 className="font-gilbert text-2xl font-bold text-army-green mb-4">
          Withdrawal Complete!
        </h2>
        <p className="font-gilbert text-army-green-lighter mb-6">
          Your tokens have been successfully withdrawn
        </p>
        <div className="bg-army-green bg-opacity-10 border border-army-green p-4 mb-6">
          <p className="font-gilbert text-army-green-lighter mb-2">
            Withdrawn Amount:
          </p>
          <p className="font-gilbert text-army-green font-bold text-lg">
            {withdrawAmount} STAKE tokens
          </p>
          {txHash && typeof txHash === "string" && (
            <p className="font-gilbert text-army-green-lighter text-sm mt-2">
              Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </p>
          )}
        </div>
        <button
          onClick={resetForm}
          className="font-gilbert px-8 py-3 bg-army-green text-white border border-army-green hover:bg-army-green-light"
        >
          Make Another Withdrawal
        </button>
      </div>
    );
  }

  return (
    <div className="bg-dark-light border border-army-green p-8">
      <h2 className="font-gilbert text-2xl font-bold text-army-green mb-6">
        Standard Withdrawal
      </h2>

      {/* Current Position */}
      <div className="bg-dark border border-army-green-light p-6 mb-6">
        <h3 className="font-gilbert text-lg font-bold text-army-green-lighter mb-4">
          Your Current Position
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-gilbert text-army-green-lighter mb-1">
              Staked Amount:
            </p>
            <p className="font-gilbert text-army-green font-bold text-xl">
              {formatTokenAmount(appState.userData.stakedAmount)} STAKE
            </p>
          </div>
          <div>
            <p className="font-gilbert text-army-green-lighter mb-1">
              Pending Rewards:
            </p>
            <p className="font-gilbert text-army-green font-bold text-xl">
              {formatTokenAmount(appState.userData.pendingRewards)} STAKE
            </p>
          </div>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="space-y-6">
        <div>
          <label className="font-gilbert text-army-green-lighter mb-2 block">
            Withdrawal Amount
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="0.00"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full px-4 py-3 bg-dark border border-army-green-light text-white font-gilbert text-lg focus:border-army-green focus:outline-none"
              disabled={isLoading}
            />
            <div className="absolute right-4 top-3 text-army-green-lighter font-gilbert">
              STAKE
            </div>
          </div>
          {errors.amount && (
            <p className="text-red-400 font-gilbert mt-2">{errors.amount}</p>
          )}
        </div>

        {/* Quick Amount Buttons */}
        <div className="bg-dark border border-army-green-light p-4">
          <p className="font-gilbert text-army-green-lighter mb-3">
            Quick Select:
          </p>
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
              className="font-gilbert px-3 py-1 bg-army-green-light text-white border border-army-green-light hover:bg-army-green text-sm disabled:opacity-50"
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
              className="font-gilbert px-3 py-1 bg-army-green-light text-white border border-army-green-light hover:bg-army-green text-sm disabled:opacity-50"
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
              className="font-gilbert px-3 py-1 bg-army-green-light text-white border border-army-green-light hover:bg-army-green text-sm disabled:opacity-50"
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
              className="font-gilbert px-3 py-1 bg-army-green-light text-white border border-army-green-light hover:bg-army-green text-sm disabled:opacity-50"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Withdrawal Preview */}
        {withdrawAmount && !errors.amount && (
          <div className="bg-army-green bg-opacity-10 border border-army-green p-4">
            <h3 className="font-gilbert text-army-green font-bold mb-2">
              Withdrawal Preview
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-gilbert text-army-green-lighter">
                  Withdrawal Amount:
                </span>
                <span className="font-gilbert text-army-green font-bold">
                  {withdrawAmount} STAKE
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-gilbert text-army-green-lighter">
                  Pending Rewards (claimed):
                </span>
                <span className="font-gilbert text-army-green font-bold">
                  {formatTokenAmount(appState.userData.pendingRewards)} STAKE
                </span>
              </div>
              <div className="border-t border-army-green mt-2 pt-2">
                <div className="flex justify-between">
                  <span className="font-gilbert text-army-green font-bold">
                    Total Received:
                  </span>
                  <span className="font-gilbert text-army-green font-bold">
                    {(
                      parseFloat(withdrawAmount) +
                      Number(
                        formatTokenAmount(appState.userData.pendingRewards)
                      )
                    ).toFixed(4)}{" "}
                    STAKE
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {errors.withdrawal && (
          <div className="bg-red-900 border border-red-500 p-4">
            <p className="text-red-400 font-gilbert">{errors.withdrawal}</p>
          </div>
        )}

        {/* Withdrawal Button */}
        <button
          onClick={handleWithdraw}
          disabled={
            isLoading || !withdrawAmount || Object.keys(errors).length > 0
          }
          className="w-full font-gilbert px-8 py-4 bg-army-green text-white border border-army-green hover:bg-army-green-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <LoadingSpinner size="small" />}
          {isLoading ? "Processing Withdrawal..." : "Withdraw Tokens"}
        </button>

        {/* Important Note */}
        <div className="bg-dark border border-army-green-light p-4">
          <h4 className="font-gilbert font-bold text-army-green-lighter mb-2">
            📝 Important Notes:
          </h4>
          <ul className="font-gilbert text-army-green-lighter text-sm space-y-1">
            <li>• Withdrawals automatically claim all pending rewards</li>
            <li>• Partial withdrawals are allowed after lock period</li>
            <li>• Gas fees apply for the withdrawal transaction</li>
            <li>• Transaction may take a few minutes to complete</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
