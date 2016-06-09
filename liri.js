var request = require('request'); //ajax
var fs = require('fs'); //reads files
var keys = require('./keys.js'); //pulls info from keys 
var Twitter = require('twitter'); //Twitter connect
var spotify = require('spotify'); //Spotify connect 


// The switch-case will direct which function gets run.
// console.log(process.argv[2]);

var cases = process.argv[2];

var action = function(caseData, functionData){
switch(caseData){
    case 'my-tweets':
        getTweets();
        break;
    case 'spotify-this-song':
        getSong();
        break;
    case 'movie-this':
        getMovie(functionData);
        break;
    case 'do-what-it-says':
        getRandom();
        break;
    default:
    	console.log('How can LIRI help?');
	}

};



var getTweets = function() {
	var client = new Twitter(keys.twitterKeys);


    // client.get('statuses/user_timeline.json?screen_name=jenesis15&count=20', {q: 'node.js'}, function(err, tweets, response){

    //     if(err){
    //         return console.log(err);
    //     }

    //     if(client){

    //         obj = tweets;

    //         for(var prop in obj){
    //             console.log(obj[prop].created_at + "\n");
    //             console.log("Tweet: " + obj[prop].text);
    //             console.log('==============================================')
    //         }

    //     }
    // });
var params = {screen_name: 'jenesis15',
                count: 20  
              };

client.get('statuses/user_timeline.json', params, function(error, tweets, response){

  		if (!error) {
                // console.log(tweets);
                for (var i = 0; i < 20; i++) {
                var tweetTime = tweets[i].created_at;
                var tweetText = tweets[i].text;
                console.log(tweetTime);
                console.log(tweetText);
                console.log('==============================================')

                }

                     } 

        var tweetData = tweetTime + '\n' + tweetText;
         fs.appendFileSync('log.txt', '\n' + tweetData + '\n', 'utf8', function(err) {
            if (err) throw err;
        })
        //End Write Spotify
        });
}

var getSong = function(song) {

    var song = process.argv[3];

    if (song == undefined) {
        song = "What's my Age Again?"
    };
    
    spotify.search({type: 'track', query: song}, function(err, data) {

        console.log(" ")//Empty
        console.log("Song: " + data.tracks.items[0].name)
        console.log("Album: " + data.tracks.items[0].album.name)

        var numOfArtists = data.tracks.items[0].artists.length
        var artistArray = []

        for (var i = 0; i < numOfArtists; i++) {
            artistArray.push(data.tracks.items[0].artists[i].name)
        }

        console.log("Artist(s): " + artistArray)
        console.log("Preview URL: " + data.tracks.items[0].preview_url)

        //Write Spotify
        var spotifyData = "Song: " + data.tracks.items[0].name + '\n' + "Album: " + data.tracks.items[0].album.name + '\n' + "Artist(s): " + artistArray + '\n' + "Preview URL: " + data.tracks.items[0].preview_url + '\n';
        fs.appendFileSync('log.txt', '\n' + spotifyData + '\n', 'utf8', function(err) {
            if (err) throw err;
        })
        //End Write Spotify
        
    })//End Spotify	

};

var getMovie = function() {
    var request = require('request');

    // request(search, function (error, response, body){
        var search = process.argv;

        // Create an empty variable for holding the movie name
        var movieName = "";

        if (search === undefined){
            search = "Mr. Nobody";
        };

        // Loop through all the words in the node argument
        // And do a little for-loop magic to handle the inclusion of "+"s
        for (var i=3; i<search.length; i++){
            if (i>3 && i< search.length){
                movieName = movieName + "+" + search[i];
            } 

            else {
                movieName = movieName + search[i];
            }
        };

        // Then run a request to the OMDB API with the movie specified 
        var url = 'http://www.omdbapi.com/?t=' + movieName +'&y=&plot=short&r=json&tomatoes=true';

        // This line is just to help us debug against the actual URL.  
        console.log(url);

        request(url, function (error, response, body) {
                if (!error && response.statusCode == 200){
                    console.dir("Title: " + JSON.parse(body)['Title'])
                    console.dir("Release Year: " + JSON.parse(body)["Year"])
                    console.dir("Imdb Rating: " + JSON.parse(body)['imdbRating'])
                    console.dir("Country: " + JSON.parse(body)['Country'])
                    console.dir("Language: " + JSON.parse(body)['Language'])
                    console.dir("Plot: " + JSON.parse(body)['Plot'])
                    console.dir("Actors: " + JSON.parse(body)['Actors'])
                    console.dir("Rotton Tomatoes: " + JSON.parse(body)['tomatoRating'])
                    console.log("Rotton Tomatoes URL: " + JSON.parse(body)['tomatoURL'])

        //Write movie data
        var movieData = "Title: " + JSON.parse(body)['Title'] + '\n' + "Release Year: " + JSON.parse(body)["Year"] + '\n' + "Imdb Rating: " + JSON.parse(body)['imdbRating'] + '\n' + "Country: " + JSON.parse(body)['Country'] + '\n' + "Language: " + JSON.parse(body)['Language'] + '\n' + "Plot: " + JSON.parse(body)['Plot'] + '\n' + "Actors: " + JSON.parse(body)['Actors'] + '\n' + "Rotton Tomatoes: " + JSON.parse(body)['tomatoRating'] + '\n' + "Rotton Tomatoes URL: " + JSON.parse(body)['tomatoURL'];  

        fs.appendFileSync('log.txt', '\n' + movieData + '\n', 'utf8', function(err) {
            if (err) throw err;
                }); //end of write movie data
            };
        });
};


var getRandom = function() {
	console.log('Do what I say');

    fs.readFile('./random.txt', "utf8", function(err, data){
        data = data.split(',');
        //console.log(data);

        if (data.length == 2){
            action(data[0], data[1]);
        }else if (data.length == 1){
            action(data[0]);
        }


    }); // end fs.readFile
};

action (cases);