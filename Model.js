const fs = require("fs");
const compiler = require("./compiler.js");
const Web3 = require("web3");
let web3 = new Web3('http://localhost:22000');
let web3_2 = new Web3('http://localhost:22001');
let web3_3 = new Web3('http://localhost:22002');
const abi = compiler.compile("CarbonFootprint/CarbonFootprint.sol")[0]; 
const contractAddress = JSON.parse(fs.readFileSync('CarbonFootprint/address.json'))[0];
const myContract1 = new web3.eth.Contract(abi, contractAddress);
const myContract2 = new web3_2.eth.Contract(abi, contractAddress);
const myContract3 = new web3_3.eth.Contract(abi, contractAddress);

function print_error(error) {
	console.log('\n' + error.toString().slice(43));
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



exports.GetLastID = GetLastID;
exports.AddRawMaterial = AddRawMaterial;
exports.SearchByName = SearchByName;
exports.SearchByLot = SearchByLot;
exports.CheckMyLots = CheckMyLots;
exports.PurchaseLot = PurchaseLot;
exports.AddProduct = AddProduct;