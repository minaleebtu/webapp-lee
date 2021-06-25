/**
 * @fileOverview  View methods for the use case "update book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.updateBook = {
  setupUserInterface: async function () {
    const formEl = document.forms["Book"],
          updateButton = formEl.commit,
          selectBookEl = formEl.selectBook;
    // load all book records
    const bookRecords = await Book.retrieveAll();
    for (const bookRec of bookRecords) {
      const optionEl = document.createElement("option");
      optionEl.text = bookRec.title;
      optionEl.value = bookRec.isbn;
      selectBookEl.add( optionEl, null);
    }
    // when a book is selected, fill the form with its data
    selectBookEl.addEventListener("change", async function () {
      const isbn = selectBookEl.value;
      if (isbn) {
        // retrieve up-to-date book record
        const bookRec = await Book.retrieve( isbn);
        formEl.isbn.value = bookRec.isbn;
        formEl.title.value = bookRec.title;
        formEl.year.value = bookRec.year;
      } else {
        formEl.reset();
      }
    });
    // set an event handler for the submit/save button
    updateButton.addEventListener("click",
        pl.v.updateBook.handleSaveButtonClickEvent);
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  },
  // save data
  handleSaveButtonClickEvent: async function () {
    const formEl = document.forms["Book"],
          selectBookEl = formEl.selectBook;
    const slots = {
      isbn: formEl.isbn.value,
      title: formEl.title.value,
      year: formEl.year.value
    };
    await Book.update( slots);
    // update the selection list option element
    selectBookEl.options[selectBookEl.selectedIndex].text = slots.title;
    formEl.reset();
  }
};