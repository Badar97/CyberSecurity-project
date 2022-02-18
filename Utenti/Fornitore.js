const fs = require("fs");
const inquirer = require('inquirer');
const compiler = require("../compiler.js");

const Web3 = require("web3");
let web3 = new Web3('http://localhost:22000');

const abi = compiler.compile("CarbonFootprint/CarbonFootprint.sol")[0]; 
const contractAddress = JSON.parse(fs.readFileSync('CarbonFootprint/address.json'))[0];
const myContract = new web3.eth.Contract(abi, contractAddress);

var myAccountAddress = null;

function fornitore(address) {

	myAccountAddress = address;

    var question = {
		type: 'list',
		name: 'action',
		message: 'MENU\' FORNITORE',
		choices: [
			'INSERIMENTO DI MATERIE PRIME',
			'RICERCA MATERIA PRIMA',
			'RICERCA LOTTO',
			'EXIT'
		]
	};
    
    inquirer.prompt(question).then((answer) => {
        switch(answer.action) {
            case question.choices[0]: add_lot(); break;
			case question.choices[1]: search_name(); break;
			case question.choices[2]: search_lot(); break;
            case question.choices[3]: default: return;
        }
    });
}

function add_lot() {

	var question = [
		{ type: 'input', name: 'nome', message: 'MATERIA PRIMA' }, 
		{ type: 'input', name: 'footprint', message: 'FOOTPRINT' },	
		{ type: 'input', name: 'amount', message: 'QUANTITA\''}
	];

	inquirer.prompt(question).then((answer) => {
	   AddRawMaterial(answer);
    });
}

function search_name() {

	var question = [
		{ type: 'input', name: 'nome', message: 'INSERISCI IL NOME DELLA MATERIA PRIMA: ' }
	];
	
	inquirer.prompt(question).then((answer) => {
		SearchByName(answer.nome);
	});
}

function search_lot() {

	var question = [
		{ type: 'input', name: 'lotto', message: 'INSERISCI IL CODICE DI LOTTO: ' }
	]

	inquirer.prompt(question).then((answer) => {
		SearchByLot(answer.lotto);
	});
}

function AddRawMaterial(answer) {
	myContract.methods.getLastID().call(function(error, response){
		if (error) console.log('\nERRORE DURANTE LA TRANSAZIONE');
		else {
			myContract.methods.AddRawMaterial(response, answer.nome.toUpperCase(), answer.footprint, answer.amount).send({from: myAccountAddress}, function(error){
				if (error) {
					console.log('\n' + error.toString().slice(43));
				} else {
					console.log('\nTRANSAZIONE ESEGUITA');
					console.log('\nCODICE DEL LOTTO INSERITO: ' + response);
				}
				console.log("\n-----------------\n");
				fornitore(myAccountAddress);
			});
		}
	});
}

function SearchByName(name) {
	myContract.methods.SearchLotsByRawMaterialName(name.toUpperCase()).call(function (error, response) {
		if (error) console.log('\n' + error.toString().slice(43));
		else {
			console.log('\nLOTTI DI ' + name.toUpperCase() + ':\n');
			response.forEach(element => {
				console.log('LOTTO ' + element.id + ' - ' + element.amount + ' UNITA\'');
			});
		}
		console.log("\n-----------------\n");
		fornitore(myAccountAddress);
	});
}

function SearchByLot(lot_id) {
	myContract.methods.SearchInfoLot(lot_id).call(function (error, response) { 
		if (error) console.log('\n' + error.toString().slice(43));
		else { 
		 	console.log('\nLOTTO: ' + response.id + '\nMATERIA PRIMA: ' + response.name + '\nFOOTPRINT: ' + response.carbonfootprint +'\nQUANTITA\': ' + response.amount);
		} 
		console.log("\n-----------------\n");
		fornitore(myAccountAddress);
	});
				
}

exports.fornitore = fornitore;
