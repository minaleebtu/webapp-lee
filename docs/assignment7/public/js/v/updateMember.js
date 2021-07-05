/**
 * @fileOverview  View methods for the use case "update book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.updateMember = {
    setupUserInterface: async function () {
        const formEl = document.forms["Member"],
            updateButton = formEl.commit,
            selectMemberEl = formEl.selectMember;
        // load all member records
        const memberRecords = await Member.retrieveAll();
        for (const memberRec of memberRecords) {
            const optionEl = document.createElement("option");
            optionEl.text = memberRec.name;
            optionEl.value = memberRec.memberId;
            selectMemberEl.add(optionEl, null);
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
                formEl.instrument.value = memberRec.instrument;
                formEl.mailAddress.value = memberRec.mailAddress;
            } else {
                formEl.reset();
            }
        });
        // set an event handler for the submit/save button
        updateButton.addEventListener("click",
            pl.v.updateMember.handleSaveButtonClickEvent);
        // neutralize the submit member
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
        });
    },
    // save data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms["Member"],
            selectMemberEl = formEl.selectMember;
        const slots = {
            memberId: formEl.memberId.value,
            role: formEl.role.value,
            name: formEl.name.value,
            instrument: formEl.instrument.value,
            mailAddress: formEl.mailAddress.value
        };
        await Member.update(slots);
        // update the selection list option element
        selectMemberEl.options[selectMemberEl.selectedIndex].text = slots.title;
        formEl.reset();
    }
};