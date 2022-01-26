const rl = require("readline-sync");
const Web3 = require("web3"); // fa riferimento al modulo Javascript 

let mycontract = require("./mycontract.js");
let trasformatore = require("./Utenti/Trasformatore.js");

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
		demo(account_address);
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

function demo(address) {
    
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

function receipt_handler(receipt) {
	try {
		contractAddress = receipt.contractAddress;
    		console.log("Contract mined: " + receipt.contractAddress);
    		console.log(receipt);
    
		web3.eth.getTransactionCount(myAccountAddress).then((value) => { 
			console.log("Transaction count: ", value); 
	    		// 2. generate a transaction to update the smart contract state
       		    var myContract = new web3.eth.Contract(abi, receipt.contractAddress);
					
    			const tx = {
    				from: myAccountAddress,
    				to: receipt.contractAddress,
    				data: myContract.methods.addUser(myAccountAddress , 1).encodeABI(),
				gas: 1500000, 
				gasPrice: '0',
				nonce: value
    			};
           
			const signPromise = web3.eth.signTransaction(tx, tx.from);

		    	console.log("Sign promise: ", signPromise);
    			signPromise.then((signedTransaction) => {
    				const sentTx = web3.eth.sendSignedTransaction(signedTransaction.raw || signedTransaction.rawTransaction);
    
    				sentTx.on("error", (error) => {
    					console.log("Transaction error: ", error);
    				});

				sentTx.on("receipt", (receipt) => {
					console.log("Transaction receipt: ", receipt);
					try {
						console.log("Ready to call ...");
						var myContract2 = new web3.eth.Contract(abi, contractAddress);
						console.log("myContract2 created ...");
 						let res = myContract2.methods.getUsersTipo(myAccountAddress).call(function (err, res) { if (err) { console.error("Error calling: ", err); } else { console.log("Tipo utente: ", res); } });
						
						 console.log("Call passed");
					} catch (err) {
						console.log("Error during call: ", err);
					}

				});
    			}).catch((error) => {
    
    				console.log("Sign Promise error: ", error);
    			}); 


		});

	} catch (err) {
		console.error("Error handling receipt: ", err);
	}

} 