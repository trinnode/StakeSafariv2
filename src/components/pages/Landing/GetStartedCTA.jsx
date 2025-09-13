// Get started CTA section - MANDATORY call-to-action

import React from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { UI_CONSTANTS } from "../../../utils/constants.js";

export const GetStartedCTA = ({ appState }) => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isCorrectNetwork = chainId === sepolia.id;

  return (
    <section className="px-6 py-20 bg-dark">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-gilbert text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Start
          <br />
          <span className="text-army-green-lighter">Earning Rewards?</span>
        </h2>

        <p className="font-gilbert text-xl text-army-green-lighter mb-12 max-w-2xl mx-auto">
          Connect your wallet and get testnet tokens to begin staking in our
          dynamic APR protocol today.
        </p>

        {/* Different CTAs based on connection status */}
        {!isConnected ? (
          <div className="space-y-6">
            <div className="bg-dark-lighter border border-army-green p-8">
              <h3 className="font-gilbert text-2xl font-bold text-army-green mb-4">
                🔗 Step 1: Connect Wallet
              </h3>
              <p className="font-gilbert text-army-green-lighter mb-6">
                Connect your Web3 wallet (MetaMask, WalletConnect, etc.) to
                interact with the protocol
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>

            <div className="bg-dark-lighter border border-army-green-light p-8 opacity-60">
              <h3 className="font-gilbert text-2xl font-bold text-army-green-lighter mb-4">
                🪙 Step 2: Get Tokens
              </h3>
              <p className="font-gilbert text-army-green-lighter mb-6">
                Visit our faucet to mint testnet tokens for staking
              </p>
              <button
                disabled
                className="font-gilbert px-8 py-4 bg-transparent text-army-green-lighter border border-army-green-light text-lg opacity-50 cursor-not-allowed"
              >
                Get Testnet Tokens
              </button>
            </div>

            <div className="bg-dark-lighter border border-army-green-light p-8 opacity-40">
              <h3 className="font-gilbert text-2xl font-bold text-army-green-lighter mb-4">
                📈 Step 3: Start Staking
              </h3>
              <p className="font-gilbert text-army-green-lighter mb-6">
                Stake your tokens and start earning dynamic APR rewards
              </p>
              <button
                disabled
                className="font-gilbert px-8 py-4 bg-transparent text-army-green-lighter border border-army-green-light text-lg opacity-50 cursor-not-allowed"
              >
                Start Staking
              </button>
            </div>
          </div>
        ) : !isCorrectNetwork ? (
          <div className="bg-red-900 border border-red-500 p-8">
            <h3 className="font-gilbert text-2xl font-bold text-red-200 mb-4">
              ⚠️ Wrong Network
            </h3>
            <p className="font-gilbert text-red-300 mb-6">
              Please switch to Sepolia testnet to use this application
            </p>
            <button
              onClick={() => switchChain?.({ chainId: sepolia.id })}
              className="font-gilbert px-8 py-4 bg-red-700 text-white border border-red-500 hover:bg-red-600 text-lg font-bold"
            >
              Switch to Sepolia
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User has tokens */}
            {appState.userData.tokenBalance &&
            appState.userData.tokenBalance > BigInt(0) ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-dark-lighter border border-army-green p-8">
                  <h3 className="font-gilbert text-2xl font-bold text-army-green mb-4">
                    📈 Start Staking
                  </h3>
                  <p className="font-gilbert text-army-green-lighter mb-6">
                    You have tokens ready to stake. Start earning rewards now!
                  </p>
                  <button
                    onClick={() =>
                      appState.navigateTo(UI_CONSTANTS.ROUTES.STAKE)
                    }
                    className="font-gilbert px-8 py-4 bg-army-green text-white border border-army-green hover:bg-army-green-light text-lg font-bold w-full"
                  >
                    Stake Tokens
                  </button>
                </div>

                <div className="bg-dark-lighter border border-army-green-light p-8">
                  <h3 className="font-gilbert text-2xl font-bold text-army-green-light mb-4">
                    💰 Manage Rewards
                  </h3>
                  <p className="font-gilbert text-army-green-lighter mb-6">
                    Check your pending rewards and staking positions
                  </p>
                  <button
                    onClick={() =>
                      appState.navigateTo(UI_CONSTANTS.ROUTES.REWARDS)
                    }
                    className="font-gilbert px-8 py-4 bg-transparent text-army-green-lighter border border-army-green-light hover:bg-army-green-light hover:text-white text-lg w-full"
                  >
                    View Rewards
                  </button>
                </div>
              </div>
            ) : (
              /* User needs tokens */
              <div className="bg-dark-lighter border border-army-green p-8">
                <h3 className="font-gilbert text-2xl font-bold text-army-green mb-4">
                  🪙 Get Testnet Tokens
                </h3>
                <p className="font-gilbert text-army-green-lighter mb-6">
                  Visit our faucet to mint free testnet tokens for staking
                </p>
                <button
                  onClick={() =>
                    appState.navigateTo(UI_CONSTANTS.ROUTES.FAUCET)
                  }
                  className="font-gilbert px-8 py-4 bg-army-green text-white border border-army-green hover:bg-army-green-light text-lg font-bold"
                >
                  Get Free Tokens
                </button>
              </div>
            )}
          </div>
        )}

        {/* Additional resources */}
        <div className="mt-12 text-center">
          <p className="font-gilbert text-army-green-lighter mb-4">
            Need help getting started?
          </p>
          <button
            onClick={() => appState.navigateTo(UI_CONSTANTS.ROUTES.FAQ)}
            className="font-gilbert text-army-green hover:text-army-green-lighter underline"
          >
            Check our comprehensive FAQ →
          </button>
        </div>
      </div>
    </section>
  );
};
