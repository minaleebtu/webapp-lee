/**
 * @fileOverview  Contains various view functions for the use case listBooks
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.retrieveAndListAllEnsembles = {
    setupUserInterface: async function () {
        const tableBodyEl = document.querySelector("table#ensembles>tbody");
        // load a list of all book records from Firestore
        const ensembleRecords = await Ensemble.retrieveAll();
        // for each book, create a table row with a cell for each attribute
        for (const ensembleRec of ensembleRecords) {
            const row = tableBodyEl.insertRow();
            row.insertCell().textContent = ensembleRec.ensembleId;
            row.insertCell().textContent = ensembleRec.ensembleType;
            row.insertCell().textContent = ensembleRec.name;
            row.insertCell().textContent = ensembleRec.member;
            row.insertCell().textContent = ensembleRec.practicingLocation;
            row.insertCell().textContent = ensembleRec.practicingDate;
        }
    }
}