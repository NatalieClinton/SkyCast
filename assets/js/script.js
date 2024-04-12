// API key and URL for OpenWeatherMap API
const apiKey = '1299d123a2b9161f68b77b51026d18fe';
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

// DOM elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const futureWeather = document.getElementById('future-weather');

// Event listener for form submission
searchForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission
  const cityName = cityInput.value.trim(); // Get the trimmed city name from input
  if (cityName) {
    getWeather(cityName); // Fetch weather data for the city
    cityInput.value = ''; // Clear the input field
  }
});

// Function to fetch weather data from API
function getWeather(cityName) {
  fetch(`${apiUrl}weather?q=${cityName}&appid=${apiKey}&units=metric`)
    .then(response => response.json()) // Parse response as JSON
    .then(data => {
      displayCurrentWeather(data); // Display current weather
      saveSearchHistory(cityName); // Save search history
      getForecast(cityName); // Fetch and display weather forecast
    })
    .catch(error => console.error('Error fetching weather:', error)); // Log any errors
}

// Function to display current weather
function displayCurrentWeather(data) {
  const weatherIcon = data.weather[0].icon; // Get the weather icon code
  const weatherDescription = data.weather[0].description; // Get the weather description
  currentWeather.innerHTML = `
    <h3 class="current-location">${data.name}</h3>
    <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weatherDescription}" class="current-weather-icon">
    <p>Date: ${new Date(data.dt * 1000).toDateString()}</p>
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

// Function to save search history
function saveSearchHistory(cityName) {
  const button = document.createElement('button'); // Create a new button element
  button.textContent = cityName; // Set button text to city name
  button.addEventListener('click', () => getWeather(cityName)); // Add click event listener to fetch weather
  searchHistory.appendChild(button); // Append button to search history
}

// Function to fetch weather forecast
function getForecast(cityName) {
  fetch(`${apiUrl}forecast?q=${cityName}&appid=${apiKey}&units=metric`)
    .then(response => response.json()) // Parse response as JSON
    .then(data => {
      displayForecast(data); // Display weather forecast
    })
    .catch(error => console.error('Error fetching forecast:', error)); // Log any errors
}

// Function to display weather forecast
function displayForecast(data) {
  futureWeather.innerHTML = ''; // Clear existing forecast
  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000).toDateString();
    const temperature = forecast.main.temp;
    const humidity = forecast.main.humidity;
    const windSpeed = forecast.wind.speed;
    const weatherIcon = forecast.weather[0].icon; // Get the weather icon code
    const weatherDescription = forecast.weather[0].description; // Get the weather description
    const forecastElement = document.createElement('div'); // Create a new div element for forecast item
    forecastElement.classList.add('forecast-item'); // Add a class to the div
    forecastElement.innerHTML = `
      <h3>${date}</h3>
      <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weatherDescription}" class="forecast-icon">
      <p>Temperature: ${temperature}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
    `;
    futureWeather.appendChild(forecastElement); // Append forecast item to future weather
  }
}

// Default city to display forecast
const defaultCity = 'Toronto';

// Call getWeather with default city on page load
window.onload = () => getWeather(defaultCity);