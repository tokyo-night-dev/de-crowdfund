// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ICrowdFunding} from "./ICrowdFunding.sol";

contract CrowdFunding is ICrowdFunding {
    mapping(uint256 => Campaign) campaignIdToCampaignData;
    mapping(uint256 campaignId => mapping(address user => uint256 fundedAmount)) campaignIdToUserToFundedAmount;
    uint256 s_campaignId = 0;

    function launch(
        uint256 targetAmount,
        uint256 deadLine
    ) external returns (uint256 campaignId) {
        if (targetAmount <= 0) {
            revert CrowdFund__InvalidTargetAmount();
        }

        if (deadLine <= block.timestamp) {
            revert CrowdFund__DeadLineMustBeFuture();
        }

        Campaign memory campaignToBeLaunched = Campaign({
            creator: msg.sender,
            targetAmount: targetAmount,
            deadLine: deadLine,
            currentAmount: 0,
            claimed: false
        });

        s_campaignId++;
        campaignIdToCampaignData[s_campaignId] = campaignToBeLaunched;

        emit LaunchCrowdFund(msg.sender, s_campaignId, targetAmount);

        return s_campaignId;
    }

    function pledge(uint256 campaignId) external payable {
        if (msg.value <= 0) {
            revert CrowdFund__MoreThanZeroPledge();
        }

        Campaign memory matchedCampaign = campaignIdToCampaignData[campaignId];

        if (matchedCampaign.creator == address(0)) {
            revert CrowdFund__NoMatchingCampaign();
        }

        if (matchedCampaign.deadLine < block.timestamp) {
            revert CrowdFund__CampaignExpired();
        }

        if (matchedCampaign.targetAmount <= matchedCampaign.currentAmount) {
            revert CrowdFund__TargetAlreadyMet();
        }

        uint256 actualUserFundingAmount = msg.value;
        uint256 userRefundAmount = 0;

        if (
            matchedCampaign.currentAmount + actualUserFundingAmount >
            matchedCampaign.targetAmount
        ) {
            actualUserFundingAmount =
                matchedCampaign.targetAmount -
                matchedCampaign.currentAmount;

            userRefundAmount = msg.value - actualUserFundingAmount;
        }

        campaignIdToCampaignData[campaignId]
            .currentAmount += actualUserFundingAmount;
        campaignIdToUserToFundedAmount[campaignId][
            msg.sender
        ] += actualUserFundingAmount;

        if (userRefundAmount > 0) {
            (bool success, ) = payable(msg.sender).call{
                value: userRefundAmount
            }("");
            if (!success) {
                revert CrowdFund__TransferFailed();
            }
        }

        emit PledgeFund(msg.sender, campaignId, actualUserFundingAmount);
    }

    function claim(uint256 campaignId) external {
        Campaign memory matchedCampaign = campaignIdToCampaignData[campaignId];

        if (matchedCampaign.creator != msg.sender) {
            revert CrowdFund__NotCampaignOwner();
        }

        if (matchedCampaign.deadLine > block.timestamp) {
            revert CrowdFund__CampaignNotEnded();
        }

        if (matchedCampaign.currentAmount < matchedCampaign.targetAmount) {
            revert CrowdFund__TargetNotMet();
        }

        uint256 fundedAmount = matchedCampaign.currentAmount;
        campaignIdToCampaignData[campaignId].claimed = true;

        (bool success, ) = payable(msg.sender).call{value: fundedAmount}("");

        if (!success) {
            revert CrowdFund__TransferFailed();
        }

        emit Claim(msg.sender, campaignId, fundedAmount);
    }

    function refund(uint256 campaignId) external {}

    function getCampaignById(
        uint256 campaignId
    ) public view returns (Campaign memory) {
        Campaign memory matchedCampaign = campaignIdToCampaignData[campaignId];

        if (matchedCampaign.creator == address(0)) {
            revert CrowdFund__NoMatchingCampaign();
        }

        return matchedCampaign;
    }

    function getUserFundedAmountById(
        uint256 campaignId,
        address user
    ) public view returns (uint256) {
        uint256 userFundedAmount = campaignIdToUserToFundedAmount[campaignId][
            user
        ];
        return userFundedAmount;
    }
}
