# Flight Insurance Blockchain App

I recreated a project that was for Udacity's Blockchain course to incorporate different aspects of how blockchain can dramatically improve certain business structures (in this case it was the flight insurance industry). Note that this project is highly theoretical and I do not intend on creating a company that automates flight insurances. However, this idea can be expanded upon in the sense that only the core contract functions have been developed in this specific business niche. The business market demands autonomy (creating efficiency for both companies and consumers), hence this is why I decided to endeavor further into the functionalities of this project.

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
`truffle test ./test/flightSurety.js`

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

> Why is a oracles used here?

Because we are fetching the flight results by extracting data from another source, we need to use an oracle.

> What is the difference between send and call?
`msg.sender.send(number);` is the same as: `msg.sender.call.gas(0).value(number)();`

> What is the use of new?

> When can you not use view?
When you are altering a property of a contract such as `address[] airlines`.


> Why do you append `then` after a web3 contract instance after call, like this: 
`this.flightSuretyApp.methods.getRegisteredAirlinesArray().call().then();`


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

## NPM Installations
- Truffle-contract : this allowed me to access and alter functions in the contract.
