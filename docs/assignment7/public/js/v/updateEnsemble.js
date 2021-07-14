/**
 * @fileOverview  View methods for the use case "update book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.updateEnsemble = {
    setupUserInterface: async function () {
        
        const formEl = document.forms["Ensemble"],
            updateButton = formEl.commit,
            selectEnsembleEl = formEl.selectEnsemble,
            selectMembers = formEl.members;
        
        // load all ensemble records
        const ensembleRecords = await Ensemble.retrieveAll();
        for (const ensembleRec of ensembleRecords) {
            const optionEl = document.createElement("option");
            optionEl.text = ensembleRec.name;
            optionEl.value = ensembleRec.ensembleId;
            selectEnsembleEl.add(optionEl, null);
        }

        // fill list of possible members
        const membersRecords = await retrieveAllMembers();
        for (const memberRec of membersRecords) {
            var opt = memberRec;
            var el = document.createElement("option");
            el.textContent = memberRec.name;
            el.value = memberRec.memberId;
            selectMembers.appendChild(el);
        }
        
        // when an ensemble is selected, fill the form with its data
        selectEnsembleEl.addEventListener("change", async function () {
            const ensembleId = selectEnsembleEl.value;
            if (ensembleId) {
                // retrieve up-to-date book record
                const ensembleRec = await Ensemble.retrieve(ensembleId);
                formEl.ensembleId.value = ensembleRec.ensembleId;
                formEl.ensembleType.value = ensembleRec.ensembleType;
                formEl.name.value = ensembleRec.name;

                // members
                /*
                var i = "";
                for(var a of ensembleRec.members) {
                    var meme = await getMemberfromID(a);
                    i += meme.name + ', ';
                }
                formEl.member.value = i.slice(0, -2); // cut off last ', '
                */

                formEl.practicingLocation.value = ensembleRec.practicingLocation;
                formEl.practicingDate.value = ensembleRec.practicingDate;
            } else {
                formEl.reset();
            }
        });
        // set an event handler for the submit/save button
        updateButton.addEventListener("click",
            pl.v.updateEnsemble.handleSaveButtonClickEvent);
        // neutralize the submit event
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
        });
    },
    // save data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms["Ensemble"],
            selectEnsembleEl = formEl.selectEnsemble;
        const slots = {
            ensembleId: formEl.ensembleId.value,
            ensembleType: formEl.ensembleType.value,
            name: formEl.name.value,
            members: [],
            practicingLocation: formEl.practicingLocation.value,
            practicingDate: formEl.practicingDate.value
        };

        const selMembersOptions = formEl.members.selectedOptions;
        for (const opt of selMembersOptions) {
            var index = opt.value;
            slots.members.push( index);
        }

        await Ensemble.update(slots);
        // update the selection list option element
        selectEnsembleEl.options[selectEnsembleEl.selectedIndex].text = slots.name;
        formEl.reset();
    }
};

async function getMemberfromID(memberId) {
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
    for( var i of memberRecords) {
        // console.log(i.memberId + "vs." + memberId);
        if(i.memberId == memberId) {
            return i;
        }
    };
    return 0;
}

async function retrieveAllMembers() {
    const membersCollRef = db.collection("members");
    var membersQuerySnapshot = null;
    try {
        membersQuerySnapshot = await membersCollRef.get();
    } catch (e) {
        console.error(`Error when retrieving member records: ${e}`);
        return null;
    }
    const memberDocs = membersQuerySnapshot.docs,
        memberRecords = memberDocs.map(d => d.data());
    console.log(`${memberRecords.length} member records retrieved.`);
    return memberRecords;
};