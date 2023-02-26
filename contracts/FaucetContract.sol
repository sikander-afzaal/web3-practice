// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Faucet {
    //special function
    //its called when you make a transaction that doesnot specify function name to call

    //external funtions are part of the contract interface which means they can be called via contracts and other transactions
    function recieve() external payable {}
}
