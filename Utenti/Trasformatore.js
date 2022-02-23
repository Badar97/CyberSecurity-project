const inquirer = require('inquirer');
const table_printer = require('console-table-printer');
const Interface = require('../Interface.js');
const Model = require('../Utils/Model.js');
const Helper = require('../Utils/Helper.js');
const myString = require("../Assets/string.js");

var myAccountAddress = null;

function trasformatore(address) {

	myAccountAddress = address;

    var question = {
            type: 'list',
            name: 'action',
            message: myString.menuTrasformatore_string,
            choices: [
                myString.purchaseRawMaterial_string,
                myString.viewLotsPurchased_string,
                myString.insertProduct_string,
                myString.transformation_string,
                myString.searchLot_string,
                myString.back_string,
                myString.exit_string
            ]
    }
    
    inquirer.prompt(question).then((answer) => {
        switch(answer.action) {
            case question.choices[0]: purchase_material(); break;
            case question.choices[1]: check_lots(); break;
            case question.choices[2]: add_product(); break;
            case question.choices[3]: transformation(); break;
            case question.choices[4]: search_lot(); break;
            case question.choices[5]: Interface.interface(); break;
            case question.choices[6]: default: return;
        }
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
			trasformatore(myAccountAddress);
		});
	});
}

function purchase_material() {
    var question = [
		{ 
            type: 'input', 
            name: 'nome', 
            message: myString.witchRawMaterial_string
        }
	];
	inquirer.prompt(question).then((answer) => {
        Model.SearchByName(answer.nome).then((result) => {
			if (result) {
                var id = [];
                result.forEach(element => { if (!element.sold && element.residual_amount > 0) id.push(element.id) });
                if (!Helper.print_lots(result, true)) {
                    console.log(myString.unavailableLot_string + '\n');
                    trasformatore(myAccountAddress);
                } else {
                    console.log();
                    var question = [
                        {
                            type: 'checkbox',
                            name: 'lotti',
                            message: '\n' + myString.selectLotsToPuschase_string,
                            choices: id
                        }
                    ]
                    inquirer.prompt(question).then((answer) => {
                        if (answer.lotti.length == 0) {
                            console.log('\n' + myString.transactionCanceled_string);
                            console.log();
                            trasformatore(myAccountAddress);
                        } else {
                            Model.PurchaseLot(answer.lotti, myAccountAddress).then((result) => {
                                if (result) console.log('\n' + myString.transactionPerformed_string);
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
        if (result) if (!Helper.print_lots(result, false)) console.log(myString.noneLotPurchase_string);
		console.log();
		trasformatore(myAccountAddress);
    });
}

function add_product(){

    var question = [
		{ 
			type: 'input', 
			name: 'nome', 
			message: myString.nameProduct_string,
            validate: (answer) => {
				if (!answer.length) return false;
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

    var choice_array = new Array();
    choice_array[0] = new Array();
    choice_array[1] = new Array();

    inquirer.prompt(question).then((answer) => {
        Model.CheckMyLots(myAccountAddress).then((result) => {

            var id = [];
            result.forEach(element => { if (element.residual_amount > 0) id.push(element.id) }); 

            add_product_details(id, result, choice_array, answer);

        });
    });
}

function add_product_details(id_array, lot_array, choice_array, answer) {

    var question2 = [
        { 
            type: 'list', 
            name: 'lotto', 
            message: myString.selectLotTakeRawMaterial_string,
            choices: [...id_array, ...[myString.end_string, myString.cancel_string]]
        }
    ]
    
    console.log('\n' + myString.lotsOwnProperty_string);
    if (lot_array) if (!Helper.print_lots(lot_array, false)) {
        console.log(myString.noneLotPurchase_string + '\n');
        trasformatore(myAccountAddress);
    } else {
        console.log();
        inquirer.prompt(question2).then((answer2) => {
            var question3 = [
                { 
                    type: 'input', 
                    name: 'amount', 
                    message: myString.insertQuantityToTake_string,
                    validate: (answer) => {

                        var residual = 0;
                        lot_array.forEach(element => {
                            if(element.id == answer2.lotto) residual = element.residual_amount;
                        });

                        if (isNaN(parseInt(answer))) return myString.errorQuantityInt_string;
                        else if (parseInt(answer) <= 0) return myString.errorQuantityPositive_string;
                        else if (parseInt(answer) > parseInt(residual)) return myString.errorResidualQuantity_string + residual + myString.errorResidualQuantityFinal_string;
                        return true;
                    }
                },
                { 
                    type: 'confirm', 
                    name: 'confirm', 
                    message: myString.confirm_string 
                }
            ]

            if (answer2.lotto != myString.end_string && answer2.lotto != myString.cancel_string) {
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
            } else if (!choice_array[0].length && answer2.lotto == myString.end_string) {
                console.log('\n' + myString.mustSelectrawMaterial_string);
                add_product_details(id_array, lot_array, choice_array, answer);
            } else if (answer2.lotto == myString.cancel_string) {
                console.log('\n' + myString.transactionCanceled_string + '\n');
				trasformatore(myAccountAddress);
            } else {
                Model.GetLastID().then((last_id) => {
                    Model.AddProduct(last_id, answer.nome.toUpperCase(), choice_array, answer.amount, myAccountAddress).then((result) => {
						if (result) {
							console.log('\n' + myString.transactionPerformed_string);
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

function transformation(){
    Model.CheckMyLots(myAccountAddress).then((result) => {
        console.log('\n' + myString.lotsOwnProperty_string);
        if (result) if (!Helper.print_lots(result, false)) console.log(myString.noneLotPurchase_string);
		console.log();

        var id = [];
        result.forEach(element => { if (element.residual_amount > 0) id.push(element.id) }); 

        var question = [
            { 
                type: 'list', 
                name: 'lotto', 
                message: myString.selectLotToTransform_string,
                choices: [...id, ...[myString.cancel_string]]
            }]

        var question2 = [
            { 
                type: 'input', 
                name: 'footprint', 
                message: myString.insertFootprintTransform_string,
                validate: (answer) => {
                    if (isNaN(parseInt(answer))) return myString.errorFootprintInt_string;
                    else if (parseInt(answer) < 0) return myString.errorFootprintNegative_string
                    return true;
                }       
            },
            { 
                type: 'confirm', 
                name: 'confirm', 
                message: myString.confirm_string,
            }
        ]
        

        inquirer.prompt(question).then((answer) => {
            if(answer.lotto != myString.cancel_string) {
                inquirer.prompt(question2).then((answer2) => {
                    if(answer2.confirm){
                        Model.TrasformationLot(answer.lotto , answer2.footprint , myAccountAddress).then((result) => {
                            if (result) {
                                console.log('\n' + myString.transactionPerformed_string);
                                Model.SearchByLot(answer.lotto).then((result) => {
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
                        }
                        )
                    } else {
                        console.log('\n' + myString.transactionCanceled_string+ '\n');
                        trasformatore(myAccountAddress);
                    }
                })
            } else {
                console.log('\n' + myString.transactionCanceled_string+ '\n');
                trasformatore(myAccountAddress);
            }
        });
    });
}

exports.trasformatore = trasformatore;
