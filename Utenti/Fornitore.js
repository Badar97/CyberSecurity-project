const inquirer = require('inquirer');
const table_printer = require('console-table-printer');
const Interface = require('../Interface.js');
const Model = require('../Model.js');

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
            case question.choices[0]: add_raw_material(); break;
			case question.choices[1]: search_name(); break;
			case question.choices[2]: search_lot(); break;
			case question.choices[3]: Interface.interface(); break;
            case question.choices[4]: default: return;
        }
    });
}

function add_raw_material() {
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
			if (answer2.confirm) {
				Model.GetLastID().then((last_id) => {
					if(last_id[0]) console.log('\nERRORE DURANTE LA TRANSAZIONE');
					else {
						Model.AddRawMaterial(last_id[1], answer, myAccountAddress).then((result) => {
							if (result[0]) console.log('\n' + result[1].toString().slice(43));
							else {
								console.log('\nTRANSAZIONE ESEGUITA');
								console.log('\nLOTTO: ' + last_id[1] + '\nMATERIA PRIMA: ' + answer.nome + '\nFOOTPRINT: ' + answer.footprint +'\nQUANTITA\': ' + answer.amount);
							}
							console.log();
							fornitore(myAccountAddress);
						});
					}
				});
			}
			else {
				console.log('\nTRANSAZIONE ANNULLATA\n');
				fornitore(myAccountAddress);
			}
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
		Model.SearchByName(answer.nome).then((result) => {
			if (result[0]) console.log('\n' + result[1].toString().slice(43));
			else {
				console.log();
				var table = [];
				result[1].forEach(element => {
					if (!element.sold) {
						var new_row = { LOTTO: element.id, FOOTPRINT: element.carbonfootprint, QUANTITA: element.amount };
						table.push(new_row);
					}
				});
				if (table.length == 0) {
					console.log('NESSUN LOTTO DISPONIBILE');
				} else table_printer.printTable(table);
			}
			console.log();
			fornitore(myAccountAddress);
		})
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
		Model.SearchByLot(answer.lotto).then((result) => {
			if (result[0]) console.log('\n' + result[1].toString().slice(43));
			else {
				console.log();
				var table = [{ LOTTO: result[1].id, MATERIA: result[1].name, FOOTPRINT: result[1].carbonfootprint, QUANTITA: result[1].amount, RESIDUO: result[1].residual_amount, VENDUTO: result[1].sold }];
				table_printer.printTable(table);
			}
			console.log();
			fornitore(myAccountAddress);
		});
		
	});
}

exports.fornitore = fornitore;
