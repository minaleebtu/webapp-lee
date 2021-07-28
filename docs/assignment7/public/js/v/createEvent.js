/**
 * @fileOverview  View methods for the use case "create event"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.createEvent = {
    setupUserInterface: async function () {
        
        const formEl = document.forms['Event'],
            saveButton = document.forms['Event'].commit,
            selectEventTypeEl = formEl.selectEventType,
            selectParticipants = formEl.participants;
        
        // console.log(formEl);
        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.createEvent.handleSaveButtonClickEvent);

        // fill drop down menu with event enum elements
        for(let i in EventTypeEL) {
            let el = document.createElement("option");
            el.textContent = EventTypeEL[i];
            el.value = EventTypeEL[i];
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

        /*
         *  input validation on change
         */

        // eventId
        formEl.eventId.addEventListener("input", async function() {
            const validationResult = await checkEventIDasID(
                formEl.eventId.value
            );
            formEl.eventId.setCustomValidity(validationResult.message);
            formEl.eventId.reportValidity();
        });

        // eventType has implicit input validation

        // title
        formEl.title.addEventListener("input", async function() {
            const validationResult = await checkEventTitle(
                formEl.title.value
            );
            formEl.title.setCustomValidity(validationResult.message);
            formEl.title.reportValidity();
        });
    },
    // save user input data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['Event'];

        const slots = {
            eventId: formEl.eventId.value,
            title: formEl.title.value,
            date: formEl.date.value,
            description: formEl.description.value,
            personInCharge: formEl.personInCharge.value,
            participants: []
        };

        let et = formEl.selectEventType.value;
        if (et) {
            slots.eventType = Object.values(EventTypeEL).indexOf(et);
        }

        const selParticipantsOptions = formEl.participants.selectedOptions;
        for (const opt of selParticipantsOptions) {
            var index = opt.value;
            slots.participants.push( index);
        }

        await addEvent(slots);
        formEl.reset();
    }
}