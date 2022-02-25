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
            case question.choices[0]: purchase_material(); break;
            case question.choices[1]: Interface.interface(); break;
            case question.choices[2]: default: return;
        }
    });
}

function purchase_material(){
    Model.checkBuyableLots().then((result) => { 
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
                        type: 'list',
                        name: 'lotto',
                        message: '\n' + myString.selectLotsToPuschase_string,
                        choices: id
                    },
                    {
                        type: 'confirm',
                        name: 'confirm',
                        message: '\n' + myString.confirm_string,
                    }
                ]
                
                inquirer.prompt(question).then((answer) => {
                    
                });
            }
        } else {
            console.log();
            cliente(myAccountAddress);
        }
    }

    )
}

exports.cliente = cliente;
