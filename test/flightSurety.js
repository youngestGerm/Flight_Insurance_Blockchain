
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('Flight Surety Tests ------------------------------------------------------------------------------------------------', async (accounts) => {

  var config;

  before('setup contract', async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`(multiparty) has correct initial isOperational() value`, async function () {

    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
      
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.flightSuretyData.setOperatingStatus(false);

      let reverted = false;
      try 
      {
          await config.flightSurety.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true);

  });

  it('(airline) cannot register an Airline using registerAirline() if it is not funded', async function() {
    
    // ARRANGE
    let newAirline = accounts[3];
        
    try {
        // await config.flightSuretyApp.fundAirline(config.firstAirline, {from: config.firstAirline, value: web3.utils.toWei('10', "ether")});
        const result = await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
        console.log(result, "line 83");
    } catch(e) {
        console.log(e);
        console.log(e.logs[0]);
        // assert.equal(false, true, "Error when registering the Airline");
    }

    let result = await config.flightSuretyData.airlineRegistered.call(newAirline); 

    // ASSERT
    assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");

  });
  
  it('the airline can fund itself', async function() {

    await config.flightSuretyData.AirlineFunded({}, (error, res)=> {
        console.log(res,error, "airline funded or not, line 98");
    });

    let startingFundedCount = await config.flightSuretyData.numberOfFundedAirlines.call();    
    
    try {
        await config.flightSuretyApp.fundAirline(config.firstAirline, {from: config.firstAirline});
    }
    catch(e) {
        console.log(e.message, "ERROR");
    }
    console.log(accounts[0], `first airline ${config.firstAirline}`, `balance: ${web3.eth.getBalance(config.firstAirline).then(console.log)}`);
    
    let endingFundedCount = await config.flightSuretyData.numberOfFundedAirlines.call();
    
    assert.equal(endingFundedCount.toNumber(), startingFundedCount.toNumber() + 1 , "funded count did not increase");


    let result = await config.flightSuretyData.isFunded.call(config.firstAirlinse); 

    assert.equal(result, true, "Airline funding is not successful");
  })
  
//   it('(airline) can vote for an Airline  voteForAirline() if it is funded', async () => {


//     // ARRANGE
//     let newAirline = accounts[4];
//     console.log(newAirline);
//     let startVoteCount = 0;
//     // ACT
//     try {
//       await config.flightSuretyApp.fundAirline(config.firstAirline, {from: config.firstAirline,value: web3.utils.toWei('10', "ether")});
//       await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
//       startVoteCount = await config.flightSuretyData.getAirlineVotesCount.call(newAirline, {from: config.firstAirline});
//       console.log(startVoteCount.toNumber());
//       await config.flightSuretyApp.voteForAirline(newAirline, {from: config.firstAirline});
//     }
//     catch(e) {
//       assert.equal(e, true, "Error in try");
//     }
//     let endVoteCount = await config.flightSuretyData.getAirlineVotesCount.call(newAirline, {from: config.firstAirline});
//     console.log(endVoteCount.toNumber());

//     // ASSERT
//     assert.equal(endVoteCount.toNumber(), startVoteCount.toNumber() + 1, "Funded airline was not able to vote for a registered airline");

//   });

//   it('5th (airline) will be added but not registered', async () => {


//     // ARRANGE
//     let startingRegistereAirlineCount = await config.flightSuretyData.getRegisteredAirlinesCount.call( {from: config.firstAirline});
//     let startingExistAirlineCount = await config.flightSuretyData.getExistAirlinesCount.call({from: config.firstAirline});

//     // ACT
//     try {
//       await config.flightSuretyApp.fundAirline(config.firstAirline, {from: config.firstAirline,value: web3.utils.toWei('10', "ether")});
//       await config.flightSuretyApp.registerAirline(accounts[4], {from: config.firstAirline});
//       await config.flightSuretyApp.registerAirline(accounts[5], {from: config.firstAirline});
//       await config.flightSuretyApp.registerAirline(accounts[6], {from: config.firstAirline});
//       await config.flightSuretyApp.registerAirline(accounts[7], {from: config.firstAirline});
//     }
//     catch(e) {
//       assert.equal(e, true, "Error in try");
//     }
//     let endingRegistereAirlineCount = await config.flightSuretyData.getRegisteredAirlinesCount.call( {from: config.firstAirline});
//     let endingExistAirlineCount = await config.flightSuretyData.getExistAirlinesCount.call({from: config.firstAirline});

//     // console.log(startingRegistereAirlineCount.toNumber(), existAirlineCount.toNumber());

//     // ASSERT
//     assert.equal(startingExistAirlineCount.toNumber(), endingExistAirlineCount.toNumber() - 1 , "Funded airline was not able to vote for a registered airline");

//   });


});
