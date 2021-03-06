
// import DOM from './dom';
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async() => {

    let result = null;
    
    // INITIALIZATION OF CONTRACT OBJECT
    let contract = new Contract('localhost', async () => {
        
        // document.addEventListener('click', async _ => {
        //     let airlines = await contract.getRegisteredAirlines();
        //     console.log(window.ethereum.selectedAddress, await contract.getRegisteredAirlines())    
            

        // })

        

        
       

        
        // NOTE: No error implementation yet
        // Note that everytime a new page is reloaded, admin functions, etc the functions below get reloaded.
        // If a document does not have a certain id, as not all pages from the site contain all the elementids listed here, the function will crash as well as all the subsequent functions.
        initializer(contract)
        addOracleEventListner(contract);
        addAirlineEventListner(contract);
        addOperationalEventListners(contract);
        addSubmitFlightEventListner(contract)
        addGetFlightsEventListner(contract);
        addBuyInsuranceEventListner(contract);
    });
    

})();

async function initializer(contract) {
    let airlines = await contract.getRegisteredAirlines();
    
    
    try {
        displayAirlines("airline-submission-update", [{value: airlines}]);
        
    } catch {}
    
}

/**
 * Event Listners
 */ 

/**
 * 32ed
 * 0xC484B3207CBd0C0dCb3Ec5e5839CE61e60EC1c56
 * 1000000000000000000 (This is wei)
 * December 17, 1995 03:24:00
 */

function addBuyInsuranceEventListner(contract) {
    try {
        DOM.elid("buy-insurance").addEventListener('click', async _ => {
            await contract.buyFlightInsurance(DOM.elid("insurance-amount").value, DOM.elid("flight-number").value, window.ethereum.selectedAddress);            
        })
    } catch {}
    
}

function addGetFlightsEventListner(contract) {
    try {
        DOM.elid("get-flights").addEventListener('click', async _ => {
            let flightInformations = await contract.getFlightInformation(window.ethereum.selectedAddress, DOM.elid("flight-number").value);   
            displayBoughtInsurance("", [{value: flightInformations}]);
        })
    } catch {}
}

 
function addSubmitFlightEventListner(contract) {
    // Format of flight time: 'December 17, 1995 03:24:00'
    try {
        document.getElementById('submit-flight-info').addEventListener('click', async _ => {
            let computerReadableDate = new Date(DOM.elid('flight-time').value).valueOf()
            
            await contract.registerFlight(DOM.elid('flight-register').value, computerReadableDate, DOM.elid('flight-status').value, DOM.elid('max-individual-insurance-amount').value, DOM.elid('max-total-insurance-amount').value, window.ethereum.selectedAddress)
        })
    } catch {}
}

function addOracleEventListner(contract) {
    // Handle clicking submite oracle
    try {
        DOM.elid('submit-oracle').addEventListener('click', async _ => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            let result = await contract.fetchFlightStatus(flight)
            displayOracleStatus("oracle-submission", [ {value: result.flight + ' ' + result.timestamp} ]);
        })
    }catch {}
    
}

function addAirlineEventListner(contract) {
    // Handle registering Airline
    try {
        DOM.elid('submit-airline').addEventListener('click', async _ => {
            //Handle checking whether the current address is registered or not
            await contract.registerAirline(DOM.elid('flight-register-address').value,  DOM.elid('flight-register-name').value, window.ethereum.selectedAddress);
            location.reload();            
        })
     
        DOM.elid('submit-airline-funding').addEventListener('click', async _ => {
            
            // DOM.elid('airline-fund'.value)
            await contract.fundAirline(DOM.elid('airline-fund-address').value, window.ethereum.selectedAddress, DOM.elid('airline-fund').value * 1000000000000000000);
            
        })
    } catch {}
    
}








/**
 * Other HTML/CSS Functions
 */ 

function displayOracleStatus(idType, results) {
    let displayDiv = DOM.elid("display-wrapper-oracle-status");
    let section = DOM.section();
    let row = section.appendChild(DOM.div({className:'col-sm-8 field-value', id: idType}, results[0].value));
    section.appendChild(row);
    displayDiv.append(section);
}

