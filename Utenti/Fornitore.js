const rl = require("readline-sync");
const fs = require("fs");
const inquirer = require('inquirer');
const Web3 = require("web3");
const mycontract = require("../mycontract.js");

let web3 = new Web3('http://localhost:22000');

function fornitore(address) {

	console.log('HAI SELEZIONATO UN ACCOUNT FORNITORE');

    var question = {
            type: 'list',
            name: 'action',
            message: 'SELEZIONA UN\'OPERAZIONE',
            choices: [
                'INSERIMENTO DI MATERIE PRIME',
                'EXIT'
            ]
    }
    
    inquirer.prompt(question).then((answer) => {
        switch(answer.action) {
            case question.choices[0]: start(address); break;
            case question.choices[1]: default: return;
        }
    });

}

function start(myAccountAddress) {
	
	web3.eth.getTransactionCount(myAccountAddress).then((value) => { 
		
		console.log("Transaction count: ", value); 
		
		var abi = mycontract.compile("CarbonFootprint/CarbonFootprint.sol")[0]; 
		var contractAddress = JSON.parse(fs.readFileSync('CarbonFootprint/address.json'))[0];

		var myContract = new web3.eth.Contract(abi, contractAddress);
			
		const tx = {
			from: myAccountAddress,
			to: contractAddress,
			data: myContract.methods.AddRawMaterial('farina', '003', 10, 10).encodeABI(),
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

exports.fornitore = fornitore;