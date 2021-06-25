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

/****************************************************
 *** Class-level ("static") properties ***************
 *****************************************************/
// initially an empty collection (in the form of a map)
Ensemble.instances = {};

/**********************************************************
 ***  Class-level ("static") storage management methods ***
 **********************************************************/
/**
 *  Create a new person record/object
 */
Ensemble.add = function (slots) {

    let ensemble;
    try {
        ensemble = new Ensemble(slots);
    } catch (e) {
        console.log(`${e.constructor.name}: ${e.message}`);
        ensemble = null;
    }
    if (Ensemble) {
        Ensemble.instances[Ensemble.ensembleId] = ensemble;
        console.log(`Saved: ${ensemble.name}`);
    }
};

/**
 *  Update an existing person record/object
 */
Ensemble.update = function ({ensembleId, ensembleType, name, member, practicingLocation, practicingDate}) {

    const ensemble = Ensemble.instances[String(ensembleId)],
        objectBeforeUpdate = cloneObject(ensemble);
    let ending = "", updatedProperties = [];
    try {
        if (ensembleType && ensemble.ensembleType !== namensembleType) {
            ensemble.ensembleType = ensembleType;
            updatedProperties.push("ensembleType");
        }
        if (name && ensemble.name !== name) {
            ensemble.name = name;
            updatedProperties.push("name");
        }
        if (member && ensemble.member !== member) {
            ensemble.member = member;
            updatedProperties.push("member");
        }
        if (practicingLocation && ensemble.practicingLocation !== practicingLocation) {
            ensemble.practicingLocation = practicingLocation;
            updatedProperties.push("practicingLocation");
        }
        if (practicingDate && ensemble.practicingDate !== practicingDate) {
            ensemble.practicingDate = practicingDate;
            updatedProperties.push("practicingDate");
        }
    } catch (e) {
        console.log(`${e.constructor.name}: ${e.message}`);
        // restore object to its state before updating
        Ensemble.instances[ensembleId] = objectBeforeUpdate;
    }
};

/**
 *  Delete an person object/record
 *  Since the movie-person association is unidirectional, a linear search on all
 *  movies is required for being able to delete the person from the movies' persons.
 */
Ensemble.destroy = function (ensembleId) {

    const ensemble = Ensemble.instances[ensembleId];

    if (!ensemble) {
        console.log(`There is no ensemble with ID ${ensembleId} in the database!`);
        return false;
    }

    // make sure person to delete is director of no movie anymore -> delete movies
    /*for (const movieId of Object.keys(Movie.instances)) {
        const movie = Movie.instances[movieId];

        if (movie.about != undefined) {
            if(movie.about == personId) {
                Movie.destroy(movieId);
            }
        }
        if (movie.directorId == personId) {
            Movie.destroy(movieId);      
        }
    }

    // delete all dependent movie records
    for (const movieId of Object.keys(Movie.instances)) {
        const movie = Movie.instances[movieId];

        if (movie.actors[personId]) {

            //delete movie.actors[personId];
            movie.removeActor(personId);
        }
    }*/

    delete Ensemble.instances[ensembleId];
    console.log(`Ensemble ${Ensemble.ensembleId} deleted.`);

    return true;
};


/**
 *  Load all person records and convert them to objects
 */
Ensemble.retrieveAll = function () {

    let ensembles;
    if (!localStorage["ensembles"]) localStorage["ensembles"] = "{}";
    try {
        ensembles = JSON.parse(localStorage["ensembles"]);
    } catch (e) {
        console.log("Error when reading from Local Storage\n" + e);
        ensembles = {};
    }
    for (const key of Object.keys(ensembles)) {
        try {
            // convert record to (typed) object
            Ensemble.instances[key] = new Ensemble(ensembles[key]);
        } catch (e) {
            console.log(`${e.constructor.name} while deserializing ensemble ${key}: ${e.message}`);
        }
    }
    console.log(`${Object.keys(ensembles).length} ensemble records loaded.`);
};

/**
 *  Save all person objects as records
 */
Ensemble.saveAll = function () {

    const nmrOfEnsembles = Object.keys(Ensemble.instances).length;
    try {
        localStorage["ensembles"] = JSON.stringify(Ensemble.instances);
        console.log(`${nmrOfEnsembles} person records saved.`);
    } catch (e) {
        alert("Error when writing to Local Storage\n" + e);
    }
};

export default Ensemble;
