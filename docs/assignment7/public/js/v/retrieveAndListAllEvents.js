/**
 * @fileOverview  Contains various view functions for the use case listevents
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.retrieveAndListAllEvents = {
    setupUserInterface: async function () {
        const tableBodyEl = document.querySelector("table#events>tbody");
        // load a list of all event records from Firestore
        const eventRecords = await retrieveAllEvents();

        const ensembleRecords = await getEnsembleRecords();

        // for each event, create a table row with a cell for each attribute
        for (const eventRec of eventRecords) {
            const row = tableBodyEl.insertRow();
            row.insertCell().textContent = eventRec.eventId;
            row.insertCell().textContent = Object.values(EventTypeEL)[eventRec.eventType];
            row.insertCell().textContent = eventRec.title;
            row.insertCell().textContent = eventRec.date;
            row.insertCell().textContent = eventRec.description;
            row.insertCell().textContent = eventRec.personInCharge;
            let i = "";
            for(let ensembleId in eventRec.participants) {
                let names = await getEnsembleFromRecords(ensembleId, ensembleRecords)
                if (names) {
                    i += names.name + ', ';
                }
            }
            row.insertCell().textContent = i.slice(0, -2);
        }
    }
}

async function getEnsembleRecords() {
    const ensemblesCollRef = db.collection("ensembles");
    let ensemblesQuerySnapshot = null;
    try {
        ensemblesQuerySnapshot = await ensemblesCollRef.get();
    } catch (e) {
        console.error(`Error when retrieving ensemble records: ${e}`);
        return null;
    }
    const ensemblesDocs = ensemblesQuerySnapshot.docs,
        ensembleRecords = ensemblesDocs.map(d => d.data());
    console.log(`${ensembleRecords.length} ensemble records retrieved.`);
    return ensembleRecords;
}

async function getEnsembleFromRecords(ensembleId, rec) {
    for( let i of rec) {
        if(i.ensembleId + "" === ensembleId + "") {
            return i;
        }
    }
}