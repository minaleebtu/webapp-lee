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
Member.instances = {};

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
/**
 *  Create a new movie record/object
 */
Member.add = function (slots) {
    let member;
    try {
        member = new Member(slots);
    } catch (e) {
        console.log(`${e.constructor.name}: ${e.message}`);
        member = null;
    }
    if (member) {
        Member.instances[member.memberId] = member;
        console.log(`${member.toString()} created!`);
    }
};
/**
 *  Update an existing Movie record/object
 *  properties are updated with implicit setters for making sure
 *  that the new values are validated
 */
Member.update = function ({memberId, role, name, instrument, mailAddress}) {
    const member = Event.instances[memberId],
        objectBeforeUpdate = cloneObject(member);  // save the current state of movie
    try {
        if (member.role !== role) {
            member.role = role;
            updatedProperties.push("role");
        }

        if (member.date !== date) {
            member.date = date;
            updatedProperties.push("date");
        }

        if (member.name !== name) {
            member.name = name;
            updatedProperties.push("name");
        }

        if (member.instrument !== instrument) {
            member.instrument = instrument;
            updatedProperties.push("instrument");
        }

        if (event.mailAddress !== mailAddress) {
            event.mailAddress = mailAddress;
            updatedProperties.push("mailAddress");
        }

    } catch (e) {
        console.log(`${e.constructor.name}: ${e.message}`);
        Member.instances[memberId] = objectBeforeUpdate;
    }
};

/**
 *  Delete an existing Movie record/object
 */
Member.destroy = function (memberId) {
    if (Member.instances[memberId]) {
        console.log(`${Member.instances[memberId].toString()} deleted!`);
        delete Member.instances[memberId];
    } else {
        console.log(`There is no event with ID ${memberId} in the database!`);
    }
};

/**
 *  Load all movie table rows and convert them to objects
 *  Precondition: directors and people must be loaded first
 */
Member.retrieveAll = function () {
    let members = {};
    try {
        if (!localStorage["members"]) localStorage["members"] = "{}";
        else {
            members = JSON.parse(localStorage["members"]);
            console.log(`${Object.keys(members).length} member records loaded.`);
        }
    } catch (e) {
        alert("Error when reading from Local Storage\n" + e);
    }
    for (const memberId of Object.keys(members)) {
        try {
            Member.instances[memberId] = Member.convertRec2Obj(members[memberId]);
        } catch (e) {
            console.log(`${e.constructor.name} while deserializing movie ${memberId}: ${e.message}`);
        }
    }
};

// Convert record/row to object
Member.convertRec2Obj = function (memberRec) {
    let member = {};
    try {
        member = new Member(memberRec);
    } catch (e) {
        console.log(`${e.constructor.name} while deserializing a member record: ${e.message}`);

    }
    return member;
};

/**
 *  Save all movie objects
 */
Member.saveAll = function () {
    const nmrOfEvents = Object.keys(Member.instances).length;
    try {
        localStorage["members"] = JSON.stringify(Member.instances);
        console.log(`${nmrOfEvents} event records saved.`);
    } catch (e) {
        alert("Error when writing to Local Storage\n" + e);
    }
};

export default Member;
export {InstrumentEL};