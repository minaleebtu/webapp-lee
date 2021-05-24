/**
 * @fileOverview  The model class Movie with attribute definitions, (class-level) check methods,
 *                setter methods, and the special methods saveAll and retrieveAll
 * @author Gerd Wagner (modified by Mina Lee)
 */
import Person from "./Person.mjs";
import {cloneObject, isIntegerOrIntegerString, createIsoDateString, isNonEmptyString} from "../../lib/util.mjs";
import {
    NoConstraintViolation, MandatoryValueConstraintViolation,
    RangeConstraintViolation, UniquenessConstraintViolation,
    IntervalConstraintViolation, StringLengthConstraintViolation
}
    from "../../lib/errorTypes.mjs";

/**
 * The class Movie
 * @class
 * @param {object} slots - Object creation slots.
 */
class Movie {
    // using a single record parameter with ES6 function parameter destructuring
    constructor ({movieId, title, releaseDate, actors, actorIdRefs,
                     director, director_id}) {
        this.movieId = movieId; // number (integer)
        this.title = title; // string
        this.releaseDate = releaseDate; // date
        // assign object references or ID references (to be converted in setter)
        this.actors = actors || actorIdRefs;
        if (director || director_id) this.director = director || director_id;
    }

    get movieId() {
        return this._movieId;
    }
    static checkMovieId( movieId) {
        if (!movieId) return new NoConstraintViolation();
        else if (!isIntegerOrIntegerString(movieId)) {
            return new RangeConstraintViolation("The value of movie ID must be an integer!");
        } else if (!isIntegerOrIntegerString(movieId) || parseInt(movieId) < 1) {
            return new RangeConstraintViolation(
                "The value of movie ID must be a positive integer!");
        } else {
            return new NoConstraintViolation();
        }
    }
    static checkMovieIdAsId( movieId) {
        var validationResult = Movie.checkMovieId( movieId);
        if ((validationResult instanceof NoConstraintViolation)) {
            if (!movieId) {
                validationResult = new MandatoryValueConstraintViolation(
                    "A value for the movie ID must be provided!");
            } else if (Movie.instances[movieId]) {
                validationResult = new UniquenessConstraintViolation(
                    `There is already a movie record with movie ID ${movieId}`);
            } else {
                validationResult = new NoConstraintViolation();
            }
        }
        return validationResult;
    }
    set movieId( movieId) {
        var validationResult = Movie.checkMovieIdAsId( movieId);
        if (validationResult instanceof NoConstraintViolation) {
            this._movieId = movieId;
        } else {
            throw validationResult;
        }
    }

    get title() {
        return this._title;
    }
    static checkTitle(title) {
        const TITLE_LENGTH_MAX = 120;
        if (!title) {
            return new MandatoryValueConstraintViolation("A title must be provided!");
        } else if (!isNonEmptyString(title)) {
            return new RangeConstraintViolation("The title must be a non-empty string!");
        } else if (title.length > TITLE_LENGTH_MAX) {
            return new StringLengthConstraintViolation(
                `The value of title must be at most ${TITLE_LENGTH_MAX} characters!`);
        }
        else {
            return new NoConstraintViolation();
        }
    }
    set title( title) {
        const validationResult = Movie.checkTitle( title);
        if (validationResult instanceof NoConstraintViolation) {
            this._title = title;
        } else {
            throw validationResult;
        }
    }

    get releaseDate() {
        return this._releaseDate;
    }
    static checkReleaseDate(rd) {
        const RELEASE_DATE_MIN = new Date("1895-12-28");
        if (!rd || rd === "") return new MandatoryValueConstraintViolation(
            "A value for the release date must be provided!"
        );
        else {
            if (new Date(rd) < RELEASE_DATE_MIN) {
                return new IntervalConstraintViolation(
                    `The value of release date must be greater than or equal to 
              ${createIsoDateString(RELEASE_DATE_MIN)}!`);
            } else {
                return new NoConstraintViolation();
            }
        }
    }
    set releaseDate( rd) {
        const validationResult = Movie.checkReleaseDate( rd);
        if (validationResult instanceof NoConstraintViolation) {
            this._releaseDate = new Date( rd);
        } else {
            throw validationResult;
        }
    }

