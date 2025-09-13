// Staking wizard component - MANDATORY multi-step interface

import React, { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { LoadingSpinner } from "../../common/LoadingSpinner.jsx";
import {
  formatTokenAmount,
  parseTokenAmount,
  isValidAmount,
} from "../../../utils/formatters.js";
import { STAKING_CONFIG } from "../../../utils/constants.js";

export const StakingWizard = ({
  appState,
  stakingStep,
  setStakingStep,
  stakeAmount,
  setStakeAmount,
  estimatedAPR,
}) => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  // Wagmi hook for wallet connection
  const { isConnected } = useAccount();

  // Amount validation function - defined early to avoid dependency issues
  const validateAmount = useCallback(() => {
    const errors = {};

    // Check if wallet is connected and userData is properly initialized
    if (!isConnected || !appState || !appState.userData) {
      errors.amount = "Please connect wallet to validate amount";
      return errors;
    }

    if (!stakeAmount || stakeAmount === "") {
      errors.amount = "Amount is required";
    } else if (!isValidAmount(stakeAmount, appState.userData.tokenBalance)) {
      errors.amount = "Invalid amount format";
    } else {
      const amount = parseTokenAmount(stakeAmount);
      const balance = appState.userData.tokenBalance;

      if (amount <= BigInt(0)) {
        errors.amount = "Amount must be greater than 0";
      } else if (amount > balance) {
        errors.amount = `Insufficient balance. You have ${formatTokenAmount(
          balance
        )} tokens`;
      } else if (amount < STAKING_CONFIG.MIN_STAKE_AMOUNT) {
        errors.amount = `Minimum stake amount is ${formatTokenAmount(
          STAKING_CONFIG.MIN_STAKE_AMOUNT
        )} tokens`;
      }
    }

    return errors;
  }, [stakeAmount, appState, isConnected]);

  // Auto-validate amount when it changes
  useEffect(() => {
    if (stakeAmount && stakingStep === 0 && isConnected) {
      const validationErrors = validateAmount();
      setErrors(validationErrors);
    }
  }, [stakeAmount, stakingStep, appState, isConnected, validateAmount]);

  // Clear errors when moving between steps
  useEffect(() => {
    setErrors({});
  }, [stakingStep]);

  // Wizard steps configuration
  const steps = [
    { id: 0, title: "Enter Amount", description: "Choose how much to stake" },
    {
      id: 1,
      title: "Approve Tokens",
      description: "Allow staking contract access",
    },
    {
      id: 2,
      title: "Stake Tokens",
      description: "Execute staking transaction",
    },
    { id: 3, title: "Complete", description: "Staking successful" },
  ];

  // Handle step progression
  const handleNextStep = async () => {
    if (stakingStep === 0) {
      // Validate amount
      const validationErrors = validateAmount();
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        setStakingStep(1);
      }
    } else if (stakingStep === 1) {
      // Execute approval
      await handleApproval();
    } else if (stakingStep === 2) {
      // Execute staking
      await handleStaking();
    }
  };

  // Handle token approval
  const handleApproval = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      console.log("Starting approval for amount:", stakeAmount);
      console.log(
        "Parsed amount (wei):",
        parseTokenAmount(stakeAmount).toString()
      );
      console.log(
        "User balance (wei):",
        appState.userData.tokenBalance?.toString()
      );
      console.log("User connected account:", appState.address);

      const result = await appState.contractFunctions.approveTokens(
        stakeAmount
      );

      if (result && result.hash) {
        setTxHash(result.hash);
        setStakingStep(2);
      } else {
        setErrors({ approval: "Approval transaction failed" });
      }
    } catch (error) {
      console.error("Approval error:", error);

      // Provide more user-friendly error messages
      let userError = "Failed to approve tokens";
      if (
        error.message.includes("user rejected") ||
        error.message.includes("User denied")
      ) {
        userError = "Transaction was rejected by user";
      } else if (error.message.includes("insufficient funds")) {
        userError = "Insufficient ETH for gas fees";
      } else if (error.message.includes("not been authorized")) {
        userError = "Please check your wallet connection and try again";
      } else if (error.message.includes("network")) {
        userError = "Network error - please check your connection";
      }

      setErrors({ approval: userError });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle staking transaction
  const handleStaking = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      console.log("Starting staking for amount:", stakeAmount);
      console.log(
        "Parsed amount (wei):",
        parseTokenAmount(stakeAmount).toString()
      );

      const result = await appState.contractFunctions.stakeTokens(stakeAmount);

      if (result && result.hash) {
        setTxHash(result.hash);
        setStakingStep(3);
        // Data will be updated automatically via events
      } else {
        setErrors({ staking: "Staking transaction failed" });
      }
    } catch (error) {
      console.error("Staking error:", error);

      // Provide more user-friendly error messages
      let userError = "Failed to stake tokens";
      if (
        error.message.includes("user rejected") ||
        error.message.includes("User denied")
      ) {
        userError = "Transaction was rejected by user";
      } else if (error.message.includes("insufficient funds")) {
        userError = "Insufficient ETH for gas fees or token balance";
      } else if (error.message.includes("not been authorized")) {
        userError = "Please check your wallet connection and try again";
      } else if (error.message.includes("network")) {
        userError = "Network error - please check your connection";
      }

      setErrors({ staking: userError });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset wizard
  const resetWizard = () => {
    setStakingStep(0);
    setStakeAmount("");
    setErrors({});
    setTxHash("");
  };

  return (
    <div className="bg-dark-light border border-army-green p-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`
                w-10 h-10 border-2 flex items-center justify-center font-gilbert font-bold
                ${
                  stakingStep >= step.id
                    ? "border-army-green bg-army-green text-white"
                    : "border-army-green-light text-army-green-light"
                }
              `}
              >
                {stakingStep > step.id ? "✓" : step.id + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                  flex-1 h-0.5 mx-4
                  ${
                    stakingStep > step.id
                      ? "bg-army-green"
                      : "bg-army-green-light"
                  }
                `}
                />
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="font-gilbert text-2xl font-bold text-army-green mb-2">
            {steps[stakingStep].title}
          </h2>
          <p className="font-gilbert text-army-green-lighter">
            {steps[stakingStep].description}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {stakingStep === 0 && (
          /* Step 1: Enter Amount */
          <div className="space-y-6">
            <div>
              <label className="font-gilbert text-army-green-lighter mb-2 block">
                Stake Amount
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="0.00"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-dark border border-army-green-light text-white font-gilbert text-lg focus:border-army-green focus:outline-none"
                />
                <div className="absolute right-4 top-3 text-army-green-lighter font-gilbert">
                  STAKE
                </div>
              </div>
              {errors.amount && (
                <p className="text-red-400 font-gilbert mt-2">
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Balance Display */}
            <div className="bg-dark border border-army-green-light p-4">
              <p className="font-gilbert text-army-green-lighter mb-2">
                Available Balance:{" "}
                {formatTokenAmount(appState.userData.tokenBalance)} STAKE
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setStakeAmount(
                      formatTokenAmount(
                        (appState.userData.tokenBalance * BigInt(25)) /
                          BigInt(100)
                      )
                    )
                  }
                  className="font-gilbert px-3 py-1 bg-army-green-light text-white border border-army-green-light hover:bg-army-green text-sm"
                >
                  25%
                </button>
                <button
                  onClick={() =>
                    setStakeAmount(
                      formatTokenAmount(
                        (appState.userData.tokenBalance * BigInt(50)) /
                          BigInt(100)
                      )
                    )
                  }
                  className="font-gilbert px-3 py-1 bg-army-green-light text-white border border-army-green-light hover:bg-army-green text-sm"
                >
                  50%
                </button>
                <button
                  onClick={() =>
                    setStakeAmount(
                      formatTokenAmount(
                        (appState.userData.tokenBalance * BigInt(75)) /
                          BigInt(100)
                      )
                    )
                  }
                  className="font-gilbert px-3 py-1 bg-army-green-light text-white border border-army-green-light hover:bg-army-green text-sm"
                >
                  75%
                </button>
                <button
                  onClick={() =>
                    setStakeAmount(
                      formatTokenAmount(appState.userData.tokenBalance)
                    )
                  }
                  className="font-gilbert px-3 py-1 bg-army-green-light text-white border border-army-green-light hover:bg-army-green text-sm"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Estimated Returns */}
            {stakeAmount && !errors.amount && (
              <div className="bg-army-green bg-opacity-10 border border-army-green p-4">
                <h3 className="font-gilbert text-army-green font-bold mb-2">
                  Estimated Returns
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-gilbert text-army-green-lighter">
                      Current APR
                    </p>
                    <p className="font-gilbert text-army-green font-bold">
                      {estimatedAPR}%
                    </p>
                  </div>
                  <div>
                    <p className="font-gilbert text-army-green-lighter">
                      Monthly Rewards
                    </p>
                    <p className="font-gilbert text-army-green font-bold">
                      {(
                        (parseFloat(stakeAmount || "0") *
                          (estimatedAPR / 100)) /
                        12
                      ).toFixed(2)}{" "}
                      STAKE
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {stakingStep === 1 && (
          /* Step 2: Approve Tokens */
          <div className="text-center space-y-6">
            <div className="w-24 h-24 border-2 border-army-green mx-auto flex items-center justify-center">
              <span className="font-gilbert text-4xl text-army-green">🔐</span>
            </div>
            <div>
              <h3 className="font-gilbert text-xl font-bold text-army-green mb-2">
                Approve Token Access
              </h3>
              <p className="font-gilbert text-army-green-lighter">
                Grant the staking contract permission to transfer your tokens
              </p>
            </div>
            <div className="bg-dark border border-army-green-light p-4">
              <p className="font-gilbert text-army-green-lighter mb-2">
                Amount to Approve:
              </p>
              <p className="font-gilbert text-army-green font-bold text-lg">
                {stakeAmount} STAKE tokens
              </p>
            </div>
            {errors.approval && (
              <p className="text-red-400 font-gilbert">{errors.approval}</p>
            )}
          </div>
        )}

        {stakingStep === 2 && (
          /* Step 3: Stake Tokens */
          <div className="text-center space-y-6">
            <div className="w-24 h-24 border-2 border-army-green mx-auto flex items-center justify-center">
              <span className="font-gilbert text-4xl text-army-green">⚡</span>
            </div>
            <div>
              <h3 className="font-gilbert text-xl font-bold text-army-green mb-2">
                Execute Staking
              </h3>
              <p className="font-gilbert text-army-green-lighter">
                Stake your tokens and start earning rewards
              </p>
            </div>
            <div className="bg-dark border border-army-green-light p-4">
              <p className="font-gilbert text-army-green-lighter mb-2">
                Staking Amount:
              </p>
              <p className="font-gilbert text-army-green font-bold text-lg">
                {stakeAmount} STAKE tokens
              </p>
            </div>
            {errors.staking && (
              <p className="text-red-400 font-gilbert">{errors.staking}</p>
            )}
          </div>
        )}

        {stakingStep === 3 && (
          /* Step 4: Complete */
          <div className="text-center space-y-6">
            <div className="w-24 h-24 border-2 border-army-green mx-auto flex items-center justify-center bg-army-green">
              <span className="font-gilbert text-4xl text-white">✓</span>
            </div>
            <div>
              <h3 className="font-gilbert text-xl font-bold text-army-green mb-2">
                Staking Complete!
              </h3>
              <p className="font-gilbert text-army-green-lighter">
                Your tokens are now staked and earning rewards
              </p>
            </div>
            <div className="bg-army-green bg-opacity-10 border border-army-green p-4">
              <p className="font-gilbert text-army-green-lighter mb-2">
                Successfully Staked:
              </p>
              <p className="font-gilbert text-army-green font-bold text-lg">
                {stakeAmount} STAKE tokens
              </p>
              {txHash && typeof txHash === "string" && (
                <p className="font-gilbert text-army-green-lighter text-sm mt-2">
                  Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
              )}
            </div>
            <button
              onClick={resetWizard}
              className="font-gilbert px-8 py-3 bg-army-green text-white border border-army-green hover:bg-army-green-light"
            >
              Stake More Tokens
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {stakingStep < 3 && (
        <div className="flex justify-between mt-8">
          <button
            onClick={() =>
              stakingStep > 0 ? setStakingStep(stakingStep - 1) : null
            }
            disabled={stakingStep === 0 || isLoading}
            className={`
              font-gilbert px-6 py-3 border
              ${
                stakingStep === 0 || isLoading
                  ? "border-gray-600 text-gray-600 cursor-not-allowed"
                  : "border-army-green-light text-army-green-light hover:bg-army-green-light hover:text-white"
              }
            `}
          >
            Previous
          </button>

          <button
            onClick={handleNextStep}
            disabled={isLoading}
            className="font-gilbert px-8 py-3 bg-army-green text-white border border-army-green hover:bg-army-green-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <LoadingSpinner size="small" />}
            {stakingStep === 0 && "Continue"}
            {stakingStep === 1 &&
              (isLoading ? "Approving..." : "Approve Tokens")}
            {stakingStep === 2 && (isLoading ? "Staking..." : "Stake Tokens")}
          </button>
        </div>
      )}
    </div>
  );
};
