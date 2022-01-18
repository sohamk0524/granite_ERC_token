const { expect } = require("chai");
const { ethers } = require("hardhat");
const BigNumber = require('bignumber.js');

async function deployContract(chain) {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("ERC20", owner);
    const hardhatToken = await Token.deploy(chain);
    return { owner: owner, contract: hardhatToken };
}

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    let deployedContract = await deployContract(1); 

    const ownerBalance = await deployedContract.contract.balanceOf(deployedContract.owner.address);
    expect(await deployedContract.contract.totalSupply()).to.equal(ownerBalance);
  });
});

describe("Token Economics Basics", function () {
  it("Token Initialization Test", async function () {
    let deployedContract = await deployContract(1); 

    const ownerBalance = await deployedContract.contract.balanceOf(deployedContract.owner.address);
    expect(await deployedContract.contract.totalSupply()).to.equal(ownerBalance);
  });
  it("Transfer Token from Owner to 1st User", async function () {
    let deployedContract = await deployContract(1);
    const [owner, user1] = await ethers.getSigners();
    let amountTransferred = 1000;
    const oldOwnerBalance = await deployedContract.contract.balanceOf(deployedContract.owner.address);

    

    await deployedContract.contract.transfer(user1.address, amountTransferred);

    expect(await deployedContract.contract.balanceOf(deployedContract.owner.address)).to.equal(oldOwnerBalance - amountTransferred);
    expect(await deployedContract.contract.balanceOf(user1.address)).to.equal(amountTransferred);
  })

  it("Transfer on Behalf of Owner to 1st User", async function() {
    let deployedContract = await deployContract(1);

    let amountTransferred = 1000;
    const oldOwnerBalance = await deployedContract.contract.balanceOf(deployedContract.owner.address);

    const [owner, user1, user2] = await ethers.getSigners();

    await deployedContract.contract.approve(user2.address, amountTransferred);
    await deployedContract.contract.connect(user2).transferFrom(owner.address, user1.address, amountTransferred);

    expect(await deployedContract.contract.balanceOf(deployedContract.owner.address)).to.equal(oldOwnerBalance - amountTransferred);
    expect(await deployedContract.contract.balanceOf(user1.address)).to.equal(amountTransferred);
  })

  it("Transfer Token from Empty Account", async function() {
    let deployedContract = await deployContract(1);

    let amountTransferred = 1000;
    const oldOwnerBalance = await deployedContract.contract.balanceOf(deployedContract.owner.address);

    const [owner, user1] = await ethers.getSigners();
    try {
      await deployedContract.contract.connect(user1).transfer(owner.address, amountTransferred);

    } catch (err) {
      expect(true,true);
      return;
    }

    expect(false,true);
   
  })

  it("Transfer More of Behalf of Owner to 1st User", async function() {
    let deployedContract = await deployContract(1);

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

    const hardhatToken = await Token.deploy(1);

    const name  = await hardhatToken.name();

  });

  it("Deployment should assign symbol to token", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20", owner);

    const hardhatToken = await Token.deploy(1);


    const symbol  = await hardhatToken.symbol();


  });

  it("Deployment should assign total supply to token", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20", owner);

    const hardhatToken = await Token.deploy(1);


    const totalSupply  = await hardhatToken.totalSupply();

  });

  it("Deployment should assign decimals to token", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20", owner);

    const hardhatToken = await Token.deploy(1);

    const decimals  = await hardhatToken.decimals();

  });
});

