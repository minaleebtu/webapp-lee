/**
 * @fileOverview  Contains various view functions for the use case deleteEvent
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.deleteEvent = {
    setupUserInterface: async function () {
        const formEl = document.forms["Event"],
            deleteButton = formEl.commit,
            selectEventEl = formEl.selectEvent;
        // load all event records
        const eventRecords = await retrieveAllEvents();
        for (const eventRec of eventRecords) {
            const optionEl = document.createElement("option");
            optionEl.text = eventRec.title;
            optionEl.value = eventRec.eventId;
            selectEventEl.add(optionEl, null);
        }
        // Set an event handler for the submit/delete button
        deleteButton.addEventListener("click",
            pl.v.deleteEvent.handleDeleteButtonClickEvent);
    },
    // Event handler for deleting a event
    handleDeleteButtonClickEvent: async function () {
        const selectEventEl = document.forms['Event'].selectEvent;
        const eventId = selectEventEl.value;
        if (eventId) {
            await destroyEvent(eventId);
            // remove deleted event from select options
            selectEventEl.remove(selectEventEl.selectedIndex);
        }
    }
}