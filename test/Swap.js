const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Falcon Swap", async function () {
  let wbnb;
  let busd;
  let falconToken;

  let falconSwapRouter;
  let falconSwapFactory;

  let owner, user1, user2, user3;

  beforeEach(async () => {
    [owner, user1, user2, user3] = await ethers.getSigners();
    const WBNB = await ethers.getContractFactory("WBNB");
    wbnb = await WBNB.deploy();
    await wbnb.deployed();
    await wbnb.deposit({ value: ethers.utils.parseEther("100") });

    const BUSD = await ethers.getContractFactory("BUSD");
    busd = await BUSD.deploy("100000000000000000000000000000");
    await busd.deployed();

    const FalconToken = await ethers.getContractFactory("FALCONS");
    falconToken = await FalconToken.deploy("100000000000000000000000000000");
    await falconToken.deployed();

    const FalconSwapFactory = await ethers.getContractFactory(
      "FalconSwapFactory"
    );
    falconSwapFactory = await FalconSwapFactory.deploy(owner.address);
    await falconSwapFactory.deployed();

    const FalconSwapRouter = await ethers.getContractFactory(
      "FalconSwapRouter"
    );
    falconSwapRouter = await FalconSwapRouter.deploy(
      falconSwapFactory.address,
      wbnb.address
    );
    await falconSwapRouter.deployed();
  });

  describe("Swap", async () => {
    it("add liquidity", async function () {
      // Create pair
      await falconSwapFactory.createPair(busd.address, falconToken.address);

      console.log(
        "Pair: ",
        await falconSwapFactory.getPair(busd.address, falconToken.address)
      );

      // Approve token for falconRouter
      await busd.approve(falconSwapRouter.address, "1000000000000000000000");
      await falconToken.approve(
        falconSwapRouter.address,
        "10000000000000000000000"
      );

      // Add liquidity
      const deadline = parseInt(Date.now() / 1000 + 60).toString();
      await falconSwapRouter.addLiquidity(
        busd.address,
        falconToken.address,
        "1000000000000000000000",
        "10000000000000000000000",
        "1000000000000000000000",
        "10000000000000000000000",
        owner.address,
        deadline
      );
    });
  });
});
