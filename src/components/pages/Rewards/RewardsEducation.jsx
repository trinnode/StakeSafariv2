// Rewards education component - MANDATORY educational content

import React from "react";
import { formatTokenAmount } from "../../../utils/formatters.js";
import { STAKING_CONFIG, EDUCATION } from "../../../utils/constants.js";

export const RewardsEducation = ({ appState }) => {
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
  const safeCompareBigInt = (value, comparison) => {
    try {
      const bigIntValue = safeToBigInt(value);
      return bigIntValue > comparison;
    } catch {
      return false;
    }
  };

  // Calculate reward metrics
  const calculateRewardRate = () => {
    if (
      appState.userData.stakeTimestamp === 0 ||
      !safeCompareBigInt(appState.userData.stakedAmount, BigInt(0))
    ) {
      return 0;
    }

    const stakingDays = Math.max(
      1,
      Math.floor(
        (Date.now() / 1000 - appState.userData.stakeTimestamp) / (24 * 60 * 60)
      )
    );
    const dailyRewards =
      Number(
        formatTokenAmount(safeToBigInt(appState.userData.pendingRewards))
      ) / stakingDays;
    const stakedAmount = Number(
      formatTokenAmount(safeToBigInt(appState.userData.stakedAmount))
    );

    return stakedAmount > 0 ? (dailyRewards / stakedAmount) * 100 : 0;
  };

  const dailyRewardRate = calculateRewardRate();
  const annualizedAPR = dailyRewardRate * 365;

  return (
    <div className="space-y-6">
      {/* Current Reward Metrics */}
      <div className="bg-army-green bg-opacity-10 border border-army-green p-6">
        <h3 className="font-gilbert text-xl font-bold text-army-green mb-4">
          Your Reward Metrics
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-gilbert text-army-green-lighter">
              Daily Rate:
            </span>
            <span className="font-gilbert text-army-green font-bold">
              {dailyRewardRate.toFixed(4)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-gilbert text-army-green-lighter">
              Annualized APR:
            </span>
            <span className="font-gilbert text-army-green font-bold">
              {annualizedAPR.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-gilbert text-army-green-lighter">
              Total Claimed:
            </span>
            <span className="font-gilbert text-army-green font-bold">
              {formatTokenAmount(
                safeToBigInt(appState.userData.totalRewardsClaimed)
              )}{" "}
              STAKE
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-gilbert text-army-green-lighter">
              Lifetime Earnings:
            </span>
            <span className="font-gilbert text-army-green font-bold">
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
                  console.error("Error calculating lifetime earnings:", error);
                  return "0";
                }
              })()}{" "}
              STAKE
            </span>
          </div>
        </div>
      </div>

      {/* Reward Calculation */}
      <div className="bg-dark-light border border-army-green-light p-6">
        <h3 className="font-gilbert text-xl font-bold text-army-green-lighter mb-4">
          How Rewards Are Calculated
        </h3>
        <div className="space-y-4 font-gilbert text-army-green-lighter text-sm">
          <div>
            <h4 className="font-gilbert font-bold text-army-green-lighter mb-2">
              Daily Reward Formula
            </h4>
            <div className="bg-dark border border-army-green-light p-3 font-mono text-xs">
              <p>
                Daily Reward = (Your Stake / Total Pool) × Daily Pool Rewards
              </p>
              <p>
                Pool APR = {STAKING_CONFIG.INITIAL_APR}% - (Total Staked ÷ 1000)
                × {STAKING_CONFIG.APR_REDUCTION_PER_THOUSAND}%
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-gilbert font-bold text-army-green-lighter mb-2">
              Factors Affecting Rewards
            </h4>
            <ul className="space-y-1">
              <li>• Your staked amount (higher stake = more rewards)</li>
              <li>• Total protocol stakes (more total = lower APR)</li>
              <li>• Time staked (rewards accrue daily)</li>
              <li>• Network activity (gas costs for claiming)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reward Optimization Tips */}
      <div className="bg-dark-light border border-army-green-light p-6">
        <h3 className="font-gilbert text-xl font-bold text-army-green-lighter mb-4">
          💡 Optimization Tips
        </h3>
        <div className="space-y-3 font-gilbert text-army-green-lighter text-sm">
          <div>
            <h4 className="font-gilbert font-bold text-army-green-lighter mb-1">
              Compound Growth
            </h4>
            <p>
              Claim rewards periodically and restake them to benefit from
              compound growth
            </p>
          </div>

          <div>
            <h4 className="font-gilbert font-bold text-army-green-lighter mb-1">
              Gas Optimization
            </h4>
            <p>
              Time your claims during low network activity to minimize gas fees
            </p>
          </div>

          <div>
            <h4 className="font-gilbert font-bold text-army-green-lighter mb-1">
              Long-term Staking
            </h4>
            <p>Keep tokens staked longer to maximize reward accumulation</p>
          </div>

          <div>
            <h4 className="font-gilbert font-bold text-army-green-lighter mb-1">
              Early Participation
            </h4>
            <p>
              Higher APR when total staked amount is lower (early adopter
              advantage)
            </p>
          </div>
        </div>
      </div>

      {/* Reward Claiming Process */}
      <div className="bg-dark-light border border-army-green-light p-6">
        <h3 className="font-gilbert text-xl font-bold text-army-green-lighter mb-4">
          Claiming Process
        </h3>
        <div className="space-y-4 font-gilbert text-army-green-lighter text-sm">
          {EDUCATION.REWARD_PROCESS.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-6 h-6 border border-army-green-light flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Considerations */}
      <div className="bg-dark-light border border-army-green-light p-6">
        <h3 className="font-gilbert text-xl font-bold text-army-green-lighter mb-4">
          📝 Important Notes
        </h3>
        <div className="space-y-2 font-gilbert text-army-green-lighter text-sm">
          <p>
            • <strong>No Lock Period:</strong> Claiming rewards doesn't affect
            your staked tokens
          </p>
          <p>
            • <strong>Gas Fees:</strong> Each claim transaction requires gas
            fees
          </p>
          <p>
            • <strong>Real-time Updates:</strong> Rewards update continuously
            based on network activity
          </p>
          <p>
            • <strong>Compound Strategy:</strong> Consider restaking rewards for
            maximum growth
          </p>
          <p>
            • <strong>Tax Implications:</strong> Claimed rewards may be taxable
            events (consult advisor)
          </p>
        </div>
      </div>

      {/* Market Context */}
      <div className="bg-army-green bg-opacity-10 border border-army-green p-6">
        <h3 className="font-gilbert text-xl font-bold text-army-green mb-4">
          📊 Current Market Context
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-gilbert text-army-green-lighter">
              Protocol APR:
            </p>
            <p className="font-gilbert text-army-green font-bold">
              {STAKING_CONFIG.INITIAL_APR -
                Math.floor(
                  Number(
                    formatTokenAmount(
                      safeToBigInt(appState.protocolData.totalStaked)
                    )
                  ) / 1000
                ) *
                  STAKING_CONFIG.APR_REDUCTION_PER_THOUSAND}
              %
            </p>
          </div>
          <div>
            <p className="font-gilbert text-army-green-lighter">
              Total Stakers:
            </p>
            <p className="font-gilbert text-army-green font-bold">
              {Number(appState.protocolData.totalStakers)}
            </p>
          </div>
          <div>
            <p className="font-gilbert text-army-green-lighter">Pool Share:</p>
            <p className="font-gilbert text-army-green font-bold">
              {safeCompareBigInt(appState.protocolData.totalStaked, BigInt(0))
                ? (
                    (Number(
                      formatTokenAmount(
                        safeToBigInt(appState.userData.stakedAmount)
                      )
                    ) /
                      Number(
                        formatTokenAmount(
                          safeToBigInt(appState.protocolData.totalStaked)
                        )
                      )) *
                    100
                  ).toFixed(4)
                : "0.0000"}
              %
            </p>
          </div>
          <div>
            <p className="font-gilbert text-army-green-lighter">Total Pool:</p>
            <p className="font-gilbert text-army-green font-bold">
              {formatTokenAmount(
                safeToBigInt(appState.protocolData.totalStaked)
              )}{" "}
              STAKE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
