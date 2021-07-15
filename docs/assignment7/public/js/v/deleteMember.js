/**
 * @fileOverview  Contains various view functions for the use case deleteBook
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.deleteMember = {
    setupUserInterface: async function () {
        const formEl = document.forms["Member"],
            deleteButton = formEl.commit,
            selectMemberEl = formEl.selectMember;
        // load all ensemble records
        const memberRecords = await retrieveAllMembers();
        for (const memberRec of memberRecords) {
            const optionEl = document.createElement("option");
            optionEl.text = memberRec.name;
            optionEl.value = memberRec.memberId;
            selectMemberEl.add(optionEl, null);
        }
        // Set an event handler for the submit/delete button
        deleteButton.addEventListener("click",
            pl.v.deleteMember.handleDeleteButtonClickEvent);
    },
    // Event handler for deleting a book
    handleDeleteButtonClickEvent: async function () {
        const selectMemberEl = document.forms['Member'].selectMember;
        const memberId = selectMemberEl.value;
        if (memberId) {
            await destroyMember(memberId);
            // remove deleted book from select options
            selectMemberEl.remove(selectMemberEl.selectedIndex);
        }
    }
}