function displayAirlines(idType, results) {
    let displayDiv = DOM.elid("display-wrapper-registered-airlines");
    let section = DOM.section();
    results[0].value.map(result => {
        console.log(result, "airlines")
        let row = section.appendChild(DOM.div({className:'col-sm-8 field-value', id: idType}, result));
        section.appendChild(row);
    })
    displayDiv.append(section);
}


// Create a function that displays the passenger insurances bought
function displayBoughtInsurance(idType, results) {
    let displayDiv = DOM.elid("display-wrapper-bought-insurance");
    displayDiv.innerHTML = "";
    let section = DOM.section();
    // console.log(results[0].value)
    results.map(result => {
        console.log(result, "result")
        for (let key in result) {
            console.log(result[key], "results")
            let rowArrivalTime = new Date(result[key].arrivalTime);
            let rowFlightStatus = result[key].flightStatus;
            let rowTotalInsuredAmount = result[key].totalInsuredAmount;
            let rowIndividualFlightInsurees = result[key].individualFlightInsurees;
            

            let row = section.appendChild(DOM.div({className: 'col-sm-8 field-value', id: idType}, `Arrival Time: ${rowArrivalTime.toString()}, Flight Status: ${rowFlightStatus}, Flight Maximum Individual Insured Amount: ${rowTotalInsuredAmount} ETH, Your Bought Insured Amount: ${rowIndividualFlightInsurees} ETH`))

            section.appendChild(row);
        }
    })

    displayDiv.append(section)

}



/**
 * Operational Events: 
 * This is to stop the contract when necessary.
 */

function addOperationalEventListners(contract){

    // Read app operational status
    const appIsOperational = contract.isOperationalApp()
    console.log(`dapp app contract is ${appIsOperational ? "" : "not"} operational`)
    try {
        DOM.elid('app-operational-status-message').innerHTML = appIsOperational ? "Ready to deploy with all functions available" : "Not ready to deploy";

    // Read data operational status
    const dataIsOperational = contract.isOperationalData()
    console.log(`dapp data contract is ${dataIsOperational ? "" : "not"} operational`)
    DOM.elid('data-operational-status-message').innerHTML = dataIsOperational ? "Ready to deploy with all functions available" : "Not ready to deploy";

    // Handle turning on app operational status request
    DOM.elid('app-operational-status-on').addEventListener('click', async _ => {
        await contract.setOperationalApp(true);
        let setAppOperationalResultOn = await contract.isOperationalApp();
        console.log(setAppOperationalResultOn)
         // This result returns whatever the return value is in the contract for this function
        console.log(`dapp app contract is ${setAppOperationalResultOn ? "" : "not"} operational`)
        DOM.elid('app-operational-status-message').innerHTML = setAppOperationalResultOn ? "Ready to deploy with all functions available" : "Not ready to deploy";  
    })
    
    // Handle turning off app operational status request
    DOM.elid('app-operational-status-off').addEventListener('click', async _ => {
        
        let setAppOperationalResultOff = await contract.setOperationalApp(false);
        console.log(setAppOperationalResultOff)

        console.log(`dapp app contract is ${setAppOperationalResultOff ? "" : "not"} operational`)
        DOM.elid('app-operational-status-message').innerHTML = setAppOperationalResultOff ? "Ready to deploy with all functions available" : "Not ready to deploy";
    })

    //Handle turning on data operational status request
    DOM.elid('data-operational-status-on').addEventListener('click', async _ => {
        await contract.setOperationalData(true);
        let setDataOperationalResultOn = await contract.isOperationalData()
        console.log(`dapp data contract is ${setDataOperationalResultOn ? "" : "not"} operational`)
        DOM.elid('data-operational-status-message').innerHTML = setDataOperationalResultOn ? "Ready to deploy with all functions available" : "Not ready to deploy";
    })
    //Handle turning on data operational status request
    DOM.elid('data-operational-status-off').addEventListener('click', async _ => {
        let setDataOperationalResultOff = await contract.setOperationalData(false);
        console.log(`dapp data contract is ${setDataOperationalResultOff ? "" : "not"} operational`)
        DOM.elid('data-operational-status-message').innerHTML = setDataOperationalResultOff ? "Ready to deploy with all functions available" : "Not ready to deploy";
    })
    } catch {}
}