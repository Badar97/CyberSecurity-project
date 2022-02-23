const inquirer = require('inquirer');
const table_printer = require('console-table-printer');
const Interface = require('../Interface.js');
const Model = require('../Utils/Model.js');
const Helper = require('../Utils/Helper.js');
const String = require("../Assets/string.js");

function cliente(address) {

    console.log('HAI SELEZIONATO UN ACCOUNT CLIENTE');

    var question = {
            type: 'list',
            name: 'action',
            message: 'SELEZIONA UN\'OPERAZIONE',
            choices: [
                '...',
                'EXIT'
            ]
    }
    
    inquirer.prompt(question).then((answer) => {
        switch(answer.action) {
            case question.choices[0]: console.log(question.choices[0]); break;
            case question.choices[1]: default: return;
        }
    });

}

exports.cliente = cliente;