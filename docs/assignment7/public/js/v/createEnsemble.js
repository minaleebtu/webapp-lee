/**
 * @fileOverview  View methods for the use case "create book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.createEnsemble = {
    setupUserInterface: async function () {

        const
            formEl = document.forms['Ensemble'],
            saveButton = document.forms['Ensemble'].commit,
            selectMembers = formEl.members;

        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.createEnsemble.handleSaveButtonClickEvent);


        /*
         *  input validation on change
         */

        // ensembleId
        formEl.ensembleId.addEventListener("input", async function() {
            const validationResult = await checkEnsembleIDasID(
                formEl.ensembleId.value
            );
            formEl.ensembleId.setCustomValidity(validationResult.message);
        });
        // ensembleType
        formEl.ensembleType.addEventListener("input", async function() {
            const validationResult = await checkEnsembleType(
                formEl.ensembleType.value
            );
            formEl.ensembleType.setCustomValidity(validationResult.message);
        });
        // name
        formEl.name.addEventListener("input", async function() {
            const validationResult = await checkEnsembleName(
                formEl.name.value
            );
            formEl.name.setCustomValidity(validationResult.message);
        });

        // members
        formEl.members.addEventListener("input", async function() {

            const validationResult = await checkEnsembleMembers(
                formEl.members.value
            );
            formEl.members.setCustomValidity(validationResult.message);
        });

        // practicing location
        formEl.practicingLocation.addEventListener("input", async function() {
            const validationResult = await checkEnsembleLocation(
                formEl.practicingLocation.value
            );
            formEl.practicingLocation.setCustomValidity(validationResult.message);
        });

        // practicing date
        formEl.practicingDate.addEventListener("input", async function() {
            const validationResult = await checkEnsemblePracticingDate(
                formEl.practicingDate.value
            );
            formEl.practicingDate.setCustomValidity(validationResult.message);
        });

        // fill list of possible members
        const membersRecords = await retrieveAllMembers();
        for (const memberRec of membersRecords) {
            var opt = memberRec;
            var el = document.createElement("option");
            el.textContent = memberRec.name;
            el.value = memberRec.memberId;
            selectMembers.appendChild(el);
        }
    },
    // save user input data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['Ensemble'];
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
        // console.log(slots.members);
        
        await addEnsemble(slots);
        formEl.reset();
    }
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