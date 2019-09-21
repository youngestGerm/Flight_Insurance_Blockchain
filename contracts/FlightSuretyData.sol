pragma solidity >=0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/
    struct Votes {
        uint votesCounted;
        mapping(address => bool) addressFromVotes;
    }
    
    struct Airline {
        bool exists;
        bool registered;
        bool funded; //is this 
        bytes32[] flightKeys;
        Votes votes;
        uint numberOfInsurance;
    }

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    mapping (address => Airline) private airlines;
    mapping (address => bool) private authorizedCallers;
    uint private registeredAirlines = 0;
    uint private fundedAirlines = 0;
    uint private airlinesCount = 0;
    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    // event AirlineExists()
    event AuthorizeCaller(address caller);
    event AirlineFunded(address airlineAddress, bool exists, bool registered, bool funded, uint fundedCount);
    event OperationalChange(bool change);
    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                ( address firstAirline
                                ) 
                                public 
    {
        contractOwner = msg.sender;
        airlines[firstAirline] =  Airline(true, true, false, new bytes32[](0), Votes(0), 0);
        registeredAirlines.add(1);
    }   

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner(){
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier requireAirlineRegistration(address airlineCompanyAddress) {
        require(airlines[airlineCompanyAddress].registered, "Airline is not registered and not part of the program");
        _;
    } 

    modifier requireAirlineExists(address _address) {
        require (airlines[_address].exists, "Airline does not exist");
        _;
    }
    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) {
        return operational;
    }

   function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            requireContractOwner 
    {
        operational = mode;
        emit OperationalChange(mode);
    }
    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    


    function authorizeCaller(address _address) public requireContractOwner requireIsOperational {
        authorizedCallers[_address] = true;
        emit AuthorizeCaller(_address);
    }
    function isAuthorized(address _address) public returns(bool) {
        return authorizedCallers[_address];
    }
    function isFunded(address _address) public returns(bool) {
        return airlines[_address].funded;
    }
    function getRegisteredAirlines() public view returns(uint) {
        return registeredAirlines;
    }
    function airlineRegistered(address _address) public view returns(bool) {
        return airlines[_address].exists;
    }
    function getAirlineVotes(address airlineAddress) public requireIsOperational returns(uint) {
        return airlines[airlineAddress].votes.votesCounted;
    }
    function airlineExists(address airlineAddress) public view returns(bool) {
        return airlines[airlineAddress].exists;
    } 
    function numberOfFundedAirlines() public view requireIsOperational returns(uint) {
        return fundedAirlines;
    }
    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function registerAirline
                            (   
                                address airlineAddress, bool registered
                            )
                            external
                            view
                            requireIsOperational

    {
        
        airlines[airlineAddress] = Airline(true, registered, false, new bytes32[](0), Votes(0), 0);
        airlinesCount.add(1);
        if (registered) {
            registeredAirlines.add(1);
        }
    }

    function setAirlineRegistered(address _address) public requireIsOperational requireAirlineExists(_address) {
        require(!airlines[_address].registered, "Airline already registered");
        airlines[_address].registered = true;
        registeredAirlines.add(1);

    }

   /**
    * @dev Buy insurance for a flight
    *
    */   

    function buy ()
                            external
                            payable
    {
    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees
                                (
                                )
                                external
                                pure
    {
    }

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay
                            (
                            )
                            external
                            pure
    {
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund
                            (   
                                address airlineAddress
                            )
                            public
                            payable
                            requireIsOperational requireAirlineRegistration(airlineAddress) 
    {
        require(msg.value >= 10 ether, "The airline did not pay the minimum requirements to be funded");
        airlines[airlineAddress].funded = true;
        fundedAirlines = fundedAirlines.add(1);
        emit AirlineFunded(airlineAddress, airlines[airlineAddress].exists, airlines[airlineAddress].registered, airlines[airlineAddress].funded, fundedAirlines);
    }

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    function vote (address votingFor, address voter) public requireIsOperational {
        //They can't vote for themselves
        require(!airlines[votingFor].votes.addressFromVotes[voter], "Airline already voted");
        airlines[votingFor].votes.addressFromVotes[voter] = true;
        airlines[votingFor].votes.votesCounted++;
    }
    
    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() 
                            external 
                            payable 
    {
        fund(msg.sender);
    }


}

