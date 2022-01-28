const rl = require("readline-sync");
const fs = require("fs");
const inquirer = require('inquirer');
const Web3 = require("web3");
const mycontract = require("../mycontract.js");

let web3 = new Web3('http://localhost:22002');

function cliente(address) {

    console.log('HAI SELEZIONATO UN ACCOUNT CLIENTE');

    var question = {
            type: 'list',
            name: 'action',
            message: 'SELEZIONA UN\'OPERAZIONE',
            choices: [
                'INSERIMENTO DI ...',
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