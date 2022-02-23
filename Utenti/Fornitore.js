const inquirer = require('inquirer');
const table_printer = require('console-table-printer');
const Interface = require('../Interface.js');
const Model = require('../Utils/Model.js');
const Helper = require('../Utils/Helper.js');
const String = require("../Assets/string.js");

var myAccountAddress = null;

function fornitore(address) {

	myAccountAddress = address;

    var question = {
		type: 'list',
		name: 'action',
		message: String.menuFornitore_string,
		choices: [
			String.insertRawMaterial_string,
			String.searchRawMaterial_string,
			String.searchLot_string,
			String.back_string,
			String.exit_string
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
			message: String.rawMaterial_string,
			validate: (answer) => {
				if (!answer.length) return false;
				return true;
			} 
		}, 
		{ 
			type: 'input', 
			name: 'footprint', 
			message: String.footprint_string, 
			validate: (answer) => {
				if (isNaN(parseInt(answer))) return String.errorFootprintInt_string;
				else if (parseInt(answer) < 0) return String.errorFootprintNegative_string
				return true;
			} 
		},	
		{ 
			type: 'input', 
			name: 'amount', 
			message: String.quantity_string,
			validate: (answer) => {
				if (isNaN(parseInt(answer))) return String.errorQuantityInt_string;
				else if (parseInt(answer) <= 0) return String.errorQuantityPositive_string
				return true;
			}
		}
	];

	inquirer.prompt(question).then((answer) => {
		var question2 = [
			{ 
				type: 'confirm', 
				name: 'confirm', 
				message: '\n' + String.rawMaterial_string + ' ' +  answer.nome + '\n' + String.footprint_string + ' ' + answer.footprint + '\n' + String.quantity_string + answer.amount + ' ' + '\n\n' + String.confirmInsertLot_string
			}
		];
		inquirer.prompt(question2).then((answer2) => {
			if (answer2.confirm) {
				Model.GetLastID().then((last_id) => {
					Model.AddRawMaterial(last_id, answer, myAccountAddress).then((result) => {
						if (result) {
							console.log('\n' + String.transactionPerformed_string);
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
				console.log('\n' + String.transactionCanceled_string + '\n');
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
			message: String.insertNameRawMaterial_string 
		}
	];
	inquirer.prompt(question).then((answer) => {
		Model.SearchByName(answer.nome).then((result) => {
			if (result) if (!Helper.print_lots(result, true)) console.log(String.unavailableLot_string);
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
			message: String.insertLotId_string,
			validate: (answer) => {
				if (isNaN(parseInt(answer))) return String.errorInvalidLotId_string;
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
