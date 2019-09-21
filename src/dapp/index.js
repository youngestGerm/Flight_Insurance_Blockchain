
// import DOM from './dom';
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async() => {

    let result = null;
    
    // INITIALIZATION OF CONTRACT OBJECT
    let contract = new Contract('localhost', async () => {
            
        addOperationalEventListners(contract);
        


        

        // Handle registering Airline
        DOM.elid('submit-airline').addEventListener('click', _ => {
            // You need to send through an address of an already registered airline in order to register a new one.
            const registeredAirline = ""
            contract.registerAirline(DOM.elid('flight-register').value, registeredAirline, (err, result) => {
                console.log(err, "error", result)
            })
        })
        
        // Handle clicking submite oracle
        DOM.elid('submit-oracle').addEventListener('click', _ => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', "oracle-submission", [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
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
    contract.isOperationalApp((error, result) => {
        console.log(`dapp app contract is ${result ? "" : "not"} operational`)
        DOM.elid('app-operational-status-message').innerHTML = result ? "Ready to deploy with all functions available" : "Not ready to deploy"
        // display('App Contract Operational Status', 'app-operational-status-message', [ { error: "Not ready to deploy", value: "Ready to deploy with all functions available"} ]);
    });
    
    // Read data operational status
    contract.isOperationalData((error, result) => {
        console.log(`dapp data contract is ${result ? "" : "not"} operational`)
        DOM.elid('data-operational-status-message').innerHTML = result ? "Ready to deploy with all functions available" : "Not ready to deploy"
        // display('Data Contract Operational Status', 'data-operational-status-message', [ { error: "Not ready to deploy", value: "Ready to deploy with all functions available"} ]);
    });

    // Handle turning on app operational status request
    DOM.elid('app-operational-status-on').addEventListener('click', _ => {
        contract.setOperationalApp(true, (err) => { if (err) console.log(err, "there is an error!!"); 
            // Handle changing text:
            contract.isOperationalApp((error, result) => {
                // This result returns whatever the return value is in the contract for this function
                console.log(`dapp app contract is ${result ? "" : "not"} operational`)
                // console.log(result, "result operational status")
                DOM.elid('app-operational-status-message').innerHTML = result ? "Ready to deploy with all functions available" : "Not ready to deploy";
            });
        })
    })
    
    // Handle turning off app operational status request
    DOM.elid('app-operational-status-off').addEventListener('click', _ => {
        contract.setOperationalApp(false, (err) => { if (err) console.log(err, "there is an error!!");  
            // Handle changing text:
            contract.isOperationalApp((error, result) => {
                // This result returns whatever the return value is in the contract for this function
                console.log(`dapp app contract is ${result ? "" : "not"} operational`)
                DOM.elid('app-operational-status-message').innerHTML = result ? "Ready to deploy with all functions available" : "Not ready to deploy";
            }); 
        })
    })

    //Handle turning on data operational status request
    DOM.elid('data-operational-status-on').addEventListener('click', _ => {
        contract.setOperationalData(true, (err) => { if (err) console.log(err, "there is an error!!"); 
            // Handle changing text:
            contract.isOperationalData((error, result) => {
                console.log(`dapp app contract is ${result ? "" : "not"} operational`)
                // console.log(result, "result operational status")
                DOM.elid('data-operational-status-message').innerHTML = result ? "Ready to deploy with all functions available" : "Not ready to deploy";
            });
        })
    })
    //Handle turning on data operational status request
    DOM.elid('data-operational-status-off').addEventListener('click', _ => {
        contract.setOperationalData(false, (err) => { if (err) console.log(err, "there is an error!!"); 
            // Handle changing text:
            contract.isOperationalData((error, result) => {
                if (result) console.log("dapp data is operational"); else console.log("dapp data is not operational")
                // console.log(result, "result operational status")
                DOM.elid('data-operational-status-message').innerHTML = result ? "Ready to deploy with all functions available" : "Not ready to deploy";
            });
        })
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



