/**
 * @fileOverview  Contains various view functions for the use case listBooks
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.retrieveAndListAllBooks = {
  setupUserInterface: async function () {
    const tableBodyEl = document.querySelector("table#books>tbody");
    // load a list of all book records from Firestore
    const bookRecords = await Book.retrieveAll();
    // for each book, create a table row with a cell for each attribute
    for (const bookRec of bookRecords) {
      const row = tableBodyEl.insertRow();
      row.insertCell().textContent = bookRec.isbn;
      row.insertCell().textContent = bookRec.title;
      row.insertCell().textContent = bookRec.year;
    }
  }
}