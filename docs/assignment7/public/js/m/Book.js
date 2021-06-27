/**
 * @fileOverview  The model class Book with attribute definitions and storage management methods
 * @authors Gerd Wagner & Juan-Francisco Reyes
 * @copyright Copyright 2013-2021 Gerd Wagner (Chair of Internet Technology) and Juan-Francisco Reyes, Brandenburg University of Technology, Germany.
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is",
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
/**
 * Constructor function for the class Book
 * @constructor
 * @param {{isbn: string, title: string, year: number}} slots - Object creation slots.
 */
class Book {
    // using a single record parameter with ES6 function parameter destructuring
    constructor({isbn, title, year}) {
        this.isbn = isbn;
        this.title = title;
        this.year = year;
    }
}

/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/
// Load a book record from Firestore
Book.retrieve = async function (isbn) {
    const booksCollRef = db.collection("books"),
        bookDocRef = booksCollRef.doc(isbn);
    var bookDocSnapshot = null;
    try {
        bookDocSnapshot = await bookDocRef.get();
    } catch (e) {
        console.error(`Error when retrieving book record: ${e}`);
        return null;
    }
    const bookRecord = bookDocSnapshot.data();
    return bookRecord;
};
// Load all book records from Firestore
Book.retrieveAll = async function () {
    const booksCollRef = db.collection("books");
    var booksQuerySnapshot = null;
    try {
        booksQuerySnapshot = await booksCollRef.get();
    } catch (e) {
        console.error(`Error when retrieving book records: ${e}`);
        return null;
    }
    const bookDocs = booksQuerySnapshot.docs,
        bookRecords = bookDocs.map(d => d.data());
    console.log(`${bookRecords.length} book records retrieved.`);
    return bookRecords;
};
// Create a Firestore document in the Firestore collection "books"
Book.add = async function (slots) {
    const booksCollRef = db.collection("books"),
        bookDocRef = booksCollRef.doc(slots.isbn);
    slots.year = parseInt(slots.year);  // convert from string to integer
    try {
        await bookDocRef.set(slots);
    } catch (e) {
        console.error(`Error when adding book record: ${e}`);
        return;
    }
    console.log(`Book record ${slots.isbn} created.`);
};
// Update a Firestore document in the Firestore collection "books"
Book.update = async function (slots) {
    const updSlots = {};
    // retrieve up-to-date book record
    const bookRec = await Book.retrieve(slots.isbn);
    // convert from string to integer
    if (slots.year) slots.year = parseInt(slots.year);
    // update only those slots that have changed
    if (bookRec.title !== slots.title) updSlots.title = slots.title;
    if (bookRec.year !== slots.year) updSlots.year = slots.year;
    if (Object.keys(updSlots).length > 0) {
        try {
            await db.collection("books").doc(slots.isbn).update(updSlots);
        } catch (e) {
            console.error(`Error when updating book record: ${e}`);
            return;
        }
        console.log(`Book record ${slots.isbn} modified.`);
    }
};
// Delete a Firestore document in the Firestore collection "books"
Book.destroy = async function (isbn) {
    try {
        await db.collection("books").doc(isbn).delete();
    } catch (e) {
        console.error(`Error when deleting book record: ${e}`);
        return;
    }
    console.log(`Book record ${isbn} deleted.`);
};
/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
// Create test data
Book.generateTestData = async function () {
    let bookRecords = [
        {
            isbn: "006251587X",
            title: "Weaving the Web",
            year: 2000
        },
        {
            isbn: "0465026567",
            title: "Gödel, Escher, Bach",
            year: 1999
        },
        {
            isbn: "0465030793",
            title: "I Am A Strange Loop",
            year: 2008
        }
    ];
    // save all book records
    await Promise.all(bookRecords.map(
        bookRec => db.collection("books").doc(bookRec.isbn).set(bookRec)
    ));
    console.log(`${Object.keys(bookRecords).length} books saved.`);
};
// Clear test data
Book.clearData = async function () {
    if (confirm("Do you really want to delete all book records?")) {
        // retrieve all book documents from Firestore
        const bookRecords = await Book.retrieveAll();
        // delete all documents
        await Promise.all(bookRecords.map(
            bookRec => db.collection("books").doc(bookRec.isbn).delete()));
        // ... and then report that they have been deleted
        console.log(`${Object.values(bookRecords).length} books deleted.`);
    }
};
