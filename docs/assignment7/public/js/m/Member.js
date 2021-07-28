const InstrumentEL = {
    none: "None",
    guitar: "Guitar",
    bongo: "Bongo",
    tone_wood: "Tone Wood",
    lute: "Lute",
    voice: "Voice",
    saxophone: "Saxophone"
}

/**
 * The class Member
 * @class
 */

function checkInstrument(r) {
    if (r === undefined) {
        return new NoConstraintViolation(); //optional
    } else if (!isIntegerOrIntegerString(r) || parseInt(r) < 0 ||
        parseInt(r) > InstrumentEL.MAX) {
        console.log(`Invalid value for instrument: ${r}`);
        return new RangeConstraintViolation(
            `Invalid value for instrument: ${r}`);
    } else {
        return new NoConstraintViolation();
    }
}

// Validate member id from param and a
function checkMemberID(memberId) {
    if (memberId == null) {
        console.log("ERROR: A value for the Member ID must be provided!");
        return new MandatoryValueConstraintViolation(
            "ERROR: A value for the Member ID must be provided!");
    }
    if (!isIntegerOrIntegerString(memberId)) {
        console.log("ERROR: Member ID " + memberId + " is not a number!");
        return new RangeConstraintViolation(
            "ERROR: Member ID " + memberId + " is not a number!");
    }
    if (memberId < 0) {
        console.log("ERROR: Member ID is not positive!");
        return new RangeConstraintViolation(
            "ERROR: Member ID is not positive!");
    }
    
    return new NoConstraintViolation();
}

async function checkMemberIDasID(memberId) {

    const validationResult = checkMemberID(memberId);
    if (!validationResult instanceof NoConstraintViolation) {
        return validationResult;
    }

    const member = await db.collection("members").doc(memberId).get();

    if (member.exists) {
        return new UniquenessConstraintViolation("ERROR: Member ID already in use!");
    }

    return validationResult;
}

function validateRole(role) {
    if (!isNonEmptyString(role)) {
        console.log("ERROR: The role must be a non-empty string!");
        return new RangeConstraintViolation(
            "ERROR: The role must be a non-empty string!");
    }
    return new NoConstraintViolation();
}

function validateMail(mail) {
    if (!isNonEmptyString(mail)) {
        console.log("ERROR: The mail must be a non-empty string!");
        return new RangeConstraintViolation(
            "ERROR: The mail must be a non-empty string!");
    }
    const mailRegex = RegExp(/^[A-Za-z0-9_]+(@)[A-Za-z0-9_]+(.)[A-Za-z0-9_]+$/);

    if (! mailRegex.test(mail)) {
        return new PatternConstraintViolation("ERROR: Malformed mail address.");
    }

    return new NoConstraintViolation();
}

function validateMemberName(name) {
    if (!isNonEmptyString(name)) {
        console.log("ERROR: The name must be a non-empty string!");
        return new RangeConstraintViolation(
            "ERROR: The name must be a non-empty string!");
    }
    return new NoConstraintViolation();
}

async function validateMemberSlots(slots) {

    //check memberid
    let validationResult = checkMemberID(slots.memberId);
    if (validationResult instanceof NoConstraintViolation) {

    } else {
        throw validationResult;
    }

    //check name
    validationResult = validateMemberName(slots.name);
    if (validationResult instanceof NoConstraintViolation) {

    } else {
        throw validationResult;
    }

    //check mail
    validationResult = validateMail(slots.mailAddress);
    if (validationResult instanceof NoConstraintViolation) {

    } else {
        throw validationResult;
    }

    //validate role
    if (!Array.isArray(slots.role)) {
        validationResult = validateRole(slots.role);
        if (!validationResult instanceof NoConstraintViolation) {
            throw validationResult;
        }
    } else {
        for (const r of slots.role) {
            validationResult = validateRole(r);
            if (!validationResult instanceof NoConstraintViolation) {
                throw validationResult;
            }
        }
    }

    //validate instrument
    const instrument = [];
    const b = slots.instrument;
    if (Array.isArray(b)) {
        for (const idRef of b) {
            validationResult = checkInstrument(idRef);
            if (idRef && validationResult instanceof NoConstraintViolation) {
                if (!instrument.includes(idRef)) {
                    instrument.push(idRef);
                } else {
                    console.error(`Instrument ${idRef} is already added to this boi!`);
                }
            } else {
                throw validationResult;
            }
        }
    } else {
        for (const idRef of Object.keys(b)) {
            validationResult = checkInstrument(b[idRef]);
            if (b[idRef] && validationResult instanceof NoConstraintViolation) {
                if (!instrument.includes(b[idRef])) {
                    instrument.push(b[idRef]);
                } else {
                    console.error(`Instrument ${b[idRef]} is already added to this boi!`);
                }
            } else {
                throw validationResult;
            }
        }
    }
} 

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
/**
 *  Create a new member record/object
 */

