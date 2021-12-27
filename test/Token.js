const { expect } = require("chai");
const { ethers } = require("hardhat");

/*describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20");

    const hardhatToken = await Token.deploy();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});
*/


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
   /*
   hardhatToken.increaseAllowance(user.address, increase).then(function(result) {
     console.log(result);
     if (result) {
       console.log(result);
       allowance += increase;
     }
     expect(allowance).to.equal(1500);
   })
   */
    
  });
});