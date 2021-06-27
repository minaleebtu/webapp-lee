/**
 * @fileOverview  The model class Ensemble with property definitions, (class-level)
 *                check methods, setter methods, and the special methods saveAll and retrieveAll
 * @person Gerd Wagner
 */
import {cloneObject, isIntegerOrIntegerString} from "../../lib/util.mjs";

/**
 * The class Ensemble
 * @class
 * @param {object} slots - Object creation slots.
 */

class Ensemble {
    // using a single record parameter with ES6 function parameter destructuring
    constructor({ensembleId, ensembleType, name, member, practicingLocation, practicingDate}) {

        // assign properties by invoking implicit setters
        this.ensembleId = ensembleId;  // number (integer)
        this.ensembleType = ensembleType;  // string
        this.name = name;  // string
        if (member) this.member = member;
        if (practicingLocation) this.practicingLocation = practicingLocation;
        if (practicingDate) this.practicingDate = practicingDate;
    }

    set ensembleId(v) {
        this._ensembleId = v;
    }

    get ensembleId() {
        return this._ensembleId;
    }

    set ensembleType(v) {
        this._ensembleType = v;
    }

    get ensembleType() {
        return this._ensembleType;
    }

    set name(v) {
        this._name = v;
    }

    get name() {
        return this._name;
    }

    set member(v) {
        this._member = v;
    }

    get member() {
        return this._member;
    }

    set practicingLocation(v) {
        this._practicingLocation = v;
    }

    get practicingLocation() {
        return this._practicingLocation;
    }

    set practicingDate(v) {
        this._practicingDate = v;
    }

    get practicingDate() {
        return this._practicingDate;
    }

    toJSON() {  // is invoked by JSON.stringify
        let rec = {};
        for (const p of Object.keys(this)) {
            // remove underscore prefix
            if (p.charAt(0) === "_") rec[p.substr(1)] = this[p];
        }
        return rec;
    }
}

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
/**
 *  Create a new movie record/object
 */
Ensemble.add = function (slots) {
  const membersCollRef = db.collection("ensembles"),
        memberDocRef = membersCollRef.doc( slots.ensembleId);
  try {
    await memberDocRef.set( slots);
  } catch( e) {
    console.error(`Error when adding book record: ${e}`);
    return;
  }
  console.log(`Ensemble record ${slots.ensembleId} created.`);
};
/**
 *  Update an existing Movie record/object
 *  properties are updated with implicit setters for making sure
 *  that the new values are validated
 */
Ensemble.update = function ({ensembleId, ensembleType, name, member, practicingLocation, practicingDate}) {
    const updSlots={};
    const ensembleRec = await Ensemble.retrieve[ensembleId]    
    
    if (ensembleType && ensembleRec.ensembleType !== namensembleType) {
        updSlots.ensembleType = ensembleType;
    }
    if (name && ensembleRec.name !== name) {
        updSlots.name = name;
    }
    if (member && ensembleRec.member !== member) {
        updSlots.member = member;
    }
    if (practicingLocation && ensembleRec.practicingLocation !== practicingLocation) {
        updSlots.practicingLocation = practicingLocation;
    }
    if (practicingDate && ensembleRec.practicingDate !== practicingDate) {
        updSlots.practicingDate = practicingDate;
    }
    
    if (Object.keys( updSlots).length > 0) {
        try {
          await db.collection("ensembles").doc(ensembleId).update( updSlots);
        } catch( e) {
          console.error(`Error when updating member record: ${e}`);
          return;
        }
        console.log(`Ensemble record ${ensembleId} modified.`);
    }
};

/**
 *  Delete an existing Movie record/object
 */
Ensemble.destroy = function (ensembleId) {
      try {
        await db.collection("ensembles").doc( ensembleId).delete();
      } catch( e) {
        console.error(`Error when deleting ensemble record: ${e}`);
        return;
      }
      console.log(`Ensemble record ${ensembleId} deleted.`);
};

/**
 *  Load all movie table rows and convert them to objects
 *  Precondition: directors and people must be loaded first
 */
Ensemble.retrieveAll = function () {
  const ensemblesCollRef = db.collection("ensembles");
  var ensemblesQuerySnapshot=null;
  try {
    ensemblesQuerySnapshot = await ensemblesCollRef.get();
  } catch( e) {
    console.error(`Error when retrieving ensemble records: ${e}`);
    return null;
  }
  const ensembleDocs = ensemblesQuerySnapshot.docs,
        ensembleRecords = ensembleDocs.map( d => d.data());
  console.log(`${ensembleRecords.length} ensemble records retrieved.`);
  return ensembleRecords;
};

// Clear test data
Ensemble.clearData = async function () {
  if (confirm("Do you really want to delete all ensemble records?")) {
    // retrieve all book documents from Firestore
    const ensembleRecords = await Ensemble.retrieveAll();
    // delete all documents
    await Promise.all( ensembleRecords.map(
      memberRec => db.collection("ensembles").doc( ensembleRec.ensembleId).delete()));
    // ... and then report that they have been deleted
    console.log(`${Object.values( ensembleRecords).length} events deleted.`);
  }
};

Ensemble.retrieve = async function (ensembleId) {
  const ensemblesCollRef = db.collection("ensembles"),
        ensembleDocRef = ensemblesCollRef.doc( ensembleId);
  var ensembleDocSnapshot=null;
  try {
    ensembleDocSnapshot = await ensembleDocRef.get();
  } catch( e) {
    console.error(`Error when retrieving ensemble record: ${e}`);
    return null;
  }
  const ensembleRecord = ensembleDocSnapshot.data();
  return ensembleRecord;
};

export default Ensemble;
