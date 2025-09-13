// Withdrawal history component - REPLACED with subgraph for historical data
// Uses The Graph Protocol queries instead of local event state for reliable historical data

import React from "react";
import { LoadingSpinner } from "../../common/LoadingSpinner.jsx";
import {
  formatTokenAmount,
  formatTimestamp,
} from "../../../utils/formatters.js";
// Import subgraph hooks for blockchain event queries
import {
  useUserWithdrawals,
  useUserEmergencyWithdrawals,
  processUserWithdrawals,
  processUserEmergencyWithdrawals,
} from "../../../hooks/useSubgraphData.js";
// Import user address for subgraph queries
import { useAccount } from "wagmi";

export const WithdrawalHistory = () => {
  // COMMENTED OUT: appState parameter no longer needed - using subgraph data directly
  // export const WithdrawalHistory = ({ appState }) => {

  // Get user address
  const { address: userAddress } = useAccount();

  // Fetch user withdrawal events from subgraph with pagination and loading states
  const {
    data: withdrawalData,
    isLoading: isLoadingWithdrawals,
    isError: isErrorWithdrawals,
    fetchNextPage: fetchNextWithdrawalPage,
    hasNextPage: hasNextWithdrawalPage,
    isFetchingNextPage: isFetchingNextWithdrawalPage,
  } = useUserWithdrawals(userAddress, !!userAddress);

  // Fetch user emergency withdrawal events from subgraph
  const {
    data: emergencyData,
    isLoading: isLoadingEmergency,
    isError: isErrorEmergency,
  } = useUserEmergencyWithdrawals(userAddress, !!userAddress);

  // Process subgraph data into component-friendly format
  const withdrawalEvents = withdrawalData
    ? processUserWithdrawals(withdrawalData)
    : [];
  const emergencyEvents = emergencyData
    ? processUserEmergencyWithdrawals(emergencyData)
    : [];

  // Combine both types of withdrawal events
  const allWithdrawalEvents = [...withdrawalEvents, ...emergencyEvents];

  // COMMENTED OUT: Original event filtering replaced with subgraph data
  // Filter withdrawal-related events with safety check
  // const withdrawalEvents = (appState.eventHistory || []).filter((event) =>
  //   ["Withdrawn", "EmergencyWithdrawn"].includes(event.eventName)
  // );

  // Sort by timestamp (newest first)
  const sortedEvents = allWithdrawalEvents.sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  );

  // Check if any data is loading
  const isLoading = isLoadingWithdrawals || isLoadingEmergency;
  const isError = isErrorWithdrawals || isErrorEmergency;

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case "withdrawal":
        return "📤";
      case "emergency":
        return "🚨";
      default:
        return "📋";
    }
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case "withdrawal":
        return "text-army-green";
      case "emergency":
        return "text-red-400";
      default:
        return "text-army-green-lighter";
    }
  };

  const getEventTitle = (eventType) => {
    switch (eventType) {
      case "withdrawal":
        return "Standard Withdrawal";
      case "emergency":
        return "Emergency Withdrawal";
      default:
        return eventType;
    }
  };

  return (
    <div className="bg-dark-light border border-army-green-light p-3 sm:p-6">
      <h3 className="font-gilbert text-lg sm:text-xl font-bold text-army-green-lighter mb-4">
        Withdrawal History
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
            Failed to load withdrawal history
          </p>
          <p className="font-gilbert text-red-300 text-xs sm:text-sm mt-2">
            Please try refreshing the page
          </p>
        </div>
      ) : sortedEvents.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border border-army-green-light mx-auto mb-4 flex items-center justify-center">
            <span className="font-gilbert text-xl sm:text-2xl text-army-green-lighter">
              📤
            </span>
          </div>
          <p className="font-gilbert text-army-green-lighter text-sm sm:text-base">
            No withdrawals yet
          </p>
          <p className="font-gilbert text-army-green-lighter text-xs sm:text-sm mt-2">
            Your withdrawal history will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
          {sortedEvents.slice(0, 10).map((event, index) => (
            <div
              key={`${event.txHash}-${index}`}
              className="bg-dark border border-army-green-light p-3 sm:p-4"
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-base sm:text-lg flex-shrink-0">
                    {getEventIcon(event.type)}
                  </span>
                  <span
                    className={`font-gilbert font-bold text-sm sm:text-base ${getEventColor(
                      event.type
                    )} truncate`}
                  >
                    {getEventTitle(event.type)}
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
                  <p className="font-gilbert text-army-green text-xs sm:text-sm break-all">
                    Rewards Claimed: {formatTokenAmount(event.rewardsAccrued)}{" "}
                    STAKE
                  </p>
                )}
                {event.penalty && (
                  <p className="font-gilbert text-red-400 text-xs sm:text-sm break-all">
                    Penalty (Burned): {formatTokenAmount(event.penalty)} STAKE
                  </p>
                )}
                {event.type === "withdrawal" && (
                  <p className="font-gilbert text-army-green text-xs sm:text-sm break-all">
                    Total Received:{" "}
                    {formatTokenAmount(
                      BigInt(event.amount || 0) +
                        BigInt(event.rewardsAccrued || 0)
                    )}{" "}
                    STAKE
                  </p>
                )}
                {event.type === "emergency" && (
                  <p className="font-gilbert text-army-green text-xs sm:text-sm break-all">
                    Net Received:{" "}
                    {formatTokenAmount(
                      BigInt(event.amount || 0) - BigInt(event.penalty || 0)
                    )}{" "}
                    STAKE
                  </p>
                )}
                <p className="font-gilbert text-army-green-lighter text-xs break-all">
                  Tx: {event.txHash.slice(0, 6)}...
                  {event.txHash.slice(-6)}
                </p>
              </div>
            </div>
          ))}

          {sortedEvents.length > 10 && (
            <div className="text-center pt-4">
              <p className="font-gilbert text-army-green-lighter text-xs sm:text-sm">
                Showing latest 10 withdrawal transactions
              </p>
            </div>
          )}

          {/* Load more button for pagination */}
          {hasNextWithdrawalPage && (
            <div className="text-center pt-4">
              <button
                onClick={() => fetchNextWithdrawalPage()}
                disabled={isFetchingNextWithdrawalPage}
                className="font-gilbert text-army-green-lighter hover:text-army-green transition-colors disabled:opacity-50 text-sm sm:text-base px-4 py-2 border border-army-green-light hover:border-army-green"
              >
                {isFetchingNextWithdrawalPage ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
