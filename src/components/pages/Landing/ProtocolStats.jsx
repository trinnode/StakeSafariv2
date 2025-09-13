// Protocol statistics section - MANDATORY real-time data display

import React from "react";
import { formatTokenAmount, formatAPR } from "../../../utils/formatters.js";

export const ProtocolStats = ({ appState }) => {
  const protocolStats = appState.getProtocolStats();

  // Use formatTokenAmount for better formatting when raw numbers are available
  const formatRawTokenAmount = (amount) => formatTokenAmount(amount);

  // Use formatAPR for percentage formatting
  const formatAPRValue = (apr) => formatAPR(apr);

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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Staked */}
          <div className="bg-dark border border-army-green p-6 text-center">
            <div className="font-gilbert text-2xl font-bold text-army-green mb-2">
              {formatRawTokenAmount(appState.protocolData.totalStaked)}
            </div>
            <div className="font-gilbert text-army-green-lighter text-sm">
              Total Staked Tokens
            </div>
            <div className="font-gilbert text-xs text-army-green mt-1">
              tNODE
            </div>
          </div>

          {/* Current APR */}
          <div className="bg-dark border border-army-green p-6 text-center">
            <div className="font-gilbert text-2xl font-bold text-army-green mb-2">
              {formatAPRValue(appState.protocolData.currentAPR)}
            </div>
            <div className="font-gilbert text-army-green-lighter text-sm">
              Current APR
            </div>
            <div className="font-gilbert text-xs text-army-green mt-1">
              Dynamic Rate
            </div>
          </div>

          {/* Circulating Supply */}
          <div className="bg-dark border border-army-green p-6 text-center">
            <div className="font-gilbert text-2xl font-bold text-army-green mb-2">
              {protocolStats.circulatingSupplyFormatted}
            </div>
            <div className="font-gilbert text-army-green-lighter text-sm">
              Circulating Supply
            </div>
            <div className="font-gilbert text-xs text-army-green mt-1">
              After Burns
            </div>
          </div>

          {/* Total Burned */}
          <div className="bg-dark border border-red-600 p-6 text-center">
            <div className="font-gilbert text-2xl font-bold text-red-400 mb-2">
              {protocolStats.totalBurnedFormatted}
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
            <strong>Why Subgraphs?</strong> We use Subgraphs to index blockchain data and provide a more efficient way to query it. This ensures zero-delay data synchronization and eliminates the need for constant network requests.
          </div>
        </div>
      </div>
    </section>
  );
};
