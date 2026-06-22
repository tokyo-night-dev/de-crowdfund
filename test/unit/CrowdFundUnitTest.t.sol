// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {ICrowdFunding} from "../../src/ICrowdFunding.sol";
import {CrowdFunding} from "../../src/CrowdFunding.sol";
import {DeployCrowdFunding} from "../../script/DeployCrowdFunding.s.sol";

contract CrowdFundUnitTest is Test {
    CrowdFunding crowdFunding;

    function setUp() public {
        DeployCrowdFunding deployer = new DeployCrowdFunding();
        crowdFunding = deployer.run();
    }

    function testRevertInvalidTargetAmount() public {
        vm.expectRevert(ICrowdFunding.CrowdFund__InvalidTargetAmount.selector);
        crowdFunding.launch(0, 1000);
    }

    function testIfDeadLineNotFuture() public {
        vm.warp(10000);
        vm.expectRevert(ICrowdFunding.CrowdFund__DeadLineMustBeFuture.selector);
        crowdFunding.launch(1 ether, block.timestamp - 1000);
    }

    function testNoMatchingCampaign() public {
        vm.warp(10000);
        uint256 campaignId = crowdFunding.launch(
            2 ether,
            block.timestamp + 10000
        );

        vm.expectRevert(ICrowdFunding.CrowdFund__NoMatchingCampaign.selector);
        crowdFunding.getCampaignById(campaignId + 1);
    }
}
