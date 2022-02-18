const Web3 = require("web3");
const fs = require("fs");
const compiler = require("./compiler.js");

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

function deploy(address) {

	console.log("\nACCOUNT USATO: " + address);

	var values = compiler.compile("CarbonFootprint/CarbonFootprint.sol"); 
	var abi = values[0];
	var bytecode = values[1];

	var wallets = JSON.parse(fs.readFileSync('wallets.json'));

	var simpleContract = new web3.eth.Contract(abi);

	simpleContract.deploy({ data: "0x" + bytecode, arguments: wallets}).send({ from: address }).then(function(newContractInstance){
		console.log('\nDEPLOY COMPLETO');
		console.log('\nINDIRIZZO DELLO SMART CONTRACT: ' + newContractInstance.options.address);
		fs.writeFileSync('CarbonFootprint/address.json', '[\n"' + newContractInstance.options.address + '"\n]');
	});

	return;
}