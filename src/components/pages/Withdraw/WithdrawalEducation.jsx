// Withdrawal education component - MANDATORY educational content

import React from "react";
import { formatTokenAmount } from "../../../utils/formatters.js";
import { STAKING_CONFIG, EDUCATION } from "../../../utils/constants.js";

export const WithdrawalEducation = ({ appState }) => {
  // Calculate stake age
  const calculateStakeAge = () => {
    if (appState.userData.stakeTimestamp === 0) return 0;
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.floor(
      (currentTime - appState.userData.stakeTimestamp) / (24 * 60 * 60)
    );
  };

  const stakeAge = calculateStakeAge();
  const isLockPeriodComplete = stakeAge >= STAKING_CONFIG.LOCK_PERIOD_DAYS;

  return (
    <div className="space-y-6">
      {/* Lock Period Status */}
      <div
        className={`
        border p-6
        ${
          isLockPeriodComplete
            ? "bg-army-green bg-opacity-10 border-army-green"
            : "bg-yellow-900 bg-opacity-20 border-yellow-500"
        }
      `}
      >
        <h3
          className={`
          font-gilbert text-xl font-bold mb-4
          ${isLockPeriodComplete ? "text-army-green" : "text-yellow-400"}
        `}
        >
          {isLockPeriodComplete
            ? "✅ Lock Period Complete"
            : "🔒 Lock Period Active"}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span
              className={`
              font-gilbert 
              ${
                isLockPeriodComplete
                  ? "text-army-green-lighter"
                  : "text-yellow-300"
              }
            `}
            >
              Stake Age:
            </span>
            <span
              className={`
              font-gilbert font-bold
              ${isLockPeriodComplete ? "text-army-green" : "text-yellow-400"}
            `}
            >
              {stakeAge} days
            </span>
          </div>
          <div className="flex justify-between">
            <span
              className={`
              font-gilbert 
              ${
                isLockPeriodComplete
                  ? "text-army-green-lighter"
                  : "text-yellow-300"
              }
            `}
            >
              Required Period:
            </span>
            <span
              className={`
              font-gilbert font-bold
              ${isLockPeriodComplete ? "text-army-green" : "text-yellow-400"}
            `}
            >
              {STAKING_CONFIG.LOCK_PERIOD_DAYS} days
            </span>
          </div>
          <div className="flex justify-between">
            <span
              className={`
              font-gilbert 
              ${
                isLockPeriodComplete
                  ? "text-army-green-lighter"
                  : "text-yellow-300"
              }
            `}
            >
              Withdrawal Status:
            </span>
            <span
              className={`
              font-gilbert font-bold
              ${isLockPeriodComplete ? "text-army-green" : "text-yellow-400"}
            `}
            >
              {isLockPeriodComplete
                ? "Available"
                : `${
                    STAKING_CONFIG.LOCK_PERIOD_DAYS - stakeAge
                  } days remaining`}
            </span>
          </div>
        </div>
      </div>

      {/* Withdrawal Types */}
      <div className="bg-dark-light border border-army-green-light p-6">
        <h3 className="font-gilbert text-xl font-bold text-army-green-lighter mb-4">
          Withdrawal Options
        </h3>
        <div className="space-y-4">
          <div className="bg-dark border border-army-green p-4">
            <h4 className="font-gilbert font-bold text-army-green mb-2">
              Standard Withdrawal
            </h4>
            <ul className="font-gilbert text-army-green-lighter text-sm space-y-1">
              <li>
                • Available after {STAKING_CONFIG.LOCK_PERIOD_DAYS} day lock
                period
              </li>
              <li>• No penalties applied</li>
              <li>• Automatically claims all pending rewards</li>
              <li>• Partial or full withdrawal supported</li>
            </ul>
          </div>

          <div className="bg-red-900 bg-opacity-20 border border-red-500 p-4">
            <h4 className="font-gilbert font-bold text-red-400 mb-2">
              Emergency Withdrawal
            </h4>
            <ul className="font-gilbert text-red-300 text-sm space-y-1">
              <li>• Available anytime (even during lock period)</li>
              <li>
                • {STAKING_CONFIG.PENALTY_PERCENTAGE}% penalty on staked amount
              </li>
              <li>• Penalty tokens are Slashed</li>
              <li>• Rewards can still be claimed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Current Position Summary */}
      <div className="bg-dark-light border border-army-green-light p-6">
        <h3 className="font-gilbert text-xl font-bold text-army-green-lighter mb-4">
          Position Summary
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-gilbert text-army-green-lighter">
              Total Staked:
            </span>
            <span className="font-gilbert text-army-green font-bold">
              {formatTokenAmount(appState.userData.stakedAmount || BigInt(0))}{" "}
              STAKE
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-gilbert text-army-green-lighter">
              Pending Rewards:
            </span>
            <span className="font-gilbert text-army-green font-bold">
              {formatTokenAmount(appState.userData.pendingRewards || BigInt(0))}{" "}
              STAKE
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-gilbert text-army-green-lighter">
              Total Claimable:
            </span>
            <span className="font-gilbert text-army-green font-bold">
              {(() => {
                try {
                  const stakedAmount =
                    appState.userData.stakedAmount || BigInt(0);
                  const pendingRewards =
                    appState.userData.pendingRewards || BigInt(0);

                  const stakedBig =
                    typeof stakedAmount === "bigint"
                      ? stakedAmount
                      : BigInt(stakedAmount || 0);
                  const pendingBig =
                    typeof pendingRewards === "bigint"
                      ? pendingRewards
                      : BigInt(pendingRewards || 0);

                  return formatTokenAmount(stakedBig + pendingBig);
                } catch (error) {
                  console.error("Error calculating total claimable:", error);
                  return "0";
                }
              })()}{" "}
              STAKE
            </span>
          </div>
        </div>
      </div>

      {/* Withdrawal Process */}
      <div className="bg-dark-light border border-army-green-light p-6">
        <h3 className="font-gilbert text-xl font-bold text-army-green-lighter mb-4">
          How Withdrawal Works
        </h3>
        <div className="space-y-4 font-gilbert text-army-green-lighter text-sm">
          {EDUCATION.WITHDRAWAL_PROCESS.map((step, index) => (
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
          ⚠️ Important Considerations
        </h3>
        <div className="space-y-2 font-gilbert text-army-green-lighter text-sm">
          <p>
            • <strong>Gas Fees:</strong> Withdrawal transactions require gas
            fees
          </p>
          <p>
            • <strong>Reward Claiming:</strong> All pending rewards are
            automatically claimed
          </p>
          <p>
            • <strong>Partial Withdrawals:</strong> You can withdraw any amount
            up to your staked balance
          </p>
          <p>
            • <strong>Transaction Time:</strong> Withdrawals may take several
            minutes to process
          </p>
          <p>
            • <strong>Network Congestion:</strong> Transaction fees may vary
            based on network usage
          </p>
        </div>
      </div>
    </div>
  );
};
