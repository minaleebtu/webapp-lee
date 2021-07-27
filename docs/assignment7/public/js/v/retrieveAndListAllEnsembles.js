/**
 * @fileOverview  Contains various view functions for the use case listBooks
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.retrieveAndListAllEnsembles = {
    setupUserInterface: async function () {
        const tableBodyEl = document.querySelector("table#ensembles>tbody");
        // load a list of all book records from Firestore
        const ensembleRecords = await retrieveAllEnsembles();
        // for each book, create a table row with a cell for each attribute

        const memberRecords = await getMemberRecords();

        for (const ensembleRec of ensembleRecords) {
            const row = tableBodyEl.insertRow();
            row.insertCell().textContent = ensembleRec.ensembleId;
            row.insertCell().textContent = ensembleRec.ensembleType;
            row.insertCell().textContent = ensembleRec.name;
            var i = "";
            for(var memberId of ensembleRec.members) {
                var meme = await getMemberFromRecords(memberId, memberRecords);
                if (meme) {
                    i += meme.name + ', ';
                }
            }
            row.insertCell().textContent = i.slice(0, -2); // cut off last ', '

            row.insertCell().textContent = ensembleRec.member;
            row.insertCell().textContent = ensembleRec.practicingLocation;
            row.insertCell().textContent = ensembleRec.practicingDate;
        }
    }
}

async function getMemberRecords() {
    const membersCollRef = db.collection("members");
    var membersQuerySnapshot = null;
    try {
        membersQuerySnapshot = await membersCollRef.get();
    } catch (e) {
        console.error(`Error when retrieving member records: ${e}`);
        return null;
    }
    const membersDocs = membersQuerySnapshot.docs,
        memberRecords = membersDocs.map(d => d.data());
    console.log(`${memberRecords.length} member records retrieved.`);
    return memberRecords;
}

async function getMemberFromRecords(memberId, rec) {
    for( var i of rec) {
        if(i.memberId == memberId) {
            return i;
        }
    };
}
