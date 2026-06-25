// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {CrowdFunding} from "../src/CrowdFunding.sol";

contract DeployCrowdFunding is Script {
    function run() public returns (CrowdFunding) {
        vm.startBroadcast();
        CrowdFunding deployer = new CrowdFunding();
        vm.stopBroadcast();

        return deployer;
    }
}
