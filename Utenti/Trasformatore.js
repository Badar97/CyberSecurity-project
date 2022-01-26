const rl = require("readline-sync");
const Web3 = require("web3"); // fa riferimento al modulo Javascript 
let mycontract = require("./mycontract.js");

let web3 = new Web3('http://localhost:22000');