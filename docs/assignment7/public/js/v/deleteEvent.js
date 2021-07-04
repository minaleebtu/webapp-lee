/**
 * @fileOverview  Contains various view functions for the use case deleteBook
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.deleteEvent = {
    setupUserInterface: async function () {
        const formEl = document.forms["Event"],
            deleteButton = formEl.commit,
            selectEventEl = formEl.selectEvent;
        // load all ensemble records
        const eventRecords = await Event.retrieveAll();
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
    // Event handler for deleting a book
    handleDeleteButtonClickEvent: async function () {
        const selectEventEl = document.forms['Event'].selectEvent;
        const eventId = selectEventEl.value;
        if (eventId) {
            await Event.destroy(eventId);
            // remove deleted book from select options
            selectEventEl.remove(selectEnsembleEl.selectedIndex);
        }
    }
}