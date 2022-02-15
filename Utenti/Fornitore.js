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
	var question = [
		{
			type: 'input',
			name: 'nome',
			message: 'INSERISCI IL NOME'
		}, 
		{
			type: 'input',
			name: 'lotto',
			message: 'INSERISCI IL LOTTO'
		},
		{
			type: 'input',
			name: 'footprint',
			message: 'INSERISCI IL FOOTPRINT'
		},	
		{
			type: 'input',
			name: 'amount',
			message: 'INSERISCI LA QUANTITA\''
		}
	]

	inquirer.prompt(question).then((answer) => {
	   add(answer);
    });
}

function SearchByLot(){

	var question = 
		{
			type: 'input',
			name: 'lotto',
			message: 'INSERISCI IL CODICE DI LOTTO: '
		}

	inquirer.prompt(question).then((answer) => {
		search(answer.lotto);
	});
}

function SearchByName(){
	
	var question = 
		{
			type: 'input',
			name: 'nome',
			message: 'INSERISCI IL NOME DELLA MATERIA PRIMA: '
		}
	
	inquirer.prompt(question).then((answer) => {
		search_name(answer.nome);
	});
}
	

function add(answer) { 

	var abi = mycontract.compile("CarbonFootprint/CarbonFootprint.sol")[0]; 
	var contractAddress = JSON.parse(fs.readFileSync('CarbonFootprint/address.json'))[0];

	var myContract = new web3.eth.Contract(abi, contractAddress);

	myContract.methods.AddRawMaterial(answer.nome.toUpperCase(), answer.lotto, answer.footprint, answer.amount).send({from: myAccountAddress}, function(error){
		if (error) console.log('\n' + error);
		else {
			console.log("\nTRANSAZIONE ESEGUITA");
			console.log('\nHAI INSERITO LA MATERIA PRIMA: ' + answer.nome.toUpperCase() + '\nLOTTO: ' + answer.lotto +'\nFOOTIPRINT: ' + answer.footprint +'\nQUANTITA\': ' + answer.amount);
		}
		console.log("\n-----------------\n");
		fornitore(myAccountAddress);
	});		
}

function search(lotto){

	var abi = mycontract.compile("CarbonFootprint/CarbonFootprint.sol")[0]; 
	var contractAddress = JSON.parse(fs.readFileSync('CarbonFootprint/address.json'))[0];

	var myContract = new web3.eth.Contract(abi, contractAddress);
	
	myContract.methods.SearchByLot(lotto).call(function (error, response) { 
		if (error) console.log('\n' + error);
		else { 
		 	console.log('\nMATERIA PRIMA: ' + response.name_RawMaterial + '\nFOOTIPRINT: ' + response.carbonfootprint_RawMaterial +'\nQUANTITA\': ' + response.amount_RawMaterial);
		} 
		console.log("\n-----------------\n");
		fornitore(myAccountAddress);
	});
				
}

function search_name(nome){
	
	var abi = mycontract.compile("CarbonFootprint/CarbonFootprint.sol")[0]; 
	var contractAddress = JSON.parse(fs.readFileSync('CarbonFootprint/address.json'))[0];

	var myContract = new web3.eth.Contract(abi, contractAddress);
	
	myContract.methods.SearchByName(nome).call(function (error, response) {
		if (error) console.log('\n' + error);
		else { 
		 	console.log('\nMATERIA PRIMA: ' + response.name_RawMaterial + '\nLOTTI: ' + response.lot_RawMaterial +'\nQUANTITA\': ' + response.amount_RawMaterial);
		}
		console.log("\n-----------------\n");
		fornitore(myAccountAddress);
	});

}

exports.fornitore = fornitore;
