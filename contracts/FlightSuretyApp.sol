pragma solidity >=0.4.25;

// It's important to avoid vulnerabilities due to numeric overflow bugs
// OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs
// More info: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2018/november/smart-contract-insecurity-bad-arithmetic/

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./FlightSuretyData.sol";

/************************************************** */
/* FlightSurety Smart Contract                      */
/************************************************** */
contract FlightSuretyApp {
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    // Flight status codees
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;
    address private contractOwner;          // Account used to deploy contract
    bool private operational = true;
    mapping(bytes32 => Flight) private flights;
    FlightSuretyData data;


    event FlightStatusInfo(address airline, string flight, uint256 timestamp, uint8 status);
    event OracleReport(address airline, string flight, uint256 timestamp, uint8 status);
    event OracleRequest(uint8 index, address airline, string flight, uint256 timestamp);
    event OperationalChange(bool change);
    event RegisteredAirline(bool threshold, uint votes);
    event RegisteredFlight(bytes32 flightNumber, uint256 date);

    struct Flight {
        uint256 arrivalTime;  
        uint256 flightStatus;
        uint256 insuredAmount;      
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
    modifier requireIsOperational() 
    {
         // Modify to call data contract's status
        require(operational, "Contract is currently not operational");  
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }
    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }
    modifier requireAirlineIsFunded(address airlineAddress) 
    {
        require(data.isFunded(airlineAddress), "airline is not funded");
        _;
    }
    modifier requireAddressIsAirline(address _address) {
        require(data.airlineExists(_address), "Address doesn't belong with an existing airline");
        _;
    }
    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/

    /**
    * @dev Contract constructor
    *
    */
    constructor
                                (
                                    address flightAddress
                                ) 
                                public 
    {
        contractOwner = msg.sender;
        data = new FlightSuretyData(flightAddress);
    }
    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function isOperationalApp() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;  // Modify to call data contract's status
    }

    function setOperationalApp
                            (
                                bool mode
                            ) 
                            public
                            requireContractOwner 
                            returns(bool)
    {
        operational = mode;
        emit OperationalChange(mode);
    }

    function isOperationalData()
                                public
                                view
                                returns(bool)
    {
        return data.isOperational();
    }

    function setOperationalData(
                                    bool mode
                                )
                                external
                                requireContractOwner
                                returns(bool)
    {
        data.setOperatingStatus(mode);
        emit OperationalChange(mode);
    }

    function getRegisteredAirlinesArray() public view requireIsOperational returns(address[] memory) {
        return data.getRegisteredAirlinesAddresses();
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/
//    View allows you to see the return value from the async/await code in the contract.js file
    function getFlightNumberFromData(bytes32 flightCode) public view requireIsOperational 
        returns(
        uint256 arrivalT,
        uint256 status,
        uint256 totalInsuredAmount
        )
    {
        return (
            flights[flightCode].arrivalTime,
            flights[flightCode].flightStatus,
            flights[flightCode].insuredAmount
        );
    }

    function buyInsurance(address airlineAddress) {
        data.buy(airlineAddress).value(msg.value)(_address)
    }
   
   /**
    * @dev Add an airline to the registration queue
    *
    */   
    function registerAirline
                            (   
                            address airlineToRegister,
                            string airlineName
                            )
                            external
                            requireIsOperational
                            // returns(address[] memory)
    {
        //First check whether the number of registered airlines is less than 5 or greater
        uint registeredAirlines = data.getRegisteredAirlines();
        uint totalVotes = data.getAirlineVotes(airlineToRegister);
        require(data.airlineRegistered(msg.sender), "The airline currently attempting to register another airline is not registered");

        if (registeredAirlines >= 4) {
            data.registerAirline(airlineToRegister, false, airlineName);
            emit RegisteredAirline(true, totalVotes);
            // return data.getRegisteredAirlinesAddresses();
        } else { 
            data.registerAirline(airlineToRegister, true, airlineName);
            emit RegisteredAirline(true, totalVotes);
            // return data.getRegisteredAirlinesAddresses();
        }    
    }
   /**
    * @dev Register a future flight for insuring.
    *int256 arrivalTime;  
        uint256 flightStatus;
        uint256 insuredAmount; 
    */  
    
    function registerFlight
                                (
                                    bytes32 flightNumber,
                                    uint256 date

                                )
                                external
                                requireIsOperational
    {  
        require(data.airlineRegistered(msg.sender), "This address is not registered, it can not log flights");
        flights[flightNumber] =  Flight(date, STATUS_CODE_ON_TIME, 0);
        data.addFlightCode(flightNumber);
        emit RegisteredFlight(flightNumber, date);
    }
    
    function voteAirline (address votingFor) public requireIsOperational requireAirlineIsFunded(msg.sender) requireAddressIsAirline(votingFor) {
        data.vote(msg.sender, votingFor);
        bool isRegistered = data.airlineRegistered(votingFor);
        uint voteCount = data.getAirlineVotes(votingFor);
        uint minimumVotes = data.getRegisteredAirlines().div(2);
        
        if ( voteCount > minimumVotes && !isRegistered){
            data.setAirlineRegistered(votingFor);
        }
    }
   /**
    * @dev Called after oracle has updated flight status
    *
    */  
    function processFlightStatus
                                (
                                    address airlineAddress,
                                    string memory flight,
                                    uint256 timestamp,
                                    uint8 statusCode
                                )
                                internal
                                pure
    {
    }
    
    function fundAirline(address _address) public payable requireIsOperational requireAddressIsAirline(_address) {
        require(msg.sender == _address, "Only the airline can fund itself");
        data.fund.value(msg.value)(_address);
    }

    // Generate a request for oracles to fetch flight information
    function fetchFlightStatus
                        (   
                            address airline,
                            string flight,
                            uint256 timestamp                        
                        )
                        external
    {
        uint8 index = getRandomIndex(msg.sender);

        // Generate a unique key for storing the request
        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp));

        
        oracleResponses[key] = ResponseInfo({
                                                requester: msg.sender,
                                                isOpen: true
                                            });

        emit OracleRequest(index, airline, flight, timestamp);
    } 
    
