
// import DOM from './dom';
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async() => {

    let result = null;
    
    // INITIALIZATION OF CONTRACT OBJECT
    let contract = new Contract('localhost', () => {
        
        addOperationalEventListners(contract);
       
        // Handle registering Airline
        DOM.elid('submit-airline').addEventListener('click', _ => {
            //Handle checking whether the current address is registered or not
            contract.registerAirline(DOM.elid('flight-register').value, "0xC484B3207CBd0C0dCb3Ec5e5839CE61e60EC1c56")
        })

        // Handle clicking submite oracle
        DOM.elid('submit-oracle').addEventListener('click', _ => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracle Response', "oracle-submission", [ { error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
        })
        
        
    });
    

})();

function display(title, idType, results) {
    let displayDiv = DOM.elid("display-wrapper");

    let section = DOM.section();
    section.appendChild(DOM.h4(title));
    // section.appendChild(DOM.h5(description));

    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'col-sm-8 field-value', id: idType}, result.value ? result.value : result.error));
        section.appendChild(row);
    })

    displayDiv.append(section);

}

function addOperationalEventListners(contract){

    // Read app operational status
    const appIsOperational = contract.isOperationalApp()
    console.log(`dapp app contract is ${appIsOperational ? "" : "not"} operational`)
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
}



//NOTES

        // User-submitted transaction
        // Note that you can write the DOM, event listener in another way 
        // document.getElementById('submit-oracle').addEventListener('click', _ => {
        //     let flight = DOM.elid('flight-number').value;
        //     // Write transaction
        //     contract.fetchFlightStatus(flight, (error, result) => {
        //         display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
        //     });
        // })



