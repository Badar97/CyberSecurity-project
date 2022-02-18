var solc = require("solc");
var fs = require("fs");

function compile(filepath) { 
    
    var input = {
    	  language: 'Solidity',
    	  sources: { },
    	  settings: {
    		      outputSelection: {
    			            '*': {
    					            '*': ['*']
    					          }
    			          }
    		    }
    };
    
    input.sources[filepath] = {
    	content: fs.readFileSync(filepath).toString()
    };
    
    // console.log("INPUT:", input);
    
    var output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    // console.log("OUTPUT:", output);
    
    let bytecode = null;
    let abi = null;
    // `output` here contains the JSON output as specified in the documentation
    for (var contractName in output.contracts[filepath]) {
    	bytecode = output.contracts[filepath][contractName].evm.bytecode.object;
    	abi = output.contracts[filepath][contractName].abi;
    
    	// console.log(contractName + " ABI: ", abi);
    
    }
 
    return [abi , bytecode];

}


exports.compile = compile;
