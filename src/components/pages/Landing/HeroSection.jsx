// Hero section - MANDATORY protocol introduction

import React from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { UI_CONSTANTS, EDUCATION } from "../../../utils/constants.js";

export const HeroSection = ({ appState }) => {
  const { isConnected } = useAccount();

  return (
    <section className="py-12 sm:py-16 lg:py-20 text-center">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Gilbert Mono font throughout */}
        <div className="flex flex-col items-center space-y-6">
          <img
            src="/StakeSafi.png"
            alt="StakeSafari Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32"
          />
          <h1 className="font-gilbert text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight text-center">
            <span className="text-army-green-lighter">StakeSafari</span>
          </h1>
        </div>

        <p className="font-gilbert text-lg sm:text-xl md:text-2xl text-army-green-lighter max-w-4xl mx-auto leading-relaxed px-4">
          Stake your tokens and earn rewards with our innovative dynamic APR
          system. Starting at 250% APR, the rate adjusts based on total staked
          amount.
        </p>

        {/* Key metrics display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 my-8 sm:my-12">
          <div className="bg-dark-light border border-army-green p-4 sm:p-6">
            <div className="font-gilbert text-2xl sm:text-3xl font-bold text-army-green">
              250%
            </div>
            <div className="font-gilbert text-sm sm:text-base text-army-green-lighter">
              Starting APR
            </div>
          </div>

          <div className="bg-dark-light border border-army-green p-4 sm:p-6">
            <div className="font-gilbert text-2xl sm:text-3xl font-bold text-army-green">
              5 days
            </div>
            <div className="font-gilbert text-sm sm:text-base text-army-green-lighter">
              Lock Period
            </div>
          </div>

          <div className="bg-dark-light border border-army-green p-4 sm:p-6">
            <div className="font-gilbert text-2xl sm:text-3xl font-bold text-army-green">
              30%
            </div>
            <div className="font-gilbert text-sm sm:text-base text-army-green-lighter">
              Emergency Penalty
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 px-4">
          {!isConnected ? (
            <>
              <div className="w-full sm:w-auto">
                <ConnectButton />
              </div>

              <button
                onClick={() => appState.navigateTo(UI_CONSTANTS.ROUTES.FAQ)}
                className="w-full sm:w-auto font-gilbert px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-army-green-lighter border border-army-green-light hover:bg-army-green-light hover:text-white text-base sm:text-lg transition-colors"
              >
                Learn More
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => appState.navigateTo(UI_CONSTANTS.ROUTES.FAUCET)}
                className="w-full sm:w-auto font-gilbert px-6 sm:px-8 py-3 sm:py-4 bg-army-green text-white border border-army-green hover:bg-army-green-light text-base sm:text-lg font-bold transition-colors"
              >
                Get Testnet Tokens
              </button>

              <button
                onClick={() => appState.navigateTo(UI_CONSTANTS.ROUTES.STAKE)}
                className="w-full sm:w-auto font-gilbert px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-army-green-lighter border border-army-green-light hover:bg-army-green-light hover:text-white text-base sm:text-lg transition-colors"
              >
                Start Staking
              </button>
            </>
          )}
        </div>

        {/* Risk warning */}
        <div className="bg-dark-lighter border border-army-green-light p-4 sm:p-6 mt-8 sm:mt-12 mx-4 sm:mx-0">
          <h3 className="font-gilbert text-army-green font-bold mb-4 text-base sm:text-lg">
            ⚠️ Important Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-left">
            {EDUCATION.RISK_WARNINGS.map((warning, index) => (
              <div
                key={index}
                className="font-gilbert text-xs sm:text-sm text-army-green-lighter"
              >
                • {warning}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
