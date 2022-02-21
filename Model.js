const fs = require("fs");
const compiler = require("./compiler.js");

const Web3 = require("web3");
let web3 = new Web3('http://localhost:22000');

const abi = compiler.compile("CarbonFootprint/CarbonFootprint.sol")[0]; 
const contractAddress = JSON.parse(fs.readFileSync('CarbonFootprint/address.json'))[0];
const myContract = new web3.eth.Contract(abi, contractAddress);

async function GetLastID() {
	var result = [];
	try {
		await myContract.methods.getLastID().call(function(error, response){
			if (error) result = [1, error];
			else result = [0, response];
		});
	} catch (error) {}
	return result;
}

async function AddRawMaterial(last_id, answer, myAccountAddress) {
	var result = [];
	try {
		await myContract.methods.AddRawMaterial(last_id, answer.nome.toUpperCase(), answer.footprint, answer.amount).send({from: myAccountAddress}, function(error){
			if (error) result = [1, error];
			else result = [0, null];
		});
	} catch (error) {}
	return result;
}

async function SearchByName(name) {
	var result = [];
	try {
		await myContract.methods.SearchLotsByRawMaterialName(name.toUpperCase()).call(function (error, response) {
			if (error) result = [1, error];
			else result = [0, response];
		});
	} catch (error) {}
	return result;
}

async function SearchByLot(lot_id) {
	var result = [];
	try {
		await myContract.methods.SearchInfoLot(lot_id).call(function (error, response) { 
			if (error) result = [1, error];
			else result = [0, response];
		});
	} catch (error) {}
	return result;	
}

async function CheckMyLots(myAccountAddress) {
	var result = [];
	try {
		await myContract.methods.CheckMyLots(myAccountAddress).call(function(error, response) {
			if (error) result = [1, error];
			else result = [0, response];
		});
	} catch (error) {}
    return result;
}

async function PurchaseLot(ids, myAccountAddress) {
	var result = [];
	try {
		await myContract.methods.PurchaseLot(ids).send({from: myAccountAddress}, function(error) {
			if (error) result = [1, error];
			else result = [0, response];
		});
	} catch (error) {}
    return result;
}

exports.GetLastID = GetLastID;
exports.AddRawMaterial = AddRawMaterial;
exports.SearchByName = SearchByName;
exports.SearchByLot = SearchByLot;
exports.CheckMyLots = CheckMyLots;
exports.PurchaseLot = PurchaseLot;