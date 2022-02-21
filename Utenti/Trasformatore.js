const fs = require("fs");
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');
const compiler = require("../compiler.js");

const Interface = require('../Interface.js');
const Model = require('../Model.js');

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
            case question.choices[1]: check_lots(); break;
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
        Model.SearchByName(answer.nome).then((result) => {
			if (result[0]) console.log('\n' + result[1].toString().slice(43));
			else {
				var table = [];
                var id = [];
                result[1].forEach(element => {
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
                    console.log('\nLOTTI DI ' + answer.nome.toUpperCase() + '\n');
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
                            Model.PurchaseLot(answer.lotti, myAccountAddress).then((result) => {
                                if (result[0]) {
                                    console.log('\n' + result[1].toString()/*.slice(43)*/);
                                }
                                else console.log('\nTRANSAZIONE ESEGUITA');
                                console.log();
                                trasformatore(myAccountAddress);
                            });
                        }
                    });
                }
            }
		});

    });		
}

function check_lots() {
    
    Model.CheckMyLots(myAccountAddress).then((result)=>{
        if (result[0]) console.log('\n' + result[1].toString().slice(43));
		else {
            console.log();
			var table = [];
			result[1].forEach(element => {
				var new_row = { LOTTO: element.id, MATERIA: element.name, FOOTPRINT: element.carbonfootprint, QUANTITA: element.amount, RESIDUO: element.residual_amount };
				table.push(new_row);
			});
            if (table.length == 0) {
                console.log('NESSUN LOTTO ACQUISTATO');
            } else printTable(table);
		}
		console.log();
		trasformatore(myAccountAddress);
    });
}

/*function add_product(){
    var question = [
		{ 
			type: 'input', 
			name: 'nome', 
			message: 'NOME PRODOTTO' 
		}, 	
		{ 
			type: 'input', 
			name: 'amount', 
			message: 'QUANTITA\'',
			validate: (answer) => {
				if (isNaN(parseInt(answer))) return 'ERRORE - QUANTITA\' DEVE ESSERE UN NUMERO INTERO';
				else if (answer <= 0) return 'ERRORE - QUANTINTA\' DEVE ESSERE MAGGIORE DI 0'
				return true;
			}
		}
	];

    console.log('\nLOTTI DI TUA PROPRIETA\'');

    var question2 = [
        { 
			type: 'input', 
			name: 'nome', 
			message: 'MATERIE PRIME UTILIZZATE PER REALIZZARE IL PRODOTTO CHE SI STA INSERENDO' 
		}
    ]


    

	inquirer.prompt(question).then((answer) => {
		var question2 = [
			{ 
				type: 'confirm', 
				name: 'confirm', 
				message: '\nMATERIA PRIMA: ' + answer.nome + '\nFOOTPRINT: ' + answer.footprint + '\nQUANTITA\': ' + answer.amount + '\n\nSEI SICURO DI VOLER INSERIRE QUESTO LOTTO?'
			}
		];
		inquirer.prompt(question2).then((answer2) => {
			if (answer2.confirm) AddRawMaterial(answer);
			else fornitore();
		});
	});
}*/

exports.trasformatore = trasformatore;
