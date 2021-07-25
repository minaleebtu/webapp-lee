/**
 * The class Ensemble
 * @class
 * @param {object} slots - Object creation slots.
 */




function checkEnsembleName(name) {
    // console.log(name);
    if (!isNonEmptyString(name)) {
        console.log("ERROR: The name must be a non-empty string!");
        return new E_RangeConstraintViolation(
            "ERROR: The name must be a non-empty string!");
    }
    return new E_NoConstraintViolation();
}

function checkEnsembleType(type) {
    if (!isNonEmptyString(type)) {
        console.log("ERROR: The type must be a non-empty string!");
        return new E_RangeConstraintViolation(
            "ERROR: The type must be a non-empty string!");
    }
    return new E_NoConstraintViolation();
}

function checkEnsembleMembers(members) {
    for (var i of members) {
        var memberRec = retrieveMember(i);
        if (!memberRec) {
            return new E_RangeConstraintViolation("Member " + i + " does not exist!");
        }
    }
    return new E_NoConstraintViolation();
}

async function retrieveMember(memberId) {
    const membersCollRef = db.collection("members"),
        memberDocRef = membersCollRef.doc(memberId);
    var memberDocSnapshot = null;
    try {
        memberDocSnapshot = await memberDocRef.get();
    } catch (e) {
        console.error(`Error when retrieving member record: ${e}`);
        return null;
    }
    const memberRecord = memberDocSnapshot.data();
    return memberRecord;
};

function checkEnsembleLocation(location) {
    return new E_NoConstraintViolation();
}

function checkEnsemblePracticingDate(date) {
    return new E_NoConstraintViolation();
}

// Validate ensemble id from param and a
function checkEnsembleID(ensembleId) {

    if (ensembleId == null) {
        console.log("ERROR: A value for the Ensemble ID must be provided!");
        return new E_MandatoryValueConstraintViolation(
            "ERROR: A value for the Ensemble ID must be provided!");
    }
    if (!isIntegerOrIntegerString(ensembleId)) {
        console.log("ERROR: Ensemble ID " + ensembleId + " is not a number!");
        return new E_RangeConstraintViolation(
            "ERROR: Ensemble ID " + ensembleId + " is not a number!");
    }
    if (ensembleId < 0) {
        console.log("ERROR: Ensemble ID is not positive!");
        return new E_RangeConstraintViolation(
            "ERROR: Ensemble ID is not positive!");
    }

    return new E_NoConstraintViolation();
}

async function checkEnsembleIDasID(ensembleId) {

    const validationResult = checkEnsembleID(ensembleId);
    if (!validationResult instanceof E_NoConstraintViolation) {
        return validationResult;
    }

    var ensemble = await db.collection("ensembles").doc(ensembleId).get();

    if (ensemble.exists) {
        return new E_UniquenessConstraintViolation("ERROR: Ensemble ID already in use!");
    }

    return validationResult;
}

async function checkEnsemblesValidity() {
    var er = await retrieveAllEnsembles();
    for (const ensembleRec of er) {
        updateEnsembleMembers(ensembleRec.ensembleId);
    }
}

async function updateEnsembleMembers(ensembleId) {
    var ensembleRec = await retrieveEnsemble(ensembleId);
    var newMembers = [];
    for (var i of ensembleRec.members) {
        var memberRec = retrieveMember(i);
        if (memberRec) {
            if (!newMembers.includes(memberRec.memberId)) {
                newMembers.push(memberRec.memberId);
            }
        }
    }
    const slots = {
        ensembleId: ensembleId,
        members: newMembers
    };
    updateEnsemble(slots);
}

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
/**
 *  Create a new movie record/object
 */
