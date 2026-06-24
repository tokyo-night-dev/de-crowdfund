// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
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

    function testEmitLaunchEvent() public {
        address alice = makeAddr("alice");
        vm.prank(alice);

        vm.expectEmit(true, true, false, true);
        emit ICrowdFunding.LaunchCrowdFund(alice, 1, 10 ether);
        crowdFunding.launch(10 ether, block.timestamp + 100000);
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

    function testMoreThanZeroPledge() public {
        vm.expectRevert(ICrowdFunding.CrowdFund__MoreThanZeroPledge.selector);
        crowdFunding.pledge{value: 0}(9);
    }

    function testNoMatchingCampaignWhenPledging() public {
        vm.expectRevert(ICrowdFunding.CrowdFund__NoMatchingCampaign.selector);
        crowdFunding.pledge{value: 1 ether}(9999);
    }

    function testCampaignExpired() public {
        vm.warp(10000);
        uint256 campaignId = crowdFunding.launch(
            1 ether,
            block.timestamp + 10000
        );

        vm.warp(30000);
        vm.expectRevert(ICrowdFunding.CrowdFund__CampaignExpired.selector);
        crowdFunding.pledge{value: 1 ether}(campaignId);
    }

    function testCheckIncreasingCurrentAmountOfCampaign() public {
        vm.warp(10000);
        uint256 campaignId = crowdFunding.launch(
            3 ether,
            block.timestamp + 10000000
        );

        address user = makeAddr("user");
        hoax(user, 1 ether);

        uint256 SENDING_ETH = 1 ether;

        crowdFunding.pledge{value: SENDING_ETH}(campaignId);
        ICrowdFunding.Campaign memory campaign = crowdFunding.getCampaignById(
            campaignId
        );
        assertEq(SENDING_ETH, campaign.currentAmount);
    }

    function testCheckIncreasingUserFundedAmount() public {
        vm.warp(10000);

        uint256 campaignId = crowdFunding.launch(
            3 ether,
            block.timestamp + 10000000
        );

        address user = makeAddr("user");
        hoax(user, 10 ether);

        uint256 SENDING_ETH = 3 ether;
        crowdFunding.pledge{value: SENDING_ETH}(campaignId);

        uint256 userFundedAmount = crowdFunding.getUserFundedAmountById(
            campaignId,
            user
        );
        assertEq(SENDING_ETH, userFundedAmount);
    }

    function testIfTargetAlreadyMetWhenPledging() public {
        vm.warp(10000);

        uint256 campaignId = crowdFunding.launch(
            1 ether,
            block.timestamp + 10000000
        );

        address user = makeAddr("user");
        hoax(user, 1 ether);

        uint256 SENDING_ETH = 1 ether;
        crowdFunding.pledge{value: SENDING_ETH}(campaignId);

        hoax(user, 1 ether);
        vm.expectRevert(ICrowdFunding.CrowdFund__TargetAlreadyMet.selector);
        crowdFunding.pledge{value: SENDING_ETH}(campaignId);
    }

    function testUserFundAmountOverTargetAmount() public {
        vm.warp(10000);

        uint256 campaignId = crowdFunding.launch(
            1 ether,
            block.timestamp + 10000000
        );

        address user = makeAddr("user");
        hoax(user, 0.8 ether);

        uint256 FIRST_SENDING_ETH = 0.8 ether;
        crowdFunding.pledge{value: FIRST_SENDING_ETH}(campaignId);

        hoax(user, 1 ether);

        uint256 SECOND_SENDING_ETH = 1 ether;
        crowdFunding.pledge{value: SECOND_SENDING_ETH}(campaignId);

        assertEq(user.balance, 0.8 ether);
    }

    function testEmitPledgeEvent() public {
        vm.warp(10000);

        uint256 campaignId = crowdFunding.launch(
            3 ether,
            block.timestamp + 10000000
        );

        address user = makeAddr("user");
        hoax(user, 10 ether);

        uint256 SENDING_ETH = 3 ether;

        vm.expectEmit(true, true, false, true);
        emit ICrowdFunding.PledgeFund(user, campaignId, 3 ether);
        crowdFunding.pledge{value: SENDING_ETH}(campaignId);
    }

    function testCampaignNotEnded() public {
        vm.warp(10000);

        uint256 campaignId = crowdFunding.launch(
            10 ether,
            block.timestamp + 10000
        );

        vm.expectRevert(ICrowdFunding.CrowdFund__CampaignNotEnded.selector);
        crowdFunding.claim(campaignId);
    }

    function testIfTargetNotMetWhenClaiming() public {
        vm.warp(10000);

        uint256 campaignId = crowdFunding.launch(
            10 ether,
            block.timestamp + 10000
        );

        address user = makeAddr("user");
        hoax(user, 1 ether);

        crowdFunding.pledge{value: user.balance}(campaignId);

        vm.warp(30000);

        vm.expectRevert(ICrowdFunding.CrowdFund__TargetNotMet.selector);
        crowdFunding.claim(campaignId);
    }

    function testNotCampaignOwnerWhenClaiming() public {
        address owner = makeAddr("owner");
        vm.prank(owner);
        vm.warp(10000);

        uint256 campaignId = crowdFunding.launch(
            10 ether,
            block.timestamp + 10000
        );

        address user = makeAddr("user");
        hoax(user, 100 ether);

        crowdFunding.pledge{value: user.balance}(campaignId);

        vm.warp(30000);

        vm.prank(user);
        vm.expectRevert(ICrowdFunding.CrowdFund__NotCampaignOwner.selector);
        crowdFunding.claim(campaignId);
    }

    function testIfCampaignDeletedAfterClaiming() public {
        address owner = makeAddr("owner");
        vm.prank(owner);
        vm.warp(10000);

        uint256 campaignId = crowdFunding.launch(
            10 ether,
            block.timestamp + 10000
        );

        address user = makeAddr("user");
        hoax(user, 100 ether);

        crowdFunding.pledge{value: user.balance}(campaignId);

        vm.warp(30000);

        vm.prank(owner);
        crowdFunding.claim(campaignId);

        vm.expectRevert(ICrowdFunding.CrowdFund__NoMatchingCampaign.selector);
        crowdFunding.getCampaignById(campaignId);
    }

    function testIfGotFundAmountAftetClaiming() public {
        address owner = makeAddr("owner");
        vm.prank(owner);
        vm.warp(10000);

        uint256 campaignId = crowdFunding.launch(
            20 ether,
            block.timestamp + 10000
        );

        address user = makeAddr("user");
        hoax(user, 100 ether);

        crowdFunding.pledge{value: user.balance}(campaignId);

        vm.warp(30000);

        vm.prank(owner);
        crowdFunding.claim(campaignId);

        assertEq(owner.balance, 20 ether);
    }

    function testClaimEvent() public {
        address owner = makeAddr("owner");
        vm.prank(owner);
        vm.warp(10000);

        uint256 campaignId = crowdFunding.launch(
            20 ether,
            block.timestamp + 10000
        );

        address user = makeAddr("user");
        hoax(user, 100 ether);

        crowdFunding.pledge{value: user.balance}(campaignId);

        vm.warp(30000);

        vm.prank(owner);

        vm.expectEmit(true, true, false, true);
        emit ICrowdFunding.Claim(owner, campaignId, 20 ether);
        crowdFunding.claim(campaignId);
    }
}
