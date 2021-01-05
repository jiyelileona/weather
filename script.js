const getLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      let long = position.coords.longitude;
      let lat = position.coords.latitude;
     
    });
  } else {
    document.querySelector('h2').innerHTML =
      'Sorry, we need your loation to get the weather information.';
  }
};


window.addEventListener('load', getLocation);
