// Emergency withdrawal history - REPLACED with subgraph for historical data
// Uses The Graph Protocol queries instead of local event state for reliable historical data

import React from "react";
import { LoadingSpinner } from "../../common/LoadingSpinner.jsx";
import {
  formatTokenAmount,
  formatTimestamp,
} from "../../../utils/formatters.js";
// Import subgraph hook for blockchain event queries
import {
  useUserEmergencyWithdrawals,
  processUserEmergencyWithdrawals,
} from "../../../hooks/useSubgraphData.js";
// Import user address for subgraph queries
import { useAccount } from "wagmi";

export const EmergencyHistory = () => {
  // COMMENTED OUT: appState parameter no longer needed - using subgraph data directly
  // export const EmergencyHistory = ({ appState }) => {

  // Get user address
  const { address: userAddress } = useAccount();

  // Fetch user emergency withdrawal events from subgraph with pagination and loading states
  const {
    data: emergencyData,
    isLoading: isLoadingEmergency,
    isError: isErrorEmergency,
    fetchNextPage: fetchNextEmergencyPage,
    hasNextPage: hasNextEmergencyPage,
    isFetchingNextPage: isFetchingNextEmergencyPage,
  } = useUserEmergencyWithdrawals(userAddress, !!userAddress);

  // Process subgraph data into component-friendly format
  const emergencyEvents = emergencyData
    ? processUserEmergencyWithdrawals(emergencyData)
    : [];

  // COMMENTED OUT: Original event filtering replaced with subgraph data
  // Filter emergency withdrawal events with safety check
  // const emergencyEvents = (appState.eventHistory || []).filter(
  //   (event) => event.eventName === "EmergencyWithdrawn"
  // );

  // Sort by timestamp (newest first) - already sorted by subgraph query
  const sortedEvents = emergencyEvents.sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  );

  return (
    <div className="bg-dark-light border border-red-500 p-3 sm:p-6">
      <h3 className="font-gilbert text-lg sm:text-xl font-bold text-red-400 mb-4">
        Emergency Withdrawal History
      </h3>

      {/* Use subgraph loading states instead of appState.isLoading */}
      {isLoadingEmergency ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : isErrorEmergency ? (
        /* Error handling for subgraph queries */
        <div className="text-center py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border border-red-500 mx-auto mb-4 flex items-center justify-center">
            <span className="font-gilbert text-xl sm:text-2xl text-red-400">
              ⚠️
            </span>
          </div>
          <p className="font-gilbert text-red-400 text-sm sm:text-base">
            Failed to load emergency withdrawal history
          </p>
          <p className="font-gilbert text-red-300 text-xs sm:text-sm mt-2">
            Please try refreshing the page
          </p>
        </div>
      ) : sortedEvents.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border border-red-500 mx-auto mb-4 flex items-center justify-center">
            <span className="font-gilbert text-xl sm:text-2xl text-red-400">
              🚨
            </span>
          </div>
          <p className="font-gilbert text-red-300 text-sm sm:text-base">
            No emergency withdrawals
          </p>
          <p className="font-gilbert text-red-300 text-xs sm:text-sm mt-2">
            Emergency withdrawal history will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
          {sortedEvents.slice(0, 10).map((event, index) => (
            <div
              key={`${event.txHash}-${index}`}
              className="bg-red-900 bg-opacity-30 border border-red-500 p-3 sm:p-4"
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-base sm:text-lg flex-shrink-0">🚨</span>
                  <span className="font-gilbert font-bold text-red-400 text-sm sm:text-base truncate">
                    Emergency Withdrawal
                  </span>
                </div>
                <span className="font-gilbert text-red-300 text-xs flex-shrink-0">
                  {formatTimestamp(Number(event.timestamp))}
                </span>
              </div>

              <div className="ml-5 sm:ml-7 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="font-gilbert text-red-300">
                      Amount Withdrawn:
                    </p>
                    <p className="font-gilbert text-red-400 font-bold">
                      {formatTokenAmount(event.amount)} STAKE
                    </p>
                  </div>
                  <div>
                    <p className="font-gilbert text-red-300">
                      Penalty (Slashed):
                    </p>
                    <p className="font-gilbert text-red-400 font-bold">
                      {formatTokenAmount(event.penalty)} STAKE
                    </p>
                  </div>
                  <div>
                    <p className="font-gilbert text-red-300">Net Received:</p>
                    <p className="font-gilbert text-red-400 font-bold">
                      {formatTokenAmount(
                        BigInt(event.amount) - BigInt(event.penalty)
                      )}{" "}
                      STAKE
                    </p>
                  </div>
                  <div>
                    <p className="font-gilbert text-red-300">Penalty Rate:</p>
                    <p className="font-gilbert text-red-400 font-bold">
                      {Math.round(
                        (Number(event.penalty) / Number(event.amount)) * 100
                      )}
                      %
                    </p>
                  </div>
                </div>

                <p className="font-gilbert text-red-300 text-xs break-all">
                  Tx: {event.txHash.slice(0, 6)}...
                  {event.txHash.slice(-6)}
                </p>
              </div>
            </div>
          ))}

          {sortedEvents.length > 10 && (
            <div className="text-center pt-4">
              <p className="font-gilbert text-red-300 text-xs sm:text-sm">
                Showing latest 10 emergency withdrawals
              </p>
            </div>
          )}

          {/* Load more button for pagination */}
          {hasNextEmergencyPage && (
            <div className="text-center pt-4">
              <button
                onClick={() => fetchNextEmergencyPage()}
                disabled={isFetchingNextEmergencyPage}
                className="font-gilbert text-red-300 hover:text-red-400 transition-colors disabled:opacity-50 text-sm sm:text-base px-4 py-2 border border-red-500 hover:border-red-400"
              >
                {isFetchingNextEmergencyPage ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Emergency Statistics */}
      {sortedEvents.length > 0 && (
        <div className="mt-6 bg-red-900 bg-opacity-20 border border-red-500 p-3 sm:p-4">
          <h4 className="font-gilbert font-bold text-red-400 mb-2 text-sm sm:text-base">
            Emergency Statistics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div>
              <p className="font-gilbert text-red-300">Total Emergencies:</p>
              <p className="font-gilbert text-red-400 font-bold">
                {sortedEvents.length}
              </p>
            </div>
            <div>
              <p className="font-gilbert text-red-300">Total Tokens Slashed:</p>
              <p className="font-gilbert text-red-400 font-bold">
                {formatTokenAmount(
                  sortedEvents.reduce(
                    (total, event) => total + BigInt(event.penalty || 0),
                    BigInt(0)
                  )
                )}{" "}
                STAKE
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
