const Web3 = require("web3");
const fs = require("fs");
const mycontract = require("./mycontract.js");

let web3 = new Web3('http://localhost:22000');
let web3_2 = new Web3('http://localhost:22001');
let web3_3 = new Web3('http://localhost:22002');

var myAccountAddress = null;

web3.eth.getAccounts().then((value) => {
	myAccountAddress = value
	console.log("Nodo 1: " + value);
	fs.writeFileSync('wallets.json', '[\n"' + value + '",\n');
	web3_2.eth.getAccounts().then((value) => {
		console.log("Nodo 2: " + value);
		fs.appendFileSync('wallets.json', '"' + value + '",\n');
		web3_3.eth.getAccounts().then((value) => {
			console.log("Nodo 3: " + value);
			fs.appendFileSync('wallets.json', '"' + value + '"\n]');
			deploy(myAccountAddress[0]);
		});
	});
});

var abi = null;
var bytecode = null;
var contractAddress = null;

function deploy(address) {

	console.log("Used account: " + address);

	var values = mycontract.compile("CarbonFootprint/CarbonFootprint.sol"); 
	abi = values[0];
	bytecode = values[1];

	var simpleContract = new web3.eth.Contract(abi, { from: address } );

	simpleContract.deploy({ data: "0x" + bytecode }).
		send({ from: address, gas: 1500000, gasPrice: '0' }, deploy_handler).
		on('receipt', receipt_handler); 

	console.log("Simple contract deploying ...");

}

async function deploy_handler(e, transactionHash) {
	console.log("Submitted transaction with hash: ", transactionHash);
	if (e) {
		console.log("Error creating contract", e);
	}
} 

function receipt_handler(receipt) {
	try {
		fs.writeFileSync('CarbonFootprint/address.json', '[\n"' + receipt.contractAddress + '"\n]');
		contractAddress = receipt.contractAddress;
		console.log("Contract mined: " + receipt.contractAddress);
		console.log(receipt);
	} catch (err) {
		console.error("Error handling receipt: ", err);
	}
}
