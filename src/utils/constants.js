// Application constants - MANDATORY configuration

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  TOKEN:
    import.meta.env.VITE_TOKEN_ADDRESS ||
    "0x27190CED6664862917f25f423b4dc95776C1B29D",
  STAKING:
    import.meta.env.VITE_STAKING_ADDRESS ||
    "0xEF42eca620b39Fed83A7EeDa80a5B3382113EC76",
};

// Network Configuration
export const NETWORK_CONFIG = {
  CHAIN_ID: 11155111, // Sepolia testnet
  RPC_URL: import.meta.env.VITE_RPC_URL,
  WEBSOCKET_URL:
    import.meta.env.VITE_WEBSOCKET_API ||
    "wss://eth-sepolia.g.alchemy.com/v2/4EkFRqr0TW4yTDAmYR9AO",
  NAME: "Sepolia",
  SYMBOL: "ETH",
  EXPLORER: "https://sepolia.etherscan.io",
};

// Contract Configuration - from constructor parameters
export const STAKING_CONFIG = {
  INITIAL_APR: parseInt(import.meta.env.VITE_INITIAL_APR) || 250, // 250%
  LOCK_PERIOD_DAYS: parseInt(import.meta.env.VITE_LOCK_PERIOD_DAYS) || 5, // 5 days
  LOCK_DURATION: parseInt(import.meta.env.VITE_LOCK_DURATION) || 432000, // 5 days = 432000 seconds
  APR_REDUCTION_PER_THOUSAND:
    parseFloat(import.meta.env.VITE_APR_REDUCTION_PER_THOUSAND) || 0.5, // 0.5%
  PENALTY_PERCENTAGE: parseInt(import.meta.env.VITE_PENALTY_PERCENTAGE) || 30, // 30%
  EMERGENCY_WITHDRAWAL_PENALTY:
    parseInt(import.meta.env.VITE_EMERGENCY_WITHDRAWAL_PENALTY) || 30, // 30%
  MIN_STAKE_AMOUNT: BigInt("1000000000000000000"), // 1 token in wei
};

// UI Constants
export const UI_CONSTANTS = {
  // Army green and black color scheme ONLY
  COLORS: {
    ARMY_GREEN: "#4B5320",
    ARMY_GREEN_LIGHT: "#6B7A3A",
    ARMY_GREEN_LIGHTER: "#8FBC8F",
    BLACK: "#000000",
    BLACK_LIGHT: "#1A1A1A",
    BLACK_LIGHTER: "#2D2D2D",
    WHITE: "#FFFFFF",
  },

  // Gilbert Mono font throughout
  FONTS: {
    GILBERT: "'Gilbert Mono', 'Space Mono', monospace",
    MONO: "'Space Mono', monospace",
  },

  // Application routes
  ROUTES: {
    HOME: "/",
    FAUCET: "/faucet",
    STAKE: "/stake",
    WITHDRAW: "/withdraw",
    EMERGENCY: "/emergency",
    REWARDS: "/rewards",
    FAQ: "/faq",
  },

  // Transaction states
  TX_STATUS: {
    IDLE: "idle",
    PENDING: "pending",
    SUCCESS: "success",
    ERROR: "error",
  },

  // Loading states
  LOADING: {
    APPROVING: "approving",
    APPROVED: "approved",
    STAKING: "staking",
    WITHDRAWING: "withdrawing",
    CLAIMING: "claiming",
    MINTING: "minting",
  },
};

// Event Names - CRITICAL for event-driven architecture
export const CONTRACT_EVENTS = {
  // Token Events
  TRANSFER: "Transfer",
  APPROVAL: "Approval",

  // Staking Events
  STAKED: "Staked",
  WITHDRAWN: "Withdrawn",
  REWARDS_CLAIMED: "RewardsClaimed",
  EMERGENCY_WITHDRAWN: "EmergencyWithdrawn",
  REWARD_RATE_UPDATED: "RewardRateUpdated",
  STAKING_INITIALIZED: "StakingInitialized",
  STAKING_PAUSED: "StakingPaused",
  STAKING_UNPAUSED: "StakingUnpaused",
};