async function addMember(slots) {
    const membersCollRef = db.collection("members"),
        memberDocRef = membersCollRef.doc(slots.memberId);
    try {
        //convert role string
        let str = slots.role;
        slots.role = str.split(",");
        await validateMemberSlots(slots);
        await memberDocRef.set(slots);
    } catch (e) {
        console.error(`Error when adding member record: ${e}`);
        return;
    }
    console.log(`Member record ${slots.memberId} created.`);
}

/**
 *  Update an existing member record/object
 *  properties are updated with implicit setters for making sure
 *  that the new values are validated
 */
async function updateMember ({memberId, role, name, instrument, mailAddress}) {
    const updSlots = {};
    const memberRec = await retrieveMember(memberId);

    if (memberRec.role !== role) {
        updSlots.role = role;
    }

    if (memberRec.name !== name) {
        updSlots.name = name;
    }

    if (memberRec.instrument !== instrument) {
        updSlots.instrument = instrument;
    }

    if (memberRec.mailAddress !== mailAddress) {
        updSlots.mailAddress = mailAddress;
    }

    if (Object.keys(updSlots).length > 0) {
        try {
            await db.collection("members").doc(memberId).update(updSlots);
        } catch (e) {
            console.error(`Error when updating member record: ${e}`);
            return;
        }
        console.log(`Member record ${memberId} modified.`);
    }
}

/**
 *  Delete an existing member record/object
 */
async function destroyMember (memberId) {
    /*
     *  implementation of deletion policy
     *  retrieve all ensembles, filter ensembles, remove ref of this member from members
     */
    try {
        const
            allMembers = db.collection("members"),
            allEnsembles = db.collection("ensembles"),
            ensembleQuery = allEnsembles.where("members", "array-contains", memberId),
            associatedEnsembles = (await ensembleQuery.get()).docs,
            memberToDelete = allMembers.doc(memberId);
        // initiate batch write
        const batch = db.batch();
        for (const en of associatedEnsembles) {
            const ensembleRef = allEnsembles.doc(en.ensembleId);
            batch.update(
                ensembleRef,
                {
                    members: FieldValue.arrayRemove(memberId)
                });
        }
        batch.delete(memberToDelete);
        batch.commit(); // finish batch write
        console.log(`Member record ${memberId} deleted.`);
    } catch (e) {
        console.error(`Error deleting member record: ${e}`);
    }

}

/**
 *  Load all member table rows and convert them to objects
 *  Precondition: directors and people must be loaded first
 */
async function retrieveAllMembers() {
    const membersCollRef = db.collection("members");
    let membersQuerySnapshot = null;
    try {
        membersQuerySnapshot = await membersCollRef.get();
    } catch (e) {
        console.error(`Error when retrieving member records: ${e}`);
        return null;
    }
    const memberDocs = membersQuerySnapshot.docs,
        memberRecords = memberDocs.map(d => d.data());
    console.log(`${memberRecords.length} member records retrieved.`);
    return memberRecords;
}

// Clear test data
async function clearMemberData() {
    if (confirm("Do you really want to delete all member records?")) {
        // retrieve all member documents from Firestore
        const memberRecords = await retrieveAllMembers();
        // delete all documents
        await Promise.all(memberRecords.map(
            memberRec => db.collection("members").doc(memberRec.memberId).delete()));
        // ... and then report that they have been deleted
        console.log(`${Object.values(memberRecords).length} members deleted.`);
    }
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

async function generateMemberTestData() {
    let memberRecords = [
        {
            memberId: "0",
            name: "John Doe",
            mailAddress: "bro@gmail.com",
            role: ["Artist"],
            instrument: [2,3]
        },
        {
            memberId: "1",
            name: "Eminem",
            mailAddress: "whiteboy@gmail.com",
            role: ["Artist"],
            instrument: [5]
        },
        {
            memberId: "2",
            name: "Maria Musterfrau",
            mailAddress: "muster@gmail.com",
            role: ["Manager"],
            instrument: [0]
        },
        {
            memberId: "3",
            name: "Epic Sax Guy",
            mailAddress: "epic@gmail.com",
            role: ["Artist"],
            instrument: [6]
        }
    ];
    // save all member records
    await Promise.all(memberRecords.map(
        memberRec => db.collection("members").doc(memberRec.memberId).set(memberRec)
    ));
    console.log(`${Object.keys(memberRecords).length} members saved.`);
}

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
