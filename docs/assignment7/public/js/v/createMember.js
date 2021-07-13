/**
 * @fileOverview  View methods for the use case "create book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.createMember = {
    setupUserInterface: async function () {
        const saveButton = document.forms['Member'].commit;
        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.createMember.handleSaveButtonClickEvent);

        const formEl = document.forms['Member'];

        formEl.memberId.addEventListener("input", async function() {
            const validationResult = await Member.checkIDasID(
                formEl.memberId.value
            );
            formEl.memberId.setCustomValidity(validationResult.message);
        });


    },
    // save user input data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['Member'];
        const slots = {
            memberId: formEl.memberId.value,
            role: formEl.role.value,
            name: formEl.name.value,
            instrument: formEl.instrument.value,
            mailAddress: formEl.mailAddress.value
        };
        await Member.add(slots);
        formEl.reset();
    }
}