// Formatting Constants
export const FORMAT_CONFIG = {
  TOKEN_DECIMALS: 18,
  DISPLAY_DECIMALS: 4,
  PERCENTAGE_DECIMALS: 2,
  CURRENCY_DECIMALS: 2,
};

// Educational Content Constants
export const EDUCATION = {
  STAKING_PROCESS: [
    "Connect your Web3 wallet to the application",
    "Enter the amount of STAKE tokens you want to stake",
    "Approve the staking contract to spend your tokens",
    "Execute the staking transaction to lock your tokens",
    "Start earning rewards immediately after staking",
  ],

  WITHDRAWAL_PROCESS: [
    "Verify that your lock period has expired (7 days minimum)",
    "Enter the amount you want to withdraw (partial or full)",
    "Review the transaction details and pending rewards",
    "Execute withdrawal - rewards are automatically claimed",
    "Receive both withdrawn stake and accumulated rewards",
  ],

  EMERGENCY_PROCESS: [
    "Select emergency withdrawal amount (incurs 30% penalty)",
    "Review penalty calculation - tokens will be burned",
    "Confirm that you understand the permanent loss",
    "Execute emergency withdrawal transaction",
    "Receive net amount (original - 30% penalty)",
  ],

  REWARD_PROCESS: [
    "Rewards accumulate daily based on your stake amount",
    "APR decreases as total protocol stakes increase",
    "Click claim to transfer pending rewards to your wallet",
    "Claiming rewards does not affect your staked balance",
    "Consider restaking rewards for compound growth",
  ],

  STAKING_STEPS: [
    {
      title: "Connect Wallet",
      description: "Connect your Web3 wallet to interact with the protocol",
      icon: "🔗",
    },
    {
      title: "Get Tokens",
      description: "Mint testnet tokens from the faucet or use existing tokens",
      icon: "🪙",
    },
    {
      title: "Stake & Earn",
      description: "Stake your tokens to earn rewards with dynamic APR",
      icon: "📈",
    },
  ],

  RISK_WARNINGS: [
    "Tokens are locked for the minimum duration after staking",
    "Emergency withdrawal incurs a 30% penalty",
    "APR decreases as more tokens are staked in the protocol",
    "Smart contracts carry inherent risks",
  ],

  BENEFITS: [
    "Dynamic APR starting at 250%",
    "Automatic reward compounding",
    "Transparent on-chain mechanics",
    "Emergency withdrawal option available",
  ],
};

// Validation Constants
export const VALIDATION = {
  MIN_STAKE_AMOUNT: "0.001", // Minimum stake in tokens
  MAX_STAKE_AMOUNT: "1000000", // Maximum stake in tokens
  MIN_WITHDRAW_AMOUNT: "0.001",
  DAILY_FAUCET_LIMIT: "100", // Daily faucet limit
};

// Time Constants
export const TIME = {
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  DAYS_PER_YEAR: 365,
  MILLISECONDS_PER_SECOND: 1000,
};

// WebSocket Configuration
// Using WebSocket for real-time event updates instead of HTTP polling
// This ensures immediate data updates when contract events occur
export const WEBSOCKET_CONFIG = {
  RECONNECT_INTERVAL: 5000, // 5 seconds
  MAX_RECONNECT_ATTEMPTS: 10,
  PING_INTERVAL: 30000, // 30 seconds
  TIMEOUT: 10000, // 10 seconds
};

