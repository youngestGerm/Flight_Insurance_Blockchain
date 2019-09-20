import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        // this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
    }

    initialize(callback) {
        // We are getting the 50 accounts set up in ganache
        this.web3.eth.getAccounts((error, accts) => {
            this.owner = accts[0];
            let counter = 1;
            // Starting from the second account we are adding accounts into airlines object until the 4 account
            while(this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }
            // This while is similar to the one above, except we start on the 6th index, end on the 10th index. 
            // 5 addresses in passengers in total.
            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }
            callback();
        });
    }

    isOperationalApp(callback) {
        this.flightSuretyApp.methods.isOperational().call({from: this.owner}, callback);
    }

    setOperationalApp(decision, callback) {
        this.flightSuretyApp.methods.setOperatingStatus(decision)
        .send({ from: this.owner}, callback);
    }
    /**
     * @Dev Find a way to get the number of registered airlines and register an airline.
     * Here is the issue: I am trying to call a contract with an instance of another contract
     * FIXED: Forget the `new` in front of the new instance `FlightSuretyData` in the `FlightSuretyApp` constructor.
     */
    getRegisteredAirlines(callback) {
        this.flightSuretyApp.methods.getAirlines().send({from: this.owner}, (error, result) => {
            console.log(result, "result")
            callback(result)
        } )

    }
    /**
     * Note that currently, the contract is hooked up so that the front end requires the registered airline to register a new airline.
     */
    registerAirline(address, registeredAirline, callback) {
        this.flightSuretyApp.methods.registerAirline(address)
        .send({from : registeredAirline}, (err, result) => {

            console.log(result, "registerAirline transaction")
            callback(err, result)
        })
    }

    fetchFlightStatus(flight, callback) {
        let payload = {
            airline: this.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        } 

        this.flightSuretyApp.methods.fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: this.owner}, (error, result) => {
                // result returns the transactionHash
                callback(error, payload);
            });
    }
}