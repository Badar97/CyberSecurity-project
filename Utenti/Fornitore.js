const inquirer = require('inquirer');
const table_printer = require('console-table-printer');
const Interface = require('../Interface.js');
const Model = require('../Model.js');
const Helper = require('../Helper.js');

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
			message: 'MATERIA PRIMA',
			validate: (answer) => {
				if (!answer.length) return false;
				return true;
			} 
		}, 
		{ 
			type: 'input', 
			name: 'footprint', 
			message: 'FOOTPRINT', 
			validate: (answer) => {
				if (isNaN(parseInt(answer))) return 'ERRORE - FOOTPRINT DEVE ESSERE UN NUMERO INTERO';
				else if (parseInt(answer) < 0) return 'ERRORE - FOOTPRINT NON PUO\' AVERE UN VALORE NEGATIVO'
				return true;
			} 
		},	
		{ 
			type: 'input', 
			name: 'amount', 
			message: 'QUANTITA\'',
			validate: (answer) => {
				if (isNaN(parseInt(answer))) return 'ERRORE - QUANTITA\' DEVE ESSERE UN NUMERO INTERO';
				else if (parseInt(answer) <= 0) return 'ERRORE - QUANTITA\' DEVE ESSERE MAGGIORE DI 0'
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
					Model.AddRawMaterial(last_id, answer, myAccountAddress).then((result) => {
						if (result) {
							console.log('\nTRANSAZIONE ESEGUITA');
							Model.SearchByLot(last_id).then((result) => {
								if (result) {
									console.log();
									var table = [{ LOTTO: result.id, MATERIA: result.name, FOOTPRINT: result.carbonfootprint, QUANTITA: result.amount, RESIDUO: result.residual_amount, VENDUTO: result.sold }];
									table_printer.printTable(table);
								}
								console.log();
								fornitore(myAccountAddress);
							});
						} else {
							console.log();
							fornitore(myAccountAddress);
						}
					});
				});
			} else {
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
			if (result) if (!Helper.print_lots(result, true)) console.log('NESSUN LOTTO DISPONIBILE');
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
			if (result) {
				console.log();
				var table = [{ LOTTO: result.id, MATERIA: result.name, FOOTPRINT: result.carbonfootprint, QUANTITA: result.amount, RESIDUO: result.residual_amount, VENDUTO: result.sold }];
				table_printer.printTable(table);
			}
			console.log();
			fornitore(myAccountAddress);
		});
	});
}

exports.fornitore = fornitore;
