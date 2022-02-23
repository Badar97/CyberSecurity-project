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
                myString.back_string,
                myString.exit_string
            ]
    }
    
    inquirer.prompt(question).then((answer) => {
        switch(answer.action) {
            case question.choices[0]: Interface.interface(); break;
            case question.choices[1]: default: return;
        }
    });
}



exports.cliente = cliente;
