// Formatting utilities for consistent data display

import { formatUnits, parseUnits } from "viem";
import { FORMAT_CONFIG, TIME } from "./constants.js";

// Token amount formatting
export const formatTokenAmount = (
  amount,
  decimals = FORMAT_CONFIG.TOKEN_DECIMALS,
  displayDecimals = FORMAT_CONFIG.DISPLAY_DECIMALS
) => {
  if (!amount) return "0";

  try {
    const formatted = formatUnits(BigInt(amount), decimals);
    const number = parseFloat(formatted);

    if (number === 0) return "0";
    if (number < 0.0001) return "< 0.0001";

    return number.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: displayDecimals,
    });
  } catch (error) {
    console.error("Error formatting token amount:", error);
    return "0";
  }
};

// Parse token amount for contract calls
export const parseTokenAmount = (
  amount,
  decimals = FORMAT_CONFIG.TOKEN_DECIMALS
) => {
  if (!amount || amount === "0") return BigInt(0);

  try {
    return parseUnits(amount.toString(), decimals);
  } catch (error) {
    console.error("Error parsing token amount:", error);
    return BigInt(0);
  }
};

// Format percentage values
export const formatPercentage = (
  value,
  decimals = FORMAT_CONFIG.PERCENTAGE_DECIMALS
) => {
  if (!value) return "0%";

  try {
    const number =
      typeof value === "bigint" ? Number(value) : parseFloat(value);
    return `${number.toFixed(decimals)}%`;
  } catch (error) {
    console.error("Error formatting percentage:", error);
    return "0%";
  }
};

// Format APR from contract (assuming it's returned as basis points or percentage)
export const formatAPR = (aprValue) => {
  if (!aprValue) return "0%";

  try {
    // Assuming APR is returned as percentage (e.g., 250 for 250%)
    const number =
      typeof aprValue === "bigint" ? Number(aprValue) : parseFloat(aprValue);
    return `${number.toFixed(FORMAT_CONFIG.PERCENTAGE_DECIMALS)}%`;
  } catch (error) {
    console.error("Error formatting APR:", error);
    return "0%";
  }
};

