// Protocol statistics section - MANDATORY real-time data display

import React, { useState, useEffect } from "react";
import { formatTokenAmount, formatAPR } from "../../../utils/formatters.js";
// Import subgraph hook to get emergency withdrawals for burned tokens calculation
import { useAllEmergencyWithdrawals } from "../../../hooks/useSubgraphData.js";
// Import for reading token total supply
import { readContract } from "wagmi/actions";
import { TOKEN_ABI, STAKING_ABI } from "../../../utils/abis.js";
import { CONTRACT_ADDRESSES } from "../../../utils/constants.js";
import { config } from "../../../utils/rainbowkit.js";

export const ProtocolStats = ({ appState }) => {
  const [totalSupply, setTotalSupply] = useState(BigInt(0));
  const [isLoadingSupply, setIsLoadingSupply] = useState(true);
  const [supplyError, setSupplyError] = useState(null);

  // State for total staked and current APR - independent of wallet connection
  const [totalStaked, setTotalStaked] = useState(BigInt(0));
  const [currentAPR, setCurrentAPR] = useState(BigInt(0));
  const [isLoadingStaking, setIsLoadingStaking] = useState(true);
  const [stakingError, setStakingError] = useState(null);

  // Fetch ALL emergency withdrawals to calculate total burned tokens
  const { data: allEmergencyData, isLoading: isLoadingBurned } =
    useAllEmergencyWithdrawals(true);

  // Fetch total supply from token contract - represents actual minted tokens
  useEffect(() => {
    const fetchTotalSupply = async () => {
      setIsLoadingSupply(true);
      setSupplyError(null);

      try {
        console.log("Fetching total supply from token contract...");
        const supply = await readContract(config, {
          address: CONTRACT_ADDRESSES.TOKEN,
          abi: TOKEN_ABI,
          functionName: "totalSupply",
        });
        console.log("Total supply fetched:", supply.toString());
        setTotalSupply(supply);
      } catch (error) {
        console.error("Error fetching total supply:", error);
        setSupplyError(error.message);
        // Don't set a fallback value - keep it as 0 to indicate fetch failed
        setTotalSupply(BigInt(0));
      } finally {
        setIsLoadingSupply(false);
      }
    };

    fetchTotalSupply();

    // Refresh total supply when app state refreshes
    if (appState.eventManager.lastEventTime) {
      fetchTotalSupply();
    }
  }, [appState.eventManager.lastEventTime]);

  // Fetch staking data from contract - independent of wallet connection
  useEffect(() => {
    const fetchStakingData = async () => {
      setIsLoadingStaking(true);
      setStakingError(null);

      try {
        console.log("Fetching staking data from contract...");

        // Fetch total staked
        const totalStakedResult = await readContract(config, {
          address: CONTRACT_ADDRESSES.STAKING,
          abi: STAKING_ABI,
          functionName: "totalStaked",
        });

        // Fetch current reward rate (APR)
        const currentRewardRateResult = await readContract(config, {
          address: CONTRACT_ADDRESSES.STAKING,
          abi: STAKING_ABI,
          functionName: "currentRewardRate",
        });

        console.log("Total staked fetched:", totalStakedResult.toString());
        console.log(
          "Current reward rate fetched:",
          currentRewardRateResult.toString()
        );

        setTotalStaked(totalStakedResult);
        setCurrentAPR(currentRewardRateResult);
      } catch (error) {
        console.error("Error fetching staking data:", error);
        setStakingError(error.message);
        setTotalStaked(BigInt(0));
        setCurrentAPR(BigInt(0));
      } finally {
        setIsLoadingStaking(false);
      }
    };

    fetchStakingData();

    // Refresh staking data when app state refreshes
    if (appState.eventManager.lastEventTime) {
      fetchStakingData();
    }
  }, [appState.eventManager.lastEventTime]);

  // Retry function for total supply
  const retryFetchTotalSupply = async () => {
    setIsLoadingSupply(true);
    setSupplyError(null);

    try {
      console.log("Retrying total supply fetch...");
      const supply = await readContract(config, {
        address: CONTRACT_ADDRESSES.TOKEN,
        abi: TOKEN_ABI,
        functionName: "totalSupply",
      });
      console.log("Total supply fetched on retry:", supply.toString());
      setTotalSupply(supply);
    } catch (error) {
      console.error("Error on retry fetching total supply:", error);
      setSupplyError(error.message);
      setTotalSupply(BigInt(0));
    } finally {
      setIsLoadingSupply(false);
    }
  };

  // Retry function for staking data
  const retryFetchStakingData = async () => {
    setIsLoadingStaking(true);
    setStakingError(null);

    try {
      console.log("Retrying staking data fetch...");

      const totalStakedResult = await readContract(config, {
        address: CONTRACT_ADDRESSES.STAKING,
        abi: STAKING_ABI,
        functionName: "totalStaked",
      });

      const currentRewardRateResult = await readContract(config, {
        address: CONTRACT_ADDRESSES.STAKING,
        abi: STAKING_ABI,
        functionName: "currentRewardRate",
      });

      setTotalStaked(totalStakedResult);
      setCurrentAPR(currentRewardRateResult);
    } catch (error) {
      console.error("Error on retry fetching staking data:", error);
      setStakingError(error.message);
      setTotalStaked(BigInt(0));
      setCurrentAPR(BigInt(0));
    } finally {
      setIsLoadingStaking(false);
    }
  };

  // Calculate total burned tokens from all emergency withdrawal penalties
  const calculateTotalBurned = () => {
    if (!allEmergencyData?.pages) return BigInt(0);

    // Sum all penalties from all emergency withdrawals
    return allEmergencyData.pages.reduce((total, page) => {
      const pageTotal = (page.emergencyWithdrawns || []).reduce(
        (pageSum, event) => pageSum + BigInt(event.penalty || 0),
        BigInt(0)
      );
      return total + pageTotal;
    }, BigInt(0));
  };

  const totalBurned = calculateTotalBurned();

  // Calculate correct circulating supply: Total Supply - Total Burned
  const calculateCirculatingSupply = () => {
    return totalSupply - totalBurned;
  };

  const circulatingSupply = calculateCirculatingSupply();

  return (
    <section className="px-6 py-16 bg-dark-light">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-gilbert text-3xl font-bold text-white mb-4">
            Protocol Statistics
          </h2>
          <p className="font-gilbert text-army-green-lighter">
            Real-time data from the staking contract
          </p>
        </div>

        {/* Event-driven data display */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Total Staked */}
          <div className="bg-dark border border-army-green p-6 text-center">
            <div className="font-gilbert text-2xl font-bold text-army-green mb-2">
              {isLoadingStaking ? (
                "Loading..."
              ) : stakingError ? (
                <button
                  onClick={retryFetchStakingData}
                  className="text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Retry
                </button>
              ) : (
                formatTokenAmount(totalStaked)
              )}
            </div>
            <div className="font-gilbert text-army-green-lighter text-sm">
              Total Staked Tokens
            </div>
            <div className="font-gilbert text-xs text-army-green mt-1">
              {stakingError ? "Click to Retry" : "STAKE"}
            </div>
          </div>

          {/* Current APR */}
          <div className="bg-dark border border-army-green p-6 text-center">
            <div className="font-gilbert text-2xl font-bold text-army-green mb-2">
              {isLoadingStaking ? (
                "Loading..."
              ) : stakingError ? (
                <button
                  onClick={retryFetchStakingData}
                  className="text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Retry
                </button>
              ) : (
                formatAPR(currentAPR)
              )}
            </div>
            <div className="font-gilbert text-army-green-lighter text-sm">
              Current APR
            </div>
            <div className="font-gilbert text-xs text-army-green mt-1">
              {stakingError ? "Click to Retry" : "Dynamic Rate"}
            </div>
          </div>

          {/* Total Supply (Minted Tokens) */}
          <div className="bg-dark border border-blue-600 p-6 text-center">
            <div className="font-gilbert text-2xl font-bold text-blue-400 mb-2">
              {isLoadingSupply ? (
                "Loading..."
              ) : supplyError ? (
                <button
                  onClick={retryFetchTotalSupply}
                  className="text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Retry
                </button>
              ) : totalSupply === BigInt(0) ? (
                "0"
              ) : (
                formatTokenAmount(totalSupply)
              )}
            </div>
            <div className="font-gilbert text-blue-300 text-sm">
              Total Supply
            </div>
            <div className="font-gilbert text-xs text-blue-400 mt-1">
              {supplyError ? "Click to Retry" : "Minted Tokens"}
            </div>
          </div>

          {/* Circulating Supply */}
          <div className="bg-dark border border-army-green p-6 text-center">
            <div className="font-gilbert text-2xl font-bold text-army-green mb-2">
              {isLoadingSupply || isLoadingBurned
                ? "Loading..."
                : supplyError
                ? "Error"
                : totalSupply === BigInt(0)
                ? "0"
                : formatTokenAmount(circulatingSupply)}
            </div>
            <div className="font-gilbert text-army-green-lighter text-sm">
              Circulating Supply
            </div>
            <div className="font-gilbert text-xs text-army-green mt-1">
              {supplyError ? "Contract Error" : "After Burns"}
            </div>
          </div>

          {/* Total Burned */}
          <div className="bg-dark border border-red-600 p-6 text-center">
            <div className="font-gilbert text-2xl font-bold text-red-400 mb-2">
              {isLoadingBurned ? "Loading..." : formatTokenAmount(totalBurned)}
            </div>
            <div className="font-gilbert text-red-300 text-sm">
              Tokens Burned
            </div>
            <div className="font-gilbert text-xs text-red-400 mt-1">
              Emergency Penalties
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 font-gilbert text-sm">
            <div
              className={`w-3 h-3 border ${
                appState.eventManager.connectionStatus === "connected"
                  ? "bg-army-green border-army-green"
                  : "bg-red-500 border-red-500"
              }`}
            ></div>
            <span className="text-army-green-lighter">
              Real-time data: {appState.eventManager.connectionStatus}
            </span>
            {appState.eventManager.lastEventTime && (
              <span className="text-army-green text-xs">
                (Last update:{" "}
                {new Date(
                  appState.eventManager.lastEventTime
                ).toLocaleTimeString()}
                )
              </span>
            )}
          </div>
        </div>

        {/* Manual Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => appState.refresh()}
            disabled={appState.globalLoading.refresh}
            className={`font-gilbert px-6 py-2 border text-sm ${
              appState.globalLoading.refresh
                ? "bg-transparent text-army-green-lighter border-army-green-light opacity-50 cursor-not-allowed"
                : "bg-transparent text-army-green border-army-green hover:bg-army-green hover:text-white"
            }`}
          >
            {appState.globalLoading.refresh ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Event Connection Info */}
        <div className="mt-6 bg-dark border border-army-green-light p-4">
          <div className="font-gilbert text-xs text-army-green-lighter text-center">
            <strong>Why Subgraphs?</strong> We use Subgraphs to index blockchain
            data and provide a more efficient way to query it. This ensures
            zero-delay data synchronization and eliminates the need for constant
            network requests.
          </div>
        </div>
      </div>
    </section>
  );
};
