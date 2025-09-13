// Contract functions hook - MANDATORY for all contract interactions

import { useState, useCallback, useMemo } from "react";
import {
  readContract,
  writeContract,
  transactionUtils,
} from "../utils/viem.js";
import { CONTRACT_ADDRESSES, UI_CONSTANTS } from "../utils/constants.js";
import { parseTokenAmount } from "../utils/formatters.js";

export const useContractFunctions = (walletClient, userAddress) => {
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  // Set loading state for specific function
  const setFunctionLoading = useCallback((functionName, isLoading) => {
    setLoading((prev) => ({
      ...prev,
      [functionName]: isLoading
        ? UI_CONSTANTS.TX_STATUS.PENDING
        : UI_CONSTANTS.TX_STATUS.IDLE,
    }));
  }, []);

  // Set error for specific function
  const setFunctionError = useCallback((functionName, error) => {
    setErrors((prev) => ({
      ...prev,
      [functionName]: error,
    }));
  }, []);

  // Clear error for specific function
  const clearError = useCallback((functionName) => {
    setErrors((prev) => ({
      ...prev,
      [functionName]: null,
    }));
  }, []);

  // FAUCET FUNCTION - Token minting for testnet
  const mintTokens = useCallback(
    async (amount) => {
      // console.log("mintTokens called with:", {
      //   amount,
      //   walletClient: !!walletClient,
      // });

      if (!walletClient) {
        console.error("No wallet client available");
        throw new Error("Wallet not connected");
      }

      const functionName = "mint";
      setFunctionLoading(functionName, true);
      clearError(functionName);

      try {
        // For this example, we'll assume there's a mint function on the token contract
        // In reality, you might need a separate faucet contract
        const amountBig = parseTokenAmount(amount.toString());
        // // console.log("Parsed amount:", amountBig.toString());

        // // console.log("Calling writeContract.mintToken...");
        const hash = await writeContract.mintToken(walletClient, amountBig);
        // // console.log("Transaction hash:", hash);

        // // console.log("Waiting for transaction receipt...");
        const receipt = await transactionUtils.waitForTransaction(hash);
        // console.log("Transaction receipt:", receipt);

        setFunctionLoading(functionName, false);
        return { hash, receipt, success: true };
      } catch (error) {
        console.error("Mint tokens error:", error);
        setFunctionError(
          functionName,
          error.message || "Failed to mint tokens"
        );
        setFunctionLoading(functionName, false);
        throw error;
      }
    },
    [walletClient, setFunctionLoading, clearError, setFunctionError]
  );

  // TOKEN APPROVAL - Step 1 of staking process
  const approveTokens = useCallback(
    async (amount) => {
      if (!walletClient) throw new Error("Wallet not connected");

      const functionName = "approve";
      setFunctionLoading(functionName, true);
      clearError(functionName);

      try {
        const amountBig = parseTokenAmount(amount.toString());

        const hash = await writeContract.approveToken(
          walletClient,
          CONTRACT_ADDRESSES.STAKING,
          amountBig
        );

        const receipt = await transactionUtils.waitForTransaction(hash);

        setFunctionLoading(functionName, false);
        return { hash, receipt, success: true };
      } catch (error) {
        console.error("Approve tokens error:", error);
        setFunctionError(
          functionName,
          error.message || "Failed to approve tokens"
        );
        setFunctionLoading(functionName, false);
        throw error;
      }
    },
    [walletClient, setFunctionLoading, clearError, setFunctionError]
  );

  // STAKING - Step 2 of staking process
  const stakeTokens = useCallback(
    async (amount) => {
      if (!walletClient) throw new Error("Wallet not connected");

      const functionName = "stake";
      setFunctionLoading(functionName, true);
      clearError(functionName);

      try {
        const amountBig = parseTokenAmount(amount.toString());

        const hash = await writeContract.stake(walletClient, amountBig);
        const receipt = await transactionUtils.waitForTransaction(hash);

        setFunctionLoading(functionName, false);
        return { hash, receipt, success: true };
      } catch (error) {
        console.error("Stake tokens error:", error);
        setFunctionError(
          functionName,
          error.message || "Failed to stake tokens"
        );
        setFunctionLoading(functionName, false);
        throw error;
      }
    },
    [walletClient, setFunctionLoading, clearError, setFunctionError]
  );

  // WITHDRAWAL - Standard withdrawal after lock period
  const withdrawTokens = useCallback(
    async (amount) => {
      if (!walletClient) throw new Error("Wallet not connected");

      const functionName = "withdraw";
      setFunctionLoading(functionName, true);
      clearError(functionName);

      try {
        const amountBig = parseTokenAmount(amount.toString());

        const hash = await writeContract.withdraw(walletClient, amountBig);
        const receipt = await transactionUtils.waitForTransaction(hash);

        setFunctionLoading(functionName, false);
        return { hash, receipt, success: true };
      } catch (error) {
        console.error("Withdraw tokens error:", error);
        setFunctionError(
          functionName,
          error.message || "Failed to withdraw tokens"
        );
        setFunctionLoading(functionName, false);
        throw error;
      }
    },
    [walletClient, setFunctionLoading, clearError, setFunctionError]
  );

  // EMERGENCY WITHDRAWAL - With penalty and burn mechanism
  const emergencyWithdraw = useCallback(async () => {
    if (!walletClient) throw new Error("Wallet not connected");

    const functionName = "emergencyWithdraw";
    setFunctionLoading(functionName, true);
    clearError(functionName);

    try {
      const hash = await writeContract.emergencyWithdraw(walletClient);
      const receipt = await transactionUtils.waitForTransaction(hash);

      setFunctionLoading(functionName, false);
      return { hash, receipt, success: true };
    } catch (error) {
      console.error("Emergency withdraw error:", error);
      setFunctionError(
        functionName,
        error.message || "Failed to emergency withdraw"
      );
      setFunctionLoading(functionName, false);
      throw error;
    }
  }, [walletClient, setFunctionLoading, clearError, setFunctionError]);

  // CLAIM REWARDS
  const claimRewards = useCallback(async () => {
    if (!walletClient) throw new Error("Wallet not connected");

    const functionName = "claimRewards";
    setFunctionLoading(functionName, true);
    clearError(functionName);

    try {
      const hash = await writeContract.claimRewards(walletClient);
      const receipt = await transactionUtils.waitForTransaction(hash);

      setFunctionLoading(functionName, false);
      return { hash, receipt, success: true };
    } catch (error) {
      console.error("Claim rewards error:", error);
      setFunctionError(
        functionName,
        error.message || "Failed to claim rewards"
      );
      setFunctionLoading(functionName, false);
      throw error;
    }
  }, [walletClient, setFunctionLoading, clearError, setFunctionError]);

  // READ FUNCTIONS - For initial data loading only (events handle updates)
  const getTokenBalance = useCallback(async () => {
    if (!userAddress) return BigInt(0);

    try {
      return await readContract.tokenBalance(userAddress);
    } catch (error) {
      console.error("Get token balance error:", error);
      return BigInt(0);
    }
  }, [userAddress]);

  const getTokenAllowance = useCallback(async () => {
    if (!userAddress) return BigInt(0);

    try {
      return await readContract.tokenAllowance(
        userAddress,
        CONTRACT_ADDRESSES.STAKING
      );
    } catch (error) {
      console.error("Get token allowance error:", error);
      return BigInt(0);
    }
  }, [userAddress]);

  const getUserDetails = useCallback(async () => {
    if (!userAddress) return null;

    try {
      return await readContract.getUserDetails(userAddress);
    } catch (error) {
      console.error("Get user details error:", error);
      return null;
    }
  }, [userAddress]);

  const getTotalStaked = useCallback(async () => {
    try {
      return await readContract.getTotalStaked();
    } catch (error) {
      console.error("Get total staked error:", error);
      return BigInt(0);
    }
  }, []);

  const getCurrentRewardRate = useCallback(async () => {
    try {
      return await readContract.getCurrentRewardRate();
    } catch (error) {
      console.error("Get current reward rate error:", error);
      return BigInt(0);
    }
  }, []);

  const getPendingRewards = useCallback(async () => {
    if (!userAddress) return BigInt(0);

    try {
      return await readContract.getPendingRewards(userAddress);
    } catch (error) {
      console.error("Get pending rewards error:", error);
      return BigInt(0);
    }
  }, [userAddress]);

  const getTimeUntilUnlock = useCallback(async () => {
    if (!userAddress) return BigInt(0);

    try {
      return await readContract.getTimeUntilUnlock(userAddress);
    } catch (error) {
      console.error("Get time until unlock error:", error);
      return BigInt(0);
    }
  }, [userAddress]);

  const getContractConstants = useCallback(async () => {
    try {
      const [minLockDuration, emergencyPenalty, initialApr] = await Promise.all(
        [
          readContract.getMinLockDuration(),
          readContract.getEmergencyWithdrawPenalty(),
          readContract.getInitialApr(),
        ]
      );

      return {
        minLockDuration,
        emergencyPenalty,
        initialApr,
      };
    } catch (error) {
      console.error("Get contract constants error:", error);
      return {
        minLockDuration: BigInt(0),
        emergencyPenalty: BigInt(0),
        initialApr: BigInt(0),
      };
    }
  }, []);

  // Check if approval is needed
  const needsApproval = useCallback(
    async (amount) => {
      if (!userAddress) return true;

      try {
        const allowance = await getTokenAllowance();
        const amountBig = parseTokenAmount(amount.toString());
        return allowance < amountBig;
      } catch (error) {
        console.error("Check approval error:", error);
        return true;
      }
    },
    [userAddress, getTokenAllowance]
  );

  return useMemo(
    () => ({
      // Write functions
      mintTokens,
      approveTokens,
      stakeTokens,
      withdrawTokens,
      emergencyWithdraw,
      claimRewards,

      // Read functions
      getTokenBalance,
      getTokenAllowance,
      getUserDetails,
      getTotalStaked,
      getCurrentRewardRate,
      getPendingRewards,
      getTimeUntilUnlock,
      getContractConstants,

      // Utility functions
      needsApproval,

      // State
      loading,
      errors,
      clearError,
    }),
    [
      mintTokens,
      approveTokens,
      stakeTokens,
      withdrawTokens,
      emergencyWithdraw,
      claimRewards,
      getTokenBalance,
      getTokenAllowance,
      getUserDetails,
      getTotalStaked,
      getCurrentRewardRate,
      getPendingRewards,
      getTimeUntilUnlock,
      getContractConstants,
      needsApproval,
      loading,
      errors,
      clearError,
    ]
  );
};