    get director() {
        return this._director;
    }
    static checkDirector( director_id) {
        var validationResult = null;
        if (!director_id) {
            validationResult = new MandatoryValueConstraintViolation(
                "A value for the director must be provided!");
        } else {
            // invoke foreign key constraint check
            validationResult = Person.checkPersonIdAsIdRef( director_id);
        }
        return validationResult;
    }
    set director( director) {
        if (!director) {  // the director reference is to be deleted
            // delete the corresponding inverse reference from Person::directedMovies
            delete this._director.directedMovies[ this._movieId];
            // unset the director property
            delete this._director;
        } else {
            // director can be an ID reference or an object reference
            const director_id = (typeof director !== "object") ? director : director.personId;
            const constraintViolation = Movie.checkDirector( director_id);
            if (constraintViolation instanceof NoConstraintViolation) {
                if (this._director) {
                    // delete the obsolete inverse reference in Person::directedMovies
                    delete this._director.directedMovies[ this._movieId];
                }
                // create the new director reference
                this._director = Person.instances[ director_id];
                // add the new inverse reference to Person::directedMovies
                this._director.directedMovies[ this._movieId] = this;
            } else {
                throw constraintViolation;
            }
        }
    }

    get actors() {
        return this._actors;
    }
    static checkActor( actor_id) {
        var validationResult = null;
        if (!actor_id) {
            // actor(s) are optional
            validationResult = new NoConstraintViolation();
        } else {
            // invoke foreign key constraint check
            validationResult = Person.checkPersonIdAsIdRef( actor_id);
        }
        return validationResult;
    }
    addActor( actor) {
        // actor can be an ID reference or an object reference
        const actor_id = (typeof actor !== "object") ? parseInt( actor) : actor.personId;
        const validationResult = Movie.checkActor( actor_id);
        if (actor_id && validationResult instanceof NoConstraintViolation) {
            // add the new actor reference
            this._actors[actor_id] = Person.instances[actor_id];
            // automatically add the derived inverse reference
            this._actors[actor_id].playedMovies[this._movieId] = this;
        } else {
            throw validationResult;
        }
    }
    removeActor( actor) {
        // actor can be an ID reference or an object reference
        const actor_id = (typeof actor !== "object") ? parseInt( actor) : actor.personId;
        const validationResult = Movie.checkActor( actor_id);
        if (validationResult instanceof NoConstraintViolation) {
            // automatically delete the derived inverse reference
            delete this._actors[actor_id].playedMovies[this._movieId];
            // delete the actor reference
            delete this._actors[actor_id];
        } else {
            throw validationResult;
        }
    }
    set actors( actor) {
        this._actors = {};
        if (Array.isArray(actor)) {  // array of IdRefs
            for (const idRef of actor) {
                this.addActor( idRef);
            }
        } else {  // map of IdRefs to object references
            for (const idRef of Object.keys( actor)) {
                this.addActor( actor[idRef]);
            }
        }
    }

    // Serialize movie object
    toString() {
        var movieStr = `Movie{ movie ID: ${this.movieId}, title: ${this.title}, 
        releaseDate: ${createIsoDateString(this.releaseDate)}, director: ${this.director.name}`;
        // if (this.director) movieStr += `, director: ${this.director.name}`;
        return `${movieStr}, actors: ${Object.keys( this.actors).join(",")} }`;
    }

    // Convert object to record with ID references
    toJSON() {  // is invoked by JSON.stringify in Movie.saveAll
        var rec = {};
        // loop over all Movie properties
        for (const p of Object.keys( this)) {
            // copy only property slots with underscore prefix
            if (p.charAt(0) === "_") {
                switch (p) {
                    case "_director":
                        // convert object reference to ID reference
                        if (this._director) rec.director_id = this._director.personId;
                        break;
                    case "_actors":
                        // convert the map of object references to a list of ID references
                        rec.actorIdRefs = [];
                        Object.keys( this.actors).forEach( actorIdStr => {
                            rec.actorIdRefs.push( parseInt( actorIdStr));
                        });
                        break;
                    default:
                        // remove underscore prefix
                        rec[p.substr(1)] = this[p];
                }
            }
        }
        return rec;
    }
}
/************************************************
 *** Class-level ("static") properties **********
 ************************************************/
