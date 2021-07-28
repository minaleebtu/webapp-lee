/**
 * @fileOverview  The model class Movie with attribute definitions, (class-level)
 *                check methods, setter methods, and the special methods saveAll
 *                and retrieveAll
 * @person Gerd Wagner
 */

const EventTypeEL = {
    concert: "Concert",
    meeting: "Meeting",
    workshop: "Workshop"
}

function checkEventTitle(title) {
    if (!isNonEmptyString(title)) {
        console.log("ERROR: The title must be a non-empty string!");
        return new RangeConstraintViolation(
            "ERROR: The title must be a non-empty string!");
    }
    return new NoConstraintViolation();
}

function checkEventDate(rd) {
    if (!rd || rd === "") return new MandatoryValueConstraintViolation(
        "A value for the release date must be provided!"
    );
    else {
        return new NoConstraintViolation();
    }
}

// Validate event id from param and a
function checkEventID(eventId) {
    if (!isIntegerOrIntegerString(eventId)) {
        console.log("ERROR: Event ID " + eventId + " is not a number!");
        return new RangeConstraintViolation(
            "ERROR: Event ID " + eventId + " is not a number!");
    }
    if (eventId < 0) {
        console.log("ERROR: Event ID is not positive!");
        return new RangeConstraintViolation(
            "ERROR: Event ID is not positive!");
    }
    if (eventId == null) {
        console.log("ERROR: A value for the Event ID must be provided!");
        return new MandatoryValueConstraintViolation(
            "ERROR: A value for the Event ID must be provided!");
    }

    return new NoConstraintViolation();
}

async function checkEventIDasID(eventId) {

    const validationResult = checkEventID(eventId);
    if (!validationResult instanceof NoConstraintViolation) {
        return validationResult;
    }

    let event = await db.collection("events").doc(eventId).get();

    if (event.exists) {
        return new UniquenessConstraintViolation("ERROR: Event ID already in use!");
    }

    return validationResult;
}

function checkEventType(r) {
    if (r === undefined) {
        return new NoConstraintViolation(); //optional
    } else if (!isIntegerOrIntegerString(r) || parseInt(r) < 0 ||
        parseInt(r) > EventTypeEL.MAX) {
        console.log(`Invalid value for event type: ${r}`);
        return new RangeConstraintViolation(
            `Invalid value for event type: ${r}`);
    } else {
        return new NoConstraintViolation();
    }
}

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
/**
 *  Create a new Event record/object
 */
async function addEvent(slots) {
    await validateEventSlots(slots);
    const eventsCollRef = db.collection("events"),
        eventDocRef = eventsCollRef.doc(slots.eventId);
    try {
        await eventDocRef.set(slots);
    } catch (e) {
        console.error(`Error when adding event record: ${e}`);
        return;
    }
    console.log(`Event record ${slots.eventId} created.`);
}

/**
 *  Update an existing Event record/object
 *  properties are updated with implicit setters for making sure
 *  that the new values are validated
 */
async function updateEvent({eventId, eventType, title, date, description, personInCharge, participants}) {
    const updSlots = {};
    const eventRec = await retrieveEvent(eventId);

    if (eventRec.eventType !== eventType) {
        updSlots.eventType = eventType;
    }

    if (eventRec.title !== title) {
        updSlots.title = title;
    }

    if (eventRec.date !== date) {
        updSlots.date = date;
    }

    if (eventRec.description !== description) {
        updSlots.description = description;
    }

    if (eventRec.personInCharge !== personInCharge) {
        updSlots.personInCharge = personInCharge;
    }

    if (eventRec.participants !== participants) {
        updSlots.participants = participants;
    }

    if (Object.keys(updSlots).length > 0) {
        try {
            await db.collection("events").doc(eventId).update(updSlots);
        } catch (e) {
            console.error(`Error when updating event record: ${e}`);
            return;
        }
        console.log(`Event record ${eventId} modified.`);
    }
}

/**
 *  Delete an existing event record/object
 */
