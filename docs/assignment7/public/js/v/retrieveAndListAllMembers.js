/**
 * @fileOverview  Contains various view functions for the use case listBooks
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.retrieveAndListAllMember = {
    setupUserInterface: async function () {
        const tableBodyEl = document.querySelector("table#members>tbody");
        // load a list of all member records from Firestore
        const memberRecords = await retrieveAllMembers();
        // for each member, create a table row with a cell for each attribute
        for (const memberRec of memberRecords) {
            const row = tableBodyEl.insertRow();
            row.insertCell().textContent = memberRec.memberId;
            row.insertCell().textContent = memberRec.role;
            row.insertCell().textContent = memberRec.name;
            var i = "";
            // console.log(memberRec.name + " " + memberRec.instrument + " " + memberRec.instrument.length);
            for(var a of memberRec.instrument) { // a should be an int here!!!
                var meme = Object.values(InstrumentEL)[a];
                i += meme + ', ';
            }
            row.insertCell().textContent = i.slice(0, -2); // cut off last ', '
            row.insertCell().textContent = memberRec.mailAddress;
        }
    }
}

