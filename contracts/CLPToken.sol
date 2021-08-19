// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CLPToken is ERC20  {
    constructor() ERC20("Chilean Token", "CLPT") {
        _mint(msg.sender, 10000 * (10 ** uint256(decimals())));
        
    }
}