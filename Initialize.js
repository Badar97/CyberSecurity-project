const Web3 = require("web3");
var fs = require("fs");

let web3 = new Web3('http://localhost:22000');
let web3_2 = new Web3('http://localhost:22001');
let web3_3 = new Web3('http://localhost:22002');

web3.eth.getAccounts().then((value) => {
	fs.writeFileSync('address.json', '[\n"' + value + '",\n');
	web3_2.eth.getAccounts().then((value) => {
		fs.appendFileSync('address.json', '"' + value + '",\n');
		web3_3.eth.getAccounts().then((value) => {
			fs.appendFileSync('address.json', '"' + value + '"\n]');
		});
	});
});

return;