import regeneratorRuntime from 'regenerator-runtime';
require('dotenv').config();

const getLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      let long = position.coords.longitude;
      let lat = position.coords.latitude;
      getCurrentConditions(long, lat);
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
    const data = await res.json();

  } catch (err) {
    console.error(err);
  }
};

window.addEventListener('load', getLocation);
