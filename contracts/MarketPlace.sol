// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MyNFT.sol";

contract Marketplace {
    MyNFT public nft;
    ERC20 public token;

    constructor(MyNFT _nft, ERC20 _token) {
        nft = _nft;
        token = _token;
    }

    event SellNFT(address indexed from, address to, uint256 tokenId);
    event BuyNFT(
        address indexed from,
        address to,
        uint256 tokenId,
        uint256 price
    );

    function sellNFT(uint256 tokenId) public {
        require(nft.ownerOf(tokenId) == msg.sender, "You don't own this token");
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        emit SellNFT(msg.sender, address(this), tokenId);
    }

    function buyNFT(uint256 tokenId) public {
        require(
            token.balanceOf(msg.sender) >= nft.nftPrice(tokenId),
            "Insufficient balance"
        );
        require(nft.ownerOf(tokenId) == address(0), "Token is already owned");
        uint256 price = nft.nftPrice(tokenId);

        token.transferFrom(msg.sender, nft.ownerOf(tokenId), price);
        nft.safeTransferFrom(address(this), msg.sender, tokenId);
        emit BuyNFT(msg.sender, address(this), tokenId, price);
    }
}
