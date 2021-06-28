/**
 * @fileOverview  Contains various view functions for the use case deleteBook
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.deleteBook = {
    setupUserInterface: async function () {
        const formEl = document.forms["Book"],
            deleteButton = formEl.commit,
            selectBookEl = formEl.selectBook;
        // load all book records
        const bookRecords = await Book.retrieveAll();
        for (const bookRec of bookRecords) {
            const optionEl = document.createElement("option");
            optionEl.text = bookRec.title;
            optionEl.value = bookRec.isbn;
            selectBookEl.add(optionEl, null);
        }
        // Set an event handler for the submit/delete button
        deleteButton.addEventListener("click",
            pl.v.deleteBook.handleDeleteButtonClickEvent);
    },
    // Event handler for deleting a book
    handleDeleteButtonClickEvent: async function () {
        const selectBookEl = document.forms['Book'].selectBook;
        const isbn = selectBookEl.value;
        if (isbn) {
            await Book.destroy(isbn);
            // remove deleted book from select options
            selectBookEl.remove(selectBookEl.selectedIndex);
        }
    }
}