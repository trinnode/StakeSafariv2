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

export function handleEmergencyWithdrawn(event: EmergencyWithdrawnEvent): void {
  let entity = new EmergencyWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.penalty = event.params.penalty;
  // entity.amountBurned = event.params.penalty; // FIXED: penalty is what gets burned
  entity.timestamp = event.params.timestamp;
  entity.newTotalStaked = event.params.newTotalStaked;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRewardsClaimed(event: RewardsClaimedEvent): void {
  let entity = new RewardsClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.timestamp = event.params.timestamp;
  entity.newPendingRewards = event.params.newPendingRewards;
  entity.totalStaked = event.params.totalStaked;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleStaked(event: StakedEvent): void {
  let entity = new Staked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.timestamp = event.params.timestamp;
  entity.newTotalStaked = event.params.newTotalStaked;
  entity.currentRewardRate = event.params.currentRewardRate;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let entity = new Withdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.timestamp = event.params.timestamp;
  entity.newTotalStaked = event.params.newTotalStaked;
  entity.currentRewardRate = event.params.currentRewardRate;
  entity.rewardsAccrued = event.params.rewardsAccrued;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
