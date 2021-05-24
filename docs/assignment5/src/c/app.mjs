/**
 * @fileOverview  Auxiliary data management procedures
 * @author Gerd Wagner (modified by Mina Lee)
 */
import Person from "../m/Person.mjs";
import Movie from "../m/Movie.mjs";

/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 *  Create and save test data
 */
function generateTestData() {
  try {
    Person.instances["1"] = new Person({personId: 1, name: "Quentin Tarantino"});
    Person.instances["2"] = new Person({personId: 2, name: "George Lucas"});
    Person.instances["4"] = new Person({personId: 4, name: "Francis Ford Coppola"});
    Person.instances["5"] = new Person({personId: 5, name: "Uma Thurman"});
    Person.instances["6"] = new Person({personId: 6, name: "John Travolta"});
    Person.instances["7"] = new Person({personId: 7, name: "Ewan McGregor"});
    Person.instances["8"] = new Person({personId: 8, name: "Natalie Portman"});
    Person.instances["9"] = new Person({personId: 9, name: "Brad Pitt"});
    Person.instances["11"] = new Person({personId: 11, name: "Marlon Brando"});
    Person.instances["12"] = new Person({personId: 12, name: "Al Pacino"});
    Person.saveAll();

    Movie.instances[1] = new Movie({
      movieId: 1,
      title: "Pulp Fiction",
      releaseDate: new Date("1994-05-12"),
      director_id: 1,
      actorIdRefs: [5,6]
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
      title: "Inglourious Basterds",
      releaseDate: new Date("2009-05-20"),
      director_id: 1,
      actorIdRefs: [9,1]
    });
    Movie.instances[4] = new Movie({
      movieId: 4,
      title: "The Godfather",
      releaseDate: new Date("1972-03-15"),
      director_id: 4,
      actorIdRefs: [11,12]
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
      Person.instances = {};
      localStorage["persons"] = "{}";
      Movie.instances = {};
      localStorage["movie"] = "{}";
      console.log("All data cleared.");
    } catch (e) {
      console.log( `${e.constructor.name}: ${e.message}`);
    }
  }
}

export { generateTestData, clearData };
