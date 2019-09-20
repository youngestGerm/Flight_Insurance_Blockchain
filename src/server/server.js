import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';

/** 
 *  Note that when this page is saved, `npm run server` will automatically refresh
 */ 

let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];

let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);

/** Event values
     * index: `uint8 index = getRandomIndex(msg.sender);`
     * airline: Returns an airline address created from the test (`accounts[1]`) or from the front end application.
     *  the return depends on what is saved in the contract.
     * flight: Returns an flight string created from the test (`"ND1309"`) or from the front end application.
     *  the return depends on what is saved in the contract. 
     * timestamp: Returns the timestamp that was created when the test was run (`Math.floor(Date.now() / 1000);`).
     * 
     * 
     */

// This is how to retrieve event data
flightSuretyApp.events.OracleRequest((err, results) => {
  console.log("\x1b[36m%s\x1b[0m", results.event, results.returnValues, "*******Event Return Value********");
});

flightSuretyApp.events.OperationalChange((err, results) => {
  console.log("\x1b[43m%s\x1b[0m", results.event, results.returnValues[0], "*******Event Return Value********")
})

flightSuretyApp.events.RegisteredAirline((err, results) => {
  console.log("\x1b[32m%s\x1b[0m", results.event, results.returnValues[0], "*******Event Return Value********")
})

const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
})

export default app;

