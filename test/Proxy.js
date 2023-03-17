const {time, loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const {anyValue} = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {expect} = require("chai");
const {ethers} = require("hardhat");

const MINT_DATA = "0x830ddb970000000000000000000000000000000000000000000000000000000000000004"
const MINT_SUM_PRICE = ethers
    .utils
    .parseEther("2.548")

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

        return operators.map(o => o.address);
    }

    async function deployNftContract() {
        const nft_contract = await ethers.getContractFactory("BasePunks");
        const nft = await nft_contract.deploy();

        return nft
    }

    async function deploy(operators_count = 1) {
        await network
            .provider
            .send("evm_setIntervalMining", [100]);
        const {minter, owner} = await deployMinter()
        const mainContractAddress = minter.address;
        const operators = await deployOperators(mainContractAddress, operators_count);
        const nft = await deployNftContract()
        return {minter, owner, operators, nft}
    }

    async function getTokens(hash, provider) {
        var res = await provider.getTransactionReceipt(hash)
        var logs = res['logs'].filter(l => l['topics'][0] == '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')
        return logs.map(l => parseInt(l['topics'][3], 16))
    }

    it("Deploy", async function () {
        var {minter, owner, operators, nft} = await deploy(91)
        var ownerAddr = await owner.getAddress()
        minter = minter.connect(owner)
        var gas = await minter
            .estimateGas
            .mint(nft.address, operators, MINT_DATA, {value: MINT_SUM_PRICE})
        console.log(gas)
        var tx = await minter.mint(nft.address, operators, MINT_DATA, {
            value: MINT_SUM_PRICE,
            gasLimit: gas.toNumber() + 5000
        })

        var tokens = await getTokens(tx.hash, owner.provider)
        console.log("HERE")
        gas = await minter
            .estimateGas
            .withdraw(nft.address, ownerAddr, operators, tokens)
        console.log(gas)
        await minter.withdraw(nft.address, ownerAddr, operators, tokens, {
            gasLimit: gas.toNumber() + 5000
        })
        console.log(gas)
        var balance = (await nft.balanceOf(ownerAddr)).toNumber()
        expect(balance)
            .to
            .eq(364)
    });

});
