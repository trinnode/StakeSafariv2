// Utility functions for staking contract event handlers
import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { ProtocolStats, UserStats } from "../generated/schema";

// Generate unique entity ID from transaction hash and log index
export function generateEntityId(event: ethereum.Event): Bytes {
  return event.transaction.hash.concatI32(event.logIndex.toI32());
}

// Get or create global protocol statistics entity
export function getOrCreateProtocolStats(): ProtocolStats {
  let stats = ProtocolStats.load("global");
  if (!stats) {
    stats = new ProtocolStats("global");
    stats.totalStaked = BigInt.fromI32(0);
    stats.currentRewardRate = BigInt.fromI32(0);
    stats.totalBurned = BigInt.fromI32(0);
    stats.totalUsers = BigInt.fromI32(0);
    stats.totalStakeEvents = BigInt.fromI32(0);
    stats.totalWithdrawEvents = BigInt.fromI32(0);
    stats.totalEmergencyWithdrawEvents = BigInt.fromI32(0);
    stats.totalRewardsClaimedEvents = BigInt.fromI32(0);
  
  }
  return stats;
}

// Get or create user statistics entity
export function getOrCreateUserStats(userAddress: Bytes): UserStats {
  let userId = userAddress.toHexString();
  let userStats = UserStats.load(userId);
  if (!userStats) {
    userStats = new UserStats(userId);
    userStats.totalStaked = BigInt.fromI32(0);
    userStats.totalWithdrawn = BigInt.fromI32(0);
    userStats.totalRewardsClaimed = BigInt.fromI32(0);
    userStats.totalEmergencyWithdrawals = BigInt.fromI32(0);
    userStats.totalPenaltiesPaid = BigInt.fromI32(0);
    userStats.stakeCount = BigInt.fromI32(0);
    userStats.withdrawCount = BigInt.fromI32(0);
    userStats.emergencyWithdrawCount = BigInt.fromI32(0);
    userStats.rewardsClaimedCount = BigInt.fromI32(0);
   
    // Increment total users count when creating new user
    let protocolStats = getOrCreateProtocolStats();
    protocolStats.totalUsers = protocolStats.totalUsers.plus(BigInt.fromI32(1));
    protocolStats.save();
  }
  return userStats;
}

// Update protocol stats common fields
export function updateProtocolStatsCommonFields(
  stats: ProtocolStats,
  event: ethereum.Event
): void {
  stats.lastUpdatedBlock = event.block.number;
  stats.lastUpdatedTimestamp = event.block.timestamp;
}

// Update user stats common fields
export function updateUserStatsCommonFields(
  userStats: UserStats,
  event: ethereum.Event
): void {
  userStats.lastActivityTimestamp = event.block.timestamp;
}
