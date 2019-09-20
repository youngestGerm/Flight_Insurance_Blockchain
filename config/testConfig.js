var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");

var BigNumber = require('bignumber.js');

const contractDetails = require('../src/dapp/config.json')

var Config = async function(accounts) {
    
    // These test addresses are useful when you need to add
    // multiple users in test scripts
   
    let firstAirline = accounts[1];
    // This is how to instantiate a contract using JS

    let flightSuretyApp = await FlightSuretyApp.deployed(firstAirline);
    let flightSuretyData = await FlightSuretyData.deployed(firstAirline);
    
    
    // -- Start --
   

    
   
    //-- End --

    return {
        firstAirline: firstAirline,
        weiMultiple: (new BigNumber(10)).pow(18),
        flightSuretyData: flightSuretyData,
        flightSuretyApp: flightSuretyApp,
    }
}

module.exports = {
    Config: Config
};