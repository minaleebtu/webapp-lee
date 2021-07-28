/**
 * @fileOverview  View methods for the use case "create book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.createEnsemble = {
    setupUserInterface: async function () {

        const
            formEl = document.forms['Ensemble'],
            saveButton = document.forms['Ensemble'].commit,
            selectMembers = formEl.allMembers;

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
        formEl.allMembers.addEventListener("input", async function() {

            const validationResult = await checkEnsembleMembers(
                formEl.allMembers.value
            );
            formEl.allMembers.setCustomValidity(validationResult.message);
        });

        // fill list of possible members
        const membersRecords = await retrieveAllMembers();
        for (const memberRec of membersRecords) {
            let el = document.createElement("option");
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
            let index = opt.value;
            slots.members.push( index);
        }
        
        await addEnsemble(slots);
        formEl.reset();
    }
}