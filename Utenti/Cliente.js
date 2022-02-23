const inquirer = require('inquirer');
const table_printer = require('console-table-printer');
const Interface = require('../Interface.js');
const Model = require('../Utils/Model.js');
const Helper = require('../Utils/Helper.js');
const myString = require("../Assets/string.js");

var myAccountAddress = null;

function cliente(address) {

	myAccountAddress = address;

    var question = {
            type: 'list',
            name: 'action',
            message: myString.menuCliente_string,
            choices: [
                myString.purchaseMaterial,
                myString.back_string,
                myString.exit_string
            ]
    }
    
    inquirer.prompt(question).then((answer) => {
        switch(answer.action) {
            case question.choices[0]: PurchaseMaterial(); break;
            case question.choices[1]: Interface.interface(); break;
            case question.choices[2]: default: return;
        }
    });

    function PurchaseMaterial(){
        Model.CheckLotBuyable().then((result) => { 
            if (result) {
                var id = [];
                result.forEach(element => { if (!element.sold && element.amount > 0) id.push(element.id) });
                if (!Helper.print_lots(result, true)) {
                    console.log(myString.unavailableLot_string + '\n');
                    cliente(myAccountAddress);
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
        }

        )
    }
}



exports.cliente = cliente;
