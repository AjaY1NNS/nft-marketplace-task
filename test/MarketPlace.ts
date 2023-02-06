import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { expandToDecimals } from "./utilities/utilities";

describe("MarketPlace", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2] = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy("MyToken", "MT", 10000);

    const MyNFT = await ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy("MyNFT", "MNFT");

    const MarketPlace = await ethers.getContractFactory("Marketplace");
    const marketPlace = await MarketPlace.deploy(
      myNFT.address,
      myToken.address
    );

    return { myToken, myNFT, marketPlace, owner, account1, account2 };
  }

  describe("Token", function () {
    it("Should set the right total supply ", async function () {
      const { myToken, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await myToken.balanceOf(owner.address)).to.equal(
        expandToDecimals(10000, 18)
      );
    });
  });

  describe("NFT", function () {
    it("Should mint the nft to and check the owner ", async function () {
      const { myNFT, owner, account1 } = await loadFixture(
        deployOneYearLockFixture
      );

      await myNFT
        .connect(account1)
        .mint(
          "https://source.unsplash.com/user/c_v_r/1900x800",
          expandToDecimals(10, 18)
        );
      const tokenId = await myNFT.balanceOf(account1.address);
      expect(await myNFT.ownerOf(tokenId)).to.equal(account1.address);
    });
  });

  describe("Marketplace", function () {
    it("Should emit an event on sell nft", async function () {
      const { myNFT, marketPlace, account1 } = await loadFixture(
        deployOneYearLockFixture
      );

      await myNFT
        .connect(account1)
        .mint(
          "https://source.unsplash.com/user/c_v_r/1900x800",
          expandToDecimals(10, 18)
        );

      const tokenId = await myNFT.balanceOf(account1.address);

      const approve = await myNFT
        .connect(account1)
        .approve(marketPlace.address, tokenId);

      expect(await marketPlace.connect(account1).sellNFT(tokenId))
        .to.emit(marketPlace, "SellNFT")
        .withArgs(account1.address, marketPlace.address, tokenId);
    });

    it("Should emit an event on Buy nft", async function () {
      const { myNFT, myToken, marketPlace, account1, account2 } =
        await loadFixture(deployOneYearLockFixture);

      await myNFT
        .connect(account1)
        .mint(
          "https://source.unsplash.com/user/c_v_r/1900x800",
          expandToDecimals(10, 18)
        );

      const tokenId = await myNFT.balanceOf(account1.address);

      const approve = await myNFT
        .connect(account1)
        .approve(marketPlace.address, tokenId);
      const sell = await marketPlace.connect(account1).sellNFT(tokenId);
      const price = await myNFT.nftPrice(tokenId);

      const tokenAppove = await myToken
        .connect(account2)
        .approve(marketPlace.address, price);
      expect(await marketPlace.connect(account2).buyNFT(tokenId))
        .to.emit(marketPlace, "BuyNFT")
        .withArgs(marketPlace.address, account2.address, tokenId, price);
    });
  });
});
