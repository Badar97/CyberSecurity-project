const fs = require("fs");
const compiler = require("./compiler.js");

const Web3 = require("web3");
let web3 = new Web3('http://localhost:22000');

const abi = compiler.compile("CarbonFootprint/CarbonFootprint.sol")[0]; 
const contractAddress = JSON.parse(fs.readFileSync('CarbonFootprint/address.json'))[0];
const myContract = new web3.eth.Contract(abi, contractAddress);

var myAccountAddress = null;

async function SearchByLot(lot_id) {
	myContract.methods.SearchInfoLot(lot_id).call(function (error, response) { 
		if (error) result = [1, error];
		else result = [0, response];
        return result;
	});		
}

exports.SearchByLot = SearchByLot;
