const Web3 = require("web3");

let mycontract = require("../mycontract.js");
let mykeys = require("../mykeys.js");

console.log("My keys: ", mykeys);

// node 0, http
let web3 = new Web3('http://localhost:22000');

// node 0, websocket
//let web3 = new Web3('ws://localhost:23000');

let myAccountAddress = null;

web3.eth.getAccounts().then((value) => {
	console.log("Accounts: " + value);
	demo(value[0]);
});

var abi = null;
var bytecode = null;
var contractAddress = null;

function demo(a) {
    
    myAccountAddress = a;
    console.log("Used account: " + a);
    
   
    var values = mycontract.compile("storage_private.sol"); 
    abi = values[0];
    bytecode = values[1];

    var simpleContract = new web3.eth.Contract(abi, { from: a } );

    // 1. deploy the smart contract (keys[0] can only retrieve, keys[1] can only store)
    var simple = simpleContract.deploy({data: "0x" + bytecode, arguments: [ "0x" + mykeys.keys[1].address, "0x" + mykeys.keys[0].address ]}).
		send({ from:a, gas: 1500000, gasPrice: '0' }, deploy_handler).
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
    				data: myContract.methods.store(10).encodeABI(),
				gas: 1500000, 
				gasPrice: '0',
				nonce: value
    			};
    
			console.log("Using key for account 0: ", mykeys.keys[0]);
			const signPromise = web3.eth.signTransaction(tx, mykeys.keys[0].privateKey);

		    	console.log("Sign promise: ". signPromise);
    			signPromise.then((signedTransaction) => {

				// this transaction should fail (and execute the "error" event handler, because
				// we are  transacting on "store" as keys[0].address, but the function 
				// is only allowed to keys[1].address
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
 						let res = myContract2.methods.retrieve().call(function (err, res) { if (err) { console.error("Call error: ", err); } else { console.log("Call result: ", res); } });
						
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

