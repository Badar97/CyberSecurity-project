const fs = require("fs");
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');
const compiler = require("../compiler.js");

const Interface = require('../Interface.js');

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
			'BACK',
			'EXIT'
		]
	};
    
    inquirer.prompt(question).then((answer) => {
        switch(answer.action) {
            case question.choices[0]: add_lot(); break;
			case question.choices[1]: search_name(); break;
			case question.choices[2]: search_lot(); break;
			case question.choices[3]: Interface.interface(); break;
            case question.choices[4]: default: return;
        }
    });
}

function add_lot() {
	var question = [
		{ 
			type: 'input', 
			name: 'nome', 
			message: 'MATERIA PRIMA' 
		}, 
		{ 
			type: 'input', 
			name: 'footprint', 
			message: 'FOOTPRINT', 
			validate: (answer) => {
				if (isNaN(parseInt(answer))) return 'ERRORE - FOOTPRINT DEVE ESSERE UN NUMERO INTERO';
				else if (answer < 0) return 'ERRORE - FOOTPRINT NON PUO\' AVERE UN VALORE NEGATIVO'
				return true;
			} 
		},	
		{ 
			type: 'input', 
			name: 'amount', 
			message: 'QUANTITA\'',
			validate: (answer) => {
				if (isNaN(parseInt(answer))) return 'ERRORE - QUANTITA\' DEVE ESSERE UN NUMERO INTERO';
				else if (answer <= 0) return 'ERRORE - QUANTINTA\' DEVE ESSERE MAGGIORE DI 0'
				return true;
			}
		}
	];

	inquirer.prompt(question).then((answer) => {
		var question2 = [
			{ 
				type: 'confirm', 
				name: 'confirm', 
				message: '\nMATERIA PRIMA: ' + answer.nome + '\nFOOTPRINT: ' + answer.footprint + '\nQUANTITA\': ' + answer.amount + '\n\nSEI SICURO DI VOLER INSERIRE QUESTO LOTTO?'
			}
		];
		inquirer.prompt(question2).then((answer2) => {
			if (answer2.confirm) AddRawMaterial(answer);
			else fornitore();
		});
	});
}

function search_name() {
	var question = [
		{ 
			type: 'input', 
			name: 'nome', 
			message: 'INSERISCI IL NOME DELLA MATERIA PRIMA: ' 
		}
	];
	inquirer.prompt(question).then((answer) => {
		SearchByName(answer.nome);
	});
}

function search_lot() {
	var question = [
		{ 
			type: 'input', 
			name: 'lotto', 
			message: 'INSERISCI IL CODICE DI LOTTO: ',
			validate: (answer) => {
				if (isNaN(parseInt(answer))) return 'ERRORE - CODICE LOTTO NON VALIDO';
				else return true;
			} 
		}
	]
	inquirer.prompt(question).then((answer) => {
		SearchByLot(answer.lotto); 
	});
}

function AddRawMaterial(answer) {
	myContract.methods.getLastID().call(function(error, response){
		if (error) console.log('\nERRORE DURANTE LA TRANSAZIONE');
		else {
			myContract.methods.AddRawMaterial(myAccountAddress, response, answer.nome.toUpperCase(), answer.footprint, answer.amount).send({from: myAccountAddress}, function(error){
				if (error) console.log('\n' + error.toString().slice(43));
				else {
					console.log('\nTRANSAZIONE ESEGUITA');
					console.log('\nLOTTO: ' + response + '\nMATERIA PRIMA: ' + answer.nome + '\nFOOTPRINT: ' +answer.footprint +'\nQUANTITA\': ' + answer.amount);
				}
				console.log();
				fornitore(myAccountAddress);
			});
		}
	});
}

function SearchByName(name) {
	myContract.methods.SearchLotsByRawMaterialName(name.toUpperCase()).call(function (error, response) {
		if (error) console.log('\n' + error.toString().slice(43));
		else {
			console.log();
			var table = [];
			response.forEach(element => {
				var new_row = { LOTTO: element.id, QUANTITA: element.amount };
				table.push(new_row);
			});
			printTable(table);
		}
		console.log();
		fornitore(myAccountAddress);
	});
}

function SearchByLot(lot_id) {
	myContract.methods.SearchInfoLot(lot_id).call(function (error, response) { 
		if (error) console.log('\n' + error.toString().slice(43));
		else console.log('\nLOTTO: ' + response.id + '\nMATERIA PRIMA: ' + response.name + '\nFOOTPRINT: ' + response.carbonfootprint + '\nQUANTITA\': ' + response.amount);
		console.log();
		fornitore(myAccountAddress);
	});		
}

exports.fornitore = fornitore;
