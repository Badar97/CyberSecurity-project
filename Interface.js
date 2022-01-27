const rl = require("readline-sync");
const Web3 = require("web3");
const fs = require("fs");
const inquirer = require('inquirer');

let mycontract = require("./mycontract.js");

const wallets = JSON.parse(fs.readFileSync('wallets.json'));

var question = [
	{
		type: 'list',
		name: 'address',
		message: 'SELEZIONA UN WALLET',
		choices: [...wallets, ...['EXIT']]
	}
]

inquirer.prompt(question).then((answer) => {
    switch(answer.address) {
		case wallets[0]: start(wallets[0]); break;
		case wallets[1]: console.log(answer); break;
		case wallets[2]: console.log(answer); break;
		default: console.log('Ciao!'); return;
	}
  });

let web3 = new Web3('http://localhost:22000');
let web3_2 = new Web3('http://localhost:22001');
let web3_3 = new Web3('http://localhost:22002');

function start(myAccountAddress) {
	
	web3.eth.getTransactionCount(myAccountAddress).then((value) => { 
		
		console.log("Transaction count: ", value); 
		
		var values = mycontract.compile("CarbonFootprint/CarbonFootprint.sol"); 
		var contractAddress = JSON.parse(fs.readFileSync('CarbonFootprint/address.json'))[0];

		var myContract = new web3.eth.Contract(values[0], contractAddress);
			
		const tx = {
			from: myAccountAddress,
			to: contractAddress,
			data: myContract.methods.AddRawMaterial('farina', '002', 10, 10).encodeABI(),
			gas: 1500000, 
			gasPrice: '0',
			nonce: value
		};

		const signPromise = web3.eth.signTransaction(tx, myAccountAddress);

		console.log("Sign promise: ", signPromise);
		signPromise.then((signedTransaction) => {
			const sentTx = web3.eth.sendSignedTransaction(signedTransaction.raw || signedTransaction.rawTransaction);

			sentTx.on("error", (error) => {
				console.log("Transaction error: ", error);
			});

		sentTx.on("receipt", (receipt) => {
			console.log("Transaction receipt: ", receipt);
			/*
			try {
				console.log("Ready to call ...");
				var myContract2 = new web3.eth.Contract(abi, contractAddress);
				console.log("myContract2 created ...");
				let res = myContract2.methods.retrieve().call(function (err, res) { if (err) { console.error("Error calling: ", err); } else { console.log("Call result: ", res); } });
				
				console.log("Call passed");
			} catch (err) {
				console.log("Error during call: ", err);
			}
			*/

		});
		}).catch((error) => {

			console.log("Sign Promise error: ", error);
		}); 


	});
	
}