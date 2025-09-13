// viem Web3 configuration - MANDATORY usage of viem only

import { createPublicClient, http, webSocket } from "viem";
import { sepolia } from "viem/chains";
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from "./constants.js";
import { TOKEN_ABI, STAKING_ABI } from "./abis.js";

// Public client for reading contract data
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(NETWORK_CONFIG.RPC_URL),
});

// WebSocket client for real-time event listening
// Using WebSocket instead of HTTP for immediate event updates
// This eliminates polling delays and provides instant data synchronization
export const webSocketClient = createPublicClient({
  chain: sepolia,
  transport: webSocket(NETWORK_CONFIG.WEBSOCKET_URL),
});

// Wallet client for writing transactions (initialized when wallet connects)
// Wallet client logic now handled by Wagmi/RainbowKit

// Contract configurations
export const tokenContract = {
  address: CONTRACT_ADDRESSES.TOKEN,
  abi: TOKEN_ABI,
};

export const stakingContract = {
  address: CONTRACT_ADDRESSES.STAKING,
  abi: STAKING_ABI,
};

// Contract read functions
export const readContract = {
  // Token functions
  tokenBalance: async (userAddress) => {
    return await publicClient.readContract({
      ...tokenContract,
      functionName: "balanceOf",
      args: [userAddress],
    });
  },

  tokenAllowance: async (userAddress, spenderAddress) => {
    return await publicClient.readContract({
      ...tokenContract,
      functionName: "allowance",
      args: [userAddress, spenderAddress],
    });
  },

  tokenTotalSupply: async () => {
    return await publicClient.readContract({
      ...tokenContract,
      functionName: "totalSupply",
    });
  },

  // Staking functions
  getUserDetails: async (userAddress) => {
    return await publicClient.readContract({
      ...stakingContract,
      functionName: "getUserDetails",
      args: [userAddress],
    });
  },

  getTotalStaked: async () => {
    return await publicClient.readContract({
      ...stakingContract,
      functionName: "totalStaked",
    });
  },

  getCurrentRewardRate: async () => {
    return await publicClient.readContract({
      ...stakingContract,
      functionName: "currentRewardRate",
    });
  },

  getPendingRewards: async (userAddress) => {
    return await publicClient.readContract({
      ...stakingContract,
      functionName: "getPendingRewards",
      args: [userAddress],
    });
  },

  getTimeUntilUnlock: async (userAddress) => {
    return await publicClient.readContract({
      ...stakingContract,
      functionName: "getTimeUntilUnlock",
      args: [userAddress],
    });
  },

  getMinLockDuration: async () => {
    return await publicClient.readContract({
      ...stakingContract,
      functionName: "minLockDuration",
    });
  },

  getEmergencyWithdrawPenalty: async () => {
    return await publicClient.readContract({
      ...stakingContract,
      functionName: "emergencyWithdrawPenalty",
    });
  },

  getInitialApr: async () => {
    return await publicClient.readContract({
      ...stakingContract,
      functionName: "initialApr",
    });
  },
};

// Contract write functions
export const writeContract = {
  // Token functions
  approveToken: async (walletClient, spenderAddress, amount) => {
    const { request } = await publicClient.simulateContract({
      ...tokenContract,
      functionName: "approve",
      args: [spenderAddress, amount],
      account: walletClient.account,
    });

    return await walletClient.writeContract(request);
  },

  mintToken: async (walletClient, amount) => {
    // console.log("mintToken called with:", {
    //   amount: amount.toString(),
    //   from: walletClient.account.address,
    // });

    try {
      const { request } = await publicClient.simulateContract({
        ...tokenContract,
        functionName: "mint",
        args: [amount],
        account: walletClient.account,
      });

      // console.log("Simulation successful, executing transaction...");
      return await walletClient.writeContract(request);
    } catch (error) {
      console.error("mintToken simulation/execution error:", error);
      throw error;
    }
  },

  // Staking functions
  stake: async (walletClient, amount) => {
    const { request } = await publicClient.simulateContract({
      ...stakingContract,
      functionName: "stake",
      args: [amount],
      account: walletClient.account,
    });

    return await walletClient.writeContract(request);
  },

  withdraw: async (walletClient, amount) => {
    const { request } = await publicClient.simulateContract({
      ...stakingContract,
      functionName: "withdraw",
      args: [amount],
      account: walletClient.account,
    });

    return await walletClient.writeContract(request);
  },

  claimRewards: async (walletClient) => {
    const { request } = await publicClient.simulateContract({
      ...stakingContract,
      functionName: "claimRewards",
      account: walletClient.account,
    });

    return await walletClient.writeContract(request);
  },

  emergencyWithdraw: async (walletClient) => {
    const { request } = await publicClient.simulateContract({
      ...stakingContract,
      functionName: "emergencyWithdraw",
      account: walletClient.account,
    });

    return await walletClient.writeContract(request);
  },
};

// Event watching utilities
export const watchContractEvents = {
  // Watch staking events
  watchStakingEvents: (callback) => {
    return webSocketClient.watchContractEvent({
      ...stakingContract,
      onLogs: callback,
    });
  },

  // Watch token events
  watchTokenEvents: (callback) => {
    return webSocketClient.watchContractEvent({
      ...tokenContract,
      onLogs: callback,
    });
  },

  // Watch specific event
  watchEvent: (contract, eventName, callback, args = []) => {
    return webSocketClient.watchContractEvent({
      ...contract,
      eventName,
      args,
      onLogs: callback,
    });
  },
};

// Transaction utilities
export const transactionUtils = {
  // Wait for transaction receipt
  waitForTransaction: async (hash) => {
    return await publicClient.waitForTransactionReceipt({ hash });
  },

  // Get transaction details
  getTransaction: async (hash) => {
    return await publicClient.getTransaction({ hash });
  },

  // Estimate gas for transaction
  estimateGas: async (transaction) => {
    return await publicClient.estimateGas(transaction);
  },
};

export default {
  publicClient,
  webSocketClient,
  // createWalletClientInstance removed, use Wagmi hooks
  tokenContract,
  stakingContract,
  readContract,
  writeContract,
  watchContractEvents,
  transactionUtils,
};
