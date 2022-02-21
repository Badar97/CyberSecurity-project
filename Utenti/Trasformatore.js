const fs = require("fs");
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');
const compiler = require("../compiler.js");

const Interface = require('../Interface.js');

const Web3 = require("web3");
let web3 = new Web3('http://localhost:22001');

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
            case question.choices[1]: CheckMyLots(); break;
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
        PurchaseLot(answer.nome);
    });
}

function PurchaseLot(name) {
	myContract.methods.SearchLotsByRawMaterialName(name.toUpperCase()).call(function (error, response) {
		if (error) {
            console.log('\n' + error.toString().slice(43) + '\n');
		    trasformatore(myAccountAddress);
        } else {
			var table = [];
            var id = [];
			response.forEach(element => {
                if (!element.sold) {
                    var new_row = { LOTTO: element.id, FOOTPRINT: element.carbonfootprint, QUANTITA: element.amount };
                    id.push(element.id); //per checkbox
                    table.push(new_row);
                }
			});
            if (table.length == 0) {
                console.log('\nNESSUN LOTTO DISPONIBILE\n');
                trasformatore(myAccountAddress);
            } else {
                console.log('\nLOTTI DI ' + name.toUpperCase() + '\n');
                printTable(table);
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
                        myContract.methods.PurchaseLot(answer.lotti).send({from: myAccountAddress}, function(error) {
                            if (error) console.log('\n' + error.toString().slice(43));
                            else console.log('\nTRANSAZIONE ESEGUITA');
                            console.log();
                            trasformatore(myAccountAddress);
                        });
                    }
                });
            }
		}
	});
}

function CheckMyLots() {
    myContract.methods.CheckMyLots(myAccountAddress).call(function(error, response) {
        if (error) console.log('\n' + error.toString().slice(43));
		else {
			console.log();
			var table = [];
			response.forEach(element => {
				var new_row = { LOTTO: element.id, MATERIA: element.name, FOOTPRINT: element.carbonfootprint, QUANTITA: element.amount, RESIDUO: element.residual_amount };
				table.push(new_row);
			});
            if (table.length == 0) {
                console.log('NESSUN LOTTO ACQUISTATO');
            } else printTable(table);
		}
		console.log();
		trasformatore(myAccountAddress);
    })
}

exports.trasformatore = trasformatore;
