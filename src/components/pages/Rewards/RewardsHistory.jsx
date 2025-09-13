// Rewards history component - REPLACED with subgraph for historical data
// Uses The Graph Protocol queries instead of local event state for reliable historical data

import React from "react";
import { LoadingSpinner } from "../../common/LoadingSpinner.jsx";
import {
  formatTokenAmount,
  formatTimestamp,
} from "../../../utils/formatters.js";
// Import subgraph hook for blockchain event queries
import {
  useUserRewardsClaimed,
  processUserRewardsClaimed,
} from "../../../hooks/useSubgraphData.js";
// Import user address for subgraph queries
import { useAccount } from "wagmi";

export const RewardsHistory = () => {
  // COMMENTED OUT: appState parameter no longer needed - using subgraph data directly
  // export const RewardsHistory = ({ appState }) => {

  // Get user address
  const { address: userAddress } = useAccount();

  // Fetch user rewards claimed events from subgraph with pagination and loading states
  const {
    data: rewardsData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserRewardsClaimed(userAddress, !!userAddress);

  // Process subgraph data into component-friendly format
  const rewardEvents = rewardsData
    ? processUserRewardsClaimed(rewardsData)
    : [];

  // COMMENTED OUT: Original event filtering replaced with subgraph data
  // Filter reward claim events with safety check
  // const rewardEvents = (appState.eventHistory || []).filter(
  //   (event) => event.eventName === "RewardClaimed"
  // );

  // Sort by timestamp (newest first) - already sorted by subgraph query
  const sortedEvents = rewardEvents.sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  );

  // Calculate total claimed from events
  const totalClaimedFromEvents = sortedEvents.reduce(
    (total, event) => total + BigInt(event.amount || 0),
    BigInt(0)
  );

  return (
    <div className="bg-dark-light border border-army-green-light p-3 sm:p-6">
      <h3 className="font-gilbert text-lg sm:text-xl font-bold text-army-green-lighter mb-4">
        Reward Claim History
      </h3>

      {/* Summary Stats */}
      <div className="bg-army-green bg-opacity-10 border border-army-green p-3 sm:p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div>
            <p className="font-gilbert text-army-green-lighter">
              Total Claims:
            </p>
            <p className="font-gilbert text-army-green font-bold">
              {sortedEvents.length}
            </p>
          </div>
          <div>
            <p className="font-gilbert text-army-green-lighter">
              Total Claimed:
            </p>
            <p className="font-gilbert text-army-green font-bold break-all">
              {formatTokenAmount(totalClaimedFromEvents)} STAKE
            </p>
          </div>
        </div>
      </div>

      {/* Loading state from subgraph */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : isError ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border border-red-500 mx-auto mb-4 flex items-center justify-center">
            <span className="font-gilbert text-xl sm:text-2xl text-red-500">
              ⚠️
            </span>
          </div>
          <p className="font-gilbert text-red-500 mb-2 text-sm sm:text-base">
            Failed to load reward history
          </p>
          <p className="font-gilbert text-army-green-lighter text-xs sm:text-sm">
            Please check your connection and try again
          </p>
        </div>
      ) : sortedEvents.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border border-army-green-light mx-auto mb-4 flex items-center justify-center">
            <span className="font-gilbert text-xl sm:text-2xl text-army-green-lighter">
              💰
            </span>
          </div>
          <p className="font-gilbert text-army-green-lighter text-sm sm:text-base">
            No reward claims yet
          </p>
          <p className="font-gilbert text-army-green-lighter text-xs sm:text-sm mt-2">
            Your reward claim history will appear here
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
                  <span className="text-base sm:text-lg flex-shrink-0">💰</span>
                  <span className="font-gilbert font-bold text-army-green text-sm sm:text-base truncate">
                    Reward Claimed
                  </span>
                </div>
                <span className="font-gilbert text-army-green-lighter text-xs flex-shrink-0">
                  {formatTimestamp(event.timestamp)}
                </span>
              </div>

              <div className="ml-5 sm:ml-7 space-y-1">
                <p className="font-gilbert text-army-green text-base sm:text-lg font-bold break-all">
                  +{formatTokenAmount(event.amount)} STAKE
                </p>

                {/* Additional context if available */}
                {event.stakedAmount && (
                  <p className="font-gilbert text-army-green-lighter text-xs sm:text-sm break-all">
                    Staked at time: {formatTokenAmount(event.stakedAmount)}{" "}
                    STAKE
                  </p>
                )}

                <p className="font-gilbert text-army-green-lighter text-xs break-all">
                  Tx: {event.transactionHash.slice(0, 6)}...
                  {event.transactionHash.slice(-6)}
                </p>
              </div>
            </div>
          ))}

          {/* Pagination controls */}
          <div className="text-center pt-4 space-y-2">
            {sortedEvents.length > 10 && (
              <p className="font-gilbert text-army-green-lighter text-xs sm:text-sm">
                Showing latest 10 claims of {sortedEvents.length} total
              </p>
            )}

            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-army-green hover:bg-army-green-light text-dark font-gilbert font-bold py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reward Statistics */}
      {sortedEvents.length > 0 && (
        <div className="mt-6 space-y-4">
          {/* Average Claim */}
          <div className="bg-dark border border-army-green-light p-3 sm:p-4">
            <h4 className="font-gilbert font-bold text-army-green-lighter mb-2 text-sm sm:text-base">
              📊 Claim Statistics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div>
                <p className="font-gilbert text-army-green-lighter">
                  Average Claim:
                </p>
                <p className="font-gilbert text-army-green-lighter font-bold break-all">
                  {formatTokenAmount(
                    totalClaimedFromEvents / BigInt(sortedEvents.length)
                  )}{" "}
                  STAKE
                </p>
              </div>
              <div>
                <p className="font-gilbert text-army-green-lighter">
                  Largest Claim:
                </p>
                <p className="font-gilbert text-army-green-lighter font-bold break-all">
                  {formatTokenAmount(
                    sortedEvents.reduce(
                      (max, event) =>
                        BigInt(event.amount || 0) > max
                          ? BigInt(event.amount || 0)
                          : max,
                      BigInt(0)
                    )
                  )}{" "}
                  STAKE
                </p>
              </div>
              <div>
                <p className="font-gilbert text-army-green-lighter">
                  First Claim:
                </p>
                <p className="font-gilbert text-army-green-lighter font-bold">
                  {sortedEvents.length > 0
                    ? formatTimestamp(
                        sortedEvents[sortedEvents.length - 1].timestamp
                      ).split(" ")[0]
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="font-gilbert text-army-green-lighter">
                  Latest Claim:
                </p>
                <p className="font-gilbert text-army-green-lighter font-bold">
                  {sortedEvents.length > 0
                    ? formatTimestamp(sortedEvents[0].timestamp).split(" ")[0]
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Compound Opportunity */}
          <div className="bg-army-green bg-opacity-10 border border-army-green p-3 sm:p-4">
            <h4 className="font-gilbert font-bold text-army-green mb-2 text-sm sm:text-base">
              💡 Compound Opportunity
            </h4>
            <p className="font-gilbert text-army-green-lighter text-xs sm:text-sm">
              You've claimed {formatTokenAmount(totalClaimedFromEvents)} STAKE
              in rewards. Consider restaking some of these rewards to benefit
              from compound growth!
            </p>

            {Number(formatTokenAmount(totalClaimedFromEvents)) > 100 && (
              <div className="mt-2 p-2 bg-army-green bg-opacity-20">
                <p className="font-gilbert text-army-green text-xs sm:text-sm">
                  <strong>Tip:</strong> With{" "}
                  {formatTokenAmount(totalClaimedFromEvents)} STAKE claimed, you
                  could restake and earn additional rewards on your rewards!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
