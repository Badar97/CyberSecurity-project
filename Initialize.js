const Web3 = require("web3");
const fs = require("fs");
const compiler = require("./Utils/Compiler.js");
const String = require("./Assets/string.js");
const Path = require("./Assets/path.js");
let web3 = new Web3(Path.web3);
let web3_2 = new Web3(Path.web3_2);
let web3_3 = new Web3(Path.web3_3);

var myAccountAddress = null;

web3.eth.getAccounts().then((value) => {
	myAccountAddress = value
	console.log(String.node1_string + value);
	fs.writeFileSync('./Assets/wallets.json', '[\n"' + value + '",\n');
	web3_2.eth.getAccounts().then((value) => {
		console.log(String.node2_string + value);
		fs.appendFileSync('./Assets/wallets.json', '"' + value + '",\n');
		web3_3.eth.getAccounts().then((value) => {
			console.log(String.node3_string + value);
			fs.appendFileSync('./Assets/wallets.json', '"' + value + '"\n]');
			deploy(myAccountAddress[0]);
		});
	});
});

function deploy(address) {
	console.log(String.usedAccount_string + address);
	var values = compiler.compile("./CarbonFootprint/CarbonFootprint.sol"); 
	var abi = values[0];
	var bytecode = values[1];
	var wallets = JSON.parse(fs.readFileSync('./Assets/wallets.json'));
	var simpleContract = new web3.eth.Contract(abi);
	simpleContract.deploy({ data: "0x" + bytecode, arguments: wallets}).send({ from: address }).then(function(newContractInstance){
		console.log(String.deployCompleted_string);
		console.log(String.addressContract_string + newContractInstance.options.address);
		fs.writeFileSync('./CarbonFootprint/address.json', '[\n"' + newContractInstance.options.address + '"\n]');
	});
}