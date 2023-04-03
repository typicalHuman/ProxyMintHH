const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProxyMinter", function () {

    const data = new Array();

    async function deployMinter() {
        const [owner,
            _] = await ethers.getSigners();

        const ProxyMinter = await ethers.getContractFactory("ProxyMinter");
        const minter = await ProxyMinter.deploy();

        return { minter, owner };
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
        const { minter, owner } = await deployMinter()
        const mainContractAddress = minter.address;
        const operators = await deployOperators(mainContractAddress, operators_count);
        const nft = await deployNftContract(nft_name)
        return { minter, owner, operators, nft }
    }

    async function getTokens(hash, provider) {
        var res = await provider.getTransactionReceipt(hash)
        var logs = res['logs'].filter(l => l['topics'][0] == '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')
        return logs.map(l => parseInt(l['topics'][3], 16))
    }

    it("BasePunks", async function () {
        const PUNKS_MINT_DATA = "0x830ddb970000000000000000000000000000000000000000000000000000000000000004"
        const PUNKS_MINT_SUM_PRICE = ethers
            .utils
            .parseEther("2.548")
        var { minter, owner, operators, nft } = await deploy("BasePunks", 91)
        var ownerAddr = await owner.getAddress()
        minter = minter.connect(owner)
        var mint_gas = await minter
            .estimateGas
            .mint(nft.address, operators, PUNKS_MINT_DATA, { value: PUNKS_MINT_SUM_PRICE })
        var tx = await minter.mint(nft.address, operators, PUNKS_MINT_DATA, {
            value: PUNKS_MINT_SUM_PRICE,
            gasLimit: mint_gas.toNumber() + 5000
        })

        var tokens = await getTokens(tx.hash, owner.provider)
        console.log("MINT GAS - ", mint_gas)
        console.log("TOKENS - ", tokens.length)
        gas = await minter
            .estimateGas
            .withdraw(nft.address, ownerAddr, operators, tokens)
        await minter.withdraw(nft.address, ownerAddr, operators, tokens, {
            gasLimit: gas.toNumber() + 5000
        })
        console.log("WITHDRAW GAS - ", gas)
        var balance = (await nft.balanceOf(ownerAddr)).toNumber();
        data.push({ Test_Passed: balance === 364, Contract: "BasePunks", Tokens: balance, Mint_Gas: mint_gas.toNumber(), Withdraw_Gas: gas.toNumber(), Operators: operators.length, Summary_Gas: mint_gas.toNumber() + gas.toNumber() });
        console.clear();
        console.table(data);
        expect(balance)
            .to
            .eq(364)
    });
    it("Circles", async function () {
        const BORED_MINT_DATA = "0xa0712d680000000000000000000000000000000000000000000000000000000000000013"
        const BORED_MINT_SUM_PRICE = ethers
            .utils
            .parseEther("0.095")
        var { minter, owner, operators, nft } = await deploy("BoredBonez", 5)
        var ownerAddr = await owner.getAddress()
        minter = minter.connect(owner)
        var mint_gas = await minter
            .estimateGas
            .mint(nft.address, operators, BORED_MINT_DATA, { value: BORED_MINT_SUM_PRICE })
        var tx = await minter.mint(nft.address, operators, BORED_MINT_DATA, {
            value: BORED_MINT_SUM_PRICE,
            gasLimit: mint_gas.toNumber() + 5000
        })

        var tokens = await getTokens(tx.hash, owner.provider)
        console.log("MINT GAS - ", mint_gas)
        console.log("TOKENS - ", tokens.length)
        gas = await minter
            .estimateGas
            .withdraw(nft.address, ownerAddr, operators, tokens)
        await minter.withdraw(nft.address, ownerAddr, operators, tokens, {
            gasLimit: gas.toNumber() + 5000
        })
        console.log("WITHDRAW GAS - ", gas)
        var balance = (await nft.balanceOf(ownerAddr)).toNumber();
        data.push({ Test_Passed: balance === 95, Contract: "Circles", Tokens: balance, Mint_Gas: mint_gas.toNumber(), Withdraw_Gas: gas.toNumber(), Operators: operators.length, Summary_Gas: mint_gas.toNumber() + gas.toNumber() });
        console.clear();
        console.table(data);
        expect(balance)
            .to
            .eq(95)
    });

    it("GORGONZ", async function () {
        const GORGONZ_MINT_DATA = "0x23cf0a220000000000000000000000000000000000000000000000000000000000000014"
        const GORGONZ_MINT_SUM_PRICE = ethers
            .utils
            .parseEther("1")
        var { minter, owner, operators, nft } = await deploy("Gorgonzorats", 5)
        var ownerAddr = await owner.getAddress()
        minter = minter.connect(owner)
        var mint_gas = await minter
            .estimateGas
            .mint(nft.address, operators, GORGONZ_MINT_DATA, { value: GORGONZ_MINT_SUM_PRICE })
        var tx = await minter.mint(nft.address, operators, GORGONZ_MINT_DATA, {
            value: GORGONZ_MINT_SUM_PRICE,
            gasLimit: mint_gas.toNumber() + 5000
        })


        var tokens = await getTokens(tx.hash, owner.provider)
        console.log("MINT GAS - ", mint_gas)
        console.log("TOKENS - ", tokens.length)
        gas = await minter
            .estimateGas
            .withdraw(nft.address, ownerAddr, operators, tokens)
        await minter.withdraw(nft.address, ownerAddr, operators, tokens, {
            gasLimit: gas.toNumber() + 5000
        })
        console.log("WITHDRAW GAS - ", gas)
        var balance = (await nft.balanceOf(ownerAddr)).toNumber();
        data.push({ Test_Passed: balance === 100, Contract: "Gorgonz", Tokens: balance, Mint_Gas: mint_gas.toNumber(), Withdraw_Gas: gas.toNumber(), Operators: operators.length, Summary_Gas: mint_gas.toNumber() + gas.toNumber() });
        console.clear();
        console.table(data);
        expect(balance)
            .to
            .eq(100)
    });

    it("Nakamigas", async () => {
        const NAKAMIGAS_MINT_DATA = "0xa0712d68000000000000000000000000000000000000000000000000000000000000000a";
        const NAKAMIGAS_MINT_SUM_PRICE = ethers.utils.parseEther("0.3");
        let { minter, owner, operators, nft } = await deploy("Nakamigas", 10);
        await nft.deployed();
        await nft.togglePublicState();
        let ownerAddr = owner.getAddress();
        minter = minter.connect(owner);
        let mint_gas = await minter.estimateGas.mint(nft.address, operators, NAKAMIGAS_MINT_DATA, { value: NAKAMIGAS_MINT_SUM_PRICE });
        let tx = await minter.mint(nft.address, operators, NAKAMIGAS_MINT_DATA, {
            value: NAKAMIGAS_MINT_SUM_PRICE,
            gasLimit: mint_gas.toNumber() + 5000
        });
        let tokens = await getTokens(tx.hash, owner.provider);
        console.log("MINT GAS - ", mint_gas);
        console.log("TOKENS - ", tokens.length);
        gas = await minter.estimateGas.withdraw(nft.address, ownerAddr, operators, tokens);
        await minter.withdraw(nft.address, ownerAddr, operators, tokens, {
            gasLimit: gas.toNumber() + 5000
        });
        console.log("WITHDRAW GAS - ", gas);
        let balance = (await nft.balanceOf(ownerAddr)).toNumber();
        data.push({ Test_Passed: balance === 100, Contract: "Nakamigas", Tokens: balance, Mint_Gas: mint_gas.toNumber(), Withdraw_Gas: gas.toNumber(), Operators: operators.length, Summary_Gas: mint_gas.toNumber() + gas.toNumber() });
        console.clear();
        console.table(data);
        expect(balance).to.eq(100);
    });

    it("OniForce", async () => {
        const ONIFORCE_MINT_DATA = "0xefef39a10000000000000000000000000000000000000000000000000000000000000007";
        const ONIFORCE_MINT_SUM_PRICE = ethers.utils.parseEther("3.5");
        let { minter, owner, operators, nft } = await deploy("OniForce", 10);
        await nft.deployed();
        await nft.setIsActive(true);
        let ownerAddr = owner.getAddress();
        minter = minter.connect(owner);
        let mint_gas = await minter.estimateGas.mint(nft.address, operators, ONIFORCE_MINT_DATA, { value: ONIFORCE_MINT_SUM_PRICE });
        let tx = await minter.mint(nft.address, operators, ONIFORCE_MINT_DATA, {
            value: ONIFORCE_MINT_SUM_PRICE,
            gasLimit: mint_gas.toNumber() + 5000
        });
        let tokens = await getTokens(tx.hash, owner.provider);
        console.log("MINT GAS - ", mint_gas);
        console.log("TOKENS - ", tokens.length);
        gas = await minter.estimateGas.withdraw(nft.address, ownerAddr, operators, tokens);
        await minter.withdraw(nft.address, ownerAddr, operators, tokens, {
            gasLimit: gas.toNumber() + 5000
        });
        console.log("WITHDRAW GAS - ", gas);
        let balance = (await nft.balanceOf(ownerAddr)).toNumber();
        data.push({ Test_Passed: balance === 70, Contract: "Oniforce", Tokens: balance, Mint_Gas: mint_gas.toNumber(), Withdraw_Gas: gas.toNumber(), Operators: operators.length, Summary_Gas: mint_gas.toNumber() + gas.toNumber() });
        console.clear();
        console.table(data);
        expect(balance).to.eq(70);
    });

    it("PumpingSlimes", async () => {
        const PUMPING_SLIMES_MINT_DATA = "0xa0712d680000000000000000000000000000000000000000000000000000000000000001";
        let { minter, owner, operators, nft } = await deploy("PumpingSlimes", 85);
        await nft.deployed();
        await nft.setIsPublicSaleActive(true);
        let ownerAddr = owner.getAddress();
        minter = minter.connect(owner);
        let mint_gas = await minter.estimateGas.mint(nft.address, operators, PUMPING_SLIMES_MINT_DATA);
        let tx = await minter.mint(nft.address, operators, PUMPING_SLIMES_MINT_DATA, {
            value: 0,
            gasLimit: mint_gas.toNumber() + 5000
        });
        let tokens = await getTokens(tx.hash, owner.provider);
        console.log("MINT GAS - ", mint_gas);
        console.log("TOKENS - ", tokens.length);
        gas = await minter.estimateGas.withdraw(nft.address, ownerAddr, operators, tokens);
        await minter.withdraw(nft.address, ownerAddr, operators, tokens, {
            gasLimit: gas.toNumber() + 5000
        });
        console.log("WITHDRAW GAS - ", gas);
        let balance = (await nft.balanceOf(ownerAddr)).toNumber();
        data.push({ Test_Passed: balance === 85, Contract: "PumpingSlimes", Tokens: balance, Mint_Gas: mint_gas.toNumber(), Withdraw_Gas: gas.toNumber(), Operators: operators.length, Summary_Gas: mint_gas.toNumber() + gas.toNumber() });
        console.clear();
        console.table(data);
        expect(balance).to.eq(85);
    });

    it("DegentlemensClub", async () => {
        const DEGENTLEMAS_CLUB_MINT_DATA = "0xa0712d680000000000000000000000000000000000000000000000000000000000000005";
        const DEGENTLEMAS_CLUB_MIN_SUM_PRICE = ethers.utils.parseEther("5");
        let { minter, owner, operators, nft } = await deploy("DegentlemensClub", 25);
        await nft.deployed();
        await nft.setPaused(false);
        let ownerAddr = owner.getAddress();
        minter = minter.connect(owner);
        let mint_gas = await minter.estimateGas.mint(nft.address, operators, DEGENTLEMAS_CLUB_MINT_DATA, { value: DEGENTLEMAS_CLUB_MIN_SUM_PRICE });
        let tx = await minter.mint(nft.address, operators, DEGENTLEMAS_CLUB_MINT_DATA, {
            value: DEGENTLEMAS_CLUB_MIN_SUM_PRICE,
            gasLimit: mint_gas.toNumber() + 5000
        });
        let tokens = await getTokens(tx.hash, owner.provider);
        console.log("MINT GAS - ", mint_gas);
        console.log("TOKENS - ", tokens.length);
        gas = await minter.estimateGas.withdraw(nft.address, ownerAddr, operators, tokens);
        await minter.withdraw(nft.address, ownerAddr, operators, tokens, {
            gasLimit: gas.toNumber() + 5000
        });
        console.log("WITHDRAW GAS - ", gas);
        let balance = (await nft.balanceOf(ownerAddr)).toNumber();
        data.push({ Test_Passed: balance === 125, Contract: "DegentlemensClub", Tokens: balance, Mint_Gas: mint_gas.toNumber(), Withdraw_Gas: gas.toNumber(), Operators: operators.length, Summary_Gas: mint_gas.toNumber() + gas.toNumber() });
        console.clear();
        console.table(data);
        expect(balance).to.eq(125);
    });

    it("SmartClubNFT", async () => {
        const SMART_CLUB_NFT_MINT_DATA = "0x5b70ea9f";
        let { minter, owner, operators, nft } = await deploy("SmartClubNFT721", 85);
        let ownerAddr = owner.getAddress();
        minter = minter.connect(owner);
        let mint_gas = await minter.estimateGas.mint(nft.address, operators, SMART_CLUB_NFT_MINT_DATA);
        let tx = await minter.mint(nft.address, operators, SMART_CLUB_NFT_MINT_DATA, {
            value: 0,
            gasLimit: mint_gas.toNumber() + 5000
        });
        let tokens = await getTokens(tx.hash, owner.provider);
        console.log("MINT GAS - ", mint_gas);
        console.log("TOKENS - ", tokens.length);
        gas = await minter.estimateGas.withdraw(nft.address, ownerAddr, operators, tokens);
        await minter.withdraw(nft.address, ownerAddr, operators, tokens, {
            gasLimit: gas.toNumber() + 5000
        });
        console.log("WITHDRAW GAS - ", gas);
        let balance = (await nft.balanceOf(ownerAddr)).toNumber();
        data.push({ Test_Passed: balance === 85, Contract: "SmartClubNFT", Tokens: balance, Mint_Gas: mint_gas.toNumber(), Withdraw_Gas: gas.toNumber(), Operators: operators.length, Summary_Gas: mint_gas.toNumber() + gas.toNumber() });
        console.clear();
        console.table(data);
        expect(balance).to.eq(85);
    });



});
