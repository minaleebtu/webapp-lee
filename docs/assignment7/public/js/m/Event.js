/**
 * @fileOverview  The model class Movie with attribute definitions, (class-level)
 *                check methods, setter methods, and the special methods saveAll
 *                and retrieveAll
 * @person Gerd Wagner
 */
import {cloneObject, isIntegerOrIntegerString} from "../../lib/util.mjs";

import {Enumeration} from "../../lib/Enumeration.mjs";
import {ConstraintViolation, IntervalConstraintViolation} from "../../lib/errorTypes.mjs";

const EventTypeEL = new Enumeration(["Concert", "Meeting", "Workshop"]);

/**
 * The class Event
 * @class
 */
class Event {
    constructor({eventId, eventType, title, date, description, personInCharge, participants}) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.title = title;
        this.date = date;
        if (description) this.description = description;
        if (personInCharge) this.personInCharge = personInCharge;
        if (participants) this.participants = participants;
    }

    set eventId(c) {
        this._eventId = eventId;
    }

    get eventId() {
        return this._eventId;
    }

    set eventType(c) {
        this._eventType = eventType;
    }

    get eventType() {
        return this._eventType;
    }

    set title(c) {
        this._title = title;
    }

    get title() {
        return this._title;
    }

    set date(c) {
        this._date = date;
    }

    get date() {
        return this._date;
    }

    set description(c) {
        this._description = description;
    }

    get description() {
        return this._description;
    }

    set personInCharge(c) {
        this._personInCharge = personInCharge;
    }

    get personInCharge() {
        return this._personInCharge;
    }

    set participants(c) {
        this._participants = participants;
    }

    get participants() {
        return this._participants;
    }
}

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
/**
 *  Create a new movie record/object
 */
Event.add = function (slots) {
  const eventsCollRef = db.collection("events"),
        eventDocRef = eventsCollRef.doc( slots.eventId);
  try {
    await eventDocRef.set( slots);
  } catch( e) {
    console.error(`Error when adding event record: ${e}`);
    return;
  }
  console.log(`Event record ${slots.eventId} created.`);
};
/**
 *  Update an existing Movie record/object
 *  properties are updated with implicit setters for making sure
 *  that the new values are validated
 */
Event.update = function ({eventId, eventType, title, date, description, personInCharge, participants}) {
    const updSlots={};
    const eventRec = await Member.retrieve[memberId]  
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

    if (Object.keys( updSlots).length > 0) {
        try {
          await db.collection("events").doc(eventId).update( updSlots);
        } catch( e) {
          console.error(`Error when updating event record: ${e}`);
          return;
        }
        console.log(`Event record ${eventId} modified.`);
    }
};

/**
 *  Delete an existing Movie record/object
 */
Event.destroy = function (eventId) {
      try {
        await db.collection("events").doc( eventId).delete();
      } catch( e) {
        console.error(`Error when deleting event record: ${e}`);
        return;
      }
      console.log(`Event record ${eventId} deleted.`);
};

/**
 *  Load all movie table rows and convert them to objects
 *  Precondition: directors and people must be loaded first
 */
Event.retrieveAll = function () {
  const eventsCollRef = db.collection("members");
  var eventsQuerySnapshot=null;
  try {
    eventsQuerySnapshot = await eventsCollRef.get();
  } catch( e) {
    console.error(`Error when retrieving member records: ${e}`);
    return null;
  }
  const eventDocs = eventsQuerySnapshot.docs,
        eventRecords = eventDocs.map( d => d.data());
  console.log(`${eventRecords.length} event records retrieved.`);
  return eventRecords;
};

// Clear test data
Event.clearData = async function () {
  if (confirm("Do you really want to delete all event records?")) {
    // retrieve all book documents from Firestore
    const eventRecords = await Event.retrieveAll();
    // delete all documents
    await Promise.all( eventRecords.map(
      memberRec => db.collection("events").doc( eventRec.eventId).delete()));
    // ... and then report that they have been deleted
    console.log(`${Object.values( eventRecords).length} events deleted.`);
  }
};

Event.retrieve = async function (eventId) {
  const eventsCollRef = db.collection("events"),
        eventDocRef = membersCollRef.doc( eventId);
  var eventDocSnapshot=null;
  try {
    eventDocSnapshot = await eventDocRef.get();
  } catch( e) {
    console.error(`Error when retrieving event record: ${e}`);
    return null;
  }
  const eventRecord = eventDocSnapshot.data();
  return eventRecord;
};

export default Event;
export {EventTypeEL};