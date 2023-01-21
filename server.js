'user-strict';


console.log('hello world');


//*** Requires ****/

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

// ** dont forget to require your start json file //

let data = require('./weather.json')


// **** Once express is in we need to use it - per express docs 
// ** app === server

const app = express();

//**** Middleware *****/
//*** cors is middleware - security guard that allows us to share resources across the internet ***/
app.use(cors());



// *** DEFINE A PORT FOR MY SERVER TO RUN ON ***
const PORT = process.env.PORT || 3002;



// *** END POINTS ***

// *** Base endpoint - proof of life 
// *** 1st arg - endpoint in quotes
// *** 2nd arg - callback which will execute when someone hits that point

// *** Callback function - 2 parameters: request, response (req,)

app.get('/', (request, response)=>{
  response.status(200).send('Hey, but why are you here');
});

app.get('/hello', (request, response)=>{
  console.log(request.query);

  let firstName = request.query.firstName;
  let lastName = request.query.lastName;

  response.status(200).send(`Hello ${firstName} ${lastName}!`)
})

app.get('/weather', async (request, response, next)=>{
  try {
    //ToDO- accept search queries - lat,lon, searchQuery - request.query / weather?lat=value&lon=value&searchQuery=value
    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${request.query.lat}&lon=${request.query.lon}`
    console.log(url);
    let weatherBit = await axios.get(url)
    let lat  = request.query.lat;
    let lon = request.query.lon;
    
    let cityName = request.query.searchQuery;
    //TODO find the ity in the json data that matches CityName
    console.log(cityName)
    // let city = data.find(city => city.city_name.toLowerCase() === cityName.toLowerCase())
    
    // console.log('this is the weather data',weatherBit.data.data[0])
    //TODO use a class to minify the bulky data //! change this
    let weatherData = weatherBit.data.data.map(dayObj => new Forecast(dayObj));
    console.log(weatherData, 'HERE')

    response.status(200).send(weatherData);

  } catch (error){
    next (error);
  }
})

app.get('/movie', async (request, response, next)=>{
  try {
    //ToDO- accept search queries - lat,lon, searchQuery - request.query / weather?lat=value&lon=value&searchQuery=value
    let cityName = request.query.searchQuery;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&language=en-US&query=${cityName}&page=1&include_adult=false`
    console.log(url);
    let movieBit = await axios.get(url)
    console.log(movieBit.data.results);
 
    
    //TODO find the ity in the json data that matches CityName
   
    //TODO use a class to minify the bulky data //! change this
    let movieData = movieBit.data.results.map(movieObj => new Movies(movieObj));
    console.log(movieData);
    response.status(200).send(movieData);

  } catch (error){
    // next (error);
    console.log('this is the error',error)
  }
})

// *** Class to groom bulky data ****

class Forecast {
  constructor(dayObj){
    this.date = dayObj.valid_date;
    this.description = dayObj.weather.description;
  }
}

class Movies {
  constructor(movieObj){
    this.title = movieObj.title;
    this.overview= movieObj.overview;
    this.poster_path=movieObj.poster_path;
  }
}


app.get('*', (request, response)=>{
  response.status(404).send('No bueno Bro');
});

// ERROR Handling 

app.use((error, request, response, next)=>{
  response.status(500).send(error.message);
})

// ***** SERVER START ******
app.listen(PORT, () =>console.log(`We are running on port: ${PORT}`));