// FAQ Content - Comprehensive documentation
export const FAQ_CONTENT = [
  {
    title: "Getting Started",
    icon: "🚀",
    description: "Basic setup and initial steps",
    questions: [
      {
        question: "What is this staking protocol?",
        answer:
          "This is a decentralized staking protocol built on Ethereum Sepolia testnet. Users can stake STAKE tokens to earn rewards with a dynamic APR system. The protocol features a 5-day lock period, emergency withdrawal options, and automatic reward distribution.",
      },
      {
        question: "How do I get started?",
        answer:
          "First, connect your Web3 wallet (MetaMask, WalletConnect, etc.). Then visit the Faucet page to get free testnet STAKE tokens. Once you have tokens, go to the Staking page to start earning rewards.",
      },
      {
        question: "What wallet do I need?",
        answer:
          "Any Web3-compatible wallet works: MetaMask, WalletConnect, Coinbase Wallet, etc. Make sure you're connected to the Sepolia testnet (Chain ID: 11155111).",
      },
      {
        question: "Is this real money?",
        answer:
          "No, this is a testnet demonstration using fake tokens. All STAKE tokens have no real-world value and are for educational/testing purposes only.",
      },
    ],
  },
  {
    title: "Staking Mechanics",
    icon: "⚡",
    description: "How staking works in detail",
    questions: [
      {
        question: "How does the APR system work?",
        answer:
          "APR starts at 250% and decreases by 0.5% for every 1,000 tokens staked in the protocol. This creates early adopter advantages and helps balance the reward distribution as more users join.",
      },
      {
        question: "What is the minimum stake amount?",
        answer:
          "The minimum stake amount is 1 STAKE token. There is no maximum limit - you can stake as many tokens as you have.",
      },
      {
        question: "How long are my tokens locked?",
        answer:
          "Tokens are locked for 7 days from the time you stake them. After this period, you can withdraw without any penalties using the standard withdrawal process.",
      },
      {
        question: "Can I add more tokens to my existing stake?",
        answer:
          "Yes! You can stake additional tokens at any time. Each new stake will have its own 5-day lock period, but your existing rewards continue to accumulate.",
      },
      {
        question: "What happens if I stake when APR is low?",
        answer:
          "Your rewards are calculated based on the APR at the time of staking. If you stake when APR is lower, you'll earn less, but you'll also benefit from a more stable protocol with higher total stakes.",
      },
    ],
  },
  {
    title: "Rewards System",
    icon: "💰",
    description: "How rewards are calculated and distributed",
    questions: [
      {
        question: "How are rewards calculated?",
        answer:
          "Rewards are calculated daily based on your staked amount and the current APR. The formula is: Daily Reward = (Your Stake ÷ Total Pool) × Daily Pool Rewards. Pool APR decreases as total stakes increase.",
      },
      {
        question: "When do I start earning rewards?",
        answer:
          "Rewards start accumulating immediately after your staking transaction is confirmed on-chain. You don't need to wait for the lock period to expire to start earning.",
      },
      {
        question: "Can I claim rewards without withdrawing my stake?",
        answer:
          "Yes! The Rewards page allows you to claim accumulated rewards while keeping your tokens staked. This is perfect for taking profits while maintaining your earning position.",
      },
      {
        question: "Should I compound my rewards?",
        answer:
          "Compounding (restaking claimed rewards) can significantly increase your total returns due to compound interest. However, each new stake has its own 5-day lock period.",
      },
      {
        question: "Do rewards continue during the lock period?",
        answer:
          "Yes, rewards accumulate throughout the entire staking period, including during the lock period. The lock period only prevents withdrawals, not reward accumulation.",
      },
    ],
  },
  {
    title: "Withdrawal Options",
    icon: "📤",
    description: "Standard and emergency withdrawal processes",
    questions: [
      {
        question:
          "What's the difference between standard and emergency withdrawal?",
        answer:
          "Standard withdrawal is available after the 5-day lock period with no penalties. Emergency withdrawal is available anytime but incurs a 30% penalty on the withdrawn amount.",
      },
      {
        question: "Can I do partial withdrawals?",
        answer:
          "Yes, both standard and emergency withdrawals support partial amounts. You can withdraw any amount up to your total staked balance.",
      },
      {
        question: "What happens to my rewards when I withdraw?",
        answer:
          "Standard withdrawals automatically claim all pending rewards. Emergency withdrawals also allow reward claiming, but the penalty only applies to the staked principal.",
      },
      {
        question: "How does the emergency withdrawal penalty work?",
        answer:
          "30% of your withdrawn stake amount is permanently burned (removed from circulation). If you withdraw 100 tokens, 30 are burned and you receive 70. This penalty helps maintain protocol stability.",
      },
      {
        question: "Can I cancel a withdrawal after initiating it?",
        answer:
          "No, blockchain transactions cannot be cancelled once confirmed. Always double-check amounts and withdrawal types before confirming.",
      },
    ],
  },
  {
    title: "Technical Details",
    icon: "⚙️",
    description: "Smart contracts and technical specifications",
    questions: [
      {
        question: "Which blockchain network is this on?",
        answer:
          "This protocol runs on Ethereum Sepolia testnet (Chain ID: 11155111). Sepolia is a proof-of-stake testnet that closely mimics Ethereum mainnet behavior.",
      },
      {
        question: "Are the smart contracts audited?",
        answer:
          "This is a testnet demonstration project. In a production environment, smart contracts should always be professionally audited before handling real funds.",
      },
      {
        question: "What are the contract addresses?",
        answer:
          "Token Contract: 0x27190CED6664862917f25f423b4dc95776C1B29D<br/>Staking Contract: 0xEF42eca620b39Fed83A7EeDa80a5B3382113EC76<br/>You can verify these contracts on Sepolia Etherscan.",
      },
      {
        question: "How does the real-time data work?",
        answer:
          "The application uses WebSocket connections to monitor blockchain events in real-time. When you stake, withdraw, or claim rewards, the interface updates immediately without requiring manual refreshes.",
      },
      {
        question: "What gas fees should I expect?",
        answer:
          "On Sepolia testnet, gas fees are minimal (usually under $0.01 equivalent). Operations like staking, withdrawing, and claiming each require separate transactions with their own gas costs.",
      },
    ],
  },
  {
    title: "Troubleshooting",
    icon: "🛠️",
    description: "Common issues and solutions",
    questions: [
      {
        question: "Why isn't my wallet connecting?",
        answer:
          "Ensure you're using a Web3 wallet and have switched to Sepolia testnet (Chain ID: 11155111). Clear your browser cache and try refreshing the page if issues persist.",
      },
      {
        question: "Transaction failed - what went wrong?",
        answer:
          "Common causes: insufficient Sepolia ETH for gas, token allowance not approved, or network congestion. Check your wallet for error messages and ensure you have testnet ETH.",
      },
      {
        question: "My data isn't updating - why?",
        answer:
          "The app uses real-time WebSocket connections. If data seems stale, try refreshing the page or checking your network connection. Blockchain confirmations can take 12-15 seconds.",
      },
      {
        question: "I can't withdraw my tokens yet - when can I?",
        answer:
          "Tokens are locked for 7 days after staking. Check the Withdraw page for your exact unlock time, or use Emergency Withdrawal (with 30% penalty) if needed immediately.",
      },
      {
        question: "The APR changed after I staked - is this normal?",
        answer:
          "Yes, APR is dynamic and decreases as more tokens are staked in the protocol. Your rewards are calculated based on the APR at your staking time, so later changes don't affect your existing stake.",
      },
    ],
  },
  {
    title: "Best Practices",
    icon: "🏆",
    description: "Tips for optimal staking strategy",
    questions: [
      {
        question: "When is the best time to stake?",
        answer:
          "Earlier is generally better due to higher APR when total stakes are lower. However, consider your personal financial situation and risk tolerance before staking.",
      },
      {
        question: "How often should I claim rewards?",
        answer:
          "This depends on gas costs vs reward amounts. On testnet, gas is cheap so you can claim frequently. On mainnet, consider batching claims or only claiming larger amounts.",
      },
      {
        question: "Should I use emergency withdrawal?",
        answer:
          "Only in true emergencies. The 30% penalty is significant - wait for the lock period to expire if possible. Emergency withdrawal should be a last resort.",
      },
      {
        question: "How can I maximize my returns?",
        answer:
          "Stake early (higher APR), compound rewards by restaking them, avoid emergency withdrawals, and consider the timing of your stakes to optimize lock periods.",
      },
      {
        question: "What's the exit strategy?",
        answer:
          "Plan your withdrawals around the 5-day lock periods. If you need regular liquidity, consider staking in smaller batches with staggered timing to have periodic access to funds.",
      },
    ],
  },
];

export default {
  CONTRACT_ADDRESSES,
  NETWORK_CONFIG,
  STAKING_CONFIG,
  UI_CONSTANTS,
  CONTRACT_EVENTS,
  FORMAT_CONFIG,
  EDUCATION,
  VALIDATION,
  TIME,
  WEBSOCKET_CONFIG,
  FAQ_CONTENT,
};