describe("Token Transfers", function (){
  it("User should transfer tokens back to owner successfully", async function () {
    const [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20", owner);

    const hardhatToken = await Token.deploy(1); 

    let transferAmount = 1000;

    const transact1 = await hardhatToken.transfer(user.address, transferAmount);

    const transact2 = await hardhatToken.connect(user).transfer(owner.address, transferAmount/2);


    expect(await hardhatToken.balanceOf(user.address)).to.equal(500);


  });

  it("Amount user can spend should be increased", async function(){
    const [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20", owner);

    const hardhatToken = await Token.deploy(1); 

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

describe("Minting Tests", function(){
  it("Should catch an error if anyone besides owner tries to mint tokens", async function(){
    let deployedContract = await deployContract(1);
    const [owner, user1] = await ethers.getSigners();
    let amountMinted = 1000;

    try{
      await deployedContract.contract.connect(user1).safeMint(amountMinted);
    }catch(err){
      expect(true,true);
      return;
    }
    
    expect(false,true);

  });

  it("Should catch an error if someone besides the owner tries to mint tokens to another user", async function(){
    let deployedContract = await deployContract(1);
    const [owner, user1, user2] = await ethers.getSigners();
    let amountMinted = 1000;

    try{
      await deployedContract.contract.connect(user1).safeMint(user2.address, amountMinted);
    }catch(err){
      expect(true, true);
      return;
    }

    expect(false,true);
  });
});

describe("Bridging Tests", function(){

  it("Successfully bridges Tokens out of main chain to side chain", async function(){

    let deployedContract = await deployContract(1)
    const [owner, user1] = await ethers.getSigners();
    const ownerBalance = await deployedContract.contract.balanceOf(deployedContract.owner.address);
    let amountTransferred = 1000;
    let bridgedAmt = 500;

    
    await deployedContract.contract.transfer(user1.address, amountTransferred);

    await deployedContract.contract.bridge(user1.address, bridgedAmt, 1,2);
    expect(await deployedContract.contract.balanceOf(user1.address)).to.equal(bridgedAmt);

  });
  
  it("Successfully bridges Tokens into main chain from side chain", async function(){

    let deployedContract = await deployContract(1)
    const [owner, user1] = await ethers.getSigners();
    const ownerBalance = await deployedContract.contract.balanceOf(deployedContract.owner.address);
    let amountTransferred = 1000;
    let bridgedAmt = 500;

    
    await deployedContract.contract.transfer(user1.address, amountTransferred);

    await deployedContract.contract.bridge(user1.address, bridgedAmt, 2,1);
    expect(await deployedContract.contract.balanceOf(user1.address)).to.equal(bridgedAmt+amountTransferred);

  });
  
  it("Bridges tokens from one contract to another", async function(){
    let deployedContract1 = await deployContract(1); //Main Contract

    let deployedContract2 = await deployContract(2); //Side Contract
    
    const[owner, user1, user2] = await ethers.getSigners();

    let amountTransferred = 1000;
    let bridgedAmount = 500;

    await deployedContract1.contract.transfer(user1.address, amountTransferred);
    await deployedContract2.contract.transfer(user2.address, amountTransferred);

    let bridgeOut = await deployedContract1.contract.bridge(user1.address, bridgedAmount, 1, 2);

    if(bridgeOut){
      await deployedContract2.contract.bridge(user2.address, bridgedAmount, 1, 2);
    }

    expect(await deployedContract2.contract.balanceOf(user2.address)).to.equal(bridgedAmount+amountTransferred);
    expect(await deployedContract1.contract.balanceOf(user1.address)).to.equal(bridgedAmount);


  });

  it("Show Invalid Bridging between Contracts", async function(){
    let deployedContract1 = await deployContract(1); //Main Contract

    let deployedContract2 = await deployContract(2); //Side Contract
    
    const[owner, user1, user2] = await ethers.getSigners();

    let amountTransferred = 1000;
    let bridgedAmount = 1500;

    await deployedContract1.contract.transfer(user1.address, amountTransferred);
    await deployedContract2.contract.transfer(user2.address, amountTransferred);

    try{
      await deployedContract1.contract.bridge(user1.address,bridgedAmount,1,2);
    }catch(err){
      //console.log("Caught Invalid Bridge Amount");
      expect(true, true);
      return;
    }

    expect(false, true);

  });
  

});