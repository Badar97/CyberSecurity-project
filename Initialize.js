const rl = require("readline-sync");
const Web3 = require("web3"); // fa riferimento al modulo Javascript 
var fs = require("fs");

let mycontract = require("./mycontract.js");

let web3 = new Web3('http://localhost:22000');

web3.eth.getAccounts().then((value) => {
	start(value[0]);
});

let myAccountAddress = null;
var abi = null;
var bytecode = null;
var contractAddress = null;

function start(address) {
    
    myAccountAddress = address;
    console.log("Used account: " + address);
    
    var values = mycontract.compile("./CarbonFootprint/CarbonFootPrint.sol"); 
    abi = values[0];
    bytecode = values[1];
    var simpleContract = new web3.eth.Contract(abi, { from: address } );

    // 1. deploy the smart contract
    var simple = simpleContract.deploy({data: "0x" + bytecode, }).
		send({ from:address, gas: 1500000, gasPrice: '0' }, deploy_handler).
		on('receipt', receipt_handler); //.
    console.log("Simple contract deploying ...");
}

async function deploy_handler(e, transactionHash) {
			console.log("Submitted transaction with hash: ", transactionHash);
      			if (e) {
        			console.log("Error creating contract", e);
      			} 
}

function receipt_handler(receipt) {
	try {
		contractAddress = receipt.contractAddress;
    		console.log("Contract mined: " + receipt.contractAddress);
    		console.log(receipt);

		fs.writeFileSync("./CarbonFootprint/address.txt" , contractAddress);

    
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