async function addEnsemble(slots) {

    // console.log("ensemble add called");
    validateEnsembleSlots(slots);
    const ensemblesCollRef = db.collection("ensembles"),
        ensembleDocRef = ensemblesCollRef.doc(slots.ensembleId);
    try {
        await ensembleDocRef.set(slots);
    } catch (e) {
        console.error(`Error when adding ensemble record: ${e}`);
        return;
    }
    console.log(`Ensemble record ${slots.ensembleId} created.`);
};

/**
 *  Update an existing Movie record/object
 *  properties are updated with implicit setters for making sure
 *  that the new values are validated
 */
async function updateEnsemble({ensembleId, ensembleType, name, members, practicingLocation, practicingDate}) {
    const updSlots = {};
    const ensembleRec = await retrieveEnsemble(ensembleId);

    if (ensembleType && ensembleRec.ensembleType !== ensembleType) {
        updSlots.ensembleType = ensembleType;
    }
    if (name && ensembleRec.name !== name) {
        updSlots.name = name;
    }
    if (members && ensembleRec.members !== members) {
        updSlots.members = members;
    }
    if (practicingLocation && ensembleRec.practicingLocation !== practicingLocation) {
        updSlots.practicingLocation = practicingLocation;
    }
    if (practicingDate && ensembleRec.practicingDate !== practicingDate) {
        updSlots.practicingDate = practicingDate;
    }

    if (Object.keys(updSlots).length > 0) {
        try {
            await db.collection("ensembles").doc(ensembleId).update(updSlots);
        } catch (e) {
            console.error(`Error when updating ensemble record: ${e}`);
            return;
        }
        console.log(`Ensemble record ${ensembleId} modified.`);
    }
};

/**
 *  Delete an existing Movie record/object
 */
async function destroyEnsemble(ensembleId) {

    /*
     *  implementation of deletion policy
     *  was before: checkEventValidity
     *  retrieve all events, filter events, remove ref of this ensemble from events
     */
    try {
        const
            allEnsembles = db.collection("ensembles"),
            allEvents = db.collection("events"),
            eventQuery = allEvents.where("participants", "array-contains", ensembleId),
            associatedEvents = (await eventQuery.get()).docs,
            ensembleToDelete = allEnsembles.doc(ensembleId);
        // initiate batch write
        const batch = db.batch();
        for (const ev of associatedEvents) {
            const eventRef = allEvents.doc(ev.eventId);
            // remove associated publisher from each book record
            batch.update(
                eventRef,
                {
                // publisher_id: firebase.firestore.FieldValue.delete()
                participants: FieldValue.arrayRemove(ensembleId)
            });
        }
        // delete publisher record
        batch.delete(ensembleToDelete);
        batch.commit(); // finish batch write
        console.log(`Ensemble record ${ensembleId} deleted.`);
    } catch (e) {
        console.error(`Error deleting ensemble record: ${e}`);
    }

};

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
};

/**
 *  Load all movie table rows and convert them to objects
 *  Precondition: directors and people must be loaded first
 */
async function retrieveAllEnsembles() {
    const ensemblesCollRef = db.collection("ensembles");
    var ensemblesQuerySnapshot = null;
    try {
        ensemblesQuerySnapshot = await ensemblesCollRef.get();
    } catch (e) {
        console.error(`Error when retrieving ensemble records: ${e}`);
        return null;
    }
    const ensembleDocs = ensemblesQuerySnapshot.docs,
        ensembleRecords = ensembleDocs.map(d => d.data());
    console.log(`${ensembleRecords.length} ensemble records retrieved.`);
    return ensembleRecords;
};

// Clear test data
async function clearEnsembleData() {
    if (
        // confirm("Do you really want to delete all ensemble records?")
        true
    ) {
        // retrieve all ensemble documents from Firestore
        const ensembleRecords = await retrieveAllEnsembles();
        // delete all documents
        await Promise.all(ensembleRecords.map(
            ensembleRec => db.collection("ensembles").doc(ensembleRec.ensembleId).delete()));
        // ... and then report that they have been deleted
        console.log(`${Object.values(ensembleRecords).length} ensembles deleted.`);
    }
};

