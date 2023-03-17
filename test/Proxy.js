const {time, loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const {anyValue} = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {expect} = require("chai");
const {ethers} = require("hardhat");

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

    async function deployNftContract(nft_name) {
        const nft_contract = await ethers.getContractFactory(nft_name);
        const nft = await nft_contract.deploy();

        return nft
    }

    async function deploy(nft_name, operators_count = 1) {
        await network
            .provider
            .send("evm_setIntervalMining", [100]);
        const {minter, owner} = await deployMinter()
        const mainContractAddress = minter.address;
        const operators = await deployOperators(mainContractAddress, operators_count);
        const nft = await deployNftContract(nft_name)
        return {minter, owner, operators, nft}
    }

    async function getTokens(hash, provider) {
        var res = await provider.getTransactionReceipt(hash)
        var logs = res['logs'].filter(l => l['topics'][0] == '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')
        return logs.map(l => parseInt(l['topics'][3], 16))
    }

    // it("BasePunks", async function () {
    //     const PUNKS_MINT_DATA = "0x830ddb970000000000000000000000000000000000000000000000000000000000000004"
    //     const PUNKS_MINT_SUM_PRICE = ethers
    //         .utils
    //         .parseEther("2.548")
    //     var {minter, owner, operators, nft} = await deploy("BasePunks", 91)
    //     var ownerAddr = await owner.getAddress()
    //     minter = minter.connect(owner)
    //     var gas = await minter
    //         .estimateGas
    //         .mint(nft.address, operators, PUNKS_MINT_DATA, {value: PUNKS_MINT_SUM_PRICE})
    //     var tx = await minter.mint(nft.address, operators, PUNKS_MINT_DATA, {
    //         value: PUNKS_MINT_SUM_PRICE,
    //         gasLimit: gas.toNumber() + 5000
    //     })

    //     var tokens = await getTokens(tx.hash, owner.provider)
    //     console.log("MINT GAS - ", gas)
    //     console.log("TOKENS - ", tokens.length)
    //     gas = await minter
    //         .estimateGas
    //         .withdraw(nft.address, ownerAddr, operators, tokens)
    //     await minter.withdraw(nft.address, ownerAddr, operators, tokens, {
    //         gasLimit: gas.toNumber() + 5000
    //     })
    //     console.log("WITHDRAW GAS - ", gas)
    //     var balance = (await nft.balanceOf(ownerAddr)).toNumber()
    //     expect(balance)
    //         .to
    //         .eq(364)
    // });
    // it("Circles", async function () {
    //     const BORED_MINT_DATA = "0xa0712d680000000000000000000000000000000000000000000000000000000000000013"
    //     const BORED_MINT_SUM_PRICE = ethers
    //         .utils
    //         .parseEther("0.095")
    //     var {minter, owner, operators, nft} = await deploy("BoredBonez", 5)
    //     var ownerAddr = await owner.getAddress()
    //     minter = minter.connect(owner)
    //     var gas = await minter
    //         .estimateGas
    //         .mint(nft.address, operators, BORED_MINT_DATA, {value: BORED_MINT_SUM_PRICE})
    //     var tx = await minter.mint(nft.address, operators, BORED_MINT_DATA, {
    //         value: BORED_MINT_SUM_PRICE,
    //         gasLimit: gas.toNumber() + 5000
    //     })

    //     var tokens = await getTokens(tx.hash, owner.provider)
    //     console.log("MINT GAS - ", gas)
    //     console.log("TOKENS - ", tokens.length)
    //     gas = await minter
    //         .estimateGas
    //         .withdraw(nft.address, ownerAddr, operators, tokens)
    //     await minter.withdraw(nft.address, ownerAddr, operators, tokens, {
    //         gasLimit: gas.toNumber() + 5000
    //     })
    //     console.log("WITHDRAW GAS - ", gas)
    //     var balance = (await nft.balanceOf(ownerAddr)).toNumber()
    //     expect(balance)
    //         .to
    //         .eq(95)
    // });

    it("GORGONZ", async function () {
        const GORGONZ_MINT_DATA = "0x23cf0a220000000000000000000000000000000000000000000000000000000000000014"
        const GORGONZ_MINT_SUM_PRICE = ethers
            .utils
            .parseEther("1")
        var {minter, owner, operators, nft} = await deploy("Gorgonzorats", 5)
        var ownerAddr = await owner.getAddress()
        minter = minter.connect(owner)
        var gas = await minter
            .estimateGas
            .mint(nft.address, operators, GORGONZ_MINT_DATA, {value: GORGONZ_MINT_SUM_PRICE})
        var tx = await minter.mint(nft.address, operators, GORGONZ_MINT_DATA, {
            value: GORGONZ_MINT_SUM_PRICE,
            gasLimit: gas.toNumber() + 5000
        })
        

        var tokens = await getTokens(tx.hash, owner.provider)
        console.log("MINT GAS - ", gas)
        console.log("TOKENS - ", tokens.length)
        gas = await minter
            .estimateGas
            .withdraw(nft.address, ownerAddr, operators, tokens)
        await minter.withdraw(nft.address, ownerAddr, operators, tokens, {
            gasLimit: gas.toNumber() + 5000
        })
        console.log("WITHDRAW GAS - ", gas)
        var balance = (await nft.balanceOf(ownerAddr)).toNumber()
        expect(balance)
            .to
            .eq(100)
    });

});
