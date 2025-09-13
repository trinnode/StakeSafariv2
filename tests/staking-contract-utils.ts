import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  EmergencyWithdrawn,
  RewardsClaimed,
  Staked,
  Withdrawn
} from "../generated/StakingContract/StakingContract"

export function createEmergencyWithdrawnEvent(
  user: Address,
  amount: BigInt,
  penalty: BigInt,
  timestamp: BigInt,
  newTotalStaked: BigInt
): EmergencyWithdrawn {
  let emergencyWithdrawnEvent = changetype<EmergencyWithdrawn>(newMockEvent())

  emergencyWithdrawnEvent.parameters = new Array()

  emergencyWithdrawnEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  emergencyWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  emergencyWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "penalty",
      ethereum.Value.fromUnsignedBigInt(penalty)
    )
  )
  emergencyWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  emergencyWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "newTotalStaked",
      ethereum.Value.fromUnsignedBigInt(newTotalStaked)
    )
  )

  return emergencyWithdrawnEvent
}


export function createRewardsClaimedEvent(
  user: Address,
  amount: BigInt,
  timestamp: BigInt,
  newPendingRewards: BigInt,
  totalStaked: BigInt
): RewardsClaimed {
  let rewardsClaimedEvent = changetype<RewardsClaimed>(newMockEvent())

  rewardsClaimedEvent.parameters = new Array()

  rewardsClaimedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  rewardsClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  rewardsClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  rewardsClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "newPendingRewards",
      ethereum.Value.fromUnsignedBigInt(newPendingRewards)
    )
  )
  rewardsClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "totalStaked",
      ethereum.Value.fromUnsignedBigInt(totalStaked)
    )
  )

  return rewardsClaimedEvent
}

export function createStakedEvent(
  user: Address,
  amount: BigInt,
  timestamp: BigInt,
  newTotalStaked: BigInt,
  currentRewardRate: BigInt
): Staked {
  let stakedEvent = changetype<Staked>(newMockEvent())

  stakedEvent.parameters = new Array()

  stakedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam(
      "newTotalStaked",
      ethereum.Value.fromUnsignedBigInt(newTotalStaked)
    )
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam(
      "currentRewardRate",
      ethereum.Value.fromUnsignedBigInt(currentRewardRate)
    )
  )

  return stakedEvent
}


export function createWithdrawnEvent(
  user: Address,
  amount: BigInt,
  timestamp: BigInt,
  newTotalStaked: BigInt,
  currentRewardRate: BigInt,
  rewardsAccrued: BigInt
): Withdrawn {
  let withdrawnEvent = changetype<Withdrawn>(newMockEvent())

  withdrawnEvent.parameters = new Array()

  withdrawnEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "newTotalStaked",
      ethereum.Value.fromUnsignedBigInt(newTotalStaked)
    )
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "currentRewardRate",
      ethereum.Value.fromUnsignedBigInt(currentRewardRate)
    )
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "rewardsAccrued",
      ethereum.Value.fromUnsignedBigInt(rewardsAccrued)
    )
  )

  return withdrawnEvent
}
