/**
 * @fileOverview  The model class Person with property definitions, (class-level) check methods,
 *                setter methods, and the special methods saveAll and retrieveAll
 * @author Gerd Wagner (modified by Mina Lee)
 */
import {cloneObject, isNonEmptyString} from "../../lib/util.mjs";
import { NoConstraintViolation, MandatoryValueConstraintViolation,
    RangeConstraintViolation, UniquenessConstraintViolation,
    ReferentialIntegrityConstraintViolation }
    from "../../lib/errorTypes.mjs";
import Movie from "./Movie.mjs";

/**
 * The class Person
 * @class
 * @param {object} slots - Object creation slots.
 */
class Person {
    // using a single record parameter with ES6 function parameter destructuring
    constructor ({personId, name}) {
        // assign properties by invoking implicit setters
        this.personId = personId;  // number (integer)
        this.name = name;  // string
        // derived inverse reference property (inverse of Movie::director)
        this._directedMovies = {};  // initialize as an empty map of Movie objects
        // derived inverse reference property (inverse of Movie::actors)
        this._playedMovies = {};  // initialize as an empty map of Movie objects
    }

    get personId() {
        return this._personId;
    }
    static checkPersonId( id) {
        if (!id) {
            return new NoConstraintViolation();  // may be optional as an IdRef
        } else {
            // convert to integer
            id = parseInt( id);
            if (isNaN( id) || !Number.isInteger( id) || id < 1) {
                return new RangeConstraintViolation("The person ID must be a positive integer!");
            } else {
                return new NoConstraintViolation();
            }
        }
    }
    static checkPersonIdAsId( id) {
        var constraintViolation = Person.checkPersonId(id);
        if ((constraintViolation instanceof NoConstraintViolation)) {
            id = parseInt( id);  // convert to integer
            if (isNaN(id)) {
                return new MandatoryValueConstraintViolation(
                    "A positive integer value for the person ID is required!");
            } else if (Person.instances[id]) {
                constraintViolation = new UniquenessConstraintViolation(
                    "There is already a person record with this person ID!");
            } else {
                constraintViolation = new NoConstraintViolation();
            }
        }
        return constraintViolation;
    }
    static checkPersonIdAsIdRef( id) {
        var constraintViolation = Person.checkPersonId( id);
        if ((constraintViolation instanceof NoConstraintViolation) &&
            id !== undefined) {
            if (!Person.instances[String(id)]) {
                constraintViolation = new ReferentialIntegrityConstraintViolation(
                    "There is no person record with this person ID!");
            }
        }
        return constraintViolation;
    }
    set personId( id) {
        var constraintViolation = Person.checkPersonIdAsId( id);
        if (constraintViolation instanceof NoConstraintViolation) {
            this._personId = parseInt( id);
        } else {
            throw constraintViolation;
        }
    }

    get name() {
        return this._name;
    }
    static checkName(n) {
        if (!n) {
            return new MandatoryValueConstraintViolation("A name must be provided!");
        } else if (!isNonEmptyString(n)) {
            return new RangeConstraintViolation("The name must be a non-empty string!");
        } else {
            return new NoConstraintViolation();
        }
    }
    set name( n) {
        const constraintViolation = Person.checkName( n);
        if (constraintViolation instanceof NoConstraintViolation) {
            this._name = n;
        } else {
            throw constraintViolation;
        }
    }

    get directedMovies() {
        return this._directedMovies;
    }
    get playedMovies() {
        return this._playedMovies;
    }


    // Convert object to record with ID references
    toJSON() {  // is invoked by JSON.stringify in Person.saveAll
        var rec = {};
        // loop over all Person properties
        for (const p of Object.keys( this)) {
            // keep underscore-prefixed properties except "_directedMovies" and "_playedMovies"
            if (p.charAt(0) === "_" && p !== "_directedMovies" || "_playedMovies") {
                // remove underscore prefix
                rec[p.substr(1)] = this[p];
            }
        }
        return rec;
    }
}
/****************************************************
 *** Class-level ("static") properties ***************
 *****************************************************/
// initially an empty collection (in the form of a map)
Person.instances = {};

/**********************************************************
 ***  Class-level ("static") storage management methods ***
 **********************************************************/
/**
 *  Create a new person record/object
 */
Person.add = function (slots) {
    var person = null;
    try {
        person = new Person( slots);
    } catch (e) {
        console.log(`${e.constructor.name}: ${e.message}`);
        person = null;
    }
    if (person) {
        Person.instances[String(person.personId)] = person;
        console.log(`Saved: ${person.name}`);
    }
};
/**
 *  Update an existing person record
 */
Person.update = function ({personId, name}) {
    const person = Person.instances[String( personId)],
        objectBeforeUpdate = cloneObject( person);
    var noConstraintViolated = true, ending = "", updatedProperties = [];
    try {
        if (name && person.name !== name) {
            person.name = name;
            updatedProperties.push("name");
        }
    } catch (e) {
        console.log(`${e.constructor.name}: ${e.message}`);
        noConstraintViolated = false;
        // restore object to its state before updating
        Person.instances[String(personId)] = objectBeforeUpdate;
    }
    if (noConstraintViolated) {
        if (updatedProperties.length > 0) {
            ending = updatedProperties.length > 1 ? "ies" : "y";
            console.log(`Propert${ending} ${updatedProperties.toString()} modified for person ${name}`);
        } else {
            console.log(`No property value changed for person ${name}!`);

        }
    }
};
/**
 *  Delete an existing person record
 *  Since the movie-director, movie-actor association are bidirectional,
 *  an actor or a director can be directly
 *  deleted from the movies' director, actors, instead of doing a linear search on all movies
 *  as required for the case of a unidirectional association.
 */
Person.destroy = function (personId) {
    const person = Person.instances[personId];

    // delete all references to this director in movie objects
    for (const movieId of Object.keys( Movie.instances)) {
        const movie = Movie.instances[movieId];
        if (movie.director === person) {
            delete movie._director;  // delete the slot
            console.log(`Movie ${movie.movieId} updated.`);
        }
    }

    // delete all dependent movie records
    for (const movieId of Object.keys( person.playedMovies)) {
        let movie = person.playedMovies[movieId];
        if (movie.actors[personId]) delete movie.actors[personId];
    }
    // delete the person record
    delete Person.instances[personId];
    console.log(`Person ${person.name} deleted.`);

};
/**
 *  Load all person records and convert them to objects
 */
Person.retrieveAll = function () {
    var persons = {};
    if (!localStorage["persons"]) localStorage["persons"] = "{}";
    try {
        persons = JSON.parse( localStorage["persons"]);
    } catch (e) {
        console.error( "Error when reading from Local Storage\n" + e);
        persons = {};
    }
    for (const key of Object.keys( persons)) {
        try {
            Person.instances[key] = new Person( persons[key]);
        } catch (e) {
            console.log(`${e.constructor.name} while deserializing person ${key}: ${e.message}`);
        }
    }
    console.log(`${Object.keys( persons).length} person records loaded.`);
};
/**
 *  Save all person objects as records
 */
Person.saveAll = function () {
    const keys = Object.keys( Person.instances);
    try {
        localStorage["persons"] = JSON.stringify( Person.instances);
        console.log(`${keys.length} person records saved.`);
    } catch (e) {
        console.error("Error when writing to Local Storage\n" + e);
    }
};

export default Person;