// region ORACLE MANAGEMENT

    // Incremented to add pseudo-randomness at various points
    uint8 private nonce = 0;    
    // Fee to be paid when registering oracle
    uint256 public constant REGISTRATION_FEE = 1 ether;

    // Number of oracles that must respond for valid status
    uint256 private constant MIN_RESPONSES = 3;
    mapping(address => Oracle) private oracles;
    mapping(bytes32 => ResponseInfo) private oracleResponses;
    
    struct Oracle {
        bool isRegistered;
        uint8[3] indexes;        
    }
    // Model for responses from oracles
    struct ResponseInfo {
        address requester;                              // Account that requested status
        bool isOpen;                                    // If open, oracle responses are accepted
        mapping(uint8 => address[]) responses;          // Mapping key is the status code reported
                                                        // This lets us group responses and identify
                                                        // the response that majority of the oracles
    }

    // Track all oracle responses
    // Key = hash(index, flight, timestamp)


    // Register an oracle with the contract.
    function registerOracle
                            (
                            )
                            external
                            payable
    {
        // Require registration fee
        require(msg.value >= REGISTRATION_FEE, "Registration fee is required");
        uint8[3] memory indexes = generateIndexes(msg.sender);
        oracles[msg.sender] = Oracle({
                                        isRegistered: true,
                                        indexes: indexes
                                    });
    }

    function getMyIndexes
                            (
                            )
                            view
                            external
                            returns(uint8[3])
    {
        require(oracles[msg.sender].isRegistered, "Not registered as an oracle");
        return oracles[msg.sender].indexes;
    }




    // Called by oracle when a response is available to an outstanding request
    // For the response to be accepted, there must be a pending request that is open
    // and matches one of the three Indexes randomly assigned to the oracle at the
    // time of registration (i.e. uninvited oracles are not welcome)

     /** 
        First the oracles list has to contain a address that is the same as msg.sender.
        Second the oracle must have an index (it has 3 in total) that is the same as the index provided.
     */
    modifier oracleResponseCriteria(uint8 index) {
        require((oracles[msg.sender].indexes[0] == index) 
        || (oracles[msg.sender].indexes[1] == index) 
        || (oracles[msg.sender].indexes[2] == index),
         "Index does not match oracle request");
         _;
    }
   

    function submitOracleResponse
                        (
                            uint8 index,
                            address airline,
                            string flight,
                            uint256 timestamp,
                            uint8 statusCode
                        )
                        external
                        oracleResponseCriteria(index)
    {
        


        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp)); 
        require(oracleResponses[key].isOpen, "Oracle request already resolved");
        
        oracleResponses[key].responses[statusCode].push(msg.sender);

        // Information isn't considered verified until at least MIN_RESPONSES
        // oracles respond with the *** same *** information
        emit OracleReport(airline, flight, timestamp, statusCode);
        if (oracleResponses[key].responses[statusCode].length >= MIN_RESPONSES) {

            emit FlightStatusInfo(airline, flight, timestamp, statusCode);

            // Handle flight status as appropriate
            processFlightStatus(airline, flight, timestamp, statusCode);
        }
    }


    function getFlightKey
                        (
                            address airline,
                            string flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    // Returns array of three non-duplicating integers from 0-9
    function generateIndexes
                            (                       
                                address account         
                            )
                            internal
                            returns(uint8[3])
    {
        uint8[3] memory indexes;
        indexes[0] = getRandomIndex(account);
        
        indexes[1] = indexes[0];
        while(indexes[1] == indexes[0]) {
            indexes[1] = getRandomIndex(account);
        }

        indexes[2] = indexes[1];
        while((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
            indexes[2] = getRandomIndex(account);
        }

        return indexes;
    }

    // Returns array of three non-duplicating integers from 0-9
    function getRandomIndex
                            (
                                address account
                            )
                            internal
                            returns (uint8)
    {
        uint8 maxValue = 10;

        // Pseudo random number...the incrementing nonce adds variation
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), account))) % maxValue);

        if (nonce > 250) {
            nonce = 0;  // Can only fetch blockhashes for last 256 blocks so we adapt
        }

        return random;
    }
}   
