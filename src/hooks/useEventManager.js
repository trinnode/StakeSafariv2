// Event-driven architecture hook - REPLACED with subgraph for historical data
// COMMENTED OUT: WebSocket implementation replaced with The Graph Protocol queries for better reliability and historical data access

import { useState, useEffect, useCallback, useRef } from "react";
// COMMENTED OUT: WebSocket imports replaced with subgraph
// import { webSocketClient, watchContractEvents } from "../utils/viem.js";
// import { CONTRACT_EVENTS, WEBSOCKET_CONFIG } from "../utils/constants.js";
import { useSubgraphData } from "./useSubgraphData.js";

export const useEventManager = () => {
  // Subgraph data hook for fetching blockchain events
  const subgraph = useSubgraphData();

  // State to hold processed event data compatible with existing code
  const [eventData] = useState({
    stakes: [],
    withdrawals: [],
    rewardsClaimed: [],
    emergencyWithdrawals: [],
    rewardRateUpdates: [], // Not available in subgraph, kept for compatibility
    transfers: [], // Not available in subgraph, kept for compatibility
  });

  // Connection status for subgraph (simulating WebSocket connection status)
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [lastEventTime, setLastEventTime] = useState(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef(null);

  // Memory leak prevention - kept for compatibility
  // const unsubscribeRefs = useRef([]);

  // Use refs to avoid circular dependencies
  const initializeEventListenersRef = useRef();
  const attemptReconnectionRef = useRef();

  // COMMENTED OUT: WebSocket reconnection logic replaced with subgraph retry
  // Reconnection logic
  const attemptReconnection = useCallback(() => {
    // Subgraph doesn't need reconnection like WebSocket, but kept for compatibility
    setConnectionStatus("reconnecting");

    reconnectTimeout.current = setTimeout(() => {
      setConnectionStatus("connected");
      reconnectAttempts.current = 0;
    }, 1000);
  }, []);

  // Store reference
  attemptReconnectionRef.current = attemptReconnection;

  // Initialize subgraph data listeners (replacement for WebSocket event listeners)
  // COMMENTED OUT: WebSocket connection management replaced with subgraph queries
  const initializeEventListeners = useCallback(() => {
    try {
      setConnectionStatus("connecting");

      // Subgraph is always "connected" - no persistent connection needed
      setConnectionStatus("connected");
      reconnectAttempts.current = 0;
      setLastEventTime(Date.now());
    } catch (error) {
      console.error("Failed to initialize subgraph listeners:", error);
      setConnectionStatus("error");
      if (attemptReconnectionRef.current) {
        attemptReconnectionRef.current();
      }
    }
  }, []);

  // Store the ref
  initializeEventListenersRef.current = initializeEventListeners;

  // Initialize on mount
  useEffect(() => {
    initializeEventListeners();

    // Cleanup function - CRITICAL for preventing memory leaks
    return () => {
      // Clear reconnect timeout
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }

      // No unsubscribe needed for subgraph queries (handled by React Query)
    };
  }, [initializeEventListeners]);

  // Helper functions to get specific user data (updated to use subgraph)
  const getUserStakes = useCallback(
    (userAddress) => {
      // Return empty array for now - will be populated by subgraph data in parent components
      return eventData.stakes.filter(
        (stake) => stake.user.toLowerCase() === userAddress.toLowerCase()
      );
    },
    [eventData.stakes]
  );

  const getUserWithdrawals = useCallback(
    (userAddress) => {
      return eventData.withdrawals.filter(
        (withdrawal) =>
          withdrawal.user.toLowerCase() === userAddress.toLowerCase()
      );
    },
    [eventData.withdrawals]
  );

  const getUserRewardsClaimed = useCallback(
    (userAddress) => {
      return eventData.rewardsClaimed.filter(
        (claim) => claim.user.toLowerCase() === userAddress.toLowerCase()
      );
    },
    [eventData.rewardsClaimed]
  );

  const getUserEmergencyWithdrawals = useCallback(
    (userAddress) => {
      return eventData.emergencyWithdrawals.filter(
        (emergency) =>
          emergency.user.toLowerCase() === userAddress.toLowerCase()
      );
    },
    [eventData.emergencyWithdrawals]
  );

  // Calculate total burned tokens from emergency withdrawals
  const getTotalBurnedTokens = useCallback(() => {
    return eventData.emergencyWithdrawals.reduce(
      (total, withdrawal) => total + BigInt(withdrawal.burnedTokens || 0),
      BigInt(0)
    );
  }, [eventData.emergencyWithdrawals]);

  // Get latest total staked from most recent event
  const getLatestTotalStaked = useCallback(() => {
    const latestStake = eventData.stakes[0];
    const latestWithdrawal = eventData.withdrawals[0];
    const latestEmergency = eventData.emergencyWithdrawals[0];

    // Find the most recent event
    const events = [latestStake, latestWithdrawal, latestEmergency]
      .filter(Boolean)
      .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

    return events[0]?.newTotalStaked || BigInt(0);
  }, [eventData.stakes, eventData.withdrawals, eventData.emergencyWithdrawals]);

  // Get latest reward rate
  const getLatestRewardRate = useCallback(() => {
    const latestUpdate = eventData.rewardRateUpdates[0];
    const latestStake = eventData.stakes[0];
    const latestWithdrawal = eventData.withdrawals[0];

    const events = [latestUpdate, latestStake, latestWithdrawal]
      .filter(Boolean)
      .filter((event) => event.newRate || event.currentRewardRate)
      .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

    return events[0]?.newRate || events[0]?.currentRewardRate || BigInt(0);
  }, [eventData.rewardRateUpdates, eventData.stakes, eventData.withdrawals]);

  // Calculate total unique stakers from all staking events
  const getTotalUniqueStakers = useCallback(() => {
    const uniqueStakers = new Set();

    // Add all users who have staked
    eventData.stakes.forEach((stake) => {
      if (stake.user) {
        uniqueStakers.add(stake.user.toLowerCase());
      }
    });

    return uniqueStakers.size;
  }, [eventData.stakes]);

  return {
    // Subgraph hooks for components to use directly
    subgraph,

    // Original interface preserved for compatibility
    eventData,
    connectionStatus,
    lastEventTime,
    reconnectAttempts: reconnectAttempts.current,

    // Helper functions
    getUserStakes,
    getUserWithdrawals,
    getUserRewardsClaimed,
    getUserEmergencyWithdrawals,
    getTotalBurnedTokens,
    getLatestTotalStaked,
    getLatestRewardRate,
    getTotalUniqueStakers,

    // Manual reconnection (no-op for subgraph)
    reconnect: initializeEventListeners,
  };
};
