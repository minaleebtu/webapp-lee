/**
 * @fileOverview  View methods for the use case "update event"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.updateEvent = {
    setupUserInterface: async function () {

        const formEl = document.forms["Event"],
            updateButton = formEl.commit,
            selectEventEl = formEl.selectEvent,
            selectEventTypeEl = formEl.selectEventType,
            selectParticipants = formEl.participants;

        // load all event records
        const eventRecords = await retrieveAllEvents();
        for (const eventRec of eventRecords) {
            const optionEl = document.createElement("option");
            optionEl.text = eventRec.title;
            optionEl.value = eventRec.eventId;
            selectEventEl.add(optionEl, null);
        }

        // fill drop down menu with event enum elements
        for(let i in EventTypeEL) {

            let opt = i;
            let el = document.createElement("option");
            el.textContent = EventTypeEL[opt];
            el.value = EventTypeEL[opt];
            selectEventTypeEl.appendChild(el);
        }

        // fill other menu with possible participants
        const ensembleRecords = await retrieveAllEnsembles();
        for (const ensembleRec of ensembleRecords) {
            let el = document.createElement("option");
            el.textContent = ensembleRec.name;
            el.value = ensembleRec.ensembleId;
            selectParticipants.appendChild(el);
        }

        // when an event is selected, fill the form with its data
        selectEventEl.addEventListener("change", async function () {
            const eventId = selectEventEl.value;
            if (eventId) {
                // retrieve up-to-date event record
                const eventRec = await retrieveEvent(eventId);
                formEl.eventId.value = eventRec.eventId;
                formEl.selectEventType.value = eventRec.eventType; // todo
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
            eventType: formEl.selectEventType.value,
            title: formEl.title.value,
            date: formEl.date.value,
            description: formEl.description.value,
            personInCharge: formEl.personInCharge.value,
            participants: formEl.participants.value
        };
        await updateEvent(slots);
        // update the selection list option element
        selectEventEl.options[selectEventEl.selectedIndex].text = slots.title;
        formEl.reset();
    }
};

async function retrieveAllEnsembles() {
    const ensemblesCollRef = db.collection("ensembles");
    let ensemblesQuerySnapshot = null;
    try {
        ensemblesQuerySnapshot = await ensemblesCollRef.get();
    } catch (e) {
        console.error(`Error when retrieving ensemble records: ${e}`);
        return null;
    }
    const ensembleDocs = ensemblesQuerySnapshot.docs,
        ensembleRecords = ensembleDocs.map(d => d.data());
    console.log(`${ensembleRecords.length} ensemble records retrieved.`);
    return ensembleRecords;
}