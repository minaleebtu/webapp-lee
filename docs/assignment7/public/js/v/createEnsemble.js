/**
 * @fileOverview  View methods for the use case "create book"
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


        // fill list of possible members
        const membersRecords = await retrieveAllMembers();

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
            allMembers: [],
            practicingLocation: formEl.practicingLocation.value,
            practicingDate: formEl.practicingDate.value
        };

        // console.log(formEl);
        const d = document.querySelector("form");
        const selMembersOptions = d.querySelector(".MultiSelectionWidget").firstElementChild;

        console.log(selMembersOptions);
        console.log(selMembersOptions.textContent);

        /*
        for (const opt of selMembersOptions) {
            let index = opt.value;
            slots.allMembers.push( index);
        }
        */
        // slots.allMembers.push(
        
        await addEnsemble(slots);
        formEl.reset();
    }
}