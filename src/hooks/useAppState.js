// Global app state management hook - MANDATORY for state consistency

import { useState, useEffect, useCallback, useRef } from "react";
import { useAccount, useWalletClient, useChainId } from "wagmi";
import { sepolia } from "wagmi/chains";
import { useEventManager } from "./useEventManager.js";
import { useContractFunctions } from "./useContractFunctions.js";
import { formatTokenAmount, calculatePenalty } from "../utils/formatters.js";

export const useAppState = () => {
  // console.log("useAppState hook called"); // Debug log

  // Use ref to track if data has been loaded for current address to prevent reloading
  const dataLoadedForAddress = useRef(null);

  // Wagmi hooks for wallet state
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();

  // Create wallet object compatible with existing code
  const wallet = {
    address,
    isConnected,
    walletClient,
    isCorrectNetwork: chainId === sepolia.id,
  };

  // COMMENTED OUT: Event-driven data replaced with subgraph queries for historical blockchain data
  // const eventManager = useEventManager();

  // Use subgraph data hook directly for blockchain event queries
  const eventManager = useEventManager(); // Still needed for compatibility but now uses subgraph internally

  // Contract functions
  const contractFunctions = useContractFunctions(walletClient, address);

  // UI state
  const [currentPage, setCurrentPage] = useState("/");
  const [notifications, setNotifications] = useState([]);
  const [globalLoading, setGlobalLoading] = useState({});

  // User data state (updated by events)
  const [userData, setUserData] = useState({
    tokenBalance: BigInt(0),
    stakedAmount: BigInt(0),
    pendingRewards: BigInt(0),
    lastStakeTimestamp: 0,
    timeUntilUnlock: 0,
    canWithdraw: false,
    allowance: BigInt(0),
    transactionHistory: [],
    lastEmergencyWithdrawal: null,
  });

  // Protocol data state (updated by events)
  const [protocolData, setProtocolData] = useState({
    totalStaked: BigInt(0),
    currentAPR: 0,
    participantCount: 0,
    totalStakers: 0,
    circulatingSupply: BigInt(0),
    totalBurned: BigInt(0),
    rewardRate: BigInt(0),
  });

  // Contract constants (loaded once)
  const [contractConstants, setContractConstants] = useState({
    minLockDuration: 0,
    emergencyPenalty: 0,
    initialApr: 0,
    loaded: false,
  });

  // Notification management (MUST be defined early to avoid circular dependency)
  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const addNotification = useCallback(
    (message, type = "info", duration = 5000) => {
      const id = Date.now().toString();
      const notification = {
        id,
        message,
        type,
        timestamp: Date.now(),
      };

      setNotifications((prev) => [notification, ...prev.slice(0, 4)]); // Keep max 5 notifications

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    [removeNotification]
  );

  // Load contract constants on wallet connection
  useEffect(() => {
    if (/*wallet.isConnected &&*/ !contractConstants.loaded) {
      contractFunctions
        .getContractConstants()
        .then((constants) => {
          setContractConstants({
            minLockDuration: Number(constants.minLockDuration),
            emergencyPenalty: Number(constants.emergencyPenalty),
            initialApr: Number(constants.initialApr),
            loaded: true,
          });
        })
        .catch((error) => {
          console.error("Failed to load contract constants:", error);
        });
    }
  }, [wallet.isConnected, contractConstants.loaded, contractFunctions]);

  // Load initial user data when wallet connects
  useEffect(() => {
    if (wallet.isConnected && wallet.address) {
      // Skip loading if data has already been loaded for this address
      if (dataLoadedForAddress.current === wallet.address) {
        return;
      }

      setGlobalLoading((prev) => ({ ...prev, initialData: true }));

      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.warn("Data loading timeout - setting loading to false");
        setGlobalLoading((prev) => ({ ...prev, initialData: false }));
      }, 10000); // 10 second timeout

      Promise.all([
        contractFunctions.getTokenBalance(),
        contractFunctions.getTokenAllowance(),
        contractFunctions.getUserDetails(),
      ])
        .then(([balance, allowance, userDetails]) => {
          clearTimeout(timeoutId);
          dataLoadedForAddress.current = wallet.address; // Mark as loaded

          setUserData((prev) => ({
            ...prev,
            tokenBalance: balance || BigInt(0),
            allowance: allowance || BigInt(0),
            stakedAmount: userDetails?.stakedAmount || BigInt(0),
            pendingRewards: userDetails?.pendingRewards || BigInt(0),
            lastStakeTimestamp: Number(userDetails?.lastStakeTimestamp || 0),
            timeUntilUnlock: Number(userDetails?.timeUntilUnlock || 0),
            canWithdraw: userDetails?.canWithdraw || false,
            balanceLastUpdated: Date.now(),
          }));
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          console.error("Failed to load initial user data:", error);
          addNotification("Failed to load user data - using defaults", "error");
          // Set default values instead of failing completely
          setUserData((prev) => ({
            ...prev,
            tokenBalance: BigInt(0),
            allowance: BigInt(0),
            stakedAmount: BigInt(0),
            pendingRewards: BigInt(0),
            lastStakeTimestamp: 0,
            timeUntilUnlock: 0,
            canWithdraw: false,
          }));
        })
        .finally(() => {
          setGlobalLoading((prev) => ({ ...prev, initialData: false }));
        });
    } else {
      // Reset the ref when wallet disconnects
      dataLoadedForAddress.current = null;
    }
  }, [wallet.isConnected, wallet.address, contractFunctions, addNotification]);

  // Load initial protocol data
  useEffect(() => {
    if (wallet.isConnected) {
      Promise.all([
        contractFunctions.getTotalStaked(),
        contractFunctions.getCurrentRewardRate(),
      ])
        .then(([totalStaked, rewardRate]) => {
          setProtocolData((prev) => ({
            ...prev,
            totalStaked: totalStaked,
            rewardRate: rewardRate,
            currentAPR: Number(rewardRate), // Adjust based on contract logic
          }));
        })
        .catch((error) => {
          console.error("Failed to load protocol data:", error);
        });
    }
  }, [wallet.isConnected, contractFunctions]);

  // Update state based on events (event-driven architecture)
  useEffect(() => {
    if (!wallet.address) return;

    // Update user data from stake events
    const userStakes = eventManager.getUserStakes(wallet.address);
    if (userStakes.length > 0) {
      const latestStake = userStakes[0];
      setUserData((prev) => ({
        ...prev,
        stakedAmount: BigInt(latestStake.amount),
        lastStakeTimestamp: Number(latestStake.timestamp),
      }));
    }

    // Update user data from withdrawal events
    const userWithdrawals = eventManager.getUserWithdrawals(wallet.address);
    if (userWithdrawals.length > 0) {
      // Process withdrawals to update staked amount
      const totalWithdrawn = userWithdrawals.reduce(
        (sum, withdrawal) => sum + BigInt(withdrawal.amount),
        BigInt(0)
      );
      setUserData((prev) => ({
        ...prev,
        stakedAmount: prev.stakedAmount - totalWithdrawn,
      }));
    }

    // Update user data from rewards claimed events
    const userRewardsClaimed = eventManager.getUserRewardsClaimed(
      wallet.address
    );
    if (userRewardsClaimed.length > 0) {
      const latestClaim = userRewardsClaimed[0];
      setUserData((prev) => ({
        ...prev,
        pendingRewards: BigInt(latestClaim.newPendingRewards),
      }));
    }

    // Update user data from emergency withdrawals
    const userEmergencyWithdrawals = eventManager.getUserEmergencyWithdrawals(
      wallet.address
    );
    if (userEmergencyWithdrawals.length > 0) {
      const latestEmergency = userEmergencyWithdrawals[0];
      setUserData((prev) => ({
        ...prev,
        stakedAmount: BigInt(0), // Emergency withdrawal removes all stake
        pendingRewards: BigInt(0),
        lastEmergencyWithdrawal: {
          amount: latestEmergency.amount,
          penalty: latestEmergency.penalty,
          timestamp: latestEmergency.timestamp,
        },
      }));
    }

    // Update transaction history
    const allUserTransactions = [
      ...userStakes.map((stake) => ({ ...stake, type: "stake" })),
      ...userWithdrawals.map((withdrawal) => ({
        ...withdrawal,
        type: "withdrawal",
      })),
      ...userRewardsClaimed.map((claim) => ({ ...claim, type: "claim" })),
      ...userEmergencyWithdrawals.map((emergency) => ({
        ...emergency,
        type: "emergency",
      })),
    ].sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

    setUserData((prev) => ({
      ...prev,
      transactionHistory: allUserTransactions,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    wallet.address,
    eventManager.eventData.stakes,
    eventManager.eventData.withdrawals,
    eventManager.eventData.rewardsClaimed,
    eventManager.eventData.emergencyWithdrawals,
  ]);

  // Update protocol data from events
  useEffect(() => {
    // Update total staked from latest events
    const latestTotalStaked = eventManager.getLatestTotalStaked();
    const latestRewardRate = eventManager.getLatestRewardRate();
    const totalBurned = eventManager.getTotalBurnedTokens();
    const totalStakers = eventManager.getTotalUniqueStakers();

    setProtocolData((prev) => ({
      ...prev,
      totalStaked: latestTotalStaked,
      rewardRate: latestRewardRate,
      currentAPR: Number(latestRewardRate),
      totalBurned: totalBurned,
      totalStakers: totalStakers,
      participantCount: totalStakers, // Keep both for backward compatibility
    }));

    // Calculate circulating supply (total supply - burned tokens)
    contractFunctions
      .getTokenBalance()
      .then((totalSupply) => {
        setProtocolData((prev) => ({
          ...prev,
          circulatingSupply: totalSupply - totalBurned,
        }));
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventManager.eventData]);

  // Calculate user stats
  const getUserStats = useCallback(() => {
    if (!wallet.address) return null;

    const penalty = calculatePenalty(
      userData.stakedAmount,
      contractConstants.emergencyPenalty
    );

    return {
      stakedAmountFormatted: formatTokenAmount(userData.stakedAmount),
      pendingRewardsFormatted: formatTokenAmount(userData.pendingRewards),
      tokenBalanceFormatted: formatTokenAmount(userData.tokenBalance),
      canWithdraw: userData.canWithdraw,
      timeUntilUnlock: userData.timeUntilUnlock,
      emergencyPenalty: penalty,
      hasStake: userData.stakedAmount && userData.stakedAmount > BigInt(0),
      hasRewards:
        userData.pendingRewards && userData.pendingRewards > BigInt(0),
    };
  }, [wallet.address, userData, contractConstants]);

  // Calculate protocol stats
  const getProtocolStats = useCallback(() => {
    return {
      totalStakedFormatted: formatTokenAmount(protocolData.totalStaked),
      totalBurnedFormatted: formatTokenAmount(protocolData.totalBurned),
      circulatingSupplyFormatted: formatTokenAmount(
        protocolData.circulatingSupply
      ),
      currentAPRFormatted: `${protocolData.currentAPR}%`,
      participantCount: protocolData.participantCount,
      totalStakers: protocolData.totalStakers,
    };
  }, [protocolData]);

  // Navigation helpers
  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Force data refresh
  const refresh = useCallback(async () => {
    if (!wallet.isConnected || !contractFunctions) return;

    try {
      setGlobalLoading((prev) => ({ ...prev, refresh: true }));

      // Reload user data
      const [tokenBalance, tokenAllowance, userDetails] = await Promise.all([
        contractFunctions.getTokenBalance(),
        contractFunctions.getTokenAllowance(),
        contractFunctions.getUserDetails(),
      ]);

      setUserData((prev) => ({
        ...prev,
        tokenBalance: tokenBalance || BigInt(0),
        allowance: tokenAllowance || BigInt(0),
        stakedAmount: userDetails?.stakedAmount || BigInt(0),
        pendingRewards: userDetails?.pendingRewards || BigInt(0),
        lastStakeTimestamp: userDetails?.stakeTimestamp || 0,
        canWithdraw: userDetails?.canWithdraw || false,
        timeUntilUnlock: userDetails?.timeUntilUnlock || 0,
      }));

      // Reload protocol data
      const [totalStaked, rewardRate] = await Promise.all([
        contractFunctions.getTotalStaked(),
        contractFunctions.getCurrentRewardRate(),
      ]);

      setProtocolData((prev) => ({
        ...prev,
        totalStaked: totalStaked || BigInt(0),
        rewardRate: rewardRate || 0,
        currentAPR: Number(rewardRate || 0),
      }));

      addNotification("Data refreshed successfully", "success");
    } catch (error) {
      console.error("Failed to refresh data:", error);
      addNotification("Failed to refresh data", "error");
    } finally {
      setGlobalLoading((prev) => ({ ...prev, refresh: false }));
    }
  }, [wallet.isConnected, contractFunctions, addNotification]);

  return {
    // Wallet state
    wallet,

    // User data
    userData,
    getUserStats,

    // Protocol data
    protocolData,
    getProtocolStats,

    // Contract constants
    contractConstants,

    // Contract functions
    contractFunctions,

    // Event data
    eventManager,

    // UI state
    currentPage,
    navigateTo,
    notifications,
    addNotification,
    removeNotification,
    globalLoading,
    refresh,

    // Calculated values
    isConnected: wallet.isConnected,
    isCorrectNetwork: wallet.isCorrectNetwork,
    userAddress: wallet.address,
  };
};
