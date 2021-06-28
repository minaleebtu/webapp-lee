/**
 * @fileOverview  Contains various view functions for the use case deleteBook
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.deleteEnsemble = {
  setupUserInterface: async function () {
    const formEl = document.forms["Ensemble"],
          deleteButton = formEl.commit,
          selectEnsembleEl = formEl.selectEnsemble;
    // load all book records
    const ensembleRecords = await Ensemble.retrieveAll();
    for (const ensembleRec of ensembleRecords) {
      const optionEl = document.createElement("option");
      optionEl.text = ensembleRec.name;
      optionEl.value = ensembleRec.ensembleId;
      selectEnsembleEl.add( optionEl, null);
    }
    // Set an event handler for the submit/delete button
    deleteButton.addEventListener("click",
        pl.v.deleteEnsemble.handleDeleteButtonClickEvent);
  },
  // Event handler for deleting a book
  handleDeleteButtonClickEvent: async function () {
    const selectEnsembleEl = document.forms['Ensemble'].selectEnsemble;
    const ensembleId = selectEnsembleEl.value;
    if (ensembleId) {
      await Book.destroy( ensembleId);
      // remove deleted book from select options
      selectEnsembleEl.remove( selectEnsembleEl.selectedIndex);
    }
  }
}