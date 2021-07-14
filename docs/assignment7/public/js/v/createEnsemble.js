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
            const validationResult = await Ensemble.checkIDasID(
                formEl.ensembleId.value
            );
            formEl.ensembleId.setCustomValidity(validationResult.message);
        });
        // ensembleType
        formEl.ensembleType.addEventListener("input", async function() {
            const validationResult = await Ensemble.checkType(
                formEl.ensembleType.value
            );
            formEl.ensembleType.setCustomValidity(validationResult.message);
        });
        // name
        formEl.name.addEventListener("input", async function() {
            const validationResult = await Ensemble.checkName(
                formEl.name.value
            );
            formEl.name.setCustomValidity(validationResult.message);
        });

        // members
        formEl.members.addEventListener("input", async function() {

            const validationResult = await Ensemble.checkMembers(
                formEl.members.value
            );
            formEl.members.setCustomValidity(validationResult.message);
        });

        // practicing location
        formEl.practicingLocation.addEventListener("input", async function() {
            const validationResult = await Ensemble.checkLocation(
                formEl.practicingLocation.value
            );
            formEl.practicingLocation.setCustomValidity(validationResult.message);
        });

        // practicing date
        formEl.practicingDate.addEventListener("input", async function() {
            const validationResult = await Ensemble.checkPracticingDate(
                formEl.practicingDate.value
            );
            formEl.practicingDate.setCustomValidity(validationResult.message);
        });


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