// Standard withdrawal page - MANDATORY lock period validation

import React, { useState, useEffect } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WithdrawalInterface } from "../components/pages/Withdraw/WithdrawalInterface.jsx";
import { WithdrawalEducation } from "../components/pages/Withdraw/WithdrawalEducation.jsx";
import { WithdrawalHistory } from "../components/pages/Withdraw/WithdrawalHistory.jsx";
import { formatTokenAmount } from "../utils/formatters.js";
import { UI_CONSTANTS, STAKING_CONFIG } from "../utils/constants.js";

export const WithdrawPage = ({ appState }) => {
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Wagmi hooks for wallet connection
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isCorrectNetwork = chainId === sepolia.id;

  // Check if user can withdraw and update countdown
  useEffect(() => {
    if (appState.userData.timeUntilUnlock > BigInt(0)) {
      setCanWithdraw(false);
      setTimeRemaining(appState.userData.timeUntilUnlock);
    } else {
      setCanWithdraw(true);
      setTimeRemaining(0);
    }
  }, [appState.userData.timeUntilUnlock]);

  // Live countdown timer - update every second
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0) {
          setCanWithdraw(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  // Format time remaining
  const formatTimeRemaining = (seconds) => {
    if (seconds <= 0) return "00d 00h 00m";

    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);

    return `${days.toString().padStart(2, "0")}d ${hours
      .toString()
      .padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`;
  };

  return (
    <div className="min-h-screen bg-dark text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-gilbert text-4xl font-bold text-army-green-lighter mb-4">
            Withdraw Stake
          </h1>
          <p className="font-gilbert text-xl text-army-green-lighter">
            Standard withdrawal with lock period validation
          </p>
        </div>

        {!isConnected ? (
          /* Wallet Connection Required */
          <div className="bg-dark-light border border-army-green p-8 text-center">
            <h2 className="font-gilbert text-2xl font-bold text-army-green mb-4">
              Connect Wallet Required
            </h2>
            <p className="font-gilbert text-army-green-lighter mb-6">
              Please connect your wallet to withdraw
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : !isCorrectNetwork ? (
          /* Wrong Network */
          <div className="bg-red-900 border border-red-500 p-8 text-center">
            <h2 className="font-gilbert text-2xl font-bold text-red-200 mb-4">
              Wrong Network
            </h2>
            <p className="font-gilbert text-red-300 mb-6">
              Please switch to Sepolia testnet to withdraw
            </p>
            <button
              onClick={() => switchChain?.({ chainId: sepolia.id })}
              className="font-gilbert px-8 py-3 bg-red-700 text-white border border-red-500 hover:bg-red-600"
            >
              Switch to Sepolia
            </button>
          </div>
        ) : BigInt(appState.userData.stakedAmount || 0) <= BigInt(0) ? (
          /* No Stakes */
          <div className="bg-dark-light border border-army-green-light p-8 text-center">
            <h2 className="font-gilbert text-2xl font-bold text-army-green-light mb-4">
              No Active Stakes
            </h2>
            <p className="font-gilbert text-army-green-lighter mb-6">
              You don't have any staked tokens to withdraw.
            </p>
            <button
              onClick={() => appState.navigateTo(UI_CONSTANTS.ROUTES.STAKING)}
              className="font-gilbert px-8 py-3 bg-army-green-light text-white border border-army-green-light hover:bg-army-green"
            >
              Stake Tokens
            </button>
          </div>
        ) : !canWithdraw ? (
          /* Lock Period Active */
          <div className="bg-dark-light border border-yellow-500 p-8 text-center">
            <div className="w-24 h-24 border-2 border-yellow-500 mx-auto mb-6 flex items-center justify-center">
              <span className="font-gilbert text-4xl text-yellow-500">🔒</span>
            </div>
            <h2 className="font-gilbert text-2xl font-bold text-yellow-400 mb-4">
              Tokens Still Locked
            </h2>
            <p className="font-gilbert text-yellow-300 mb-6">
              Your staked tokens are locked for{" "}
              {STAKING_CONFIG.LOCK_PERIOD_DAYS} days from the stake date.
            </p>

            <div className="bg-dark border border-yellow-500 p-6 mb-6">
              <h3 className="font-gilbert text-xl font-bold text-yellow-400 mb-4">
                Time Remaining
              </h3>
              <div className="font-gilbert text-3xl font-bold text-yellow-400 mb-4">
                {formatTimeRemaining(timeRemaining)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-gilbert text-yellow-300">Staked Amount:</p>
                  <p className="font-gilbert text-yellow-400 font-bold">
                    {formatTokenAmount(appState.userData.stakedAmount)} STAKE
                  </p>
                </div>
                <div>
                  <p className="font-gilbert text-yellow-300">
                    Pending Rewards:
                  </p>
                  <p className="font-gilbert text-yellow-400 font-bold">
                    {formatTokenAmount(appState.userData.pendingRewards)} STAKE
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-gilbert text-yellow-300">
                You can still claim rewards or use emergency withdrawal (with{" "}
                {STAKING_CONFIG.PENALTY_PERCENTAGE}% penalty)
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() =>
                    appState.navigateTo(UI_CONSTANTS.ROUTES.REWARDS)
                  }
                  className="font-gilbert px-6 py-3 bg-army-green text-white border border-army-green hover:bg-army-green-light"
                >
                  Claim Rewards
                </button>
                <button
                  onClick={() =>
                    appState.navigateTo(UI_CONSTANTS.ROUTES.EMERGENCY)
                  }
                  className="font-gilbert px-6 py-3 bg-red-700 text-white border border-red-500 hover:bg-red-600"
                >
                  Emergency Withdrawal
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Main Withdrawal Interface */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Withdrawal Interface */}
            <div className="lg:col-span-2">
              <WithdrawalInterface appState={appState} />
            </div>

            {/* Right Column - Education & History */}
            <div className="space-y-8">
              <WithdrawalEducation appState={appState} />
              <WithdrawalHistory appState={appState} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
