// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Interface CrowdFunding Contract
 * @author Tokyo Night
 *
 * Before implementing contract, design interface first.
 * a. Define Errors
 * b. Design Functions
 * c. construct struct data type
 */

interface ICrowdFunding {
    /**
     * Custom Events
     */
    event LaunchCrowdFund(
        address indexed creator,
        uint256 indexed campaignId,
        uint256 targetAmount
    );

    event PledgeFund(
        address indexed user,
        uint256 indexed campaignId,
        uint256 fundedAmount
    );

    event Claim(
        address indexed creator,
        uint256 indexed campaignId,
        uint256 fundedAmount
    );

    /**
     * Custom Errors
     * Define Errors based on functions.
     */
    error CrowdFund__InvalidTargetAmount();
    error CrowdFund__DeadLineMustBeFuture();
    error CrowdFund__MoreThanZeroPledge();
    error CrowdFund__CampaignExpired();
    error CrowdFund__CampaignNotEnded();
    error CrowdFund__TargetNotMet();
    error CrowdFund__TargetAlreadyMet();
    error CrowdFund__TransferFailed();
    error CrowdFund__NoMatchingCampaign();
    error CrowdFund__NotCampaignOwner();

    struct Campaign {
        address creator;
        uint256 targetAmount;
        uint256 deadLine;
        uint256 currentAmount;
        bool claimed;
    }

    /**
     * Base Functions which CrowdFunding contract should provide.
     */
    function launch(
        uint256 targetAmount,
        uint256 deadLine
    ) external returns (uint256 campaignId);

    function pledge(uint256 campaignId) external payable;

    function claim(uint256 campaignId) external;

    function refund(uint256 campaignId) external;
}
