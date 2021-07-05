/**
 * @fileOverview  Contains various view functions for the use case listBooks
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.retrieveAndListAllMember = {
    setupUserInterface: async function () {
        const tableBodyEl = document.querySelector("table#members>tbody");
        // load a list of all member records from Firestore
        const memberRecords = await Member.retrieveAll();
        // for each member, create a table row with a cell for each attribute
        for (const memberRec of memberRecords) {
            const row = tableBodyEl.insertRow();
            row.insertCell().textContent = memberRec.memberId;
            row.insertCell().textContent = memberRec.role;
            row.insertCell().textContent = memberRec.name;
            row.insertCell().textContent = memberRec.instrument;
            row.insertCell().textContent = memberRec.mailAddress;
        }
    }
}