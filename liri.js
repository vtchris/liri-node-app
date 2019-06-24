//Required Packages
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const inquirer = require("inquirer");
const keys = require("./keys");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);

//API Keys
const bandsInTownKey = keys.bandsInTown.id;
const omdbAPIkey = keys.omdb.id;

start_liri();

function start_liri() {

    //Time to talk to the User
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            choices: ["concert-this", "spotify-this", "movie-this", "surprise-me-this"],
            message: "How may I help you?"
        }
    ]).then(function (Q1response) {

        append_log("********** USER REQUEST - " + moment().format("MM/DD/YYYY, h:mm:ss a ") + "**********");
        append_log("USER REQUEST: " + Q1response.action);

        if (Q1response.action != "surprise-me-this") {

            inquirer.prompt([
                {
                    name: "search-what",
                    type: "input",
                    message: "What do you want to search?"
                }
            ]).then(function (Q2response) {

                append_log("USER SEARCH: " + Q2response["search-what"]);

                switch (Q1response.action) {
                    case "concert-this":
                        search_concerts(Q2response["search-what"]);
                        break;
                    case "movie-this":
                        search_movies(Q2response["search-what"]);
                        break;
                    case "spotify-this":
                        search_songs(Q2response["search-what"]);
                        break;
                }

            })
        } else {
            console.log("SURPRISE!");

            fs.readFile("random.txt", "utf8", function (error, data) {
                if (error) {
                    console.log(error);
                }

                // Then split it by commas (to make it more readable)
                var dataArr = data.split(",");

                // We will then re-display the content as an array for later use.
                console.log(dataArr);

                switch (dataArr[0]) {
                    case "concert-this":
                        search_concerts(dataArr[1]);
                        break;
                    case "movie-this":
                        search_movies(dataArr[1]);
                        break;
                    case "spotify-this":
                        search_songs(dataArr[1]);
                        break;
                }
            })
        }
    })
}
function search_concerts(bandName) {

    axios.get("https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=" + bandsInTownKey).then(
        function (response) {

            for (var i = 0; i < response.data.length; i++) {

                let header = "********** EVENT **********"
                let artist = "ARTIST: " + bandName.toUpperCase();
                let dt = "DATE:   " + moment(response.data[i].datetime).format("MM/DD/YYYY");
                let venue = "VENUE:  " + response.data[i].venue.name;
                let city = "CITY:   " + response.data[i].venue.city;
                let country = "COUNTRY:" + response.data[i].venue.country;

                console.log(header);
                console.log(artist);
                console.log(dt);
                console.log(venue);
                console.log(city);
                console.log(country);

                append_log(header);
                append_log(artist);
                append_log(dt);
                append_log(venue);
                append_log(city);
                append_log(country);

            }

            console.log("");
            setTimeout(start_liri, 4000);

        })
        .catch(function (error) {
            if (error.response) {

                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {

                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);

            } else {

                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }

            console.log(error.config);

        });

}

function search_movies(movieName) {

    if (movieName === "") {
        movieName = "Mr Nobody";
        let suggestion1 = "May I suggest Mr Nobody?";
        let suggestion2 = "It's on Netflix!";

        console.log("");
        console.log(suggestion1);
        console.log(suggestion2);
        console.log("");

        append_log(suggestion1);
        append_log(suggestion2);

    }

    // Then run a request with axios to the OMDB API with the movie specified
    axios.get("http://www.omdbapi.com/?t=" + movieName + "&apikey=" + omdbAPIkey).then(
        function (response) {

            //Notify user if movie not found
            if (response.data.Response === "False") {
                console.log(response.data.Error)
                append_log(response.data.Error)
                console.log("");
                setTimeout(start_liri, 4000);
                return
            }

            var Rotten = "";

            for (var i = 0; i < response.data.Ratings.length; i++) {
                if (response.data.Ratings[i].Source === 'Rotten Tomatoes') {
                    Rotten = response.data.Ratings[i].Value;
                }
            }

            let header = "********** MOVIE **********";
            let title = "TITLE:           " + response.data.Title;
            let rated = "RATED:           " + response.data.Rated;
            let imdb = "IMDB RATING:     " + response.data.imdbRating;
            let tomatoes = "ROTTEN TOMATOES: " + Rotten;
            let plot = "PLOT:            " + response.data.Plot;
            let actors = "ACTORS:          " + response.data.Actors;
            let release = "RELEASE:         " + response.data.Year;
            let country = "COUNTRY:         " + response.data.Country;
            let language = "LANGUAGE:        " + response.data.Language;

            //console.log(response.data)
            console.log(header);
            console.log(title);
            console.log(rated);
            console.log(imdb);
            console.log(tomatoes);
            console.log(plot);
            console.log(actors);
            console.log(release);
            console.log(country);
            console.log(language);

            append_log(header);
            append_log(title);
            append_log(rated);
            append_log(imdb);
            append_log(tomatoes);
            append_log(plot);
            append_log(actors);
            append_log(release);
            append_log(country);
            append_log(language);

            console.log("");
            setTimeout(start_liri, 4000);

        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        }
        );

}
function search_songs(songName) {

    if (songName === "") {
        songName = "The Sign Ace of Base";
    }

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        for (var i = 0; i < data.tracks.items.length; i++) {

            let header = "********** SONG **********";
            let track = "NAME:    " + data.tracks.items[i].name;
            let artist = "ARTIST:  " + data.tracks.items[i].artists[0].name;
            let album = "ALBUM:   " + data.tracks.items[i].album.name;
            let release = "RELEASE: " + data.tracks.items[i].album.release_date;
            let preview = "PREVIEW: " + data.tracks.items[i].external_urls.spotify;

            console.log(header);
            console.log(track);
            console.log(artist);
            console.log(album);
            console.log(release);
            console.log(preview);
            console.log("");

            append_log(header);
            append_log(track);
            append_log(artist);
            append_log(album);
            append_log(release);
            append_log(preview);
        }

        console.log("");
        setTimeout(start_liri, 4000);

    });
}
function append_log(appendText) {

    fs.appendFileSync("log.txt", appendText + "\n");

}