// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Storage {

    uint256 number;

    address a;
    address b;

    constructor(address partA, address partB) {
        a = partA;
        b = partB;
    }

    modifier onlyA {
        require(msg.sender == a, "Only A can do this");
	_;
    }

    modifier onlyB {
        require(msg.sender == b, "Only B can do this");
	_;  
    }

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function store(uint256 num) public onlyA {
        number = num;
    }

    /**
     * @dev Return value 
     * @return value of 'number'
     */
    function retrieve() public onlyB view returns (uint256) {
        return number;
    }
}
