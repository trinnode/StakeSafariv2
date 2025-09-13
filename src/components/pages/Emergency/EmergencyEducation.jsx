// Emergency education component - MANDATORY penalty information

import React from "react";
import { formatTokenAmount } from "../../../utils/formatters.js";
import { STAKING_CONFIG, EDUCATION } from "../../../utils/constants.js";

export const EmergencyEducation = ({ appState }) => {
  // Calculate potential penalty amounts
  const calculatePenalty = (amount) => {
    return (amount * BigInt(STAKING_CONFIG.PENALTY_PERCENTAGE)) / BigInt(100);
  };

  const stakedAmount = appState.userData.stakedAmount;
  const fullPenalty = calculatePenalty(stakedAmount);
  const netAfterFullWithdrawal = stakedAmount - fullPenalty;

  return (
    <div className="space-y-6">
      {/* Penalty Warning */}
      <div className="bg-red-900 bg-opacity-30 border border-red-500 p-6">
        <h3 className="font-gilbert text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
          ⚠️ Penalty Information
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-gilbert text-red-300">Penalty Rate:</span>
            <span className="font-gilbert text-red-400 font-bold">
              {STAKING_CONFIG.PENALTY_PERCENTAGE}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-gilbert text-red-300">
              Your Full Penalty:
            </span>
            <span className="font-gilbert text-red-400 font-bold">
              {formatTokenAmount(fullPenalty)} STAKE
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-gilbert text-red-300">
              Net if Full Withdrawal:
            </span>
            <span className="font-gilbert text-red-400 font-bold">
              {formatTokenAmount(netAfterFullWithdrawal)} STAKE
            </span>
          </div>
        </div>
      </div>

      {/* When to Use Emergency Withdrawal */}
      <div className="bg-dark-light border border-red-500 p-6">
        <h3 className="font-gilbert text-xl font-bold text-red-400 mb-4">
          When to Use Emergency Withdrawal
        </h3>
        <div className="space-y-3 font-gilbert text-red-300 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-red-400 font-bold">✓</span>
            <span>Urgent financial emergency requiring immediate funds</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-400 font-bold">✓</span>
            <span>Critical personal or business situation</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-400 font-bold">✓</span>
            <span>
              You accept the {STAKING_CONFIG.PENALTY_PERCENTAGE}% penalty cost
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-400 font-bold">✗</span>
            <span>Normal portfolio rebalancing (use standard withdrawal)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-400 font-bold">✗</span>
            <span>Market timing or speculative moves</span>
          </div>
        </div>
      </div>

      {/* How Emergency Withdrawal Works */}
      <div className="bg-dark-light border border-red-500 p-6">
        <h3 className="font-gilbert text-xl font-bold text-red-400 mb-4">
          How It Works
        </h3>
        <div className="space-y-4 font-gilbert text-red-300 text-sm">
          {EDUCATION.EMERGENCY_PROCESS.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-6 h-6 border border-red-500 flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Token Slash Mechanism */}
      <div className="bg-dark-light border border-red-500 p-6">
        <h3 className="font-gilbert text-xl font-bold text-red-400 mb-4">
          🔥 Token Slash Mechanism
        </h3>
        <div className="space-y-3 font-gilbert text-red-300 text-sm">
          <p>
            <strong>Deflationary Design:</strong> Penalty tokens are permanently
            Slashed, reducing total supply and potentially increasing value for
            remaining holders.
          </p>
          <p>
            <strong>No Recovery:</strong> Slashed tokens cannot be recovered,
            minted back, or retrieved through any mechanism.
          </p>
          <p>
            <strong>Network Effect:</strong> The Slash mechanism helps maintain
            protocol stability by discouraging premature exits.
          </p>
        </div>
      </div>

      {/* Alternatives to Emergency Withdrawal */}
      <div className="bg-army-green bg-opacity-10 border border-army-green p-6">
        <h3 className="font-gilbert text-xl font-bold text-army-green mb-4">
          💡 Better Alternatives
        </h3>
        <div className="space-y-3 font-gilbert text-army-green-lighter text-sm">
          <div className="flex items-start gap-2">
            <span className="text-army-green font-bold">1.</span>
            <div>
              <p className="font-bold">Wait for Lock Period</p>
              <p>
                Standard withdrawal with no penalty after{" "}
                {STAKING_CONFIG.LOCK_PERIOD_DAYS} days
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-army-green font-bold">2.</span>
            <div>
              <p className="font-bold">Claim Rewards Only</p>
              <p>
                Access your earned rewards without touching staked principal
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-army-green font-bold">3.</span>
            <div>
              <p className="font-bold">Partial Withdrawal</p>
              <p>Withdraw only the amount you need, keeping the rest staked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-red-900 bg-opacity-20 border border-red-500 p-6">
        <h3 className="font-gilbert text-xl font-bold text-red-400 mb-4">
          🚨 Risk Assessment
        </h3>
        <div className="space-y-2 font-gilbert text-red-300 text-sm">
          <p>
            • <strong>Financial Loss:</strong>{" "}
            {STAKING_CONFIG.PENALTY_PERCENTAGE}% of withdrawn amount is lost
            forever
          </p>
          <p>
            • <strong>Opportunity Cost:</strong> Missing out on future rewards
            from staked tokens
          </p>
          <p>
            • <strong>Market Impact:</strong> Slashed tokens may affect your
            remaining holdings
          </p>
          <p>
            • <strong>Irreversible:</strong> No way to undo the transaction once
            confirmed
          </p>
          <p>
            • <strong>Gas Costs:</strong> Transaction fees still apply despite
            penalty
          </p>
        </div>
      </div>
    </div>
  );
};
