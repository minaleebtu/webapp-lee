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
        const memberRecords = await retrieveAllMembers();
        for (const memberRec of memberRecords) {
            const optionEl = document.createElement("option");
            optionEl.text = memberRec.name;
            optionEl.value = memberRec.memberId;
            selectMemberEl.add(optionEl, null);
        }

        // fill menu with instument enum elements
        for(let i in InstrumentEL) {
            let opt = i;
            let el = document.createElement("option");
            el.textContent = InstrumentEL[opt];
            el.value = InstrumentEL[opt];
            selectInstrumentsEl.appendChild(el);
        }

        // when a member is selected, fill the form with its data
        selectMemberEl.addEventListener("change", async function () {
            const memberId = selectMemberEl.value;
            if (memberId) {
                // retrieve up-to-date member record
                const memberRec = await retrieveMember(memberId);
                formEl.memberId.value = memberRec.memberId;
                formEl.role.value = memberRec.role;
                formEl.name.value = memberRec.name;
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
            const validationResult = await validateMemberName(
                formEl.name.value
            );
            formEl.name.setCustomValidity(validationResult.message);
        });
        // mailAddress
        formEl.mailAddress.addEventListener("input", async function() {
            const validationResult = await validateMail(
                formEl.mailAddress.value
            );
            formEl.mailAddress.setCustomValidity(validationResult.message);
        });

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
            instrument: [],
            mailAddress: formEl.mailAddress.value
        };

        const selInstrumentOptions = formEl.selectInstrument.selectedOptions;
        for (const opt of selInstrumentOptions) {
            var index = Object.values(InstrumentEL).indexOf(opt.value);
            slots.instrument.push( index);
        }

        await updateMember(slots);
        // update the selection list option element
        selectMemberEl.options[selectMemberEl.selectedIndex].text = slots.title;
        formEl.reset();
    }
};