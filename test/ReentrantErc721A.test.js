const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const name="ASONFT"
    const symbol="AEASO"
    const RECEIVER_MAGIC_VALUE = '0x150b7a02';

    const [owner, otherAccount] = await ethers.getSigners();


    const Erc721A=await ethers.getContractFactory("ERC721AMock")
    const erc721A=await Erc721A.deploy(name,symbol)

    const Erc721AReceiver= await ethers.getContractFactory("ERC721ReceiverMock")
    const erc721AReceiver=await Erc721AReceiver.deploy(RECEIVER_MAGIC_VALUE,erc721A.address)
    return { erc721A, owner, otherAccount,name,symbol,erc721AReceiver };
  }

  describe("Deployment and Check", function () {
    it("Should get deployed", async function () {
      const { erc721A, owner,otherAccount,name,symbol,erc721AReceiver } = await loadFixture(deployOneYearLockFixture);
      expect(await erc721AReceiver.sanityCheck()).to.equal(erc721AReceiver.address);
      expect(await erc721A.name()).to.equal(name);
    });
    it("Should reentrant without code-block",async function(){
      const { erc721A, owner,otherAccount,name,symbol,erc721AReceiver } = await loadFixture(deployOneYearLockFixture);
      //this will revert caused 
      //expect(await erc721A.VerysafeMint(erc721AReceiver.address, 1,"0x03")).to.revertedWithCustomError("0x00000000");
      //before check just disable the if block in ERC721A line 892 and remove comment line on below ,add comment line on 
      //above 
      await erc721A.VerysafeMint(erc721AReceiver.address, 1,"0x03")
    })
  });
})