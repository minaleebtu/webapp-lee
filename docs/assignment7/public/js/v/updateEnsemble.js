/**
 * @fileOverview  View methods for the use case "update book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.updateEnsemble = {
  setupUserInterface: async function () {
    const formEl = document.forms["Ensemble"],
          updateButton = formEl.commit,
          selectEnsembleEl = formEl.selectEnsemble;
    // load all book records
    const ensembleRecords = await Ensemble.retrieveAll();
    for (const ensembleRec of ensembleRecords) {
      const optionEl = document.createElement("option");
      optionEl.text = ensembleRec.name;
      optionEl.value = ensembleRec.ensembleId;
      selectEnsembleEl.add( optionEl, null);
    }
    // when a book is selected, fill the form with its data
    selectEnsembleEl.addEventListener("change", async function () {
      const ensembleId = selectEnsembleEl.value;
      if (ensembleId) {
        // retrieve up-to-date book record
        const ensembleRec = await Ensemble.retrieve( ensembleId);
        formEl.ensembleId.value = ensembleRec.ensembleId;
        formEl.ensembleType.value = ensembleRec.ensembleType;
        formEl.member.value = ensembleRec.member;
        formEl.practicingLocation.value = ensembleRec.practicingLocation;
        formEl.practicingDate.value = ensembleRec.practicingDate;
      } else {
        formEl.reset();
      }
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
      ensembleId: formEl.ensembleId.value;
      ensembleType: formEl.ensembleType.value;
      member: formEl.member.value;
      practicingLocation: formEl.practicingLocation.value;
      practicingDate: formEl.practicingDate.value;
    };
    await Ensemble.update( slots);
    // update the selection list option element
    selectEnsembleEl.options[selectEnsembleEl.selectedIndex].text = slots.name;
    formEl.reset();
  }
};