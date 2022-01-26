const Web3 = require("web3"); // fa riferimento al modulo Javascript 


let web3 = new Web3('http://localhost:22000');
let web3_2 = new Web3('http://localhost:22001');
let web3_3 = new Web3('http://localhost:22002');

user = Array();

web3.eth.getAccounts().then((value) => {
    user[0] = value;
    console.log("Questo è l'account dell'admin: " + user[0]);
	});

web3.eth.personal.newAccount().then((utente) => {
    user[1] = utente;
    console.log("Account fornitori nodo 1: " + user[1]);
});

web3.eth.personal.newAccount().then((utente) => {
    user[2] = utente;
    console.log("Account trasformatori nodo 1: " + user[2]);
});

web3.eth.personal.newAccount().then((utente) => {
    user[3] = utente;
    console.log("Account clienti nodo 1: " + user[3]);
});




/*
 web3_2.eth.getAccounts().then((value) => {
    user[4]= value;
    console.log("Account trasformatori nodo 2: " + user[4]);
    });

 web3_2.eth.personal.newAccount().then((utente) => {
        user[5] = utente;
        console.log("Account fornitori nodo 2: " + user[5]);
    });
    
 web3_2.eth.personal.newAccount().then((utente) => {
        user[6] = utente;
        console.log("Account clienti nodo 2: " + user[6]);
    });

 web3_3.eth.getAccounts().then((value) => {
    user[7]= value;
    console.log("Account trasformatori nodo 3: " + user[7]);
    });

 web3_3.eth.personal.newAccount().then((utente) => {
        user[8] = utente;
        console.log("Account fornitori nodo 3: " + user[8]);
    });
    
 web3_3.eth.personal.newAccount().then((utente) => {
        user[9] = utente;
        console.log("Account clienti nodo 3: " + user[9]);
    });

let myAccountAddress = null;
var abi = null;
var bytecode = null;
var contractAddress = null;
/*
demo(user);

function demo(address) {
    
    myAccountAddress = address[0];
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
    				data: myContract.methods.seeder(address).encodeABI(),
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

}*/ 