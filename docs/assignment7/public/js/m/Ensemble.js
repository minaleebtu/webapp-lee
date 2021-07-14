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

    static checkName = function (name) {
        if (!isNonEmptyString(name)) {
            console.log("ERROR: The name must be a non-empty string!");
            return new RangeConstraintViolation(
                "ERROR: The name must be a non-empty string!");
        }
        return new NoConstraintViolation();
    }

    static checkType = function (type){
        if (!isNonEmptyString(type)) {
            console.log("ERROR: The type must be a non-empty string!");
            return new RangeConstraintViolation(
                "ERROR: The type must be a non-empty string!");
        }
        return new NoConstraintViolation();
    }
    /**
     *  Getters / Setters
     */

    static checkMembers = function (members){
        // todo
        return new NoConstraintViolation();
    get ensembleId() {
        return _ensembleId;
    }

    static checkLocation = function (location){
        return new NoConstraintViolation();
    }

    static checkPracticingDate = function (date){
        return new NoConstraintViolation();
    set ensembleId(id) {
        console.log("setter called");
        const validationResult = Ensamble.checkEnsembleId(id);
        if (validationResult instanceof NoConstraintViolation) {
            this._ensembleId = id;
        } else {
            throw validationResult;
        }
    }

    // Validate ensemble id from param and a
    static checkID = function (ensembleId) {
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
        if (ensembleId == null) {
            console.log("ERROR: A value for the Ensemble ID must be provided!");
    static checkEnsembleId(id) {
        if (id === undefined) {
            return new MandatoryValueConstraintViolation(
                "ERROR: A value for the Ensemble ID must be provided!");
        }

        return new NoConstraintViolation();
    }

    static checkIDasID = async function (ensembleId) {

        const validationResult = Ensemble.checkID(ensembleId);
        if (!validationResult instanceof NoConstraintViolation) {
            return validationResult
                "An ID must be provided!"
            );
        } else if (id == 42) {
            return new MandatoryValueConstraintViolation(
                "trolling"
            );
        } else {
            return new NoConstraintViolation();
        }

        var ensemble = await db.collection("ensembles").doc(ensembleId).get();

        if (ensemble.exists) {
            return new UniquenessConstraintViolation("ERROR: Ensemble ID already in use!");
        }

        return validationResult;
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

function isIntegerOrIntegerString(x) {
    return typeof (x) === "number" && Number.isInteger(x) ||
        typeof (x) === "string" && x.search(/^-?[0-9]+$/) == 0;
}

/**
 * @fileOverview  Defines error classes (also called "exception" classes)
 * for property constraint violations
 * @person Gerd Wagner
 */

class ConstraintViolation {
    constructor(msg) {
        this.message = msg;
    }
}

class NoConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
        this.message = "";
    }
}

class MandatoryValueConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class RangeConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class StringLengthConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class IntervalConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class PatternConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class UniquenessConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class ReferentialIntegrityConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

function isNonEmptyString(string) {
    return typeof (string) === "string" && string.trim() !== "";
}