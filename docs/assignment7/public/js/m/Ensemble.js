function checkEnsembleName(name) {
    if (!isNonEmptyString(name)) {
        console.log("ERROR: The name must be a non-empty string!");
        return new RangeConstraintViolation(
            "ERROR: The name must be a non-empty string!");
    }
    return new NoConstraintViolation();
}

function checkEnsembleType(type) {
    if (!isNonEmptyString(type)) {
        console.log("ERROR: The type must be a non-empty string!");
        return new RangeConstraintViolation(
            "ERROR: The type must be a non-empty string!");
    }
    return new NoConstraintViolation();
}

function checkEnsembleMembers(members) {
    for (let i of members) {
        let memberRec = retrieveMember(i);
        if (!memberRec) {
            return new RangeConstraintViolation("Member " + i + " does not exist!");
        }
    }
    return new NoConstraintViolation();
}

async function retrieveMember(memberId) {
    const membersCollRef = db.collection("members"),
        memberDocRef = membersCollRef.doc(memberId);
    let memberDocSnapshot = null;
    try {
        memberDocSnapshot = await memberDocRef.get();
    } catch (e) {
        console.error(`Error when retrieving member record: ${e}`);
        return null;
    }
    return memberDocSnapshot.data();
}

// Validate ensemble id from param and a
function checkEnsembleID(ensembleId) {

    if (ensembleId == null) {
        console.log("ERROR: A value for the Ensemble ID must be provided!");
        return new MandatoryValueConstraintViolation(
            "ERROR: A value for the Ensemble ID must be provided!");
    }
    if (!isIntegerOrIntegerString(ensembleId)) {
        console.log("ERROR: Ensemble ID " + ensembleId + " is not a number!");
        return new RangeConstraintViolation(
            "ERROR: Ensemble ID " + ensembleId + " is not a number!");
    }
    if (ensembleId < 0) {
        console.log("ERROR: Ensemble ID is not positive!");
        return new RangeConstraintViolation(
            "ERROR: Ensemble ID is not positive!");
    }

    return new NoConstraintViolation();
}

async function checkEnsembleIDasID(ensembleId) {

    const validationResult = checkEnsembleID(ensembleId);
    if (!validationResult instanceof NoConstraintViolation) {
        return validationResult;
    }

    let ensemble = await db.collection("ensembles").doc(ensembleId).get();

    if (ensemble.exists) {
        return new UniquenessConstraintViolation("ERROR: Ensemble ID already in use!");
    }

    return validationResult;
}

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
/**
 *  Create a new Ensemble record/object
 */
async function addEnsemble(slots) {
    await validateEnsembleSlots(slots);
    const ensemblesCollRef = db.collection("ensembles"),
        ensembleDocRef = ensemblesCollRef.doc(slots.ensembleId);
    try {
        await ensembleDocRef.set(slots);
    } catch (e) {
        console.error(`Error when adding ensemble record: ${e}`);
        return;
    }
    console.log(`Ensemble record ${slots.ensembleId} created.`);
}

/**
 *  Update an existing Ensemble record/object
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
    if (members && ensembleRec.allMembers !== members) {
        updSlots.allMembers = members;
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
}

/**
 *  Delete an existing Ensemble record/object
 */
async function destroyEnsemble(ensembleId) {
    /*
     *  implementation of deletion policy
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
            // remove associated publisher from each ensemble record
            batch.update(eventRef,{
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

}

/**
 *  Load all movie table rows and convert them to objects
 *  Precondition: directors and people must be loaded first
 */
async function retrieveAllEnsembles() {
    const ensemblesCollRef = db.collection("ensembles");
    let ensemblesQuerySnapshot = null;
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
}

// Clear test data
async function clearEnsembleData() {
    if (confirm("Do you really want to delete all ensemble records?")) {
        // retrieve all ensemble documents from Firestore
        const ensembleRecords = await retrieveAllEnsembles();
        // delete all documents
        await Promise.all(ensembleRecords.map(
            ensembleRec => db.collection("ensembles").doc(ensembleRec.ensembleId).delete()));
        // ... and then report that they have been deleted
        console.log(`${Object.values(ensembleRecords).length} ensembles deleted.`);
    }
}

async function retrieveEnsemble(ensembleId) {
    const ensemblesCollRef = db.collection("ensembles"),
        ensembleDocRef = ensemblesCollRef.doc(ensembleId);
    let ensembleDocSnapshot = null;
    try {
        ensembleDocSnapshot = await ensembleDocRef.get();
    } catch (e) {
        console.error(`Error when retrieving ensemble record: ${e}`);
        return null;
    }
    return ensembleDocSnapshot.data();
}

async function generateEnsembleTestData() {
    let ensembleRecords = [
        {
            ensembleId: "0",
            ensembleType: "flute choir",
            name: "The Air Benders",
            allMembers: [0, 1],
            practicingLocation: "Building A, Room 42",
            practicingDate: "every Sunday at 8"
        },
        {
            ensembleId: "1",
            ensembleType: "saxophone ensemble",
            name: "Epic Sax Guy and Friends",
            allMembers: [3, 2],
            practicingLocation: "Building B, Room 69",
            practicingDate: "every Wednesday at 7"
        },
        {
            ensembleId: "2",
            ensembleType: "saxophone ensemble",
            name: "Cantina Band",
            allMembers: [2],
            practicingLocation: "Building C, Canteen",
            practicingDate: "every Sunday, biweekly"
        }
    ];
    // save all ensemble records
    await Promise.all(ensembleRecords.map(
        ensembleRec => db.collection("ensembles").doc(ensembleRec.ensembleId).set(ensembleRec)
    ));
    console.log(`${Object.keys(ensembleRecords).length} ensembles saved.`);
}

async function validateEnsembleSlots(slots) {
    //check id
    let validationResult = checkEnsembleID(slots.ensembleId);
    if (validationResult instanceof NoConstraintViolation) {

    } else {
        throw validationResult;
    }

    //check type
    validationResult = checkEnsembleType(slots.ensembleType);
    if (validationResult instanceof NoConstraintViolation) {

    } else {
        throw validationResult;
    }

    //check name
    validationResult = checkEnsembleName(slots.name);
    if (validationResult instanceof NoConstraintViolation) {

    } else {
        throw validationResult;
    }

    //check members
    validationResult = checkEnsembleMembers(slots.allMembers);
    if (validationResult instanceof NoConstraintViolation) {

    } else {
        throw validationResult;
    }
}

function isIntegerOrIntegerString(x) {
    return typeof (x) === "number" && Number.isInteger(x) ||
        typeof (x) === "string" && x.search(/^-?[0-9]+$/) === 0;
}

function isNonEmptyString(string) {
    return typeof (string) === "string" && string.trim() !== "";
}



