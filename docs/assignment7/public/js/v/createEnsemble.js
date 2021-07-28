/**
 * @fileOverview  View methods for the use case "create ensemble"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.createEnsemble = {
    setupUserInterface: async function () {

        const
            formEl = document.forms['Ensemble'],
            saveButton = document.forms['Ensemble'].commit;

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
            formEl.ensembleId.reportValidity();
        });
        // ensembleType
        formEl.ensembleType.addEventListener("input", async function() {
            const validationResult = await checkEnsembleType(
                formEl.ensembleType.value
            );
            formEl.ensembleType.setCustomValidity(validationResult.message);
            formEl.ensembleType.reportValidity();
        });
        // name
        formEl.name.addEventListener("input", async function() {
            const validationResult = await checkEnsembleName(
                formEl.name.value
            );
            formEl.name.setCustomValidity(validationResult.message);
            formEl.name.reportValidity();
        });

        // members
        /*
        formEl.allMembers.addEventListener("input", async function() {

            const validationResult = await checkEnsembleMembers(
                formEl.allMembers.value
            );
            formEl.allMembers.setCustomValidity(validationResult.message);
            formEl.allMembers.reportValidity();
        });
        */

        // fill list of possible members
        const membersRecords = await retrieveAllMembers();
        /*
        for (const memberRec of membersRecords) {
            let el = document.createElement("option");
            el.textContent = memberRec.name;
            el.value = memberRec.memberId;
            selectMembers.appendChild(el);
        }
        */



        const selectMembersWidget = formEl.querySelector(".MultiSelectionWidget");
        createMultiSelectionWidget( selectMembersWidget, [],
            membersRecords, "memberId", "name", 100);
        // widget, preselection, options, key, display, minimum count of selected entries

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

        const selMembersOptions = formEl.allMembers.selectedOptions;
        for (const opt of selMembersOptions) {
            let index = opt.value;
            slots.members.push( index);
        }
        
        await addEnsemble(slots);
        formEl.reset();
    }
}