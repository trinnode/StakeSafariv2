import {
  EmergencyWithdrawn as EmergencyWithdrawnEvent,
  RewardsClaimed as RewardsClaimedEvent,
  Staked as StakedEvent,
  Withdrawn as WithdrawnEvent,
} from "../generated/StakingContract/StakingContract";
import {
  EmergencyWithdrawn,
  RewardsClaimed,
  Staked,
  Withdrawn,
} from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";
import {
  generateEntityId,
  getOrCreateProtocolStats,
  getOrCreateUserStats,
  updateProtocolStatsCommonFields,
  updateUserStatsCommonFields,
} from "./utils";

export function handleEmergencyWithdrawn(event: EmergencyWithdrawnEvent): void {
  // Create and store individual event entity
  let entity = new EmergencyWithdrawn(generateEntityId(event));
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.penalty = event.params.penalty;
  entity.timestamp = event.params.timestamp;
  entity.newTotalStaked = event.params.newTotalStaked;

  entity.transactionHash = event.transaction.hash;
  entity.save();

  // Update protocol statistics
  let protocolStats = getOrCreateProtocolStats();
  protocolStats.totalStaked = event.params.newTotalStaked;
  protocolStats.totalBurned = protocolStats.totalBurned.plus(
    event.params.penalty
  );
  protocolStats.totalEmergencyWithdrawEvents =
    protocolStats.totalEmergencyWithdrawEvents.plus(BigInt.fromI32(1));
  updateProtocolStatsCommonFields(protocolStats, event);
  protocolStats.save();

  // Update user statistics
  let userStats = getOrCreateUserStats(event.params.user);
  userStats.totalEmergencyWithdrawals =
    userStats.totalEmergencyWithdrawals.plus(event.params.amount);
  userStats.totalPenaltiesPaid = userStats.totalPenaltiesPaid.plus(
    event.params.penalty
  );
  userStats.emergencyWithdrawCount = userStats.emergencyWithdrawCount.plus(
    BigInt.fromI32(1)
  );
  updateUserStatsCommonFields(userStats, event);
  userStats.save();
}

export function handleRewardsClaimed(event: RewardsClaimedEvent): void {
  // Create and store individual event entity
  let entity = new RewardsClaimed(generateEntityId(event));
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.timestamp = event.params.timestamp;
  entity.newPendingRewards = event.params.newPendingRewards;
  entity.totalStaked = event.params.totalStaked;

  entity.transactionHash = event.transaction.hash;
  entity.save();

  // Update protocol statistics
  let protocolStats = getOrCreateProtocolStats();
  protocolStats.totalStaked = event.params.totalStaked;
  protocolStats.totalRewardsClaimedEvents =
    protocolStats.totalRewardsClaimedEvents.plus(BigInt.fromI32(1));
  updateProtocolStatsCommonFields(protocolStats, event);
  protocolStats.save();

  // Update user statistics
  let userStats = getOrCreateUserStats(event.params.user);
  userStats.totalRewardsClaimed = userStats.totalRewardsClaimed.plus(
    event.params.amount
  );
  userStats.rewardsClaimedCount = userStats.rewardsClaimedCount.plus(
    BigInt.fromI32(1)
  );
  updateUserStatsCommonFields(userStats, event);
  userStats.save();
}

export function handleStaked(event: StakedEvent): void {
  // Create and store individual event entity
  let entity = new Staked(generateEntityId(event));
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.timestamp = event.params.timestamp;
  entity.newTotalStaked = event.params.newTotalStaked;
  entity.currentRewardRate = event.params.currentRewardRate;

  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Update protocol statistics
  let protocolStats = getOrCreateProtocolStats();
  protocolStats.totalStaked = event.params.newTotalStaked;
  protocolStats.currentRewardRate = event.params.currentRewardRate;
  protocolStats.totalStakeEvents = protocolStats.totalStakeEvents.plus(
    BigInt.fromI32(1)
  );
  updateProtocolStatsCommonFields(protocolStats, event);
  protocolStats.save();

  // Update user statistics
  let userStats = getOrCreateUserStats(event.params.user);
  userStats.totalStaked = userStats.totalStaked.plus(event.params.amount);
  userStats.stakeCount = userStats.stakeCount.plus(BigInt.fromI32(1));
  if (userStats.firstStakeTimestamp.equals(BigInt.fromI32(0))) {
    userStats.firstStakeTimestamp = event.block.timestamp;
  }
  updateUserStatsCommonFields(userStats, event);
  userStats.save();
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  // Create and store individual event entity
  let entity = new Withdrawn(generateEntityId(event));
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.timestamp = event.params.timestamp;
  entity.newTotalStaked = event.params.newTotalStaked;
  entity.currentRewardRate = event.params.currentRewardRate;
  entity.rewardsAccrued = event.params.rewardsAccrued;

  entity.transactionHash = event.transaction.hash;
  entity.save();

  // Update protocol statistics
  let protocolStats = getOrCreateProtocolStats();
  protocolStats.totalStaked = event.params.newTotalStaked;
  protocolStats.currentRewardRate = event.params.currentRewardRate;
  protocolStats.totalWithdrawEvents = protocolStats.totalWithdrawEvents.plus(
    BigInt.fromI32(1)
  );
  updateProtocolStatsCommonFields(protocolStats, event);
  protocolStats.save();

  // Update user statistics
  let userStats = getOrCreateUserStats(event.params.user);
  userStats.totalWithdrawn = userStats.totalWithdrawn.plus(event.params.amount);
  userStats.totalRewardsClaimed = userStats.totalRewardsClaimed.plus(
    event.params.rewardsAccrued
  );
  userStats.withdrawCount = userStats.withdrawCount.plus(BigInt.fromI32(1));
  updateUserStatsCommonFields(userStats, event);
  userStats.save();
}
