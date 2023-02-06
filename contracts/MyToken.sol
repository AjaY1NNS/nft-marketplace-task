// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 supply
    ) ERC20(_name, _symbol) {
        require(bytes(_name).length > 0, "Name must not be empty");
        require(bytes(_symbol).length > 0, "Symbol must not be empty");
        require(supply > 0, "Supply must be grater than 0");
        _mint(msg.sender, supply * (10**uint256(decimals())));
    }
}