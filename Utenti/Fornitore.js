const inquirer = require('inquirer');
const table_printer = require('console-table-printer');
const Interface = require('../Interface.js');
const Model = require('../Utils/Model.js');
const Helper = require('../Utils/Helper.js');
const myString = require("../Assets/string.js");

var myAccountAddress = null;

function fornitore(address) {

	myAccountAddress = address;

    var question = {
		type: 'list',
		name: 'action',
		message: myString.menuFornitore_string,
		choices: [
			myString.insertRawMaterial_string,
			myString.searchRawMaterial_string,
			myString.searchLot_string,
			myString.back_string,
			myString.exit_string
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
			message: myString.rawMaterial_string,
			validate: (answer) => {
				if (!answer.length) return false;
				return true;
			} 
		}, 
		{ 
			type: 'input', 
			name: 'footprint', 
			message: myString.footprint_string, 
			validate: (answer) => {
				if (isNaN(parseInt(answer))) return myString.errorFootprintInt_string;
				else if (parseInt(answer) < 0) return myString.errorFootprintNegative_string
				return true;
			} 
		},	
		{ 
			type: 'input', 
			name: 'amount', 
			message: myString.quantity_string,
			validate: (answer) => {
				if (isNaN(parseInt(answer))) return myString.errorQuantityInt_string;
				else if (parseInt(answer) <= 0) return myString.errorQuantityPositive_string
				return true;
			}
		}
	];

	inquirer.prompt(question).then((answer) => {
		var question2 = [
			{ 
				type: 'confirm', 
				name: 'confirm', 
				message: '\n' + myString.rawMaterial_string + ' ' +  answer.nome + '\n' + myString.footprint_string + ' ' + answer.footprint + '\n' + myString.quantity_string + answer.amount + ' ' + '\n\n' + myString.confirmInsertLot_string
			}
		];
		inquirer.prompt(question2).then((answer2) => {
			if (answer2.confirm) {
				Model.GetLastID().then((last_id) => {
					Model.AddRawMaterial(last_id, answer, myAccountAddress).then((result) => {
						if (result) {
							console.log('\n' + myString.transactionPerformed_string);
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
				console.log('\n' + myString.transactionCanceled_string + '\n');
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
			message: myString.insertNameRawMaterial_string 
		}
	];
	inquirer.prompt(question).then((answer) => {
		Model.SearchByName(answer.nome).then((result) => {
			if (result) if (!Helper.print_lots(result, true)) console.log(myString.unavailableLot_string);
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
			message: myString.insertLotId_string,
			validate: (answer) => {
				if (isNaN(parseInt(answer))) return myString.errorInvalidLotId_string;
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
