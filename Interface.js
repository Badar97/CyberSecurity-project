const rl = require("readline-sync");
const fs = require("fs");
const inquirer = require('inquirer');

const fornitore = require('./Utenti/Fornitore.js');
const trasformatore = require('./Utenti/Trasformatore.js');
const cliente = require('./Utenti/Cliente.js');

const wallets = JSON.parse(fs.readFileSync('wallets.json'));

var question = {
		type: 'list',
		name: 'wallet',
		message: 'SELEZIONA UN WALLET',
		choices: [...wallets, ...['EXIT']]
}

inquirer.prompt(question).then((answer) => {
    switch(answer.wallet) {
		case question.choices[0]: fornitore.fornitore(wallets[0]); break;
		case question.choices[1]: trasformatore.trasformatore(wallets[1]); break;
		case question.choices[2]: cliente.cliente(wallets[2]); break;
		default: return;
	}
});

return;