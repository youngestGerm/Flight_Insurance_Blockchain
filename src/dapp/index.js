
// import DOM from './dom';
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async() => {

    let result = null;

    let contract = new Contract('localhost', () => {
            
        // Read transaction
        contract.isOperationalApp((error, result) => {
            if (result) console.log("dapp is operational"); else console.log("dapp is not operational")
            display('App Contract Operational Status', 'app-operational-status-message', [ { label: 'Operational Status', error: "Not ready to deploy", value: "Ready to deploy with all functions available"} ]);
        });
        
        // Handle turning on operational status request
        DOM.elid('app-operational-status-on').addEventListener('click', _ => {
            contract.setOperationalApp(true, (err) => { if (err) console.log(err, "there is an error!!");  
                contract.isOperationalApp((error, result) => {
                    console.log(result, "result")
                    DOM.elid('app-operational-status-message').innerHTML = result ? "Ready to deploy with all functions available" : "Not ready to deploy";
                });
            })
            

        })
        
        // Handle turning off operational status request
        DOM.elid('app-operational-status-off').addEventListener('click', _ => {
            contract.setOperationalApp(false, (err) => { if (err) console.log(err, "there is an error!!");  
                // Handle changing text:
                contract.isOperationalApp((error, result) => {
                    DOM.elid('app-operational-status-message').innerHTML = result ? "Ready to deploy with all functions available" : "Not ready to deploy";
                }); 
            })
            
        })

        // Handle registering Airline
        DOM.elid('submit-airline').addEventListener('click', _ => {
                
            // contract.setOperational((err) => {
            //     if (err) console.log(err, "there is an error!!"); else console.log("WORKS!!")    
            // })
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
