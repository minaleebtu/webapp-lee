/**
 * @fileOverview  View methods for the use case "create book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.createEvent = {
    setupUserInterface: async function () {
        const formEl = document.forms['Event'],
            selectEventTypeEl = formEl.selectEventType;
            selectParticipants = formEl.participants
        const saveButton = document.forms['Event'].commit;
        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.createEvent.handleSaveButtonClickEvent);

        // fill menu with event enum elements
        for(var i in EventTypeEL) {
            // console.log("s");
            var opt = i;
            var el = document.createElement("option");
            el.textContent = EventTypeEL[opt];
            el.value = EventTypeEL[opt];
            selectEventTypeEl.appendChild(el);
        }

        const ensembleRecords = await retrieveAllEnsembles();
        // for each book, create a table row with a cell for each attribute
        for (const ensembleRec of ensembleRecords) {
            // console.log("s");
            var opt = i;
            var el = document.createElement("option");
            el.textContent = ensembleRec.name;
            el.value = ensembleRec.ensembleId;
            selectParticipants.appendChild(el);
        }
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
            console.log(slots.eventType);
        }
        const selParticipantsOptions = formEl.participants.selectedOptions;
        for (const opt of selParticipantsOptions) {
            var index = opt.value;
            slots.participants.push( index);
        }
        await Event.add(slots);
        formEl.reset();
    }
}

/**
 * Fill a select element with option elements created from an
 * map of objects
 *
 * @param {object} selectEl  A select(ion list) element
 * @param {object|array} selectionRange  A map of objects or an array
 * @param {string} keyProp [optional]  The standard identifier property
 * @param {object} optPar [optional]  A record of optional parameter slots
 *                 including optPar.displayProp and optPar.selection
 */
function fillSelectWithOptions(selectEl, selectionRange, keyProp, optPar) {
    let optionEl = null, displayProp = "";
    // delete old contents
    selectEl.innerHTML = "";
    // create "no selection yet" entry
    if (!selectEl.multiple) selectEl.add(createOption("", " --- "));
    // create option elements from object property values
    let options = Array.isArray(selectionRange) ? selectionRange : Object.keys(selectionRange);
    for (let i = 0; i < options.length; i++) {
        if (Array.isArray(selectionRange)) {
            optionEl = createOption(i, options[i]);
        } else {
            const key = options[i];
            const obj = selectionRange[key];
            if (!selectEl.multiple) obj.index = i + 1;  // store selection list index
            if (optPar && optPar.displayProp) displayProp = optPar.displayProp;
            else displayProp = keyProp;
            optionEl = createOption(key, obj[displayProp]);
            // if invoked with a selection argument, flag the selected options
            if (selectEl.multiple && optPar && optPar.selection &&
                optPar.selection[keyProp]) {
                // flag the option element with this value as selected
                optionEl.selected = true;
            }
        }
        selectEl.add(optionEl);
    }
}

async function retrieveAllEnsembles() {
    const ensemblesCollRef = db.collection("ensembles");
    var ensemblesQuerySnapshot = null;
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
};