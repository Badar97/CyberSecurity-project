const rl = require("readline-sync");
const Web3 = require("web3"); // fa riferimento al modulo Javascript 


var Menu = require('terminal-menu');
var menu = Menu({ width: 29, x: 4, y: 2 });
menu.reset();
menu.write('SERIOUS BUSINESS TERMINAL\n');
menu.write('-------------------------\n');
 
menu.add('ADD TRANSACTION INVOICE');
menu.add('BUSINESS INTELLIGENCE');
menu.add('ACCOUNTS PAYABLE');
menu.add('LEDGER BOOKINGS');
menu.add('INDICATOR CHART METRICS');
menu.add('BACKUP DATA TO FLOPPY DISK');
menu.add('RESTORE FROM FLOPPY DISK');
menu.add('EXIT');
 
menu.on('select', function (label) {
    menu.close();
    console.log('\nSELECTED: ' + label);
});

process.stdin.pipe(menu.createStream()).pipe(process.stdout); 
process.stdin.setRawMode(true);

menu.on('close', function () {
    process.stdin.setRawMode(false);
    process.stdin.end();
});

return;

let mycontract = require("./mycontract.js");
let trasformatore = require("./Utenti/Trasformatore");

let web3 = new Web3('http://localhost:22000');
let web3_2 = new Web3('http://localhost:22001');
let web3_3 = new Web3('http://localhost:22002');

function ArrayToLowerCase(array){
  appoggio = Array();
  array.forEach(element => {
	  appoggio.push(element.toString().toLowerCase());
  });
  return appoggio;
}



var account_address = rl.question("Inserisci indirizzo account: ");
web3.eth.getAccounts().then((value) => {
	if(ArrayToLowerCase(value).includes(account_address.toLowerCase())){
		start(account_address);
	}
	else {
		web3_2.eth.getAccounts().then((value) => {
			if(ArrayToLowerCase(value).includes(account_address.toLowerCase())){
				demo(account_address);
			}
			else {
				web3_3.eth.getAccounts().then((value) => {
					if(ArrayToLowerCase(value).includes(account_address.toLowerCase())){
						demo(account_address);
					}
					else {
						console.log("Account non presente in alcun nodo");
					}
				});
			}
		}); 
	}
}); 

let myAccountAddress = null;
var abi = null;
var bytecode = null;
var contractAddress = null;

function start(address) {
    
    myAccountAddress = address;
    console.log("Used account: " + address);
    
   
    var values = mycontract.compile("CarbonFootPrint.sol"); 
    abi = values[0];
    bytecode = values[1];
    var simpleContract = new web3.eth.Contract(abi, { from: address } );

    // 1. deploy the smart contract
    var simple = simpleContract.deploy({data: "0x" + bytecode, }).
		send({ from:address, gas: 1500000, gasPrice: '0' }, deploy_handler).
		on('receipt', receipt_handler); //.
//		on('confirmation', (num, eonfirmation) => { console.log("Confirmation: ", num, confirmation); } ).then((newContractInstance) => { console.log("Deployed contract at address: ", newContractInstance.options.address); });
    console.log("Simple contract deploying ...");
}

async function deploy_handler(e, transactionHash) {
			console.log("Submitted transaction with hash: ", transactionHash);
      			if (e) {
        			console.log("err creating contract", e);
      			} 
}

/*
function receipt_handler(receipt) {
	try {
		contractAddress = receipt.contractAddress;
    		console.log("Contract mined: " + receipt.contractAddress);
    		console.log(receipt);
    
		web3.eth.getTransactionCount(myAccountAddress).then((value) => { 
			console.log("Transaction count: ", value); 
	    		
						var myContract2 = new web3.eth.Contract(abi, contractAddress);
						console.log("myContract2 created ...");
 						let res = myContract2.methods.getUsersTipo(myAccountAddress).call(function (err, res) { if (err) { console.error("Error calling: ", err); } else { console.log("Tipo utente: ", res); } });
						
						 console.log("Call passed");
					} catch (err) {
						console.log("Error during call: ", err);
					}


		});

	} catch (err) {
		console.error("Error handling receipt: ", err);
	}

} 
*/