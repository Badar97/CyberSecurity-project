const Web3 = require("web3");
const fs = require("fs");
const compiler = require("./Utils/Compiler.js");
const myString = require("./Assets/string.js");
let web3 = new Web3(myString.web3);
let web3_2 = new Web3(myString.web3_2);
let web3_3 = new Web3(myString.web3_3);

var myAccountAddress = null;

web3.eth.getAccounts().then((value) => {
	myAccountAddress = value
	console.log(myString.node1_string + value);
	fs.writeFileSync('./Assets/wallets.json', '[\n"' + value + '",\n');
	web3_2.eth.getAccounts().then((value) => {
		console.log(myString.node2_string + value);
		fs.appendFileSync('./Assets/wallets.json', '"' + value + '",\n');
		web3_3.eth.getAccounts().then((value) => {
			console.log(myString.node3_string + value);
			fs.appendFileSync('./Assets/wallets.json', '"' + value + '"\n]');
			deploy(myAccountAddress[0]);
		});
	});
});

function deploy(address) {
	console.log(myString.usedAccount_string + address);
	var values = compiler.compile("./CarbonFootprint/CarbonFootprint.sol"); 
	var abi = values[0];
	var bytecode = values[1];
	var wallets = JSON.parse(fs.readFileSync('./Assets/wallets.json'));
	var simpleContract = new web3.eth.Contract(abi);
	simpleContract.deploy({ data: "0x" + bytecode, arguments: wallets}).send({ from: address }).then(function(newContractInstance){
		console.log(myString.deployCompleted_string);
		console.log(myString.addressContract_string + newContractInstance.options.address);
		fs.writeFileSync('./CarbonFootprint/address.json', '[\n"' + newContractInstance.options.address + '"\n]');
	});
}