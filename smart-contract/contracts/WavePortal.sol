// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;
    mapping(address => uint256) public userAddressToWavesNumber;
    mapping(address => uint256) public lastWavedAt;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        uint256 timestamp;
        string message;
    }

    Wave[] waves;

    constructor() payable {
        console.log("I'm a smart contract");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 1 minutes < block.timestamp,
            "Wait 1 minutes"
        );
        lastWavedAt[msg.sender] = block.timestamp;
        totalWaves++;
        userAddressToWavesNumber[msg.sender]++;
        waves.push(Wave(msg.sender, block.timestamp, _message));
        seed = (block.difficulty + block.timestamp + seed) % 100;
        if (seed <= 50) {
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has"
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed withdraw money from contract.");
        }
        console.log("%s waved at us, he/she waved at us %s times, the message is: %s", msg.sender, userAddressToWavesNumber[msg.sender], _message);
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getTotalWaves() public view returns(uint256) {
        console.log("%d waves !", totalWaves);
        return totalWaves;
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }
}