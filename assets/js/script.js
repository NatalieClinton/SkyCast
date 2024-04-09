// API key and URL for OpenWeatherMap API
const apiKey = '1299d123a2b9161f68b77b51026d18fe';
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

// DOM elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const futureWeather = document.getElementById('future-weather');
const majorCities = document.getElementById('major-cities');

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
  currentWeather.innerHTML = `
    <h2>${data.name}</h2>
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

    const forecastElement = document.createElement('div'); // Create a new div element for forecast item
    forecastElement.classList.add('forecast-item'); // Add a class to the div
    forecastElement.innerHTML = `
      <h3>${date}</h3>
      <p>Temperature: ${temperature}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
    `;
    futureWeather.appendChild(forecastElement); // Append forecast item to future weather
  }
}

// Event listener for major cities buttons
majorCities.addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON') { // Check if clicked element is a button
    const cityName = event.target.textContent; // Get city name from button text content
    getWeather(cityName); // Fetch weather data for the city
  }
});

// Default city to display forecast
const defaultCity = 'Toronto';
// Call getWeather with default city on page load
window.onload = () => getWeather(defaultCity);