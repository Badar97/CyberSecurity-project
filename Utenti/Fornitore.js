const rl = require("readline-sync");
const fs = require("fs");
const inquirer = require('inquirer');
const Web3 = require("web3");
const mycontract = require("../mycontract.js");

let web3 = new Web3('http://localhost:22000');

var myAccountAddress = null;



function fornitore(address) {

	myAccountAddress = address;

    var question = {
            type: 'list',
            name: 'action',
            message: 'MENU\' FORNITORE',
            choices: [
                'INSERIMENTO DI MATERIE PRIME',
				'RICERCA MATERIA PRIMA PER LOTTO',
				'RICERCA MATERIA PRIMA PER NOME',
				'TRASPORTO',
                'EXIT'
            ]
    }
    
    inquirer.prompt(question).then((answer) => {
        switch(answer.action) {
            case question.choices[0]: Insert(); break;
			case question.choices[1]: SearchByLot(); break;
			case question.choices[2]: SearchByName(); break;
			case question.choices[3]: Transport(); break;
            case question.choices[4]: default: return;
        }
    });

}

function Insert() {
	var question1 = [
		{
			type: 'input',
			name: 'nome',
			message: 'IMMETTI IL NOME',} , 

		{
			type: 'input',
			name: 'lotto',
			message: 'IMMETTI IL LOTTO',} ,

		{
			type: 'input',
			name: 'footprint',
			message: 'IMMETTI IL FOOTPRINT',} ,
			
		{
			type: 'input',
			name: 'amount',
			message: 'IMMETTI LA QUANTITA\' ',}
		
	]

	inquirer.prompt(question1).then((answer) => {
	   console.log("\n");
       console.log('HAI INSERITO LA MATERIA PRIMA: ' + answer.nome + '\nCON LOTTO: ' + answer.lotto +'\nCON FOOTIPRINT: ' + answer.footprint +'\nIN QUANTITA\': ' + answer.amount);
	   add(answer);
    });
}

function SearchByLot(){
	var question2 = 
		{
			type: 'input',
			name: 'lotto',
			message: 'IMMETTI IL LOTTO DELLA MATERIA PRIMA: ', }

	
	inquirer.prompt(question2).then((answer) => {
			search(answer.lotto);
			 });
		}


function SearchByName(){
			var question3 = 
				{
					type: 'input',
					name: 'nome',
					message: 'IMMETTI IL NOME DELLA MATERIA PRIMA: ', }
		
			
			inquirer.prompt(question3).then((answer) => {
					search_name(answer.nome);
					 });
				}
	


function add(answer) { 
	web3.eth.getTransactionCount(myAccountAddress).then((value) => { 

		var abi = mycontract.compile("CarbonFootprint/CarbonFootprint.sol")[0]; 
		var contractAddress = JSON.parse(fs.readFileSync('CarbonFootprint/address.json'))[0];

		var myContract = new web3.eth.Contract(abi, contractAddress);
			
		const tx = {
			from: myAccountAddress,
			to: contractAddress,
			data: myContract.methods.AddRawMaterial(answer.nome, answer.lotto, answer.footprint, answer.amount).encodeABI(),
			gas: 1500000, 
			gasPrice: '0',
			nonce: value
		};

		const signPromise = web3.eth.signTransaction(tx, myAccountAddress);
		signPromise.then((signedTransaction) => {
			const sentTx = web3.eth.sendSignedTransaction(signedTransaction.raw || signedTransaction.rawTransaction);

			sentTx.on("error", (error) => {
				console.log("ERRORE DURANTE LA TRANSAZIONE: ", error);
			});

		sentTx.on("receipt", (receipt) => {
			console.log("TRANSAZIONE ESEGUITA")
		}); 	
		}).catch((error) => {
			console.log("Sign Promise error: ", error);
		}); 
		console.log("\n-----------------\n");
		fornitore(myAccountAddress);
	});
				
}

function search(lotto){

	var abi = mycontract.compile("CarbonFootprint/CarbonFootprint.sol")[0]; 
	var contractAddress = JSON.parse(fs.readFileSync('CarbonFootprint/address.json'))[0];

	var myContract = new web3.eth.Contract(abi, contractAddress);
	
	myContract.methods.SearchByLot(lotto).call(function (err, res) { if (err) { console.error("Error calling: ", err); } else { 
		 console.log('MATERIA PRIMA: ' + res.name_RawMaterial + '\nCON FOOTIPRINT: ' + res.carbonfootprint_RawMaterial +'\nIN QUANTITA\': ' + res.amount_RawMaterial); } 
		 console.log("\n-----------------\n");
		 fornitore(myAccountAddress);
		});
				
}

function search_name(nome){
	
	var abi = mycontract.compile("CarbonFootprint/CarbonFootprint.sol")[0]; 
	var contractAddress = JSON.parse(fs.readFileSync('CarbonFootprint/address.json'))[0];

	var myContract = new web3.eth.Contract(abi, contractAddress);
	
	myContract.methods.SearchByName(nome).call(function (err, res) { if (err) { console.error("Error calling: ", err); } else { 
		 console.log('MATERIA PRIMA: ' + res.name_RawMaterial + '\nLOTTI: ' + res.lot_RawMaterial +'\nIN QUANTITA\': ' + res.amount_RawMaterial); } 
		 console.log("\n-----------------\n");
		 fornitore(myAccountAddress);
		});

}


exports.fornitore = fornitore;
