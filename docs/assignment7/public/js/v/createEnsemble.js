/**
 * @fileOverview  View methods for the use case "create book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.createEnsemble = {
    setupUserInterface: function () {
        const saveButton = document.forms['Ensemble'].commit;
        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.createEnsemble.handleSaveButtonClickEvent);
    },
    // save user input data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['Ensemble'];
        const slots = {
            ensembleId: formEl.ensembleId.value,
            ensembleType: formEl.ensembleType.value,
            name: formEl.name.value,
            member: formEl.member.value,
            practicingLocation: formEl.practicingLocation.value,
            practicingDate: formEl.practicingDate.value
        };
        await Ensemble.add(slots);
        formEl.reset();
    }
}