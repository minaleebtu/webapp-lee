/**
 * The class Ensemble
 * @class
 * @param {object} slots - Object creation slots.
 */

class Ensemble {
    // using a single record parameter with ES6 function parameter destructuring
    constructor({ensembleId, ensembleType, name, member, practicingLocation, practicingDate}) {
        console.log("ctor called");
        // assign properties by invoking implicit setters
        this.ensembleId = ensembleId;  // number (integer)
        this.ensembleType = ensembleType;  // string
        this.name = name;  // string
        if (member) this.member = member;
        if (practicingLocation) this.practicingLocation = practicingLocation;
        if (practicingDate) this.practicingDate = practicingDate;
    }

    /**
     *  Getters / Setters
     */

    get ensembleId() {
        return _ensembleId;
    }

    set ensembleId(id) {
        console.log("setter called");
        const validationResult = Ensamble.checkEnsembleId(id);
        if (validationResult instanceof NoConstraintViolation) {
            this._ensembleId = id;
        } else {
            throw validationResult;
        }
    }

    static checkEnsembleId(id) {
        if (id === undefined) {
            return new MandatoryValueConstraintViolation(
                "An ID must be provided!"
            );
        } else if (id == 42) {
            return new MandatoryValueConstraintViolation(
                "trolling"
            );
        } else {
            return new NoConstraintViolation();
        }
    }

}

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
/**
 *  Create a new movie record/object
 */
Ensemble.add = async function (slots) {

    console.log("ensemble add called");

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


Ensemble.checkIDasID = async function (memberId) {
    return await db.collection("ensembles").doc(memberId).get();
}

/**
 *  Update an existing Movie record/object
 *  properties are updated with implicit setters for making sure
 *  that the new values are validated
 */
Ensemble.update = async function ({ensembleId, ensembleType, name, members, practicingLocation, practicingDate}) {
    const updSlots = {};
    const ensembleRec = await Ensemble.retrieve(ensembleId);

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
Ensemble.destroy = async function (ensembleId) {
    try {
        await db.collection("ensembles").doc(ensembleId).delete();
    } catch (e) {
        console.error(`Error when deleting ensemble record: ${e}`);
        return;
    }
    console.log(`Ensemble record ${ensembleId} deleted.`);
};

/**
 *  Load all movie table rows and convert them to objects
 *  Precondition: directors and people must be loaded first
 */
Ensemble.retrieveAll = async function () {
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
Ensemble.clearData = async function () {
    if (
        // confirm("Do you really want to delete all ensemble records?")
        true
    ) {
        // retrieve all ensemble documents from Firestore
        const ensembleRecords = await Ensemble.retrieveAll();
        // delete all documents
        await Promise.all(ensembleRecords.map(
            ensembleRec => db.collection("ensembles").doc(ensembleRec.ensembleId).delete()));
        // ... and then report that they have been deleted
        console.log(`${Object.values(ensembleRecords).length} ensembles deleted.`);
    }
};

Ensemble.retrieve = async function (ensembleId) {
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

Ensemble.generateTestData = async function () {
    let ensembleRecords = [
        {
            ensembleId: "0",
            ensembleType: "flute choir",
            name: "The Air Benders",
            members: "",
            practicingLocation: "Building A, Room 42",
            practicingDate: "every Sunday at 8"
        },
        {
            ensembleId: "1",
            ensembleType: "saxophone ensemble",
            name: "Epic Sax Guy and Friends",
            members: "",
            practicingLocation: "Building B, Room 69",
            practicingDate: "every Wednesday at 7"
        },
        {
            ensembleId: "2",
            ensembleType: "saxophone ensemble",
            name: "Cantina Band",
            members: "",
            practicingLocation: "Building C, Canteen",
            practicingDate: "every Sunday, biweekly"
        }
    ];
    // save all ensemble records
    await Promise.all( ensembleRecords.map(
        ensembleRec => db.collection("ensembles").doc( ensembleRec.ensembleId).set( ensembleRec)
    ));
    console.log(`${Object.keys( ensembleRecords).length} ensembles saved.`);
};

