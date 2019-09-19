# FlightSurety

FlightSurety is a sample application project for Udacity's Blockchain course.

## Install

To install, download or clone the repo, then:

`npm install`  
`truffle compile`

## Develop Client

To run truffle tests:

`truffle test ./test/flightSurety.js`  
`truffle test ./test/oracles.js`

To use the dapp:

`truffle migrate`  
`npm run dapp`

To view dapp:

`http://localhost:8000`

## Develop Server

`npm run server`  
`truffle test ./test/oracles.js`

## Deploy

To build dapp for prod: `npm run dapp:prod`. This deploys the contents of the ./dapp folder.

## Concepts

> What is a scaffold?

Programming method of building database-backend software applications. Programmer may write a specification that describes how the application database may be used.

> Why is babel used?

Babel allows you to write code in the latest version of JS. Babel helps compile features down to a supported version of JS. AKA JS compiler, used to convert ECMAScript 2015+ code into a backwards compatible version of JS in current and older browsers or environments. What can Babel do?

Bable can transform syntax. 
Source code transformations.

> What does the `npm run dapp` script contain, what does it mean?
It contains `webpack-dev-server --mode development --config webpack.config.dapp.js`.

`webpack-dev-server` will start a server and begin listening for connections from localhost on port 8080. When we include `--config webpack.config.dapp.js`, this directs the webpack to load the configuration file we set up with code specifying the entry point, and other customizations. `--mode development` can also be added in webpack.config.dapp.js as `mode : "development"`.

> What does the `npm run server` script contain, what does it mean?
It contains `rm -rf ./build/server && webpack --config webpack.config.server.js`.

`rm -rf ./build/server` specifies in terminal to remove (`rm`) the `./build/server` file. `-rf` is equivalent to `-r -f`, which `-r` is to delete directories and all their subdirectories and `-f` is to force the deletion, ignoring errors or warnings. `webpack --config webpack.config.server.js` sets the configurations for webpack when the server is loaded.


## Notes

### Some tasks to complete: 
- Learn webpack production and development: https://webpack.js.org/guides/production.

## Resources
* [Webpack JS Configuration Files](https://webpack.js.org/configuration/)
* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Remix Solidity IDE](https://remix.ethereum.org/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)