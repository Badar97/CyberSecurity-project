const inquirer = require('inquirer');
const table_printer = require('console-table-printer');
const Interface = require('../Interface.js');
const Model = require('../Utils/Model.js');
const Helper = require('../Utils/Helper.js');
const String = require("../Assets/string.js");

var myAccountAddress = null;

function trasformatore(address) {

	myAccountAddress = address;

    var question = {
            type: 'list',
            name: 'action',
            message: 'MENU\' TRASFORMATORE',
            choices: [
                'ACQUISTO MATERIE PRIME',
                'VISUALIZZA LOTTI ACQUISTATI',
                'INSERIMENTO PRODOTTI',
                'BACK',
                'EXIT'
            ]
    }
    
    inquirer.prompt(question).then((answer) => {
        switch(answer.action) {
            case question.choices[0]: purchase_material(); break;
            case question.choices[1]: check_lots(); break;
            case question.choices[2]: add_product(); break;
            case question.choices[3]: Interface.interface(); break;
            case question.choices[4]: default: return;
        }
    });
}

function purchase_material() {
    var question = [
		{ 
            type: 'input', 
            name: 'nome', 
            message: 'QUALE MATERIA PRIMA VUOI ACQUISTARE? '
        }
	];
	inquirer.prompt(question).then((answer) => {
        Model.SearchByName(answer.nome).then((result) => {
			if (result) {
                var id = [];
                result.forEach(element => { if (!element.sold) id.push(element.id) });
                if (!Helper.print_lots(result, true)) {
                    console.log('NESSUN LOTTO DISPONIBILE\n');
                    trasformatore(myAccountAddress);
                } else {
                    console.log();
                    var question = [
                        {
                            type: 'checkbox',
                            name: 'lotti',
                            message: '\nSELEZIONA I LOTTI CHE VUOI ACQUISTARE',
                            choices: id
                        }
                    ]
                    inquirer.prompt(question).then((answer) => {
                        if (answer.lotti.length == 0) {
                            console.log('\nTRANSAZIONE ANNULLATA');
                            console.log();
                            trasformatore(myAccountAddress);
                        } else {
                            Model.PurchaseLot(answer.lotti, myAccountAddress).then((result) => {
                                if (result) console.log('\nTRANSAZIONE ESEGUITA');
                                console.log();
                                trasformatore(myAccountAddress);
                            });
                        }
                    });
                }
            } else {
                console.log();
                trasformatore(myAccountAddress);
            }
		});
    });		
}

function check_lots() {
    Model.CheckMyLots(myAccountAddress).then((result) => {
        if (result) if (!Helper.print_lots(result, false)) console.log('NESSUN LOTTO ACQUISTATO');
		console.log();
		trasformatore(myAccountAddress);
    });
}

function add_product(){

    var question = [
		{ 
			type: 'input', 
			name: 'nome', 
			message: 'NOME PRODOTTO',
            validate: (answer) => {
				if (!answer.length) return false;
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

    var choice_array = new Array();
    choice_array[0] = new Array();
    choice_array[1] = new Array();

    inquirer.prompt(question).then((answer) => {
        Model.CheckMyLots(myAccountAddress).then((result) => {

            var id = [];
            result.forEach(element => { if(element.residual_amount !=0) id.push(element.id) }); 

            add_product_details(id, result, choice_array, answer);

        });
    });
}

function add_product_details(id_array, lot_array, choice_array, answer) {

    var question2 = [
        { 
            type: 'list', 
            name: 'lotto', 
            message: 'SELEZIONA IL LOTTO DA CUI PRELEVARE MATERIE PRIME',
            choices: [...id_array, ...['FINE', 'ANNULLA']]
        }
    ]
    
    console.log('\nLOTTI DI TUA PROPRIETA\'');
    if (lot_array) if (!Helper.print_lots(lot_array, false)) {
        console.log('NESSUN LOTTO ACQUISTATO\n');
        trasformatore(myAccountAddress);
    } else {
        console.log();
        inquirer.prompt(question2).then((answer2) => {
            var question3 = [
                { 
                    type: 'input', 
                    name: 'amount', 
                    message: 'INSERISCI LA QUANTITA\' DA PRELEVARE',
                    validate: (answer) => {

                        var residual = 0;
                        lot_array.forEach(element => {
                            if(element.id == answer2.lotto) residual = element.residual_amount;
                        });

                        if (isNaN(parseInt(answer))) return 'ERRORE - QUANTITA\' DEVE ESSERE UN NUMERO INTERO';
                        else if (parseInt(answer) <= 0) return 'ERRORE - QUANTITA\' DEVE ESSERE MAGGIORE DI 0';
                        else if (parseInt(answer) > parseInt(residual)) return 'ERRORE - LA QUANTITA\' NON PUO\' SUPERARE IL RESIDUO (' + residual + ')';
                        return true;
                    }
                },
                { 
                    type: 'confirm', 
                    name: 'confirm', 
                    message: 'SEI SICURO?' 
                }
            ]

            if (answer2.lotto != 'FINE' && answer2.lotto != 'ANNULLA') {
                inquirer.prompt(question3).then((answer3) => {
                    if (answer3.confirm) {
                        var new_id = [];
                        var new_array = [];
                        lot_array.forEach((element, index) => {
                            if (element.id != answer2.lotto) new_array[index] = element;
                            else {
                                var residual_lot = {
                                    id: element.id,
                                    name: element.name,
                                    carbonfootprint: element.carbonfootprint,
                                    amount: element.amount,
                                    residual_amount: element.residual_amount - answer3.amount,
                                    sold: element.sold
                                };
                                new_array[index] = residual_lot;
                            }
                        });   

                        choice_array[0].push(answer2.lotto);
                        choice_array[1].push(answer3.amount);

                        new_array.forEach(element => { if(element.residual_amount !=0) new_id.push(element.id) });
                        add_product_details(new_id, new_array, choice_array, answer);  
                    } else add_product_details(id_array, lot_array, choice_array, answer);  
                });
            } else if(!choice_array[0].length && answer2.lotto != 'ANNULLA') {
                console.log("\nDEVI SELEZIONARE ALMENO UNA MATERIA PRIMA");
                add_product_details(id_array, lot_array, choice_array, answer);
            } else if (answer2.lotto == 'EXIT') {
                console.log();
				trasformatore(myAccountAddress);
            } else {
                Model.GetLastID().then((last_id) => {
                    Model.AddProduct(last_id, answer.nome.toUpperCase(), choice_array, answer.amount, myAccountAddress).then((result) => {
						if (result) {
							console.log('\nTRANSAZIONE ESEGUITA');
							Model.SearchByLot(last_id).then((result) => {
                                if (result) {
									console.log();
									var table = [{ LOTTO: result.id, MATERIA: result.name, FOOTPRINT: result.carbonfootprint, QUANTITA: result.amount, RESIDUO: result.residual_amount, VENDUTO: result.sold }];
									table_printer.printTable(table);
								}
								console.log();
						        trasformatore(myAccountAddress);	
						    });
                        } else {
                            console.log();
						    trasformatore(myAccountAddress);
                        }
					});
                });
            }
        });
    }
}

exports.trasformatore = trasformatore;
