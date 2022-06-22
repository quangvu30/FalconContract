// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BUSD is ERC20 {
    constructor(uint256 initialSupply) ERC20("Binance USD", "BUSD") {
        _mint(msg.sender, initialSupply);
    }
}