async function retrieveEnsemble(ensembleId) {
    const ensemblesCollRef = db.collection("ensembles"),
        ensembleDocRef = ensemblesCollRef.doc(ensembleId);
    var ensembleDocSnapshot = null;
    try {
        ensembleDocSnapshot = await ensembleDocRef.get();
    } catch (e) {
        console.error(`Error when retrieving ensemble record: ${e}`);
        return null;
    }
    const ensembleRecord = ensembleDocSnapshot.data();
    return ensembleRecord;
};

async function generateEnsembleTestData() {
    let ensembleRecords = [
        {
            ensembleId: "0",
            ensembleType: "flute choir",
            name: "The Air Benders",
            members: [0, 1],
            practicingLocation: "Building A, Room 42",
            practicingDate: "every Sunday at 8"
        },
        {
            ensembleId: "1",
            ensembleType: "saxophone ensemble",
            name: "Epic Sax Guy and Friends",
            members: [3, 2],
            practicingLocation: "Building B, Room 69",
            practicingDate: "every Wednesday at 7"
        },
        {
            ensembleId: "2",
            ensembleType: "saxophone ensemble",
            name: "Cantina Band",
            members: [2],
            practicingLocation: "Building C, Canteen",
            practicingDate: "every Sunday, biweekly"
        }
    ];
    // save all ensemble records
    await Promise.all(ensembleRecords.map(
        ensembleRec => db.collection("ensembles").doc(ensembleRec.ensembleId).set(ensembleRec)
    ));
    console.log(`${Object.keys(ensembleRecords).length} ensembles saved.`);
};

async function validateEnsembleSlots(slots) {
    //check id
    var validationResult = checkEnsembleID(slots.ensembleId);
    if (validationResult instanceof E_NoConstraintViolation) {

    } else {
        throw validationResult;
    }

    //check type
    var validationResult = checkEnsembleType(slots.ensembleType);
    if (validationResult instanceof E_NoConstraintViolation) {

    } else {
        throw validationResult;
    }

    //check name
    var validationResult = checkEnsembleName(slots.name);
    if (validationResult instanceof E_NoConstraintViolation) {

    } else {
        throw validationResult;
    }

    //check date
    var validationResult = checkEnsemblePracticingDate(slots.practicingDate);
    if (validationResult instanceof E_NoConstraintViolation) {

    } else {
        throw validationResult;
    }

    //check location
    var validationResult = checkEnsembleLocation(slots.practicingLocation);
    if (validationResult instanceof E_NoConstraintViolation) {

    } else {
        throw validationResult;
    }

    //check members
    var validationResult = checkEnsembleMembers(slots.members);
    if (validationResult instanceof E_NoConstraintViolation) {

    } else {
        throw validationResult;
    }
}

function isIntegerOrIntegerString(x) {
    return typeof (x) === "number" && Number.isInteger(x) ||
        typeof (x) === "string" && x.search(/^-?[0-9]+$/) == 0;
}

function isNonEmptyString(string) {
    return typeof (string) === "string" && string.trim() !== "";
}

/**
 * @fileOverview  Defines error classes (also called "exception" classes)
 * for property constraint violations
 * @person Gerd Wagner
 */

class E_ConstraintViolation {
    constructor(msg) {
        this.message = msg;
    }
}

class E_NoConstraintViolation extends E_ConstraintViolation {
    constructor(msg) {
        super(msg);
        this.message = "";
    }
}

class E_MandatoryValueConstraintViolation extends E_ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class E_RangeConstraintViolation extends E_ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class E_StringLengthConstraintViolation extends E_ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class E_IntervalConstraintViolation extends E_ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class E_PatternConstraintViolation extends E_ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class E_UniquenessConstraintViolation extends E_ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class E_ReferentialIntegrityConstraintViolation extends E_ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}



