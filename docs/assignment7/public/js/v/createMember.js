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
        const selectInstrumentsEl = formEl.selectInstrument;

        for(var i in InstrumentEL) {
            console.log("s");
            var opt = i;
            var el = document.createElement("option");
            el.textContent = InstrumentEL[opt];
            el.value = InstrumentEL[opt];
            //el.setAttribute('value', InstrumentEL[i].value);
            //el.appendChild(document.createTextNode(InstrumentEL[i].value));
            selectInstrumentsEl.appendChild(el);
        }

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
            instrument: [],
            mailAddress: formEl.mailAddress.value
        };

        const selInstrumentOptions = formEl.selectInstrument.selectedOptions;
        for (const opt of selInstrumentOptions) {
            var index = Object.values(InstrumentEL).indexOf(opt.value);
            slots.instrument.push( index);
        }
        await Member.add(slots);
        formEl.reset();
    }
}