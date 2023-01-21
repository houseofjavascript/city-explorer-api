'use strict';

const axios = require('axios');


let cache = {};

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