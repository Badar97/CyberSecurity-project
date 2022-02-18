const fs = require("fs");
const inquirer = require('inquirer');
const compiler = require("../compiler.js");

const Web3 = require("web3");
let web3 = new Web3('http://localhost:22002');

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