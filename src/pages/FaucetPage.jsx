// Faucet page - Clean implementation

import React, { useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MintSpinner } from "../components/common/LoadingSpinner.jsx";

export const FaucetPage = ({ appState }) => {
  const [mintHistory, setMintHistory] = useState([]);

  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isCorrectNetwork = chainId === sepolia.id;

  // Fixed mint amount - 500 tokens per click
  const MINT_AMOUNT = "500";

  const canMint =
    isConnected &&
    isCorrectNetwork &&
    !appState.contractFunctions?.loading?.mint;

  const handleMint = async () => {
    if (!canMint) return;

    // console.log("Minting", MINT_AMOUNT, "tokens...");

    try {
      const result = await appState.contractFunctions.mintTokens(MINT_AMOUNT);

      if (result.success) {
        appState.addNotification(
          `Successfully minted ${MINT_AMOUNT} tNODE!`,
          "success"
        );
        setMintHistory((prev) => [
          {
            amount: MINT_AMOUNT,
            timestamp: Date.now(),
            txHash: result.hash,
          },
          ...prev.slice(0, 9),
        ]);
      }
    } catch (error) {
      console.error("Mint error:", error);
      appState.addNotification(`Mint failed: ${error.message}`, "error");
    }
  };

  return (
    <div className="min-h-screen text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-gilbert text-4xl font-bold text-army-green-lighter mb-4">
            Token Faucet
          </h1>
          <p className="font-gilbert text-xl text-army-green-lighter">
            Mint free testnet tNODE tokens
          </p>
        </div>

        {!isConnected ? (
          <div className="bg-dark-light border border-army-green p-8 text-center">
            <h2 className="font-gilbert text-2xl font-bold text-army-green mb-4">
              Connect Wallet Required
            </h2>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : !isCorrectNetwork ? (
          <div className="bg-red-900 border border-red-500 p-8 text-center">
            <h2 className="font-gilbert text-2xl font-bold text-red-200 mb-4">
              Wrong Network
            </h2>
            <button
              onClick={() => switchChain?.({ chainId: sepolia.id })}
              className="font-gilbert px-8 py-3 bg-red-700 text-white border border-red-500"
            >
              Switch to Sepolia
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-dark-light border border-army-green p-8">
              <h3 className="font-gilbert text-2xl font-bold text-army-green mb-6">
                Mint Tokens
              </h3>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="font-gilbert text-6xl font-bold text-army-green mb-4">
                    {MINT_AMOUNT}
                  </div>
                  <div className="font-gilbert text-xl text-army-green-lighter mb-6">
                    tNODE tokens per mint
                  </div>
                  <div className="font-gilbert text-sm text-army-green-lighter mb-8">
                    Click the button below to mint {MINT_AMOUNT} free testnet
                    tokens to your wallet
                  </div>
                </div>

                <button
                  onClick={handleMint}
                  disabled={!canMint}
                  className={`font-gilbert w-full p-6 border font-bold text-xl ${
                    canMint
                      ? "bg-army-green text-white border-army-green hover:bg-army-green-light transform hover:scale-105 transition-all"
                      : "bg-transparent text-army-green-lighter border-army-green-light opacity-50 cursor-not-allowed"
                  }`}
                >
                  {appState.contractFunctions?.loading?.mint ? (
                    <>
                      <MintSpinner /> Minting...
                    </>
                  ) : (
                    `🎁 Mint ${MINT_AMOUNT} tNODE`
                  )}
                </button>

                <div className="text-center font-gilbert text-sm text-army-green-lighter">
                  No input required - just connect wallet and click! - REFRESH the page to see the updated Balance
                </div>
              </div>
            </div>

            {mintHistory.length > 0 && (
              <div className="bg-dark-light border border-army-green p-6">
                <h4 className="font-gilbert text-lg font-bold text-army-green mb-4">
                  Recent Mints
                </h4>
                {mintHistory.map((mint, index) => (
                  <div
                    key={index}
                    className="font-gilbert text-sm text-army-green-lighter mb-2"
                  >
                    {mint.amount} tNODE -{" "}
                    {new Date(mint.timestamp).toLocaleString()}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
