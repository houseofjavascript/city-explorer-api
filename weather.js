'use strict';

const axios = require('axios');


let cache = {};

async function getWeather(request, response, next) {
  try {
    //ToDO- accept search queries - lat,lon, searchQuery - request.query / weather?lat=value&lon=value&searchQuery=value
    let cityName = request.query.searchQuery;
    let key = `${cityName}Weather`

    if (cache[key] && (Date.now() - cache[key].timeStamp) < 300000) {
      console.log('Cache was hit, images are present');
      response.status(200).send(cache[key].data);

    } else {

      let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${request.query.lat}&lon=${request.query.lon}`
      console.log(url);
      let weatherBit = await axios.get(url)
      let lat = request.query.lat;
      let lon = request.query.lon;

      //TODO find the ity in the json data that matches CityName
      console.log(cityName)

      //TODO use a class to minify the bulky data //! change this
      let weatherData = weatherBit.data.data.map(dayObj => new Forecast(dayObj));
      console.log(weatherData, 'HERE')


      cache[key] = {
        data: weatherData,
        timeStamp: Date.now()
      };
      response.status(200).send(weatherData);
    }

  } catch (error) {
    next(error);
  }
}




class Forecast {
  constructor(dayObj) {
    this.date = dayObj.valid_date;
    this.description = dayObj.weather.description;
  }
}

module.exports = getWeather;