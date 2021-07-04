/**
 * @fileOverview  View methods for the use case "update book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.updateEvent = {
    setupUserInterface: async function () {
        const formEl = document.forms["Event"],
            updateButton = formEl.commit,
            selectEventEl = formEl.selectEvent;
        // load all event records
        const eventRecords = await Event.retrieveAll();
        for (const eventRec of eventRecords) {
            const optionEl = document.createElement("option");
            optionEl.text = eventRec.title;
            optionEl.value = eventRec.eventId;
            selectEventEl.add(optionEl, null);
        }
        // when a book is selected, fill the form with its data
        selectEventEl.addEventListener("change", async function () {
            const eventId = selectEventEl.value;
            if (eventId) {
                // retrieve up-to-date book record
                const eventRec = await Event.retrieve(eventId);
                formEl.eventId.value = eventRec.eventId;
                formEl.eventType.value = eventRec.eventType;
                formEl.title.value = eventRec.title;
                formEl.date.value = eventRec.date;
                formEl.description.value = eventRec.description;
                formEl.personInCharge.value = eventRec.personInCharge;
                formEl.participants.value = eventRec.participants;
            } else {
                formEl.reset();
            }
        });
        // set an event handler for the submit/save button
        updateButton.addEventListener("click",
            pl.v.updateEvent.handleSaveButtonClickEvent);
        // neutralize the submit event
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
        });
    },
    // save data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms["Event"],
            selectEventEl = formEl.selectEvent;
        const slots = {
            eventId: formEl.eventId.value,
            eventType: formEl.eventType.value,
            title: formEl.title.value,
            date: formEl.date.value,
            description: formEl.description.value,
            personInCharge: formEl.personInCharge.value,
            participants: formEl.participants.value
        };
        await Event.update(slots);
        // update the selection list option element
        selectEventEl.options[selectEventEl.selectedIndex].text = slots.title;
        formEl.reset();
    }
};