// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {CREATE3} from "./utilities/Create3.sol";
import {IDeflateModuleFactory} from "./utilities/IDeflateModuleFactory.sol";

/// @title Factory for deploying contracts to deterministic addresses via CREATE3
/// @notice The reference implementation is from zefram.eth
contract DeflateModuleFactory is IDeflateModuleFactory {
    function deploy(bytes32 salt, bytes memory creationCode)
        external
        payable
        override
        returns (address deployed)
    {
        // hash salt with the deployer address to give each deployer its own namespace
        salt = keccak256(abi.encodePacked(msg.sender, salt));

        deployed = CREATE3.deploy(salt, creationCode, msg.value);

        emit AgentDeployed(deployed);

        return deployed;
    }

    function getDeployed(address deployer, bytes32 salt)
        external
        view
        override
        returns (address deployed)
    {
        // hash salt with the deployer address to give each deployer its own namespace
        salt = keccak256(abi.encodePacked(deployer, salt));
        return CREATE3.getDeployed(salt);
    }

}
