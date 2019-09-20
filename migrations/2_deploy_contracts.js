const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const fs = require('fs');

module.exports = async function(deployer) {
    
    let firstAirline = '0xC484B3207CBd0C0dCb3Ec5e5839CE61e60EC1c56';
    
    await deployer.deploy(FlightSuretyApp, firstAirline)
    await deployer.deploy(FlightSuretyData, firstAirline)
    
    /**
     *  Note that `FlightSuretyData.address` is the contract address for flightSuretyData.
     *  This is being input to flightAddress for FlightSurety 
     */   
    let config = {
        localhost: {
            url: 'http://localhost:8545',
            dataAddress: FlightSuretyData.address,
            appAddress: FlightSuretyApp.address,
            firstAirline: firstAirline
        }
    }
    // This writes to the config files in server and dapp of the various properties obtained here
    fs.writeFileSync(__dirname + '/../src/dapp/config.json', JSON.stringify(config, null, '\t'), 'utf-8');
    fs.writeFileSync(__dirname + '/../src/server/config.json', JSON.stringify(config, null, '\t'), 'utf-8');
    console.log("deployment successful")
}