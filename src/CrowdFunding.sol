// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ICrowdFunding} from "./ICrowdFunding.sol";

contract CrowdFunding is ICrowdFunding {
    mapping(uint256 => Campaign) campaignIdToCampaignData;
    uint256 campaignId = 0;

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

        campaignId++;
        campaignIdToCampaignData[campaignId] = campaignToBeLaunched;
        return campaignId;
    }

    function pledge(uint256 campaignId) external payable {}

    function claim(uint256 campaignId) external {}

    function refund(uint256 campaignId) external {}
}
