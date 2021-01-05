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
  const res = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${process.env.API_KEY}`
  );
  const {main, weather} = await res.json();
  showCurrentWeather(main.temp, weather[0]);
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
  let newList = list.filter(item => moment(item.dt_txt).format('dddd') !== moment().format('dddd'));

  let forecast = {
    firstDate: newList.slice(0, 8),
    secondDate: newList.slice(8, 16),
    thirdDate: newList.slice(16, 24),
    fourthDate: newList.slice(24, 32),
    lastDate: newList.slice(32, newList.length),
  };
  showList(forecast);
};

const showList = list => {
  for (const property in list) {
    let max = Math.max.apply(
      Math,
      list[property].map(item => item.main.temp)
    );
    let min = Math.min.apply(
      Math,
      list[property].map(item => item.main.temp)
    );
    let date = moment(list[property][0].dt_txt).format('dddd');
    let icon = list[property][0].weather[0].icon;
    let description = list[property][0].weather[0].description;

    let day = document.createElement('div');
    day.classList.add('day');
    day.innerHTML = `
      <h3>${date}</h3>
      <img src="http://openweathermap.org/img/wn/${icon}@2x.png" />
      <div class="description">${description}</div>
      <div class="temp">
        <span class="high">${Math.floor(max - 273.15)} ℃</span>/<span class="low">${Math.floor(
      min - 273.15
    )} ℃</span>
      </div>`;
    document.querySelector('.forecast').appendChild(day);
  }
};

document.querySelector('.forecast').innerHTML = '';
const currentIcon = document.querySelector('.current-conditions img');
const currentDescription = document.querySelector('.current .condition');
const currentTemp = document.querySelector('.current .temp');
window.addEventListener('load', getLocation);
