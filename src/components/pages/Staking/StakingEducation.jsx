// Staking education component - MANDATORY educational content

import React from "react";
import { formatTokenAmount } from "../../../utils/formatters.js";
import { EDUCATION, STAKING_CONFIG } from "../../../utils/constants.js";

export const StakingEducation = ({ appState, estimatedAPR, stakeAmount }) => {
  // Calculate potential earnings
  const calculateEarnings = (amount, apr, days) => {
    const dailyRate = apr / 100 / 365;
    return amount * dailyRate * days;
  };

  const stakingAmount = parseFloat(stakeAmount || "0");

  return (
    <div className="space-y-6">
      {/* Current Protocol Stats */}
      <div className="bg-dark-light border border-army-green p-6">
        <h3 className="font-gilbert text-xl font-bold text-army-green mb-4">
          Protocol Statistics
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-gilbert text-army-green-lighter">
              Total Staked:
            </span>
            <span className="font-gilbert text-army-green font-bold">
              {formatTokenAmount(appState.protocolData.totalStaked)} STAKE
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-gilbert text-army-green-lighter">
              Total Stakers:
            </span>
            <span className="font-gilbert text-army-green font-bold">
              {Number(appState.protocolData.totalStakers)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-gilbert text-army-green-lighter">
              Current APR:
            </span>
            <span className="font-gilbert text-army-green font-bold">
              {estimatedAPR}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-gilbert text-army-green-lighter">
              Total Rewards Paid:
            </span>
            <span className="font-gilbert text-army-green font-bold">
              {formatTokenAmount(appState.protocolData.totalRewardsPaid)} STAKE
            </span>
          </div>
        </div>
      </div>

      {/* Earnings Calculator */}
      {stakingAmount > 0 && (
        <div className="bg-army-green bg-opacity-10 border border-army-green p-6">
          <h3 className="font-gilbert text-xl font-bold text-army-green mb-4">
            Projected Earnings
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-gilbert text-army-green-lighter">
                Daily:
              </span>
              <span className="font-gilbert text-army-green font-bold">
                {calculateEarnings(stakingAmount, estimatedAPR, 1).toFixed(4)}{" "}
                STAKE
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-gilbert text-army-green-lighter">
                Weekly:
              </span>
              <span className="font-gilbert text-army-green font-bold">
                {calculateEarnings(stakingAmount, estimatedAPR, 7).toFixed(4)}{" "}
                STAKE
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-gilbert text-army-green-lighter">
                Monthly:
              </span>
              <span className="font-gilbert text-army-green font-bold">
                {calculateEarnings(stakingAmount, estimatedAPR, 30).toFixed(4)}{" "}
                STAKE
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-gilbert text-army-green-lighter">
                Yearly:
              </span>
              <span className="font-gilbert text-army-green font-bold">
                {calculateEarnings(stakingAmount, estimatedAPR, 365).toFixed(2)}{" "}
                STAKE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Staking Rules */}
      <div className="bg-dark-light border border-army-green-light p-6">
        <h3 className="font-gilbert text-xl font-bold text-army-green-lighter mb-4">
          Staking Rules
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-gilbert font-bold text-army-green-lighter mb-2">
              Lock Period
            </h4>
            <p className="font-gilbert text-army-green-lighter text-sm">
              {STAKING_CONFIG.LOCK_PERIOD_DAYS} days minimum lock period. Early
              withdrawal incurs {STAKING_CONFIG.PENALTY_PERCENTAGE}% penalty.
            </p>
          </div>

          <div>
            <h4 className="font-gilbert font-bold text-army-green-lighter mb-2">
              Rewards Distribution
            </h4>
            <p className="font-gilbert text-army-green-lighter text-sm">
              Rewards are calculated daily and can be claimed anytime. Claiming
              rewards does not affect your staked amount.
            </p>
          </div>

          <div>
            <h4 className="font-gilbert font-bold text-army-green-lighter mb-2">
              APR Mechanism
            </h4>
            <p className="font-gilbert text-army-green-lighter text-sm">
              APR starts at {STAKING_CONFIG.INITIAL_APR}% and decreases by{" "}
              {STAKING_CONFIG.APR_REDUCTION_PER_THOUSAND}% for every 1,000
              tokens staked in the protocol.
            </p>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-dark-light border border-army-green-light p-6">
        <h3 className="font-gilbert text-xl font-bold text-army-green-lighter mb-4">
          How Staking Works
        </h3>
        <div className="space-y-4 font-gilbert text-army-green-lighter text-sm">
          {EDUCATION.STAKING_PROCESS.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-6 h-6 border border-army-green-light flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Warning */}
      <div className="bg-red-900 bg-opacity-20 border border-red-500 p-6">
        <h3 className="font-gilbert text-xl font-bold text-red-400 mb-4">
          ⚠️ Important Risks
        </h3>
        <div className="space-y-2 font-gilbert text-red-300 text-sm">
          <p>• Smart contract risk: Funds are locked in the contract</p>
          <p>
            • Early withdrawal penalty: {STAKING_CONFIG.PENALTY_PERCENTAGE}% of
            staked amount
          </p>
          <p>• APR changes: Returns may decrease as more users stake</p>
          <p>• Testnet only: This is for testing purposes only</p>
        </div>
      </div>
    </div>
  );
};
