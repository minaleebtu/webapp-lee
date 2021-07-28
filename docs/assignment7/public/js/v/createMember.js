/**
 * @fileOverview  View methods for the use case "create book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.createMember = {
    setupUserInterface: async function () {

        const 
            formEl = document.forms['Member'],
            saveButton = formEl.commit,
            selectInstrumentsEl = formEl.selectInstrument;

        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.createMember.handleSaveButtonClickEvent);


        // fill menu with instument enum elements
        for(let i in InstrumentEL) {
            let opt = i;
            let el = document.createElement("option");
            el.textContent = InstrumentEL[opt];
            el.value = InstrumentEL[opt];
            selectInstrumentsEl.appendChild(el);
        }

        /*
         *  input validation on change
         */
        
        // memberId
        formEl.memberId.addEventListener("input", async function() {
            const validationResult = await checkMemberIDasID(
                formEl.memberId.value
            );
            formEl.memberId.setCustomValidity(validationResult.message);
            formEl.memberId.reportValidity();
        });
        // name
        formEl.name.addEventListener("input", async function() {
            const validationResult = await validateMemberName(
                formEl.name.value
            );
            formEl.name.setCustomValidity(validationResult.message);
            formEl.name.reportValidity();
        });
        // mailAddress
        formEl.mailAddress.addEventListener("input", async function() {
            const validationResult = await validateMail(
                formEl.mailAddress.value
            );
            formEl.mailAddress.setCustomValidity(validationResult.message);
            formEl.mailAddress.reportValidity();
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
        await addMember(slots);
        formEl.reset();
    }
}