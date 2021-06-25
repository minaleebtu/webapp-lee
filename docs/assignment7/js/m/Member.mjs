/**
 * @fileOverview  The model class Movie with attribute definitions, (class-level)
 *                check methods, setter methods, and the special methods saveAll
 *                and retrieveAll
 * @person Gerd Wagner
 */
import {cloneObject, isIntegerOrIntegerString} from "../../lib/util.mjs";

import {Enumeration} from "../../lib/Enumeration.mjs";
import {ConstraintViolation, IntervalConstraintViolation} from "../../lib/errorTypes.mjs";

const InstrumentEL = new Enumeration(["guitar", "bongo", "tone wood", "lute", "voice"]);

/**
 * The class Member
 * @class
 */
class Member {
    constructor({memberId, role, name, instrument, mailAddress}) {
        this.memberId = memberId;
        this.name = name;
        this.mailAddress = mailAddress;
        if (role) this.role = role;
        if (instrument) this.instrument = instrument;
    }

    set memberId(c) {
        this._memberId = memberId;
    }

    get memberId() {
        return this._memberId;
    }

    set name(c) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set mailAddress(c) {
        this._mailAddress = mailAddress;
    }

    get mailAddress() {
        return this._mailAddress;
    }

    set role(c) {
        this._role = role;
    }

    get role() {
        return this._role;
    }

    set instrument(c) {
        this._instrument = instrument;
    }

    get instrument() {
        return this._instrument;
    }
}

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
/**
 *  Create a new movie record/object
 */
Member.add = function (slots) {
  const membersCollRef = db.collection("members"),
        memberDocRef = membersCollRef.doc( slots.memberId);
  try {
    await memberDocRef.set( slots);
  } catch( e) {
    console.error(`Error when adding book record: ${e}`);
    return;
  }
  console.log(`Member record ${slots.memberId} created.`);
};
/**
 *  Update an existing Movie record/object
 *  properties are updated with implicit setters for making sure
 *  that the new values are validated
 */
Member.update = function ({memberId, role, name, instrument, mailAddress}) {
    const updSlots={};
    const memberRec = await Member.retrieve[memberId]    
    
    if (memberRec.role !== role) {
        updSlots.role = role;
    }

    if (memberRec.date !== date) {
        updSlots.date = date;
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
    
    if (Object.keys( updSlots).length > 0) {
        try {
          await db.collection("members").doc(memberId).update( updSlots);
        } catch( e) {
          console.error(`Error when updating member record: ${e}`);
          return;
        }
        console.log(`Member record ${memberId} modified.`);
      }
};

/**
 *  Delete an existing Movie record/object
 */
Member.destroy = function (memberId) {
      try {
        await db.collection("members").doc( memberId).delete();
      } catch( e) {
        console.error(`Error when deleting member record: ${e}`);
        return;
      }
      console.log(`Member record ${memberId} deleted.`);
};

/**
 *  Load all movie table rows and convert them to objects
 *  Precondition: directors and people must be loaded first
 */
Member.retrieveAll = function () {
  const membersCollRef = db.collection("members");
  var membersQuerySnapshot=null;
  try {
    membersQuerySnapshot = await membersCollRef.get();
  } catch( e) {
    console.error(`Error when retrieving member records: ${e}`);
    return null;
  }
  const memberDocs = membersQuerySnapshot.docs,
        memberRecords = memberDocs.map( d => d.data());
  console.log(`${memberRecords.length} member records retrieved.`);
  return memberRecords;
};

// Clear test data
Member.clearData = async function () {
  if (confirm("Do you really want to delete all member records?")) {
    // retrieve all book documents from Firestore
    const memberRecords = await Member.retrieveAll();
    // delete all documents
    await Promise.all( memberRecords.map(
      memberRec => db.collection("members").doc( memberRec.memberId).delete()));
    // ... and then report that they have been deleted
    console.log(`${Object.values( memberRecords).length} members deleted.`);
  }
};

Member.retrieve = async function (memberId) {
  const membersCollRef = db.collection("members"),
        memberDocRef = membersCollRef.doc( memberId);
  var memberDocSnapshot=null;
  try {
    memberDocSnapshot = await memberDocRef.get();
  } catch( e) {
    console.error(`Error when retrieving member record: ${e}`);
    return null;
  }
  const memberRecord = memberDocSnapshot.data();
  return memberRecord;
};

export default Member;
export {InstrumentEL};