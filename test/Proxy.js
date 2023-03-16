const {time, loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const {anyValue} = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("ProxyMinter", function () {
    async function deployMinter() {
        const [owner,
            _] = await ethers.getSigners();

        const ProxyMinter = await ethers.getContractFactory("ProxyMinter");
        const minter = await ProxyMinter.deploy();

        return {minter, owner};
    }

    async function deployOperators(mainContractAddress, count = 1) {

        const ProxyOperator = await ethers.getContractFactory("contracts/proxy/ProxyOperator.sol:ProxyOperator");
        var operators = []
        for (let i = 0; i < count; i++) {
            operators.push(await ProxyOperator.deploy(mainContractAddress));

        }

        return operators;
    }

    async function deployNftContract() {
        const nft_contract = await ethers.getContractFactory("BasePunks");
        const nft = await nft_contract.deploy();

        return nft
    }

    async function deploy(operators_count = 1) {
        const {minter, owner} = await deployMinter()
        const mainContractAddress = minter.address;
        const operators = await deployOperators(mainContractAddress, operators_count);
        const nft = await deployNftContract()
        return {minter, owner, operators, nft}
    }

    it("Deploy", async function () {
        var {minter, owner, operators, nft} = await deploy()
        var ownerAddr = await owner.getAddress()
        minter = minter.connect(owner)
        var tx = await minter.mint(nft.address, operators.map(op => op.address), "0x830ddb970000000000000000000000000000000000000000000000000000000000000004",{value:ethers.utils.parseEther("0.028")})

        console.log(await nft.balanceOf(operators[0].address));

      });

});
