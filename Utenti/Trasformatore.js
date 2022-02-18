const fs = require("fs");
const inquirer = require('inquirer');
const compiler = require("../compiler.js");

const Web3 = require("web3");
let web3 = new Web3('http://localhost:22000');

const abi = compiler.compile("CarbonFootprint/CarbonFootprint.sol")[0]; 
const contractAddress = JSON.parse(fs.readFileSync('CarbonFootprint/address.json'))[0];
const myContract = new web3.eth.Contract(abi, contractAddress);

var myAccountAddress = null;

function trasformatore(address) {

	myAccountAddress = address;

    var question = {
            type: 'list',
            name: 'action',
            message: 'MENU\' TRASFORMATORE',
            choices: [
                'RICHIESTA MATERIE PRIME',
                'EXIT'
            ]
    }
    
    inquirer.prompt(question).then((answer) => {
        switch(answer.action) {
            case question.choices[0]: request_material(); break;
            case question.choices[1]: default: return;
        }
    });
}

function request_material() {
	
    var question = [
		{
			type: 'input',
			name: 'nome',
			message: 'INSERISCI IL NOME DELLA MATERIA PRIMA: '
		}
	]

	inquirer.prompt(question).then((answer) => {
	   AddRawMaterial(answer);
    });
}

exports.trasformatore = trasformatore;
