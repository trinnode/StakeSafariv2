// Subgraph data management hook - The Graph Protocol integration
// Provides comprehensive GraphQL queries with pagination, loading states, error handling, and retry mechanisms

import { useInfiniteQuery } from "@tanstack/react-query";

// Subgraph endpoint for The Graph Protocol
const SUBGRAPH_URL = import.meta.env.VITE_SUBGRAPH_URL; // GraphQL queries for different event types
const QUERIES = {
  USER_STAKES: `
    query GetUserStakes($user: String!, $first: Int!, $skip: Int!) {
      stakeds(
        where: { user: $user }
        first: $first
        skip: $skip
        orderBy: blockTimestamp
        orderDirection: desc
      ) {
        id
        user
        amount
        timestamp: blockTimestamp
        transactionHash
      }
    }
  `,

  USER_WITHDRAWALS: `
    query GetUserWithdrawals($user: String!, $first: Int!, $skip: Int!) {
      withdrawns(
        where: { user: $user }
        first: $first
        skip: $skip
        orderBy: blockTimestamp
        orderDirection: desc
      ) {
        id
        user
        amount
        timestamp: blockTimestamp
        
        transactionHash
      }
    }
  `,

  USER_EMERGENCY_WITHDRAWALS: `
    query GetUserEmergencyWithdrawals($user: String!, $first: Int!, $skip: Int!) {
      emergencyWithdrawns(
        where: { user: $user }
        first: $first
        skip: $skip
        orderBy: blockTimestamp
        orderDirection: desc
      ) {
        id
        user
        amount
        penalty
        timestamp: blockTimestamp
        
        transactionHash
      }
    }
  `,

  ALL_EMERGENCY_WITHDRAWALS: `
    query GetAllEmergencyWithdrawals($first: Int!, $skip: Int!) {
      emergencyWithdrawns(
        first: $first
        skip: $skip
        orderBy: blockTimestamp
        orderDirection: desc
      ) {
        id
        penalty
      }
    }
  `,

  USER_REWARDS_CLAIMED: `
    query GetUserRewardsClaimed($user: String!, $first: Int!, $skip: Int!) {
      rewardsClaimeds(
        where: { user: $user }
        first: $first
        skip: $skip
        orderBy: blockTimestamp
        orderDirection: desc
      ) {
        id
        user
        amount
        timestamp: blockTimestamp
        
        transactionHash
      }
    }
  `,

  ALL_USER_EVENTS: `
    query GetAllUserEvents($user: String!, $first: Int!, $skip: Int!) {
      stakeds: stakeds(where: { user: $user }, first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
        id
        user
        amount
        timestamp: blockTimestamp
        
        transactionHash
        __typename
      }
      withdrawns: withdrawns(where: { user: $user }, first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
        id
        user
        amount
        timestamp: blockTimestamp
        
        transactionHash
        __typename
      }
      emergencyWithdrawns: emergencyWithdrawns(where: { user: $user }, first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
        id
        user
        amount
        penalty
        timestamp: blockTimestamp
        
        transactionHash
        __typename
      }
      rewardsClaimeds: rewardsClaimeds(where: { user: $user }, first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
        id
        user
        amount
        timestamp: blockTimestamp
        
        transactionHash
        __typename
      }
    }
  `,
};

