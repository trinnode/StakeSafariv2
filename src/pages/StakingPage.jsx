// Multi-step staking page - MANDATORY wizard interface

import React, { useState, useEffect } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { StakingWizard } from "../components/pages/Staking/StakingWizard.jsx";
import { StakingEducation } from "../components/pages/Staking/StakingEducation.jsx";
import { StakingHistory } from "../components/pages/Staking/StakingHistory.jsx";
import {
  formatTokenAmount,
  isValidAmount,
  parseTokenAmount,
} from "../utils/formatters.js";
import { UI_CONSTANTS, STAKING_CONFIG } from "../utils/constants.js";

export const StakingPage = ({ appState }) => {
  const [stakingStep, setStakingStep] = useState(0); // 0: amount, 1: approve, 2: stake, 3: complete
  const [stakeAmount, setStakeAmount] = useState("");
  const [estimatedAPR, setEstimatedAPR] = useState(STAKING_CONFIG.INITIAL_APR);

  // Wagmi hooks for wallet connection
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isCorrectNetwork = chainId === sepolia.id;

  // Validation helper for stake amount
  const validateStakeAmount = (amount) => {
    return isValidAmount(amount, appState.userData.tokenBalance);
  };

  // Parse amount for contract calls
  const getStakeAmountInWei = () => {
    return parseTokenAmount(stakeAmount);
  };

  // Calculate estimated APR based on current total staked
  useEffect(() => {
    const currentStaked = Number(
      formatTokenAmount(appState.protocolData.totalStaked)
    );
    const newStakeAmount = parseFloat(stakeAmount || "0");
    const totalAfterStake = currentStaked + newStakeAmount;

    // Simple APR calculation (adjust based on actual contract logic)
    const reductionFactor =
      Math.floor(totalAfterStake / 1000) *
      STAKING_CONFIG.APR_REDUCTION_PER_THOUSAND;
    const newAPR = Math.max(STAKING_CONFIG.INITIAL_APR - reductionFactor, 0);

    setEstimatedAPR(newAPR);
  }, [stakeAmount, appState.protocolData.totalStaked]);

  return (
    <div className="min-h-screen text-white px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-gilbert text-2xl sm:text-3xl lg:text-4xl font-bold text-army-green-lighter mb-4">
            Stake Tokens
          </h1>
          <p className="font-gilbert text-lg sm:text-xl text-army-green-lighter">
            Multi-step staking process with dynamic APR
          </p>
        </div>

        {!isConnected ? (
          /* Wallet Connection Required */
          <div className="bg-dark-light border border-army-green p-6 sm:p-8 text-center rounded-lg">
            <h2 className="font-gilbert text-xl sm:text-2xl font-bold text-army-green mb-4">
              Connect Wallet Required
            </h2>
            <p className="font-gilbert text-army-green-lighter mb-6">
              Please connect your wallet to start staking
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : !isCorrectNetwork ? (
          /* Wrong Network */
          <div className="bg-red-900 border border-red-500 p-6 sm:p-8 text-center rounded-lg">
            <h2 className="font-gilbert text-xl sm:text-2xl font-bold text-red-200 mb-4">
              Wrong Network
            </h2>
            <p className="font-gilbert text-red-300 mb-6">
              Please switch to Sepolia testnet to stake
            </p>
            <button
              onClick={() => switchChain?.({ chainId: sepolia.id })}
              className="w-full sm:w-auto font-gilbert px-6 sm:px-8 py-3 bg-red-700 text-white border border-red-500 hover:bg-red-600 transition-colors"
            >
              Switch to Sepolia
            </button>
          </div>
        ) : !appState.userData.tokenBalance ||
          appState.userData.tokenBalance <= BigInt(0) ? (
          /* No Tokens */
          <div className="bg-dark-light border border-army-green-light p-6 sm:p-8 text-center rounded-lg">
            <h2 className="font-gilbert text-xl sm:text-2xl font-bold text-army-green-light mb-4">
              No Tokens Available
            </h2>
            <p className="font-gilbert text-army-green-lighter mb-6">
              You need tokens to stake. Visit the faucet to get free testnet
              tokens.
            </p>
            <button
              onClick={() => appState.navigateTo(UI_CONSTANTS.ROUTES.FAUCET)}
              className="w-full sm:w-auto font-gilbert px-6 sm:px-8 py-3 bg-army-green-light text-white border border-army-green-light hover:bg-army-green transition-colors"
            >
              Get Tokens from Faucet
            </button>
          </div>
        ) : (
          /* Main Staking Interface */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Staking Wizard */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <StakingWizard
                appState={appState}
                stakingStep={stakingStep}
                setStakingStep={setStakingStep}
                stakeAmount={stakeAmount}
                setStakeAmount={setStakeAmount}
                estimatedAPR={estimatedAPR}
                validateAmount={validateStakeAmount}
                parseAmount={getStakeAmountInWei}
              />
            </div>

            {/* Right Column - Education & History */}
            <div className="space-y-6 lg:space-y-8 order-1 lg:order-2">
              <StakingEducation
                appState={appState}
                estimatedAPR={estimatedAPR}
                stakeAmount={stakeAmount}
              />

              <StakingHistory appState={appState} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
