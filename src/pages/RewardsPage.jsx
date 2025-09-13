// Rewards claiming page - MANDATORY reward interface

import React from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { RewardsInterface } from "../components/pages/Rewards/RewardsInterface.jsx";
import { RewardsEducation } from "../components/pages/Rewards/RewardsEducation.jsx";
import { RewardsHistory } from "../components/pages/Rewards/RewardsHistory.jsx";
import { formatTokenAmount } from "../utils/formatters.js";
import { UI_CONSTANTS } from "../utils/constants.js";

export const RewardsPage = ({ appState }) => {
  // Wagmi hooks for wallet connection
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isCorrectNetwork = chainId === sepolia.id;

  return (
    <div className="min-h-screen bg-dark text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 border-2 border-army-green mx-auto mb-6 flex items-center justify-center">
            <span className="font-gilbert text-4xl text-army-green">💰</span>
          </div>
          <h1 className="font-gilbert text-4xl font-bold text-army-green-lighter mb-4">
            Claim Rewards
          </h1>
          <p className="font-gilbert text-xl text-army-green-lighter">
            Claim your staking rewards without affecting your staked balance
          </p>
        </div>

        {!isConnected ? (
          /* Wallet Connection Required */
          <div className="bg-dark-light border border-army-green p-8 text-center">
            <h2 className="font-gilbert text-2xl font-bold text-army-green mb-4">
              Connect Wallet Required
            </h2>
            <p className="font-gilbert text-army-green-lighter mb-6">
              Please connect your wallet to claim rewards
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
              Please switch to Sepolia testnet to claim rewards
            </p>
            <button
              onClick={() => switchChain?.({ chainId: sepolia.id })}
              className="font-gilbert px-8 py-3 bg-red-700 text-white border border-red-500 hover:bg-red-600"
            >
              Switch to Sepolia
            </button>
          </div>
        ) : appState.userData.stakedAmount <= BigInt(0) ? (
          /* No Stakes */
          <div className="bg-dark-light border border-army-green-light p-8 text-center">
            <h2 className="font-gilbert text-2xl font-bold text-army-green-light mb-4">
              No Active Stakes
            </h2>
            <p className="font-gilbert text-army-green-lighter mb-6">
              You need to stake tokens first to earn rewards.
            </p>
            <button
              onClick={() => appState.navigateTo(UI_CONSTANTS.ROUTES.STAKING)}
              className="font-gilbert px-8 py-3 bg-army-green-light text-white border border-army-green-light hover:bg-army-green"
            >
              Stake Tokens
            </button>
          </div>
        ) : appState.userData.pendingRewards <= BigInt(0) ? (
          /* No Rewards */
          <div className="bg-dark-light border border-army-green-light p-8 text-center">
            <div className="w-24 h-24 border border-army-green-light mx-auto mb-6 flex items-center justify-center">
              <span className="font-gilbert text-4xl text-army-green-lighter">
                ⏱️
              </span>
            </div>
            <h2 className="font-gilbert text-2xl font-bold text-army-green-light mb-4">
              No Rewards Yet
            </h2>
            <p className="font-gilbert text-army-green-lighter mb-6">
              You don't have any pending rewards to claim. Keep staking to earn
              rewards!
            </p>

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
                    {formatTokenAmount(appState.userData.stakedAmount)} STAKE
                  </p>
                </div>
                <div>
                  <p className="font-gilbert text-army-green-lighter mb-1">
                    Days Staking:
                  </p>
                  <p className="font-gilbert text-army-green font-bold text-xl">
                    {appState.userData.stakeTimestamp > 0
                      ? Math.floor(
                          (Date.now() / 1000 -
                            appState.userData.stakeTimestamp) /
                            (24 * 60 * 60)
                        )
                      : 0}
                  </p>
                </div>
              </div>
            </div>

            <p className="font-gilbert text-army-green-lighter text-sm mb-6">
              Rewards are calculated and distributed daily. Check back tomorrow!
            </p>

            <button
              onClick={() => appState.refresh()}
              className="font-gilbert px-8 py-3 bg-army-green-light text-white border border-army-green-light hover:bg-army-green"
            >
              Refresh Data
            </button>
          </div>
        ) : (
          /* Main Rewards Interface */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Rewards Interface */}
            <div className="lg:col-span-2">
              <RewardsInterface appState={appState} />
            </div>

            {/* Right Column - Education & History */}
            <div className="space-y-8">
              <RewardsEducation appState={appState} />
              <RewardsHistory appState={appState} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
