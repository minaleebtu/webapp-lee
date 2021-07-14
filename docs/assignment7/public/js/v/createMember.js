/**
 * @fileOverview  View methods for the use case "create book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.createMember = {
    setupUserInterface: async function () {

        const 
            formEl = document.forms['Member']
            saveButton = formEl.commit,
            selectInstrumentsEl = formEl.selectInstrument;

        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.createMember.handleSaveButtonClickEvent);


        // fill menu with instument enum elements
        for(var i in InstrumentEL) {
            var opt = i;
            var el = document.createElement("option");
            el.textContent = InstrumentEL[opt];
            el.value = InstrumentEL[opt];
            selectInstrumentsEl.appendChild(el);
        }

        /*
         *  input validation on change
         */
        
        // memberId
        formEl.memberId.addEventListener("input", async function() {
            const validationResult = await Member.checkIDasID(
                formEl.memberId.value
            );
            formEl.memberId.setCustomValidity(validationResult.message);
        });
        // name
        formEl.name.addEventListener("input", async function() {
            const validationResult = await Member.validateName(
                formEl.name.value
            );
            formEl.name.setCustomValidity(validationResult.message);
        });
        // mailAddress
        formEl.mailAddress.addEventListener("input", async function() {
            const validationResult = await Member.validateMail(
                formEl.mailAddress.value
            );
            formEl.mailAddress.setCustomValidity(validationResult.message);
        });

        // roles - check if role string separated by comma?
        /*
        formEl.roles.addEventListener("input", async function() {

            const validationResult = await Member.validateMail(
                formEl.roles.value
            );
            formEl.roles.setCustomValidity(validationResult.message);
        });
        */

        // instrument - check here constraint that you can't choose NONE and something else?
        /*
        formEl.mailAddress.addEventListener("input", async function() {
            const validationResult = await Member.validateMail(
                formEl.mailAddress.value
            );
            formEl.mailAddress.setCustomValidity(validationResult.message);
        });
        */

        
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