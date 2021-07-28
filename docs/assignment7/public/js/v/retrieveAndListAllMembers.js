/**
 * @fileOverview  Contains various view functions for the use case listBooks
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.retrieveAndListAllMembers = {
    setupUserInterface: async function () {
        const tableBodyEl = document.querySelector("table#tableMembers>tbody");
        // load a list of all member records from Firestore
        const memberRecords = await retrieveAllMembers();
        // for each member, create a table row with a cell for each attribute
        for (const memberRec of memberRecords) {
            const row = tableBodyEl.insertRow();
            row.insertCell().textContent = memberRec.memberId;
            row.insertCell().textContent = memberRec.role;
            row.insertCell().textContent = memberRec.name;
            let i = "";
            for(let a of memberRec.instrument) {
                let instrument = Object.values(InstrumentEL)[a];
                if (instrument) {
                    i += instrument + ', ';
                }
            }
            row.insertCell().textContent = i.slice(0, -2); // cut off last ', '
            row.insertCell().textContent = memberRec.mailAddress;
        }
    }
}

