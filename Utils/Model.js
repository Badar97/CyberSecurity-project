const fs = require("fs");
const compiler = require("./Compiler.js");
const myString = require("../Assets/string.js");
const Web3 = require("web3");
let web3 = new Web3(myString.web3);
let web3_2 = new Web3(myString.web3_2);
let web3_3 = new Web3(myString.web3_3);
const abi = compiler.compile("./CarbonFootprint/CarbonFootprint.sol")[0];  // PATH DA RIFERIRSI DAL PATH DI LANCIO
const contractAddress = JSON.parse(fs.readFileSync('./CarbonFootprint/address.json'))[0]; // PATH DA RIFERIRSI DAL PATH DI LANCIO
const myContract1 = new web3.eth.Contract(abi, contractAddress);
const myContract2 = new web3_2.eth.Contract(abi, contractAddress);
const myContract3 = new web3_3.eth.Contract(abi, contractAddress);

function print_error(error) {
	console.log('\n' + error.toString().slice());
}

//MODEL FORNITORE
async function GetLastID() {
	var result = null;
	try {
		await myContract1.methods.getLastID().call().then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
	return result;
}

async function AddRawMaterial(last_id, answer, myAccountAddress) {
	var result = null;
	try {
		await myContract1.methods.AddRawMaterial(last_id, answer.nome.toUpperCase(), answer.footprint, answer.amount).send({from: myAccountAddress}).then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
	return result;
}

async function SearchByName(name) {
	var result = null;
	try {
		await myContract1.methods.SearchLotsByRawMaterialName(name.toUpperCase()).call().then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
	return result;
}

async function SearchByLot(lot_id) {
	var result = null;
	try {
		await myContract1.methods.SearchInfoLot(lot_id).call().then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
	return result;	
}

//MODEL TRASFORMATORE

async function CheckMyLots(myAccountAddress) {
	var result = null;
	try {
		await myContract2.methods.CheckMyLots(myAccountAddress).call().then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
	return result;	
}

async function PurchaseLot(ids, myAccountAddress) {
	var result = null;
	try {
		await myContract2.methods.PurchaseLot(ids).send({from: myAccountAddress}).then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
    return result;
}

async function AddProduct(id, name, array, amount, myAccountAddress) {
	var result = null;
	try {
		await myContract2.methods.AddProduct(id, name, array, amount).send({from: myAccountAddress}).then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
    return result;
}

async function TrasformationLot(id, footprint , myAccountAddress) {
	var result = null;
	try {
		await myContract2.methods.TrasformationLot(id, footprint).send({from: myAccountAddress}).then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
    return result;
}

//MODEL CLIENTE

async function CheckLotBuyable() {
	var result = null;
	try {
		await myContract3.methods.CheckLotBuyable().call().then((response) => {
			result = response;
		});
	} catch (error) { print_error(error) }
    return result;
}


exports.GetLastID = GetLastID;
exports.AddRawMaterial = AddRawMaterial;
exports.SearchByName = SearchByName;
exports.SearchByLot = SearchByLot;
exports.CheckMyLots = CheckMyLots;
exports.PurchaseLot = PurchaseLot;
exports.AddProduct = AddProduct;
exports.TrasformationLot = TrasformationLot;
exports.CheckLotBuyable = CheckLotBuyable;