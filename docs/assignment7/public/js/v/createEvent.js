/**
 * @fileOverview  View methods for the use case "create book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.createEvent = {
    setupUserInterface: function () {
        const saveButton = document.forms['Event'].commit;
        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.createEvent.handleSaveButtonClickEvent);
    },
    // save user input data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['Event'];
        const slots = {
            eventId: formEl.eventId.value,
            eventType: formEl.eventType.value,
            title: formEl.title.value,
            date: formEl.date.value,
            description: formEl.description.value,
            personInCharge: formEl.personInCharge.value,
            participants: formEl.participants.value
        };
        await Event.add(slots);
        formEl.reset();
    }
}