const fs = require("fs");
const inquirer = require('inquirer');

const Fornitore = require('./Utenti/Fornitore.js');
const Trasformatore = require('./Utenti/Trasformatore.js');
const Cliente = require('./Utenti/Cliente.js');

const wallets = JSON.parse(fs.readFileSync('wallets.json'));

var question = {
		type: 'list',
		name: 'wallet',
		message: 'SELEZIONA UN WALLET',
		choices: [...wallets, ...['EXIT']]
}

inquirer.prompt(question).then((answer) => {
    switch(answer.wallet) {
		case question.choices[0]: Fornitore.fornitore(wallets[0]); break;
		case question.choices[1]: Trasformatore.trasformatore(wallets[1]); break;
		case question.choices[2]: Cliente.cliente(wallets[2]); break;
		default: console.log('\n'); return;
	}
});

return;