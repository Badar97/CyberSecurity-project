const fs = require("fs");
const compiler = require("./Compiler.js");
const myString = require("../Assets/string.js");
const Web3 = require("web3");
let web3 = new Web3(myString.web3);
let web3_2 = new Web3(myString.web3_2);
let web3_3 = new Web3(myString.web3_3);

const abi_cf = compiler.compile("./Contracts/CarbonFootprint/CarbonFootprint.sol")[0];  // PATH RELATIVO ALLA DIRECTORY DI LANCIO
const contractAddress_cf = JSON.parse(fs.readFileSync('./Contracts/CarbonFootprint/address.json'))[0]; // PATH RELATIVO ALLA DIRECTORY DI LANCIO
const CarbonFootprint1 = new web3.eth.Contract(abi_cf, contractAddress_cf);
const CarbonFootprint2 = new web3_2.eth.Contract(abi_cf, contractAddress_cf);
const CarbonFootprint3 = new web3_3.eth.Contract(abi_cf, contractAddress_cf);

const abi_nftcf = compiler.compile("./Contracts/NFT_Footprint/NFT_Footprint.sol")[0];  // PATH RELATIVO ALLA DIRECTORY DI LANCIO
const contractAddress_nftcf = JSON.parse(fs.readFileSync('./Contracts/NFT_Footprint/address.json'))[0]; // PATH RELATIVO ALLA DIRECTORY DI LANCIO
const NFT_Footprint1 = new web3.eth.Contract(abi_nftcf, contractAddress_nftcf);
const NFT_Footprint2 = new web3_2.eth.Contract(abi_nftcf, contractAddress_nftcf);
const NFT_Footprint3 = new web3_3.eth.Contract(abi_nftcf, contractAddress_nftcf);

function print_error(error) {
	console.log('\n' + error.toString().slice(43));
}

//MODEL FORNITORE
async function getLastID() {
	var result = null;
	try {
		await CarbonFootprint1.methods.getLastID().call().then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
	return result;
}

async function addRawMaterial(last_id, answer, myAccountAddress) {
	var result = null;
	try {
		await CarbonFootprint1.methods.addRawMaterial(last_id, answer.nome.toUpperCase(), answer.footprint, answer.amount).send({from: myAccountAddress}).then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
	return result;
}

async function searchByName(name) {
	var result = null;
	try {
		await CarbonFootprint1.methods.searchLotsByRawMaterialName(name.toUpperCase()).call().then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
	return result;
}

async function searchByLot(lot_id) {
	var result = null;
	try {
		await CarbonFootprint1.methods.searchInfoLot(lot_id).call().then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
	return result;	
}

//MODEL TRASFORMATORE

async function checkMyLots(myAccountAddress) {
	var result = null;
	try {
		await CarbonFootprint2.methods.checkMyLots(myAccountAddress).call().then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
	return result;	
}

async function purchaseLot(ids, myAccountAddress) {
	var result = null;
	try {
		await CarbonFootprint2.methods.purchaseLot(ids).send({from: myAccountAddress}).then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
    return result;
}

async function addProduct(id, name, array, amount, footprint, myAccountAddress) {
	var result = null;
	try {
		await CarbonFootprint2.methods.addProduct(id, name, array, amount, footprint).send({from: myAccountAddress}).then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
    return result;
}

async function mintNFT(myAccountAddress) {
	var result = null;
	try {
		await NFT_Footprint2.methods.safeMint(myAccountAddress).send({ from: myAccountAddress }).then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
    return result;
}

async function getTokenID(myAccountAddress) {
	var result = null;
	try {
		await NFT_Footprint2.methods.returnBalance(myAccountAddress).call().then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
    return result;
}

//MODEL CLIENTE

async function checkBuyableLots() {
	var result = null;
	try {
		await CarbonFootprint3.methods.checkBuyableLots().call().then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
    return result;
}


exports.getLastID = getLastID;
exports.addRawMaterial = addRawMaterial;
exports.searchByName = searchByName;
exports.searchByLot = searchByLot;
exports.checkMyLots = checkMyLots;
exports.purchaseLot = purchaseLot;
exports.addProduct = addProduct;
exports.getTokenID = getTokenID;
exports.mintNFT = mintNFT;
exports.checkBuyableLots = checkBuyableLots;