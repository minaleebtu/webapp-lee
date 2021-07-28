/**
 * @fileOverview  Contains various view functions for the use case listBooks
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.retrieveAndListAllEnsembles = {
    setupUserInterface: async function () {
        const tableBodyEl = document.querySelector("table#ensembles>tbody");
        // load a list of all member records from Firestore
        const ensembleRecords = await retrieveAllEnsembles();
        // for each member, create a table row with a cell for each attribute

        const memberRecords = await getMemberRecords();

        for (const ensembleRec of ensembleRecords) {
            const row = tableBodyEl.insertRow();
            row.insertCell().textContent = ensembleRec.ensembleId;
            row.insertCell().textContent = ensembleRec.ensembleType;
            row.insertCell().textContent = ensembleRec.name;
            let i = "";
            for(let memberId of ensembleRec.allMembers) {

                let m = await getMemberFromRecords(memberId, memberRecords);

                if (m) {
                    i += m.name + ', ';
                }
            }
            row.insertCell().textContent = i.slice(0, -2); // cut off last ', '
            row.insertCell().textContent = ensembleRec.practicingLocation;
            row.insertCell().textContent = ensembleRec.practicingDate;
        }
    }
}

async function getMemberRecords() {
    const membersCollRef = db.collection("members");
    let membersQuerySnapshot = null;
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
        if(i.memberId + "" === memberId + "") {
            return i;
        }
    };
}