// Format time duration (seconds to human readable)
export const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return "0 seconds";

  try {
    const totalSeconds =
      typeof seconds === "bigint" ? Number(seconds) : parseInt(seconds);

    if (totalSeconds < TIME.SECONDS_PER_MINUTE) {
      return `${totalSeconds} second${totalSeconds !== 1 ? "s" : ""}`;
    }

    const minutes = Math.floor(totalSeconds / TIME.SECONDS_PER_MINUTE);
    if (minutes < TIME.MINUTES_PER_HOUR) {
      const remainingSeconds = totalSeconds % TIME.SECONDS_PER_MINUTE;
      return remainingSeconds > 0
        ? `${minutes} minute${
            minutes !== 1 ? "s" : ""
          } ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`
        : `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }

    const hours = Math.floor(minutes / TIME.MINUTES_PER_HOUR);
    if (hours < TIME.HOURS_PER_DAY) {
      const remainingMinutes = minutes % TIME.MINUTES_PER_HOUR;
      return remainingMinutes > 0
        ? `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${
            remainingMinutes !== 1 ? "s" : ""
          }`
        : `${hours} hour${hours !== 1 ? "s" : ""}`;
    }

    const days = Math.floor(hours / TIME.HOURS_PER_DAY);
    const remainingHours = hours % TIME.HOURS_PER_DAY;
    return remainingHours > 0
      ? `${days} day${days !== 1 ? "s" : ""} ${remainingHours} hour${
          remainingHours !== 1 ? "s" : ""
        }`
      : `${days} day${days !== 1 ? "s" : ""}`;
  } catch (error) {
    console.error("Error formatting duration:", error);
    return "0 seconds";
  }
};

// Format countdown timer (returns object with time units)
export const formatCountdown = (seconds) => {
  if (!seconds || seconds <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  try {
    const totalSeconds =
      typeof seconds === "bigint" ? Number(seconds) : parseInt(seconds);

    const days = Math.floor(
      totalSeconds /
        (TIME.HOURS_PER_DAY * TIME.MINUTES_PER_HOUR * TIME.SECONDS_PER_MINUTE)
    );
    const hours = Math.floor(
      (totalSeconds %
        (TIME.HOURS_PER_DAY *
          TIME.MINUTES_PER_HOUR *
          TIME.SECONDS_PER_MINUTE)) /
        (TIME.MINUTES_PER_HOUR * TIME.SECONDS_PER_MINUTE)
    );
    const minutes = Math.floor(
      (totalSeconds % (TIME.MINUTES_PER_HOUR * TIME.SECONDS_PER_MINUTE)) /
        TIME.SECONDS_PER_MINUTE
    );
    const secs = totalSeconds % TIME.SECONDS_PER_MINUTE;

    return { days, hours, minutes, seconds: secs, expired: false };
  } catch (error) {
    console.error("Error formatting countdown:", error);
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
};

// Format address (truncate for display)
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return "";

  if (address.length <= startChars + endChars) return address;

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

// Format transaction hash
export const formatTxHash = (hash, chars = 8) => {
  if (!hash) return "";
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
};

// Format timestamp to readable date
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";

  try {
    const date = new Date(Number(timestamp) * TIME.MILLISECONDS_PER_SECOND);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "";
  }
};

// Format relative time (e.g., "2 minutes ago")
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";

  try {
    const date = new Date(Number(timestamp) * TIME.MILLISECONDS_PER_SECOND);
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / TIME.MILLISECONDS_PER_SECOND);

    if (diffSeconds < TIME.SECONDS_PER_MINUTE) {
      return "Just now";
    }

    const diffMinutes = Math.floor(diffSeconds / TIME.SECONDS_PER_MINUTE);
    if (diffMinutes < TIME.MINUTES_PER_HOUR) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    }

    const diffHours = Math.floor(diffMinutes / TIME.MINUTES_PER_HOUR);
    if (diffHours < TIME.HOURS_PER_DAY) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }

    const diffDays = Math.floor(diffHours / TIME.HOURS_PER_DAY);
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "";
  }
};

// Calculate penalty amount
export const calculatePenalty = (amount, penaltyPercentage) => {
  if (!amount || !penaltyPercentage)
    return { penalty: BigInt(0), remaining: BigInt(0) };

  try {
    const amountBig = typeof amount === "bigint" ? amount : BigInt(amount);
    const penaltyBig = (amountBig * BigInt(penaltyPercentage)) / BigInt(100);
    const remainingBig = amountBig - penaltyBig;

    return {
      penalty: penaltyBig,
      remaining: remainingBig,
      penaltyFormatted: formatTokenAmount(penaltyBig),
      remainingFormatted: formatTokenAmount(remainingBig),
    };
  } catch (error) {
    console.error("Error calculating penalty:", error);
    return { penalty: BigInt(0), remaining: BigInt(0) };
  }
};

// Calculate APR based on staking parameters
export const calculateCurrentAPR = (initialAPR, totalStaked, aprReduction) => {
  try {
    // This is a simplified calculation - adjust based on actual contract logic
    const totalStakedNumber =
      typeof totalStaked === "bigint"
        ? Number(formatUnits(totalStaked, FORMAT_CONFIG.TOKEN_DECIMALS))
        : parseFloat(totalStaked);
    const reductionFactor = Math.floor(totalStakedNumber / 1000) * aprReduction;
    const currentAPR = Math.max(initialAPR - reductionFactor, 0);

    return currentAPR;
  } catch (error) {
    console.error("Error calculating APR:", error);
    return initialAPR;
  }
};

// Validation helpers
export const isValidAmount = (amount, balance) => {
  try {
    const amountBig = parseTokenAmount(amount);
    const balanceBig =
      typeof balance === "bigint" ? balance : BigInt(balance || 0);

    return amountBig > BigInt(0) && amountBig <= balanceBig;
  } catch (error) {
    console.warn("Invalid amount format:", amount, error.message);
    return false;
  }
};

export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export default {
  formatTokenAmount,
  parseTokenAmount,
  formatPercentage,
  formatAPR,
  formatDuration,
  formatCountdown,
  formatAddress,
  formatTxHash,
  formatTimestamp,
  formatRelativeTime,
  calculatePenalty,
  calculateCurrentAPR,
  isValidAmount,
  isValidAddress,
};