// initially an empty collection (in the form of a map)
Movie.instances = {};

/*********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
/**
 *  Create a new movie row
 */
Movie.add = function (slots) {
    var movie = null;
    try {
        movie = new Movie( slots);
    } catch (e) {
        console.log(`${e.constructor.name}: ${e.message}`);
        movie = null;
    }
    if (movie) {
        Movie.instances[movie.movieId] = movie;
        console.log(`${movie.toString()} created!`);
    }
};
/**
 *  Update an existing Movie row
 *  where slots contain the slots to be updated and performing the updates
 *  with setters makes sure that the new values are validated
 */
Movie.update = function ({movieId, title, releaseDate,
                             actorIdRefsToAdd, actorIdRefsToRemove, director_id}) {
    const movie = Movie.instances[movieId],
        objectBeforeUpdate = cloneObject( movie);  // save the current state of movie
    var noConstraintViolated = true, updatedProperties = [];
    try {
        if (title && movie.title !== title) {
            movie.title = title;
            updatedProperties.push("title");
        }
        if (releaseDate && createIsoDateString(movie.releaseDate) !== releaseDate) {
            movie.releaseDate = releaseDate;
            updatedProperties.push("releaseDate");
        }
        if (actorIdRefsToAdd) {
            updatedProperties.push("actors(added)");
            for (let actorIdRef of actorIdRefsToAdd) {
                movie.addActor( actorIdRef);
            }
        }
        if (actorIdRefsToRemove) {
            updatedProperties.push("actors(removed)");
            for (let actor_id of actorIdRefsToRemove) {
                movie.removeActor( actor_id);
            }
        }
        if (!movie.director && director_id) {
            movie.director = director_id;
            updatedProperties.push("director");
        } else if (director_id && movie.director.personId !== parseInt(director_id)) {
            movie.director = director_id;
            updatedProperties.push("director");
        }
    } catch (e) {
        console.log( e.constructor.name +": "+ e.message);
        noConstraintViolated = false;
        // restore object to its state before updating
        Movie.instances[movieId] = objectBeforeUpdate;
    }
    if (noConstraintViolated) {
        if (updatedProperties.length > 0) {
            let ending = updatedProperties.length > 1 ? "ies" : "y";
            console.log(`Propert${ending} ${updatedProperties.toString()} modified for movie ${movieId}`);
        } else {
            console.log(`No property value changed for movie ${movie.movieId}!`);
        }
    }
};
/**
 *  Delete an existing Movie row
 */
Movie.destroy = function (movieId) {
    const movie = Movie.instances[movieId];
    if (movie) {
        console.log(`${movie.toString()} deleted!`);
        if (movie.director) {
            // remove inverse reference from movie.director
            delete movie.director.directedMovies[movieId];
        }
        // remove inverse references from all movie.actors
        for (const actorID of Object.keys( movie.actors)) {
            delete movie.actors[actorID].playedMovies[movieId];
        }
        // finally, delete movie from Movie.instances
        delete Movie.instances[movieId];
    } else {
        console.log(`There is no movie with movie ID ${movieId} in the database!`);
    }
};
/**
 *  Load all movie table rows and convert them to objects
 */
Movie.retrieveAll = function () {
    var movies = {};
    try {
        if (!localStorage["movies"]) {
            localStorage.setItem("movies", JSON.stringify({}));
        } else {
            movies = JSON.parse( localStorage["movies"]);
            console.log(`${Object.keys( movies).length} movie records loaded.`);
        }
    } catch (e) {
        console.error("Error when reading from Local Storage\n" + e);
    }
    for (const movieId of Object.keys( movies)) {
        try {
            Movie.instances[movieId] = new Movie( movies[movieId]);
        } catch (e) {
            console.error(`${e.constructor.name} while deserializing movie ${movieId}: ${e.message}`);
        }
    }
};
/**
 *  Save all movie objects
 */
Movie.saveAll = function () {
    const nmrOfMovies = Object.keys( Movie.instances).length;
    try {
        localStorage["movies"] = JSON.stringify( Movie.instances);
        console.log(`${nmrOfMovies} movies saved.`);
    } catch (e) {
        console.error("Error when writing to Local Storage\n" + e);
    }
};

export default Movie;
