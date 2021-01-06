import regeneratorRuntime from 'regenerator-runtime';
require('dotenv').config();
const moment = require('moment');
const {chunk} = require('lodash');

const getLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      let {longitude, latitude} = position.coords;
      getCurrentConditions(longitude, latitude);
      getForecast(longitude, latitude);
    });
  } else {
    document.querySelector('h2').innerHTML =
      'Sorry, we need your loation to get the weather information.';
  }
};

const getCurrentConditions = async (lon, lat) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`
  );
  const {main, weather} = await res.json();
  showCurrentWeather(main.temp, weather[0]);
};

const showCurrentWeather = (temp, weather) => {
  currentIcon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  currentDescription.innerHTML = `${weather.description}`;
  currentTemp.innerHTML = `${Math.floor(temp - 273.15)} ℃`;
};

const getForecast = async (lon, lat) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`
  );
  let {list} = await res.json();
  let newList = list.filter(
    item =>
      moment(item.dt_txt).format('dddd') !== moment().add(6, 'd').format('dddd') &&
      moment(item.dt_txt).format('dddd') !== moment().format('dddd')
  );

  showList(chunk(newList, 8));
};

const showList = list => {
  list.forEach(arr => {
    let max = Math.max(...arr.map(item => item.main.temp_max));
    let min = Math.min(...arr.map(item => item.main.temp_min));
    let date = moment(arr[4].dt_txt).format('dddd');
    let {icon, description} = arr[4].weather[0];

    forecast.insertAdjacentHTML(
      'beforeend',
      `
      <div class="day">
      <h3>${date}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" />
        <div class="description">${description}</div>
        <div class="temp">
          <span class="high">${Math.floor(max - 273.15)} ℃</span>/<span class="low">${Math.floor(
        min - 273.15
      )} ℃</span>
        </div>
      </div>
    `
    );
  });
};

const currentIcon = document.querySelector('.current-conditions img');
const currentDescription = document.querySelector('.current .condition');
const currentTemp = document.querySelector('.current .temp');
const forecast = document.querySelector('.forecast');
window.addEventListener('load', getLocation);
forecast.innerHTML = '';
