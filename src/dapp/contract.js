import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
var contract = require("truffle-contract");
var BigNumber = require('big-number');
var web3 = require('web3')
export default class Contract {

    constructor(network, callback) {
        this._appAddress = Config[network].appAddress;
        console.log(this._appAddress, "constructor")
        this.providers = new Web3.providers.HttpProvider('http://localhost:8545');
        this.web3 = new Web3(this.providers);
        this.flightSuretyApp = contract({abi : FlightSuretyApp.abi});
        this.flightSuretyApp.setProvider(this.providers);


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


    async registerFlight(flightNumber, flightTime, registeredAirline) {
        console.log("in register flight")
        const instance = await this.flightSuretyApp.at(this._appAddress);
        await instance.registerFlight(flightNumber, flightTime, {from: registeredAirline});
        let flightNumberReturned = await instance.flightNumber(registeredAirline, {from: registeredAirline});
        console.log("Sucess in registering flight", flightNumberReturned);
        return flightNumberReturned
    }





    async getRegisteredAirlines() {
        const instance = await this.flightSuretyApp.at(this._appAddress);
        let airlines = await instance.getRegisteredAirlinesArray();
        console.log(airlines, "instance airlines return");
        return airlines
    } 

    async registerAirline(address, name, registeredAirline) {
        const instance = await this.flightSuretyApp.at(this._appAddress);
        await instance.registerAirline(address, name, {from: registeredAirline});

    }

    async fundAirline(address, callingAddress, airlineFundValue) {
        const instance = await this.flightSuretyApp.at(this._appAddress);
        await instance.fundAirline(address, {from: callingAddress, value: airlineFundValue});
        console.log("funded Airline")
    }

    // App Operationals
    async isOperationalApp() {
        let instance = await this.flightSuretyApp.at(this._appAddress);
        let isOperational = await instance.isOperationalApp({from: this.owner})
        return isOperational;
    }

    async setOperationalApp(decision) {
        let instance = await this.flightSuretyApp.at(this._appAddress);
        await instance.setOperationalApp(decision, {from: this.owner})
        let appOperationalResult = await instance.isOperationalApp({from: this.owner})
        return appOperationalResult;
    }

    // Data Operationals
    async isOperationalData() {
        let instance = await this.flightSuretyApp.at(this._appAddress);
        let isOperational = await instance.isOperationalData({from: this.owner})
        return isOperational;
    }

    async setOperationalData(decision) {
        let instance = await this.flightSuretyApp.at(this._appAddress);
        await instance.setOperationalData(decision, {from: this.owner})
        let dataOperationalResult = await instance.isOperationalData({from: this.owner})
        return dataOperationalResult;    
    }
    
    //msg.sender is used, update this.owner to window.ethereum.selectedAddress
    async fetchFlightStatus(flight) {
        let payload = {
            airline: this.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        } 
        let instance = await this.flightSuretyApp.at(this._appAddress);
        await instance.fetchFlightStatus(payload.airline, payload.flight, payload.timestamp, {from : this.owner})            
        return payload;
    }
}