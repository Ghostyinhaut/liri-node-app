require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');

var moment = require('moment')

//console.log(process.env.SPOTIFY_ID);
//console.log(process.env.SPOTIFY_SECRET);

var spotify = new Spotify(keys.spotify);

//input data
var topic=process.argv[2];
var name=process.argv.slice(3).join(" ");

console.log(topic);
console.log(name);
//run functions 
if(topic=="movie-this"){
    searchMovie(name);
}else if(topic=="concert-this"){
    searchConcert(name);
}else if(topic=="spotify-this-song"){
    searchMusic(name);
}else {
    searchMusic(name);
    searchConcert(name);
    searchMusic(name);
}

//spotify section, spotify can be found in node.js


function searchMusic(name){
    if(!name){
        name = "The sigin";
    }
    spotify.search({ type: 'track', query: name }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        for (var i = 0; i < 5; i++) {
            console.log("Artist Name: "+data.tracks.items[i].artist[0].name); 
            console.log("Song name: "+data.tracks.items[i].name);
            console.log("Link: "+data.tracks.items[i].album.name);
            console.log("Album"+data.tracks.items[i].preview_url);
            console.log("-------------------------------------");
        }
      });
}


//use axios to pull data from omdb and bands in town



//function for pulling Movie data
function searchMovie(movieName){
    var fix=movieName.replace(/ /g,"+");
    console.log(fix);
    //dauflt when name is undefine

    axios.get("http://www.omdbapi.com/?t="+fix+"&y=&plot=short&apikey=trilogy").then(
    function(response) {
      console.log("Movie Title: "+response.data.Title);
      console.log("Year: "+response.data.Year);
      console.log("IMDB Rating: "+response.data.Ratings[0]);
      console.log("Rotten Rating: "+response.data.Ratings[1]);
      console.log("Conutry: "+response.data.Country);
      console.log("Language: "+response.data.Language);
      console.log("Plot of Movie: "+response.data.Plot);
      console.log("Actors List: "+response.data.Actors);
      console.log("-------------------------------------");
    })
    .catch(function(error) {
      console.log("error");
    });

}

//funciton for pulling concert data
function searchConcert(artistName){
    axios.get("https://rest.bandsintown.com/artists/" + artistName+ "/events?app_id=codingbootcamp").then(
  function(response) {
    for (var i = 0; i < response.data.length; i++) {

        var datetime = response.data[i].datetime; 
        var dateArr = datetime.split('T'); 

        console.log("--------------------------------------------------------------------");
        console.log("Venue Name: " + response.data[i].venue.name); 
        console.log("Venue Location: " + response.data[i].venue.city);
        console.log("Date of the Event: " + moment(dateArr[0], "MM-DD-YYYY")); 
        
    
    }

  })
  .catch(function(error) {
    console.log("error");
  });
}
