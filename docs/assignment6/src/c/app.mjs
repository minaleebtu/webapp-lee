/**
 * @fileOverview  Auxiliary data management procedures
 * @author Gerd Wagner (modified by Mina Lee)
 */
import Person from "../m/Person.mjs";
import Director from "../m/Director.mjs";
import Actor from "../m/Actor.mjs";
import Movie, { MovieCategoryEL } from "../m/Movie.mjs";

/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 *  Create and save test data
 */
function generateTestData() {
    try {
        // Director.instances["1"] = new Director({
        //   personId: 1,
        //   name: "Quentin Tarantino"
        // });
        // Director.instances["2"] = new Director({
        //   personId: 2,
        //   name: "George Lucas"
        // });
        // Director.instances["4"] = new Director({
        //   personId: 4,
        //   name: "Francis Ford Coppola"
        // });
        // Director.saveAll();
        //
        // Actor.instances["4"] =  new Actor({
        //   personId: 4,
        //   name: "Francis Ford Coppola",
        //   agent: "merong"
        // })
        // Actor.instances["5"] = new Actor({
        //   personId: 5,
        //   name: "Uma Thurman",
        //   agent: "Agent Uma"
        // });
        // Actor.instances["6"] = new Actor({
        //   personId: 6,
        //   name: "John Travolta",
        //   agent: "Agent John"
        // });
        // Actor.instances["7"] = new Actor({
        //   personId: 7,
        //   name: "Ewan McGregor",
        //   agent: "Agent Ewan"
        // });
        // Actor.instances["8"] = new Actor({
        //   personId: 8,
        //   name: "Natalie Portman",
        //   agent: "Agent Natalie"
        // });
        // Actor.instances["9"] = new Actor({
        //   personId: 9,
        //   name: "Brad Pitt",
        //   agent: "Agent Brad"
        // });
        // Actor.instances["10"] = new Actor({
        //   personId: 10,
        //   name: "Ten Zehn",
        //   agent: "Agent Ten"
        // });
        // Actor.instances["11"] = new Actor({
        //   personId: 11,
        //   name: "Marlon Brando",
        //   agent: "Agent Marlon"
        // });
        // Actor.instances["12"] = new Actor({
        //   personId: 12,
        //   name: "Al Pacino",
        //   agent: "Agent Al"
        // });
        // Actor.saveAll();
        Person.instances["16"] = new Person({
            personId: 16,
            name: "John Forbes Nash",
        });
        Person.instances["17"] = new Person({
            personId: 17,
            name: "John Doe"
        });
        Person.instances["18"] = new Person({
            personId: 18,
            name: "Jane Doe"
        });
        Person.saveAll();

        Director.instances["1"] = new Director({
            personId: 1,
            name: "Stephen Frears"
        });
        Director.instances["2"] = new Director({
            personId: 2,
            name: "George Lucas"
        });

        Director.instances["3"] = new Director({
            personId: 3,
            name: "Quentin Tarantino"
        });
        Actor.instances["3"] = new Actor({
            personId: 3,
            name: "Quentin Tarantino"
        });

        Actor.instances["5"] = new Actor({
            personId: 5,
            name: "Uma Thurman",
            agent: Person.instances["17"].name
        });
        Actor.instances["6"] = new Actor({
            personId: 6,
            name: "John Travolta"
        });
        Actor.instances["7"] = new Actor({
            personId: 7,
            name: "Ewan McGregor"
        });
        Actor.instances["8"] = new Actor({
            personId: 8,
            name: "Natalie Portman"
        });
        Actor.instances["9"] = new Actor({
            personId: 9,
            name: "Keanu Reeves",
            agent: Person.instances["18"].name
        });

        Director.instances["10"] = new Director({
            personId: 10,
            name: "Russell Crowe",
            agent: Person.instances["18"].name
        });
        Actor.instances["10"] = new Actor({
            personId: 10,
            name: "Russell Crowe"
        });

        Actor.instances["11"] = new Actor({
            personId: 11,
            name: "Seth MacFarlane"
        });
        Actor.instances["12"] = new Actor({
            personId: 12,
            name: "Naomi Watts"
        });
        Director.instances["13"] = new Director({
            personId: 13,
            name: "Daniel Minahan"
        });
        Actor.instances["14"] = new Actor({
            personId: 14,
            name: "Ed Harris",
            agent: Person.instances["17"].name
        });
        Director.instances["15"] = new Director({
            personId: 15,
            name: "Marc Forster"
        });
        Director.saveAll();
        Actor.saveAll();

        Movie.instances[1] = new Movie({
            movieId: 1,
            title: "Pulp Fiction",
            releaseDate: new Date("1994-05-12"),
            director_id: 3,
            actorIdRefs: [3,5,6]
        });
        Movie.instances[2] = new Movie({
            movieId: 2,
            title: "Star Wars",
            releaseDate: new Date("1977-05-25"),
            director_id: 2,
            actorIdRefs: [7,8]
        });
        Movie.instances[3] = new Movie({
            movieId: 3,
            title: "Dangerous Liaisons",
            releaseDate: new Date("1988-12-16"),
            director_id: 1,
            actorIdRefs: [9,5]
        });
        Movie.instances[4] = new Movie({
            movieId: 4,
            title: "2015",
            releaseDate: new Date("2019-06-30"),
            director_id: 1,
            actorIdRefs: [10,11,12],
            category: MovieCategoryEL.TVSERIESEPISODE,
            tvSeriesName: "The Loudest Voice",
            episodeNo: 6
        });
        Movie.instances[5] = new Movie({
            movieId: 5,
            title: "A Beautiful Mind",
            releaseDate: new Date("2001-12-21"),
            director_id: 10,
            actorIdRefs: [10,14],
            category: MovieCategoryEL.BIOGRAPHY,
            about: Person.instances["16"].name
        });
        Movie.instances[6] = new Movie({
            movieId: 6,
            title: "Stay",
            releaseDate: new Date("2005-09-24"),
            director_id: 15,
            actorIdRefs: [7,12]
        });
        Movie.saveAll();

    } catch (e) {
        console.log( `${e.constructor.name}: ${e.message}`);
    }
}

/**
 * Clear data
 */
function clearData() {
    if (confirm( "Do you really want to delete the entire database?")) {
        try {
            [Director, Actor, Person, Movie].forEach(Class => {
                Class.instances = {};
            });
            /*
                Director.instances = {};
                Actor.instances = {};
                Person.instances = {};
                Movie.instances = {};
            */
            localStorage["directors"] = localStorage["actors"] = localStorage["people"] = "{}";
            localStorage["movies"] = "{}";
            console.log("All data cleared.");
        } catch (e) {
            console.log(`${e.constructor.name}: ${e.message}`);
        }
    }
}

export { generateTestData, clearData };
