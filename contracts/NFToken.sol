// SPDX-License-Identifier: nolicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NFToken is ERC20 {
    constructor(address receiver) ERC20("NFToken", "NFTO") {
        _mint(receiver, 5000 ether);
    }

    function hasTokens(address user, uint256 amount)
        public
        view
        returns (bool)
    {
        return balanceOf(user) >= amount;
    }

    function give(address to) public {
        transferFrom(address(this), to, 100);
    }
}
