/**
 * @fileOverview  View methods for the use case "create book"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.createBook = {
    setupUserInterface: function () {
        const saveButton = document.forms['Book'].commit;
        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.createBook.handleSaveButtonClickEvent);
    },
    // save user input data
    handleSaveButtonClickEvent: async function () {
        const formEl = document.forms['Book'];
        const slots = {
            isbn: formEl.isbn.value,
            title: formEl.title.value,
            year: formEl.year.value
        };
        await Book.add(slots);
        formEl.reset();
    }
}