// GraphQL client with error handling and retry mechanisms
const fetchGraphQL = async (query, variables = {}) => {
  if (!SUBGRAPH_URL) {
    throw new Error(
      "Subgraph URL is not configured. Please set VITE_SUBGRAPH_URL environment variable."
    );
  }

  try {
    const response = await fetch(SUBGRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    console.log("GraphQL fetch result:", result);

    if (result.errors) {
      throw new Error(
        `GraphQL error: ${result.errors.map((e) => e.message).join(", ")}`
      );
    }

    return result.data;
  } catch (error) {
    console.error("GraphQL fetch error:", error);
    throw error;
  }
};

// Individual hooks for different queries

// Get user staking history with pagination
export const useUserStakes = (userAddress, enabled = true) => {
  const pageSize = 10;

  return useInfiniteQuery({
    queryKey: ["user-stakes", userAddress?.toLowerCase()],
    queryFn: ({ pageParam = 0 }) =>
      fetchGraphQL(QUERIES.USER_STAKES, {
        user: userAddress?.toLowerCase(),
        first: pageSize,
        skip: pageParam * pageSize,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const stakeds = lastPage.stakeds || [];
      return stakeds.length === pageSize ? allPages.length : undefined;
    },
    enabled: enabled && !!userAddress,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user withdrawal history with pagination
export const useUserWithdrawals = (userAddress, enabled = true) => {
  const pageSize = 10;

  return useInfiniteQuery({
    queryKey: ["user-withdrawals", userAddress?.toLowerCase()],
    queryFn: ({ pageParam = 0 }) =>
      fetchGraphQL(QUERIES.USER_WITHDRAWALS, {
        user: userAddress?.toLowerCase(),
        first: pageSize,
        skip: pageParam * pageSize,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const withdrawns = lastPage.withdrawns || [];
      return withdrawns.length === pageSize ? allPages.length : undefined;
    },
    enabled: enabled && !!userAddress,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user emergency withdrawal history with pagination
export const useUserEmergencyWithdrawals = (userAddress, enabled = true) => {
  const pageSize = 10;

  return useInfiniteQuery({
    queryKey: ["user-emergency-withdrawals", userAddress?.toLowerCase()],
    queryFn: ({ pageParam = 0 }) =>
      fetchGraphQL(QUERIES.USER_EMERGENCY_WITHDRAWALS, {
        user: userAddress?.toLowerCase(),
        first: pageSize,
        skip: pageParam * pageSize,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const emergencyWithdrawns = lastPage.emergencyWithdrawns || [];
      return emergencyWithdrawns.length === pageSize
        ? allPages.length
        : undefined;
    },
    enabled: enabled && !!userAddress,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get ALL emergency withdrawals (for calculating total burned tokens)
export const useAllEmergencyWithdrawals = (enabled = true) => {
  const pageSize = 100; // Larger page size since we need all data for total calculation

  return useInfiniteQuery({
    queryKey: ["all-emergency-withdrawals"],
    queryFn: ({ pageParam = 0 }) =>
      fetchGraphQL(QUERIES.ALL_EMERGENCY_WITHDRAWALS, {
        first: pageSize,
        skip: pageParam * pageSize,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const emergencyWithdrawns = lastPage.emergencyWithdrawns || [];
      return emergencyWithdrawns.length === pageSize
        ? allPages.length
        : undefined;
    },
    enabled: enabled,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user rewards claimed history with pagination
export const useUserRewardsClaimed = (userAddress, enabled = true) => {
  const pageSize = 10;

  return useInfiniteQuery({
    queryKey: ["user-rewards-claimed", userAddress?.toLowerCase()],
    queryFn: ({ pageParam = 0 }) =>
      fetchGraphQL(QUERIES.USER_REWARDS_CLAIMED, {
        user: userAddress?.toLowerCase(),
        first: pageSize,
        skip: pageParam * pageSize,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const rewardsClaimeds = lastPage.rewardsClaimeds || [];
      return rewardsClaimeds.length === pageSize ? allPages.length : undefined;
    },
    enabled: enabled && !!userAddress,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get all user events combined with pagination
export const useAllUserEvents = (userAddress, enabled = true) => {
  const pageSize = 20;

  return useInfiniteQuery({
    queryKey: ["all-user-events", userAddress?.toLowerCase()],
    queryFn: ({ pageParam = 0 }) =>
      fetchGraphQL(QUERIES.ALL_USER_EVENTS, {
        user: userAddress?.toLowerCase(),
        first: pageSize,
        skip: pageParam * pageSize,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalEvents = [
        ...(lastPage.stakeds || []),
        ...(lastPage.withdrawns || []),
        ...(lastPage.emergencyWithdrawns || []),
        ...(lastPage.rewardsClaimeds || []),
      ];
      return totalEvents.length === pageSize ? allPages.length : undefined;
    },
    enabled: enabled && !!userAddress,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Data processing utility functions

// Process user stakes data for components
export const processUserStakes = (data) => {
  if (!data?.pages) return [];

  return data.pages.flatMap((page) =>
    (page.stakeds || []).map((stake) => ({
      id: stake.id,
      user: stake.user,
      amount: stake.amount,
      timestamp: stake.timestamp,
      transactionHash: stake.transactionHash,
      eventType: "Staked",
    }))
  );
};

// Process user withdrawals data for components
export const processUserWithdrawals = (data) => {
  if (!data?.pages) {
    return [];
  }

  return data.pages.flatMap((page) => {
    if (!page || !page.withdrawns) {
      return [];
    }

    return page.withdrawns.map((withdrawal) => ({
      id: withdrawal.id,
      user: withdrawal.user,
      amount: withdrawal.amount,
      timestamp: withdrawal.timestamp,
      txHash: withdrawal.transactionHash, // Changed to match component expectations
      transactionHash: withdrawal.transactionHash, // Keep both for compatibility
      type: "withdrawal", // Changed to match component expectations
      eventType: "Withdrawn", // Keep both for compatibility
    }));
  });
};

// Process user emergency withdrawals data for components
export const processUserEmergencyWithdrawals = (data) => {
  if (!data?.pages) {
    console.log("processUserEmergencyWithdrawals: No pages data", data);
    return [];
  }

  return data.pages.flatMap((page) => {
    if (!page || !page.emergencyWithdrawns) {
      console.log(
        "processUserEmergencyWithdrawals: No emergencyWithdrawns in page",
        page
      );
      return [];
    }

    return page.emergencyWithdrawns.map((emergencyWithdrawal) => ({
      id: emergencyWithdrawal.id,
      user: emergencyWithdrawal.user,
      amount: emergencyWithdrawal.amount,
      penalty: emergencyWithdrawal.penalty,
      timestamp: emergencyWithdrawal.timestamp,
      txHash: emergencyWithdrawal.transactionHash, // Changed to match component expectations
      transactionHash: emergencyWithdrawal.transactionHash, // Keep both for compatibility
      type: "emergency", // Changed to match component expectations
      eventType: "EmergencyWithdrawn", // Keep both for compatibility
    }));
  });
};

// Process user rewards claimed data for components
export const processUserRewardsClaimed = (data) => {
  if (!data?.pages) return [];

  return data.pages.flatMap((page) =>
    (page.rewardsClaimeds || []).map((rewardClaimed) => ({
      id: rewardClaimed.id,
      user: rewardClaimed.user,
      amount: rewardClaimed.amount,
      timestamp: rewardClaimed.timestamp,
      transactionHash: rewardClaimed.transactionHash,
      eventType: "RewardClaimed",
    }))
  );
};

// Process all user events combined
export const processAllUserEvents = (data) => {
  if (!data?.pages) return [];

  const allEvents = [];

  data.pages.forEach((page) => {
    // Add staking events
    if (page.stakeds) {
      allEvents.push(
        ...page.stakeds.map((event) => ({
          ...event,
          eventType: "Staked",
        }))
      );
    }

    // Add withdrawal events
    if (page.withdrawns) {
      allEvents.push(
        ...page.withdrawns.map((event) => ({
          ...event,
          eventType: "Withdrawn",
        }))
      );
    }

    // Add emergency withdrawal events
    if (page.emergencyWithdrawns) {
      allEvents.push(
        ...page.emergencyWithdrawns.map((event) => ({
          ...event,
          eventType: "EmergencyWithdrawn",
        }))
      );
    }

    // Add reward claimed events
    if (page.rewardsClaimeds) {
      allEvents.push(
        ...page.rewardsClaimeds.map((event) => ({
          ...event,
          eventType: "RewardClaimed",
        }))
      );
    }
  });

  // Sort by timestamp (newest first)
  return allEvents.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
};

// Main hook for backward compatibility - returns all hooks and utilities
export const useSubgraphData = () => {
  return {
    // Individual hooks
    useUserStakes,
    useUserWithdrawals,
    useUserEmergencyWithdrawals,
    useAllEmergencyWithdrawals,
    useUserRewardsClaimed,
    useAllUserEvents,

    // Data processing functions
    processUserStakes,
    processUserWithdrawals,
    processUserEmergencyWithdrawals,
    processUserRewardsClaimed,
    processAllUserEvents,

    // GraphQL client for custom queries
    fetchGraphQL,

    // Query constants
    QUERIES,
  };
};
