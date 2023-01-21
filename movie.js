'use strict';

const axios = require('axios');


let cache = {};

app.get('/movie', async (request, response, next)=>{
  try {
    //ToDO- accept search queries - lat,lon, searchQuery - request.query / weather?lat=value&lon=value&searchQuery=value
    let {cityName} = request.query;
    let key = `${cityName}Movie`; 

    if(cache[key] &&(Date.now() - cache[key].timeStamp) < 300000){
      response.status(200).send(cache[key].data);
    } else {
      let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&language=en-US&query=${cityName}&page=1&include_adult=false`
      console.log(url);
      let movieBit = await axios.get(url)
      let movieData = movieBit.data.results.map(movieObj => new Movies(movieObj));
      console.log(movieBit.data.results);


      // *** Cache results from the api call 
      cache[key] = {
        data:movieData,
        timeStamp: DataTransfer.now()
      };
      response.status(200).send(movieData);
        
    }


  } catch (error){
    // next (error);
    console.log('this is the error',error)
  }
})

class Movies {
  constructor(movieObj){
    this.title = movieObj.title;
    this.overview= movieObj.overview;
    this.poster_path=movieObj.poster_path;
  }
}