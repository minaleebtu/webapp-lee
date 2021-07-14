/**
 * @fileOverview  View methods for the use case "update book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.updateMember = {
    setupUserInterface: async function () {

        const formEl = document.forms["Member"],
            updateButton = formEl.commit,
            selectMemberEl = formEl.selectMember,
            selectInstrumentsEl = formEl.selectInstrument;

        // load all member records
        const memberRecords = await Member.retrieveAll();
        for (const memberRec of memberRecords) {
            const optionEl = document.createElement("option");
            optionEl.text = memberRec.name;
            optionEl.value = memberRec.memberId;
            selectMemberEl.add(optionEl, null);
        }

        // fill menu with instument enum elements
        for(var i in InstrumentEL) {
            // console.log("s");
            var opt = i;
            var el = document.createElement("option");
            el.textContent = InstrumentEL[opt];
            el.value = InstrumentEL[opt];
            //el.setAttribute('value', InstrumentEL[i].value);
            //el.appendChild(document.createTextNode(InstrumentEL[i].value));
            selectInstrumentsEl.appendChild(el);
        }

        // when a member is selected, fill the form with its data
        selectMemberEl.addEventListener("change", async function () {
            const memberId = selectMemberEl.value;
            if (memberId) {
                // retrieve up-to-date member record
                const memberRec = await Member.retrieve(memberId);
                formEl.memberId.value = memberRec.memberId;
                formEl.role.value = memberRec.role;
                formEl.name.value = memberRec.name;
                formEl.selectInstrument.value = memberRec.instrument;
                formEl.mailAddress.value = memberRec.mailAddress;
            } else {
                formEl.reset();
            }
        });

        /*
         *  input validation on change
         */
        // memberId can't be changed
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


        // set an event handler for the submit/save button
        updateButton.addEventListener("click",
            pl.v.updateMember.handleSaveButtonClickEvent);

        // neutralize the submit member
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
        });

    },
    
    // save user input data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms["Member"],
            selectMemberEl = formEl.selectMember;
        const slots = {
            memberId: formEl.memberId.value,
            role: formEl.role.value,
            name: formEl.name.value,
            instrument: formEl.selectInstrument.value,
            mailAddress: formEl.mailAddress.value
        };
        await Member.update(slots);
        // update the selection list option element
        selectMemberEl.options[selectMemberEl.selectedIndex].text = slots.title;
        formEl.reset();
    }
};