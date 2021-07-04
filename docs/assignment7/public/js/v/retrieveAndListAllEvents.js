/**
 * @fileOverview  Contains various view functions for the use case listBooks
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.retrieveAndListAllEvent = {
    setupUserInterface: async function () {
        const tableBodyEl = document.querySelector("table#events>tbody");
        // load a list of all event records from Firestore
        const eventRecords = await Event.retrieveAll();
        // for each event, create a table row with a cell for each attribute
        for (const eventRec of eventRecords) {
            const row = tableBodyEl.insertRow();
            row.insertCell().textContent = eventRec.eventId;
            row.insertCell().textContent = eventRec.eventType;
            row.insertCell().textContent = eventRec.title;
            row.insertCell().textContent = eventRec.date;
            row.insertCell().textContent = eventRec.description;
            row.insertCell().textContent = eventRec.personInCharge;
            row.insertCell().textContent = eventRec.participants;
        }
    }
}