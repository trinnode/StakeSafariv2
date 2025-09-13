// Staking history component - REPLACED with subgraph for historical data
// Uses The Graph Protocol queries instead of local event state for reliable historical data

import React from "react";
import { LoadingSpinner } from "../../common/LoadingSpinner.jsx";
import {
  formatTokenAmount,
  formatTimestamp,
} from "../../../utils/formatters.js";
// Import subgraph hooks for blockchain event queries
import {
  useUserStakes,
  processUserStakes,
} from "../../../hooks/useSubgraphData.js";
// Import user address for subgraph queries
import { useAccount } from "wagmi";

export const StakingHistory = () => {
  // COMMENTED OUT: appState parameter no longer needed - using subgraph data directly
  // export const StakingHistory = ({ appState }) => {

  // Get user address and subgraph hook
  const { address: userAddress } = useAccount();

  // Fetch user staking events from subgraph with pagination and loading states
  const {
    data: stakingData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserStakes(userAddress, !!userAddress);

  // Process subgraph data into component-friendly format
  const stakingEvents = stakingData ? processUserStakes(stakingData) : [];

  // COMMENTED OUT: Original event filtering replaced with subgraph data
  // Filter staking-related events with safety check
  // const stakingEvents = (appState.eventHistory || []).filter((event) =>
  //   ["Staked", "Withdrawn", "RewardClaimed", "EmergencyWithdrawn"].includes(
  //     event.eventName
  //   )
  // );

  // Sort by timestamp (newest first) - already sorted by subgraph query
  const sortedEvents = stakingEvents.sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  );

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case "stake":
        return "🔒";
      case "withdrawal":
        return "📤";
      case "claim":
        return "💰";
      case "emergency":
        return "🚨";
      default:
        return "📋";
    }
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case "stake":
        return "text-army-green";
      case "withdrawal":
        return "text-blue-400";
      case "claim":
        return "text-green-400";
      case "emergency":
        return "text-red-400";
      default:
        return "text-army-green-lighter";
    }
  };

  const getEventName = (eventType) => {
    switch (eventType) {
      case "stake":
        return "Staked";
      case "withdrawal":
        return "Withdrawn";
      case "claim":
        return "Reward Claimed";
      case "emergency":
        return "Emergency Withdrawn";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-dark-light border border-army-green-light p-3 sm:p-6">
      <h3 className="font-gilbert text-lg sm:text-xl font-bold text-army-green-lighter mb-4">
        Staking History
      </h3>

      {/* Use subgraph loading states instead of appState.isLoading */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : isError ? (
        /* Error handling for subgraph queries */
        <div className="text-center py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border border-red-500 mx-auto mb-4 flex items-center justify-center">
            <span className="font-gilbert text-xl sm:text-2xl text-red-400">
              ⚠️
            </span>
          </div>
          <p className="font-gilbert text-red-400 text-sm sm:text-base">
            Failed to load staking history
          </p>
          <p className="font-gilbert text-red-300 text-xs sm:text-sm mt-2">
            Please try refreshing the page
          </p>
        </div>
      ) : sortedEvents.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border border-army-green-light mx-auto mb-4 flex items-center justify-center">
            <span className="font-gilbert text-xl sm:text-2xl text-army-green-lighter">
              📊
            </span>
          </div>
          <p className="font-gilbert text-army-green-lighter text-sm sm:text-base">
            No staking activity yet
          </p>
          <p className="font-gilbert text-army-green-lighter text-xs sm:text-sm mt-2">
            Your staking history will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
          {sortedEvents.slice(0, 10).map((event, index) => (
            <div
              key={`${event.transactionHash}-${index}`}
              className="bg-army-green bg-opacity-10 border border-army-green p-3 sm:p-4"
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-base sm:text-lg flex-shrink-0">
                    {getEventIcon(event.eventType)}
                  </span>
                  <span
                    className={`font-gilbert font-bold text-sm sm:text-base ${getEventColor(
                      event.eventType
                    )} truncate`}
                  >
                    {getEventName(event.eventType)}
                  </span>
                </div>
                <span className="font-gilbert text-army-green-lighter text-xs flex-shrink-0">
                  {formatTimestamp(Number(event.timestamp))}
                </span>
              </div>

              <div className="ml-5 sm:ml-7 space-y-1">
                {/* Updated to use subgraph event structure */}
                {event.amount && (
                  <p className="font-gilbert text-army-green-lighter text-xs sm:text-sm break-all">
                    Amount: {formatTokenAmount(event.amount)} STAKE
                  </p>
                )}
                {event.rewardsAccrued && (
                  <p className="font-gilbert text-army-green-lighter text-xs sm:text-sm break-all">
                    Rewards: {formatTokenAmount(event.rewardsAccrued)} STAKE
                  </p>
                )}
                {event.penalty && (
                  <p className="font-gilbert text-red-400 text-xs sm:text-sm break-all">
                    Penalty: {formatTokenAmount(event.penalty)} STAKE
                  </p>
                )}

                <p className="font-gilbert text-army-green-lighter text-xs break-all">
                  Tx: {event.transactionHash.slice(0, 6)}...
                  {event.transactionHash.slice(-6)}
                </p>
              </div>
            </div>
          ))}

          {/* Load more button for pagination */}
          {hasNextPage && (
            <div className="text-center pt-4">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="font-gilbert text-army-green-lighter hover:text-army-green transition-colors disabled:opacity-50 text-sm sm:text-base px-4 py-2 border border-army-green-light hover:border-army-green"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
