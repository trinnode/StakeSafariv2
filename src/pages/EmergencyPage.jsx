// Emergency withdrawal page - MANDATORY penalty calculator

import React, { useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { EmergencyInterface } from "../components/pages/Emergency/EmergencyInterface.jsx";
import { EmergencyEducation } from "../components/pages/Emergency/EmergencyEducation.jsx";
import { EmergencyHistory } from "../components/pages/Emergency/EmergencyHistory.jsx";
import { formatTokenAmount } from "../utils/formatters.js";
import { UI_CONSTANTS, STAKING_CONFIG } from "../utils/constants.js";

export const EmergencyPage = ({ appState }) => {
  const [calculatedPenalty, setCalculatedPenalty] = useState(BigInt(0));
  const [showPenaltyWarning, setShowPenaltyWarning] = useState(false);

  // Wagmi hooks for wallet connection
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isCorrectNetwork = chainId === sepolia.id;

  // Calculate penalty amount when user has staked tokens
  const userStakedAmount = appState.userData.stakedAmount;
  const penaltyAmount =
    calculatedPenalty > BigInt(0)
      ? calculatedPenalty
      : (userStakedAmount * BigInt(STAKING_CONFIG.PENALTY_PERCENTAGE)) /
        BigInt(100);
  const netWithdrawal = userStakedAmount - penaltyAmount;

  // Format amounts for display
  const formatStakedAmount = () => formatTokenAmount(userStakedAmount);
  const formatPenaltyAmount = () => formatTokenAmount(penaltyAmount);
  const formatNetAmount = () => formatTokenAmount(netWithdrawal);
  return (
    <div className="min-h-screen bg-dark text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 border-2 border-red-500 mx-auto mb-6 flex items-center justify-center">
            <span className="font-gilbert text-4xl text-red-500">🚨</span>
          </div>
          <h1 className="font-gilbert text-4xl font-bold text-red-400 mb-4">
            Emergency Withdrawal
          </h1>
          <p className="font-gilbert text-xl text-red-300">
            Withdraw with {STAKING_CONFIG.PENALTY_PERCENTAGE}% penalty - tokens
            are burned
          </p>
        </div>

        {!isConnected ? (
          /* Wallet Connection Required */
          <div className="bg-dark-light border border-army-green p-8 text-center">
            <h2 className="font-gilbert text-2xl font-bold text-army-green mb-4">
              Connect Wallet Required
            </h2>
            <p className="font-gilbert text-army-green-lighter mb-6">
              Please connect your wallet to use emergency withdrawal
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
              Please switch to Sepolia testnet for emergency withdrawal
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
              You don't have any staked tokens for emergency withdrawal.
            </p>
            <button
              onClick={() => appState.navigateTo(UI_CONSTANTS.ROUTES.STAKING)}
              className="font-gilbert px-8 py-3 bg-army-green-light text-white border border-army-green-light hover:bg-army-green"
            >
              Stake Tokens
            </button>
          </div>
        ) : (
          /* Main Emergency Interface */
          <>
            {/* Warning Banner */}
            <div className="bg-red-900 border border-red-500 p-6 mb-8">
              <div className="flex items-start gap-4">
                <span className="font-gilbert text-3xl text-red-400">⚠️</span>
                <div>
                  <h2 className="font-gilbert text-xl font-bold text-red-400 mb-2">
                    HIGH PENALTY WARNING
                  </h2>
                  <div className="font-gilbert text-red-300 space-y-1">
                    <p>
                      • {STAKING_CONFIG.PENALTY_PERCENTAGE}% of your staked
                      tokens will be permanently burned
                    </p>
                    <p>• This action cannot be undone</p>
                    <p>
                      • Consider standard withdrawal if lock period has expired
                    </p>
                    <p>• Only use in true emergency situations</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Emergency Interface */}
              <div className="lg:col-span-2 space-y-6">
                {/* Penalty Breakdown */}
                <div className="bg-dark-light border border-red-500 p-6">
                  <h3 className="font-gilbert text-xl font-bold text-red-400 mb-4">
                    💸 Penalty Breakdown
                  </h3>
                  <div className="space-y-3 font-gilbert text-sm">
                    <div className="flex justify-between">
                      <span className="text-red-300">Your Staked Amount:</span>
                      <span className="text-white">{formatStakedAmount()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-300">
                        Penalty ({STAKING_CONFIG.PENALTY_PERCENTAGE}%):
                      </span>
                      <span className="text-red-400">
                        -{formatPenaltyAmount()}
                      </span>
                    </div>
                    <div className="border-t border-red-600 pt-3 flex justify-between font-bold">
                      <span className="text-red-300">You'll Receive:</span>
                      <span className="text-army-green">
                        {formatNetAmount()}
                      </span>
                    </div>
                  </div>

                  {showPenaltyWarning && (
                    <div className="mt-4 p-3 bg-red-800 border border-red-600">
                      <p className="font-gilbert text-red-200 text-sm">
                        ⚠️ Penalty tokens will be permanently burned from the
                        supply!
                      </p>
                    </div>
                  )}
                </div>

                <EmergencyInterface
                  appState={appState}
                  onCalculatePenalty={setCalculatedPenalty}
                  onToggleWarning={setShowPenaltyWarning}
                />
              </div>

              {/* Right Column - Education & History */}
              <div className="space-y-8">
                <EmergencyEducation appState={appState} />
                <EmergencyHistory appState={appState} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
