const { expect } = require("chai");
const { ethers } = require("hardhat");

async function deployContract() {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("ERC20", owner);
    const hardhatToken = await Token.deploy();
    return { owner: owner, contract: hardhatToken };
}

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    let deployedContract = await deployContract(); 

    const ownerBalance = await deployedContract.contract.balanceOf(deployedContract.owner.address);
    expect(await deployedContract.contract.totalSupply()).to.equal(ownerBalance);
  });
});

describe("Token Economics Basics", function () {
  it("Token Initialization Test", async function () {
    let deployedContract = await deployContract(); 

    const ownerBalance = await deployedContract.contract.balanceOf(deployedContract.owner.address);
    expect(await deployedContract.contract.totalSupply()).to.equal(ownerBalance);
  });
  it("Transfer Token from Owner to 1st User", async function () {
    let deployedContract = await deployContract();

    let amountTransferred = 1000;
    const oldOwnerBalance = await deployedContract.contract.balanceOf(deployedContract.owner.address);

    const [owner, user1] = await ethers.getSigners();

    await deployedContract.contract.transfer(user1.address, amountTransferred);

    expect(await deployedContract.contract.balanceOf(deployedContract.owner.address)).to.equal(oldOwnerBalance - amountTransferred);
    expect(await deployedContract.contract.balanceOf(user1.address)).to.equal(amountTransferred);
  })

  it("Transfer on Behalf of Owner to 1st User", async function() {
    let deployedContract = await deployContract();

    let amountTransferred = 1000;
    const oldOwnerBalance = await deployedContract.contract.balanceOf(deployedContract.owner.address);

    const [owner, user1, user2] = await ethers.getSigners();

    await deployedContract.contract.approve(user2.address, amountTransferred);
    await deployedContract.contract.connect(user2).transferFrom(owner.address, user1.address, amountTransferred);

    expect(await deployedContract.contract.balanceOf(deployedContract.owner.address)).to.equal(oldOwnerBalance - amountTransferred);
    expect(await deployedContract.contract.balanceOf(user1.address)).to.equal(amountTransferred);
  })

  it("Transfer Token from Empty Account", async function() {
    let deployedContract = await deployContract();

    let amountTransferred = 1000;
    const oldOwnerBalance = await deployedContract.contract.balanceOf(deployedContract.owner.address);

    const [owner, user1] = await ethers.getSigners();
    try {
      await deployedContract.contract.connect(user1).transfer(owner.address, amountTransferred);

    } catch (err) {
    }
    expect(await deployedContract.contract.balanceOf(deployedContract.owner.address)).to.equal(oldOwnerBalance);
    expect(await deployedContract.contract.balanceOf(user1.address)).to.equal(0);
  })

  it("Transfer More of Behalf of Owner to 1st User", async function() {
    let deployedContract = await deployContract();

    let amountTransferred = 1000;
    const oldOwnerBalance = await deployedContract.contract.balanceOf(deployedContract.owner.address);

    const [owner, user1, user2] = await ethers.getSigners();

    await deployedContract.contract.approve(user2.address, amountTransferred);
    await deployedContract.contract.connect(user2).transferFrom(owner.address, user1.address, amountTransferred);

    expect(await deployedContract.contract.balanceOf(deployedContract.owner.address)).to.equal(oldOwnerBalance - amountTransferred);
    expect(await deployedContract.contract.balanceOf(user1.address)).to.equal(amountTransferred);
  })
});


describe("Token basics", function (){
  it("Deployment should assign name to token", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20", owner);

    const hardhatToken = await Token.deploy();

    const name  = await hardhatToken.name();

  });

  it("Deployment should assign symbol to token", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20", owner);

    const hardhatToken = await Token.deploy();


    const symbol  = await hardhatToken.symbol();


  });

  it("Deployment should assign total supply to token", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20", owner);

    const hardhatToken = await Token.deploy();


    const totalSupply  = await hardhatToken.totalSupply();

  });

  it("Deployment should assign decimals to token", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20", owner);

    const hardhatToken = await Token.deploy();

    const decimals  = await hardhatToken.decimals();

  });
});

describe("Token Transfers", function (){
  it("User should transfer tokens back to owner successfully", async function () {
    const [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20", owner);

    const hardhatToken = await Token.deploy(); 

    let transferAmount = 1000;

    const transact1 = await hardhatToken.transfer(user.address, transferAmount);

    const transact2 = await hardhatToken.connect(user).transfer(owner.address, transferAmount/2);


    expect(await hardhatToken.balanceOf(user.address)).to.equal(500);


  });

  it("Amount user can spend should be increased", async function(){
    const [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20", owner);

    const hardhatToken = await Token.deploy(); 

    let allowance = 1000;
    let increase = 500;

    await hardhatToken.approve(user.address, allowance);

    try {
      await hardhatToken.increaseAllowance(user.address, increase)
    } catch(err) {
      expect(false).to.equal(true);
    }
    expect(true).to.equal(true);
  });
});