async function destroyEvent(eventId) {
    try {
        await db.collection("events").doc(eventId).delete();
    } catch (e) {
        console.error(`Error when deleting event record: ${e}`);
        return;
    }
    console.log(`Event record ${eventId} deleted.`);
}

/**
 *  Load all movie table rows and convert them to objects
 *  Precondition: directors and people must be loaded first
 */
async function retrieveAllEvents() {
    const eventsCollRef = db.collection("events");
    var eventsQuerySnapshot = null;
    try {
        eventsQuerySnapshot = await eventsCollRef.get();
    } catch (e) {
        console.error(`Error when retrieving event records: ${e}`);
        return null;
    }
    const eventDocs = eventsQuerySnapshot.docs,
        eventRecords = eventDocs.map(d => d.data());
    console.log(`${eventRecords.length} event records retrieved.`);
    return eventRecords;
}

// Clear test data
async function clearEventData() {
    if (confirm("Do you really want to delete all event records?")) {
        // retrieve all events documents from Firestore
        const eventRecords = await retrieveAllEvents();
        // delete all documents
        await Promise.all(eventRecords.map(
            eventRec => db.collection("events").doc(eventRec.eventId).delete()));
        // ... and then report that they have been deleted
        console.log(`${Object.values(eventRecords).length} events deleted.`);
    }
}

async function retrieveEvent(eventId) {
    const eventsCollRef = db.collection("events"),
        eventDocRef = eventsCollRef.doc(eventId);
    var eventDocSnapshot = null;
    try {
        eventDocSnapshot = await eventDocRef.get();
    } catch (e) {
        console.error(`Error when retrieving event record: ${e}`);
        return null;
    }
    return eventDocSnapshot.data();
}

async function validateEventSlots(slots) {
    /*
     *  check id
     */
    let validationResult = checkEventID(slots.eventId);
    if (!validationResult instanceof NoConstraintViolation) {
        throw validationResult;
    }

    /*
     *  check eventType
     */
    validationResult = checkEventType(slots.eventType);
    if (!validationResult instanceof NoConstraintViolation) {
        throw validationResult;
    }

    /*
     *  check title
     */
    validationResult = checkEventTitle(slots.title);
    if (!validationResult instanceof NoConstraintViolation) {
        throw validationResult;
    }

    /*
     *  check date
     */
    validationResult = checkEventDate(slots.date);
    if (!validationResult instanceof NoConstraintViolation) {
        throw validationResult;
    }

    /*
     *  checking description and person in charge not needed
     */

}

async function generateEventTestData() {
    let eventRecords = [
        {
            eventId: "0",
            eventType: 0,
            title: "Biggest Party Ever",
            date: "t. b. a.",
            description: "This will be the biggest party ever!",
            personInCharge: "Tony Stark, more info on the website",
            participants: [0, 1, 2]
        },
        {
            eventId: "1",
            eventType: 2,
            title: "Saxophone Saturday",
            date: "every Saturday",
            description: "usually in Moe's Tavern",
            personInCharge: "the barkeeper",
            participants: [1, 2]
        }
    ];
    // save all event records
    await Promise.all(eventRecords.map(
        eventRec => db.collection("events").doc(eventRec.eventId).set(eventRec)
    ));
    console.log(`${Object.keys(eventRecords).length} events saved.`);
}

/*
Copy Pasta Code inc
*/

/**
 * Verifies if a value represents an integer or integer string
 * @param {string} x
 * @return {boolean}
 */
function isIntegerOrIntegerString(x) {
    return typeof (x) === "number" && Number.isInteger(x) ||
        typeof (x) === "string" && x.search(/^-?[0-9]+$/) === 0;
}

function isNonEmptyString(string) {
    return typeof (string) === "string" && string.trim() !== "";
}

/**
 * Create a DOM option element
 *
 * @param {string} val
 * @param {string} txt
 * @param {string} classValues [optional]
 *
 * @return {object}
 */
function createOption(val, txt, classValues) {
    let el = document.createElement("option");
    el.value = val;
    el.text = txt;
    if (classValues) el.className = classValues;
    return el;
}


