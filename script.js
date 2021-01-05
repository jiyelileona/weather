import regeneratorRuntime from 'regenerator-runtime';
require('dotenv').config();
const moment = require('moment');

const getLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      let long = position.coords.longitude;
      let lat = position.coords.latitude;
      getCurrentConditions(long, lat);
      getForecast(long, lat);
    });
  } else {
    document.querySelector('h2').innerHTML =
      'Sorry, we need your loation to get the weather information.';
  }
};

const getCurrentConditions = async (long, lat) => {
  try {
    const res = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${process.env.API_KEY}`
    );
    const {main, weather} = await res.json();
    showCurrentWeather(main.temp, weather[0]);
  } catch (err) {
    console.error(err);
  }
};

const showCurrentWeather = (temp, weather) => {
  currentIcon.src = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  currentDescription.innerHTML = `${weather.description}`;
  currentTemp.innerHTML = `${Math.floor(temp - 273.15)} ℃`;
};

const getForecast = async (long, lat) => {
  const res = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${process.env.API_KEY}`
  );
  let {list} = await res.json();
  let newList = list.filter(content => moment(content.dt_txt).format('dddd') !== moment().format('dddd'));

}; 

const currentIcon = document.querySelector('.current-conditions img');
const currentDescription = document.querySelector('.current .condition');
const currentTemp = document.querySelector('.current .temp');
window.addEventListener('load', getLocation);
