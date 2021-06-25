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

    // Serialize movie object
    /*toString() {
        let movieStr = `Movie{ ID: ${this.movieId}, title: ${this.title}, date: ${this.releaseDate}`;
        if (this.directorId) movieStr += `, director: ${this.directorId}`;
        return `${movieStr}, actors: ${Object.keys(this.actors).join(",")} }`;
    }*/

    // Convert object to record with ID references
    /*toJSON() {  // is invoked by JSON.stringify
        const rec = {};
        for (const p of Object.keys(this)) {
            // copy only property slots with underscore prefix
            if (p.charAt(0) === "_") {
                switch (p) {
                    case "_directorId":
                        // convert object reference to ID reference
                        if (this._directorId) rec.directorId = this._directorId;
                        break;

                    case "_actors":
                        // convert the map of object references to a list of ID references
                        rec.actors = [];
                        for (const personIdStr of Object.keys(this._actors)) {
                            rec.actors.push(parseInt(personIdStr));
                        }
                        break;

                    default:
                        // remove underscore prefix
                        rec[p.substr(1)] = this[p];
                }
            }
        }
        return rec;
    }*/
}

/***********************************************
 *** Class-level ("static") properties **********
 ************************************************/
// initially an empty collection (in the form of a map)
Event.instances = {};

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
/**
 *  Create a new movie record/object
 */
Event.add = function (slots) {
    let event;
    try {
        event = new Event(slots);
    } catch (e) {
        console.log(`${e.constructor.name}: ${e.message}`);
        event = null;
    }
    if (event) {
        Event.instances[event.eventId] = event;
        console.log(`${event.toString()} created!`);
    }
};
/**
 *  Update an existing Movie record/object
 *  properties are updated with implicit setters for making sure
 *  that the new values are validated
 */
Event.update = function ({eventId, eventType, title, date, description, personInCharge, participants}) {
    const event = Event.instances[eventId],
        objectBeforeUpdate = cloneObject(movie);  // save the current state of movie
    try {

        if (event.eventType !== eventType) {
            event.eventType = eventType;
            updatedProperties.push("eventType");
        }

        if (event.title !== title) {
            event.title = title;
            updatedProperties.push("title");
        }

        if (event.date !== date) {
            event.date = date;
            updatedProperties.push("date");
        }

        if (event.description !== description) {
            event.description = description;
            updatedProperties.push("description");
        }

        if (event.personInCharge !== personInCharge) {
            event.personInCharge = personInCharge;
            updatedProperties.push("personInCharge");
        }

        if (event.participants !== participants) {
            event.participants = participants;
            updatedProperties.push("participants");
        }

    } catch (e) {
        console.log(`${e.constructor.name}: ${e.message}`);
        Event.instances[eventId] = objectBeforeUpdate;
    }
};

/**
 *  Delete an existing Movie record/object
 */
Event.destroy = function (eventId) {
    if (Event.instances[eventId]) {
        console.log(`${Event.instances[eventId].toString()} deleted!`);
        delete Event.instances[eventId];
    } else {
        console.log(`There is no event with ID ${eventId} in the database!`);
    }
};

/**
 *  Load all movie table rows and convert them to objects
 *  Precondition: directors and people must be loaded first
 */
Event.retrieveAll = function () {
    let events = {};
    try {
        if (!localStorage["events"]) localStorage["events"] = "{}";
        else {
            events = JSON.parse(localStorage["events"]);
            console.log(`${Object.keys(events).length} event records loaded.`);
        }
    } catch (e) {
        alert("Error when reading from Local Storage\n" + e);
    }
    for (const eventId of Object.keys(events)) {
        try {
            Event.instances[eventId] = Event.convertRec2Obj(events[eventId]);
        } catch (e) {
            console.log(`${e.constructor.name} while deserializing movie ${eventId}: ${e.message}`);
        }
    }
};

// Convert record/row to object
Event.convertRec2Obj = function (eventRec) {
    let event = {};
    try {
        event = new Member(eventRec);
    } catch (e) {
        console.log(`${e.constructor.name} while deserializing a event record: ${e.message}`);

    }
    return event;
};

/**
 *  Save all movie objects
 */
Event.saveAll = function () {
    const nmrOfEvents = Object.keys(Event.instances).length;
    try {
        localStorage["events"] = JSON.stringify(Member.instances);
        console.log(`${nmrOfEvents} event records saved.`);
    } catch (e) {
        alert("Error when writing to Local Storage\n" + e);
    }
};

export default Event;
export {EventTypeEL};