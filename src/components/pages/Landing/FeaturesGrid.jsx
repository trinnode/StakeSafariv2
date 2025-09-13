// Features grid - MANDATORY benefits display

import React from "react";
import { useAccount } from "wagmi";
import { EDUCATION } from "../../../utils/constants.js";

export const FeaturesGrid = ({ appState }) => {
  // Get dynamic data from app state
  const protocolStats = appState.getProtocolStats();
  const { isConnected } = useAccount();

  const features = [
    {
      icon: "📈",
      title: "Dynamic APR",
      description: isConnected
        ? `Currently at ${protocolStats.currentAPRFormatted}, adjusting based on total staked amount for sustainable rewards.`
        : "Starting at 250% APR, adjusting based on total staked amount for sustainable rewards.",
      benefit: "High initial returns",
    },
    {
      icon: "⚡",
      title: "Real-time Updates",
      description:
        "WebSocket-driven interface provides instant updates when contract events occur.",
      benefit: "Zero-delay data sync",
    },
    {
      icon: "🔒",
      title: "Secure Staking",
      description:
        "OpenZeppelin-based smart contracts with reentrancy protection and pause mechanisms.",
      benefit: "Battle-tested security",
    },
    {
      icon: "🚨",
      title: "Emergency Exit",
      description:
        "Emergency withdrawal option available anytime with 30% penalty for immediate access.",
      benefit: "Flexible liquidity",
    },
    {
      icon: "🔥",
      title: "Burn Mechanism",
      description: isConnected
        ? `${protocolStats.totalBurnedFormatted} tokens burned so far from emergency withdrawals, reducing supply.`
        : "Penalty tokens from emergency withdrawals are permanently burned, reducing supply.",
      benefit: "Deflationary pressure",
    },
    {
      icon: "⏰",
      title: "Short Lock Period",
      description:
        "Only 5 days minimum lock period for regular withdrawals after staking.",
      benefit: "Quick accessibility",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-dark-light">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-gilbert text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Protocol Features
          </h2>
          <p className="font-gilbert text-lg sm:text-xl text-army-green-lighter px-4">
            Built for security, flexibility, and user experience
          </p>
        </div>

        {/* Flat design with army green and black only */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-dark border border-army-green p-4 sm:p-6 hover:border-army-green-light transition-colors"
            >
              <div className="text-3xl sm:text-4xl mb-4">{feature.icon}</div>

              <h3 className="font-gilbert text-lg sm:text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>

              <p className="font-gilbert text-army-green-lighter text-sm leading-relaxed mb-4">
                {feature.description}
              </p>

              <div className="bg-army-green-light bg-opacity-20 border border-army-green-light p-3">
                <div className="font-gilbert text-army-green text-xs font-bold">
                  ✓ {feature.benefit}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits summary */}
        <div className="mt-12 sm:mt-16 bg-dark border border-army-green-light p-6 sm:p-8">
          <h3 className="font-gilbert text-xl sm:text-2xl font-bold text-army-green mb-6 text-center">
            Why Choose Our Protocol?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h4 className="font-gilbert text-base sm:text-lg font-bold text-white mb-4">
                ✅ Protocol Benefits
              </h4>
              <ul className="font-gilbert text-army-green-lighter space-y-2 text-sm">
                {EDUCATION.BENEFITS.map((benefit, index) => (
                  <li key={index}>• {benefit}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-gilbert text-base sm:text-lg font-bold text-white mb-4">
                ⚠️ Risk Factors
              </h4>
              <ul className="font-gilbert text-army-green-lighter space-y-2 text-sm">
                {EDUCATION.RISK_WARNINGS.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
