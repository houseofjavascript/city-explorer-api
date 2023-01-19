'user-strict';


console.log('hello world');


//*** Requires ****/

const express = require('express');
require('dotenv').config();
const cors = require('cors');

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

app.get('./weather', (request, response, next)=>{
  try {
    //ToDO- accept search queries - lat,lon, searchQuery - request.query / weather?lat=value&lon=value&searchQuery=value


    // let lat  = request.query.lat;
    // let lon = request.query.lon;
    let cityName = request.query.searchQuery;
    //TODO find the ity in the json data that matches CityName

    let city = data.find(city => city.city_name.toLowerCase() === cityName.toLowerCase())

    //TODO use a class to minify the bulky data
    let weatherData = city.data.map(dayObj => new Forecast(dayObj));

    response.status(200).send(city);

  } catch (error){
    next (error);
  }
})

// *** Class to groom bulky data ****

class Forecast {
  constructor(dayObj){
    this.date = dayObj.valid_date;
    this.description = dayObj.weather.description;
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

