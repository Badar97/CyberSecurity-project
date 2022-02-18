const rl = require("readline-sync");
const fs = require("fs");
const inquirer = require('inquirer');
const Web3 = require("web3");
const mycontract = require("../mycontract.js");

let web3 = new Web3('http://localhost:22001');

function trasformatore(address) {

    console.log('HAI SELEZIONATO UN ACCOUNT TRASFORMATORE');

    var question = {
            type: 'list',
            name: 'action',
            message: 'SELEZIONA UN\'OPERAZIONE',
            choices: [
                'RICHIESTA DI MATERIE PRIME',
                'EXIT'
            ]
    }
    
    inquirer.prompt(question).then((answer) => {
        switch(answer.action) {
            case question.choices[0]: Request(); break;
            case question.choices[1]: default: return;
        }
    });

    function Request(){
        var question = [
            {
                type: 'input',
                name: 'nome',
                message: 'INSERISCI LA MATERIA PRIMA CHE VUOI RICHIEDERE:'
            }, 
            {
                type: 'input',
                name: 'lotto',
                message: 'INSERISCI IL LOTTO'
            },	
            {
                type: 'input',
                name: 'amount',
                message: 'INSERISCI LA QUANTITA\''
            }
        ]

	    inquirer.prompt(question).then((answer) => {
		search(answer);
	    });

    }

}

exports.trasformatore = trasformatore;