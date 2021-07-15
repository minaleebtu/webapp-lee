/**
 * @fileOverview  Contains various view functions for the use case listBooks
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.retrieveAndListAllEvents = {
    setupUserInterface: async function () {
        const tableBodyEl = document.querySelector("table#events>tbody");
        // load a list of all event records from Firestore
        const eventRecords = await retrieveAllEvents();
        // for each event, create a table row with a cell for each attribute
        for (const eventRec of eventRecords) {
            const row = tableBodyEl.insertRow();
            row.insertCell().textContent = eventRec.eventId;
            row.insertCell().textContent = Object.values(EventTypeEL)[eventRec.eventType];
            row.insertCell().textContent = eventRec.title;
            row.insertCell().textContent = eventRec.date;
            row.insertCell().textContent = eventRec.description;
            row.insertCell().textContent = eventRec.personInCharge;
            var i = "";
            for(var a in eventRec.participants) {
                var meme = await getEnsemblefromID(a);
                i += meme.name + ', ';
            }
            row.insertCell().textContent = i;
        }
    }
}

async function getEnsemblefromID(ensembleId) {
    const ensemblesCollRef = db.collection("ensembles");
    var ensemblesQuerySnapshot = null;
    try {
        ensemblesQuerySnapshot = await ensemblesCollRef.get();
    } catch (e) {
        console.error(`Error when retrieving ensemble records: ${e}`);
        return null;
    }
    const ensembleDocs = ensemblesQuerySnapshot.docs,
        ensembleRecords = ensembleDocs.map(d => d.data());
    console.log(`${ensembleRecords.length} ensemble records retrieved.`);
    for( var i of ensembleRecords) {
        if(i.ensembleId == ensembleId) {
            return i;
        }
    };
    return 0;
}