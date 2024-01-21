let latInputElem = document.getElementById("lat");
let lonInputElem = document.getElementById("lon");
const containerElem = document.getElementById("weather-data-container");

async function getLocation() {
  return {
    lat: parseFloat(latInputElem.value),
    lon: parseFloat(lonInputElem.value)
  };
}

async function getReverseGeocodingData(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`;


  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Reverse Geocoding response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
  }
}

async function getWeather() {
  const apiKey = '825a55eb94d489abd7b6d71e57509046'; 
  const location = await getLocation();
  const apiCall = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`;

  try {
    const responseWeather = await fetch(apiCall);
    if (!responseWeather.ok) {
      throw new Error('Weather API response was not ok');
    }
    const weatherData = await responseWeather.json();

    const locationData = await getReverseGeocodingData(location.lat, location.lon);
    const locationName = locationData ? `${locationData.address.city}, ${locationData.address.country}` : 'Unknown Location';

    const combinedData = {
      location: locationName,
      weather: weatherData.weather[0].main,
      humidity: weatherData.main.humidity,
      temp: weatherData.main.temp
    };

    console.log(combinedData);
    createWeatherDashboard(combinedData);

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    containerElem.innerHTML = 'Enter Latitude and Longitude.';
  }
}

function createWeatherDashboard(data) {
  const tempFahrenheit = (data.temp * 9/5) + 32;
  containerElem.innerHTML = `
    Location: ${data.location}<br>
    Temperature: ${data.temp.toFixed(1)}°C / ${tempFahrenheit.toFixed(1)}°F<br>
    Weather: ${data.weather}<br>
    Humidity: ${data.humidity}<br>
  `;
}
