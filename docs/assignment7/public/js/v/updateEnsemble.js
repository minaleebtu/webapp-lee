/**
 * @fileOverview  View methods for the use case "update book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.updateEnsemble = {
    setupUserInterface: async function () {
        
        const formEl = document.forms["Ensemble"],
            updateButton = formEl.commit,
            selectEnsembleEl = formEl.selectEnsemble,
            selectMembers = formEl.allMembers;
        
        // load all ensemble records
        const ensembleRecords = await retrieveAllEnsembles();
        for (const ensembleRec of ensembleRecords) {
            const optionEl = document.createElement("option");
            optionEl.text = ensembleRec.name;
            optionEl.value = ensembleRec.ensembleId;
            selectEnsembleEl.add(optionEl, null);
        }

        // fill list of possible members
        const membersRecords = await retrieveAllMembers();
        /*
        for (const memberRec of membersRecords) {
            let el = document.createElement("option");
            el.textContent = memberRec.name;
            el.value = memberRec.memberId;
            selectMembers.appendChild(el);
        }
        */
        const selectMembersWidget = formEl.querySelector(".MultiSelectionWidget");
        createMultiSelectionWidget( selectMembersWidget, [],
            membersRecords, "memberId", "name", 1);
        
        // when an ensemble is selected, fill the form with its data
        selectEnsembleEl.addEventListener("change", async function () {
            const ensembleId = selectEnsembleEl.value;
            if (ensembleId) {
                // retrieve up-to-date ensemble record
                const ensembleRec = await retrieveEnsemble(ensembleId);
                formEl.ensembleId.value = ensembleRec.ensembleId;
                formEl.ensembleType.value = ensembleRec.ensembleType;
                formEl.name.value = ensembleRec.name;
                formEl.practicingLocation.value = ensembleRec.practicingLocation;
                formEl.practicingDate.value = ensembleRec.practicingDate;


                const c = [];
                for (const i of membersRecords) {
                    if (ensembleRec.members[i.memberId]) {
                        c.push(i);
                    }
                }
                createMultiSelectionWidget(selectMembersWidget, c,
                    membersRecords, "memberId", "name", 100);

            } else {
                formEl.reset();
            }
        });

        formEl.ensembleId.addEventListener("input", async function() {
            const validationResult = await checkEnsembleIDasID(
                formEl.ensembleId.value
            );
            formEl.ensembleId.setCustomValidity(validationResult.message);
            formEl.ensembleId.reportValidity();
        });
        formEl.ensembleType.addEventListener("input", async function() {
            const validationResult = await checkEnsembleType(
                formEl.ensembleType.value
            );
            formEl.ensembleType.setCustomValidity(validationResult.message);
            formEl.ensembleType.reportValidity();
        });
        // name
        formEl.name.addEventListener("input", async function() {
            const validationResult = await checkEnsembleName(
                formEl.name.value
            );
            formEl.name.setCustomValidity(validationResult.message);
            formEl.name.reportValidity();
        });

        // members
        console.log(formEl);
        formEl.allMembers.addEventListener("input", async function() {

            const validationResult = await checkEnsembleMembers(
                formEl.allMembers.value
            );
            formEl.allMembers.setCustomValidity(validationResult.message);
            formEl.allMembers.reportValidity();
        });
        // set an event handler for the submit/save button
        updateButton.addEventListener("click",
            pl.v.updateEnsemble.handleSaveButtonClickEvent);

        // neutralize the submit event
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
        });
    },
    // save data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms["Ensemble"],
            selectEnsembleEl = formEl.selectEnsemble;
        const slots = {
            ensembleId: formEl.ensembleId.value,
            ensembleType: formEl.ensembleType.value,
            name: formEl.name.value,
            allMembers: [],
            practicingLocation: formEl.practicingLocation.value,
            practicingDate: formEl.practicingDate.value
        };

        const selMembersOptions = formEl.allMembers.selectedOptions;
        for (const opt of selMembersOptions) {
            let index = opt.value;
            slots.allMembers.push( index);
        }

        await updateEnsemble(slots);
        // update the selection list option element
        selectEnsembleEl.options[selectEnsembleEl.selectedIndex].text = slots.name;
        formEl.reset();
    }
};