// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721URIStorage {
    uint256 public _tokenIds;

    mapping(uint256 => uint256) public nftPrice;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {
        require(bytes(_name).length > 0, "Name must not be empty");
        require(bytes(_symbol).length > 0, "Symbol must not be empty");
    }

    function mint(string memory tokenURI, uint256 tokenPrice) public {
        _tokenIds++;
        _mint(msg.sender, _tokenIds);
        _setTokenURI(_tokenIds, tokenURI);
        nftPrice[_tokenIds] = tokenPrice;
    }
}
