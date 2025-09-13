// How it works section - MANDATORY educational content

import React from "react";
import { useAccount } from "wagmi";
import { EDUCATION, UI_CONSTANTS } from "../../../utils/constants.js";

export const HowItWorks = ({ appState }) => {
  // Get current stats for dynamic content
  const protocolStats = appState.getProtocolStats();
  const userStats = appState.getUserStats();
  const { isConnected } = useAccount();

  return (
    <section className="px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-gilbert text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="font-gilbert text-xl text-army-green-lighter">
            Simple 3-step process to start earning rewards
          </p>
        </div>

        {/* Educational step-by-step guide */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {EDUCATION.STAKING_STEPS.map((step, index) => (
            <div key={index} className="text-center">
              {/* Step number and icon */}
              <div className="bg-dark-light border border-army-green p-8 mb-6">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="font-gilbert text-6xl font-bold text-army-green mb-2">
                  {index + 1}
                </div>
                <h3 className="font-gilbert text-xl font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="font-gilbert text-army-green-lighter">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed process explanation */}
        <div className="bg-dark-lighter border border-army-green p-8">
          <h3 className="font-gilbert text-2xl font-bold text-army-green mb-6">
            Detailed Process
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Staking Process */}
            <div>
              <h4 className="font-gilbert text-lg font-bold text-white mb-4">
                📈 Staking Process
              </h4>
              <ul className="font-gilbert text-army-green-lighter space-y-2 text-sm">
                <li>• Approve tokens for the staking contract</li>
                <li>• Deposit your tokens into the staking pool</li>
                <li>• Tokens are locked for minimum 5 days </li>
                <li>• Rewards accrue automatically over time</li>
                <li>• APR decreases as more tokens are staked</li>
              </ul>
            </div>

            {/* Withdrawal Process */}
            <div>
              <h4 className="font-gilbert text-lg font-bold text-white mb-4">
                💰 Withdrawal Process
              </h4>
              <ul className="font-gilbert text-army-green-lighter space-y-2 text-sm">
                <li>• Wait for lock period to expire</li>
                <li>• Withdraw any amount up to your stake</li>
                <li>• Claim accumulated rewards separately</li>
                <li>• Emergency withdrawal available (30% penalty)</li>
                <li>• Penalty tokens are permanently Slashed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dynamic APR explanation */}
        <div className="mt-8 bg-dark border border-army-green-light p-8">
          <h3 className="font-gilbert text-2xl font-bold text-army-green mb-6">
            🔄 Dynamic APR System
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="font-gilbert text-2xl font-bold text-army-green mb-2">
                {isConnected ? protocolStats.currentAPRFormatted : "250%"}
              </div>
              <div className="font-gilbert text-army-green-lighter text-sm">
                {isConnected ? "Current APR" : "Initial APR"}
              </div>
              <div className="font-gilbert text-xs text-army-green mt-2">
                {isConnected ? "Live rate" : "When protocol launches"}
              </div>
            </div>

            <div className="text-center">
              <div className="font-gilbert text-2xl font-bold text-army-green mb-2">
                {isConnected ? protocolStats.totalStakedFormatted : "0"}
              </div>
              <div className="font-gilbert text-army-green-lighter text-sm">
                Total Staked
              </div>
              <div className="font-gilbert text-xs text-army-green mt-2">
                {isConnected ? "All users" : "Affects APR"}
              </div>
            </div>

            <div className="text-center">
              <div className="font-gilbert text-2xl font-bold text-army-green mb-2">
                {isConnected || userStats
                  ? userStats.stakedAmountFormatted
                  : "0"}
              </div>
              <div className="font-gilbert text-army-green-lighter text-sm">
                Your Stake
              </div>
              <div className="font-gilbert text-xs text-army-green mt-2">
                {isConnected
                  ? userStats?.hasStake
                    ? "Earning rewards"
                    : "Not staking yet"
                  : "Connect to view"}
              </div>
            </div>

            <div className="text-center">
              <div className="font-gilbert text-2xl font-bold text-army-green mb-2">
                -0.5%
              </div>
              <div className="font-gilbert text-army-green-lighter text-sm">
                Per 1000 Tokens
              </div>
              <div className="font-gilbert text-xs text-army-green mt-2">
                APR reduction rate
              </div>
            </div>

            <div className="text-center">
              <div className="font-gilbert text-2xl font-bold text-army-green mb-2">
                Real-time
              </div>
              <div className="font-gilbert text-army-green-lighter text-sm">
                Rate Updates
              </div>
              <div className="font-gilbert text-xs text-army-green mt-2">
                Via contract events
              </div>
            </div>
          </div>

          <div className="mt-6 font-gilbert text-army-green-lighter text-center">
            As more tokens are staked, the APR decreases to maintain protocol
            sustainability
          </div>
        </div>
      </div>
    </section>
  );
};
