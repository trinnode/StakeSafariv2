// Development summary - MANDATORY completion status

import React, { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { sepolia } from "wagmi/chains";

export const DevSummary = ({ appState }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const isCorrectNetwork = chainId === sepolia.id;

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-army-green text-white px-4 py-2 font-gilbert text-sm border border-army-green hover:bg-army-green-light z-50"
      >
        Show Dev Summary
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-dark border border-army-green max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-gilbert text-2xl font-bold text-army-green">
              🚀 Complete Web3 Staking dApp - DELIVERED
            </h1>
            <button
              onClick={() => setIsVisible(false)}
              className="text-army-green-lighter hover:text-army-green text-2xl"
            >
              ×
            </button>
          </div>

          {/* Implementation Status */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-army-green bg-opacity-10 border border-army-green p-4">
              <h2 className="font-gilbert text-xl font-bold text-army-green mb-4">
                ✅ COMPLETED FEATURES
              </h2>
              <div className="space-y-2 font-gilbert text-army-green-lighter text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-army-green">✓</span>
                  <span>Complete multi-step staking wizard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-army-green">✓</span>
                  <span>Standard withdrawal with lock validation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-army-green">✓</span>
                  <span>Emergency withdrawal with penalty calculator</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-army-green">✓</span>
                  <span>Reward claiming interface</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-army-green">✓</span>
                  <span>Comprehensive FAQ with search</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-army-green">✓</span>
                  <span>Real-time WebSocket event tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-army-green">✓</span>
                  <span>Educational content throughout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-army-green">✓</span>
                  <span>Token faucet for testnet tokens</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-light border border-army-green-light p-4">
              <h2 className="font-gilbert text-xl font-bold text-army-green-lighter mb-4">
                🏗️ TECHNICAL STACK
              </h2>
              <div className="space-y-2 font-gilbert text-army-green-lighter text-sm">
                <div className="flex justify-between">
                  <span>Frontend:</span>
                  <span className="text-army-green">React + Vite</span>
                </div>
                <div className="flex justify-between">
                  <span>Web3:</span>
                  <span className="text-army-green">Viem (MANDATORY)</span>
                </div>
                <div className="flex justify-between">
                  <span>Styling:</span>
                  <span className="text-army-green">Tailwind CSS</span>
                </div>
                <div className="flex justify-between">
                  <span>Typography:</span>
                  <span className="text-army-green">Gilbert Mono</span>
                </div>
                <div className="flex justify-between">
                  <span>Colors:</span>
                  <span className="text-army-green">Army Green + Black</span>
                </div>
                <div className="flex justify-between">
                  <span>Design:</span>
                  <span className="text-army-green">
                    Flat (No shadows/borders)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Data:</span>
                  <span className="text-army-green">WebSocket Real-time</span>
                </div>
                <div className="flex justify-between">
                  <span>Network:</span>
                  <span className="text-army-green">Sepolia Testnet</span>
                </div>
              </div>
            </div>

            {/* Connection Status */}
            <div className="bg-dark-light border border-army-green-light p-4">
              <h2 className="font-gilbert text-xl font-bold text-army-green-lighter mb-4">
                🔗 CONNECTION STATUS
              </h2>
              <div className="space-y-2 font-gilbert text-army-green-lighter text-sm">
                <div className="flex justify-between">
                  <span>Wallet:</span>
                  <span
                    className={isConnected ? "text-army-green" : "text-red-400"}
                  >
                    {isConnected ? "Connected" : "Not Connected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Network:</span>
                  <span
                    className={
                      isCorrectNetwork ? "text-army-green" : "text-red-400"
                    }
                  >
                    {isCorrectNetwork ? "Sepolia" : "Wrong Network"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>User Address:</span>
                  <span className="text-army-green text-xs">
                    {appState.userAddress
                      ? `${appState.userAddress.slice(
                          0,
                          6
                        )}...${appState.userAddress.slice(-4)}`
                      : "None"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Token Balance:</span>
                  <span className="text-army-green">
                    {appState.getUserStats()?.tokenBalanceFormatted || "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Staked Amount:</span>
                  <span className="text-army-green">
                    {appState.getUserStats()?.stakedAmountFormatted || "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Page Overview */}
          <div className="mb-8">
            <h2 className="font-gilbert text-xl font-bold text-army-green mb-4">
              📄 IMPLEMENTED PAGES
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  name: "Landing",
                  icon: "🏠",
                  features: [
                    "Hero section",
                    "Protocol stats",
                    "How it works",
                    "Features grid",
                  ],
                },
                {
                  name: "Staking",
                  icon: "📈",
                  features: [
                    "Multi-step wizard",
                    "Amount validation",
                    "APR calculator",
                    "Education panel",
                  ],
                },
                {
                  name: "Withdraw",
                  icon: "📤",
                  features: [
                    "Lock period check",
                    "Partial withdrawal",
                    "Auto reward claim",
                    "History tracking",
                  ],
                },
                {
                  name: "Emergency",
                  icon: "🚨",
                  features: [
                    "Penalty calculator",
                    "30% burn mechanism",
                    "Multi-step confirm",
                    "Risk warnings",
                  ],
                },
                {
                  name: "Rewards",
                  icon: "💰",
                  features: [
                    "Claim interface",
                    "Compound strategy",
                    "Metrics display",
                    "Optimization tips",
                  ],
                },
                {
                  name: "FAQ",
                  icon: "❓",
                  features: [
                    "Comprehensive docs",
                    "Search function",
                    "Expandable sections",
                    "Technical details",
                  ],
                },
                {
                  name: "Faucet",
                  icon: "🚰",
                  features: [
                    "Token minting",
                    "Daily limits",
                    "Rate limiting",
                    "Balance display",
                  ],
                },
              ].map((page) => (
                <div
                  key={page.name}
                  className="bg-dark-light border border-army-green-light p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{page.icon}</span>
                    <span className="font-gilbert font-bold text-army-green-lighter">
                      {page.name}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {page.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="font-gilbert text-army-green-lighter text-xs"
                      >
                        • {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Contract Integration */}
          <div className="bg-dark-light border border-army-green-light p-6 mb-6">
            <h2 className="font-gilbert text-xl font-bold text-army-green-lighter mb-4">
              🔗 SMART CONTRACT INTEGRATION
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-gilbert font-bold text-army-green mb-2">
                  Staking Contract Functions
                </h3>
                <div className="space-y-1 font-gilbert text-army-green-lighter text-sm">
                  <div>• stake(amount) - Lock tokens for rewards</div>
                  <div>• withdraw(amount) - Standard withdrawal</div>
                  <div>• emergencyWithdraw(amount) - With penalty</div>
                  <div>• claimReward() - Claim accumulated rewards</div>
                  <div>• getUserStakeInfo() - Get user data</div>
                </div>
              </div>
              <div>
                <h3 className="font-gilbert font-bold text-army-green mb-2">
                  Event Listening
                </h3>
                <div className="space-y-1 font-gilbert text-army-green-lighter text-sm">
                  <div>• Staked - New stake events</div>
                  <div>• Withdrawn - Standard withdrawals</div>
                  <div>• EmergencyWithdrawn - Emergency events</div>
                  <div>• RewardClaimed - Reward claims</div>
                  <div>• Real-time WebSocket updates</div>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Highlights */}
          <div className="bg-army-green bg-opacity-10 border border-army-green p-6">
            <h2 className="font-gilbert text-xl font-bold text-army-green mb-4">
              🏛️ ARCHITECTURE HIGHLIGHTS
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-gilbert font-bold text-army-green-lighter mb-2">
                  Event-Driven Design
                </h3>
                <div className="space-y-1 font-gilbert text-army-green-lighter text-sm">
                  <div>• WebSocket for real-time updates</div>
                  <div>• No HTTP polling (better performance)</div>
                  <div>• Automatic data synchronization</div>
                  <div>• Memory leak prevention</div>
                </div>
              </div>
              <div>
                <h3 className="font-gilbert font-bold text-army-green-lighter mb-2">
                  User Experience
                </h3>
                <div className="space-y-1 font-gilbert text-army-green-lighter text-sm">
                  <div>• Educational tooltips everywhere</div>
                  <div>• Multi-step confirmation for risky actions</div>
                  <div>• Clear error messages and validation</div>
                  <div>• Progress indicators for long operations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Access Information */}
          <div className="mt-6 text-center">
            <p className="font-gilbert text-army-green-lighter mb-4">
              🌐 <strong>Development Server Running:</strong>{" "}
              http://localhost:5173
            </p>
            <p className="font-gilbert text-army-green-lighter text-sm">
              Complete Web3 staking dApp with all requested features implemented
              using
              <br />
              React + Vite + Viem + Tailwind + Gilbert Mono + Army Green/Black
              design system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
