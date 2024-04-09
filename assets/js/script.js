// OpenWeatherMap API key
const apiKey = 'MY_API_KEY';
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

// DOM elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const futureWeather = document.getElementById('future-weather');

// Event listener for form submission
searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const cityName = cityInput.value.trim();
  if (cityName) {
    getWeather(cityName);
    cityInput.value = '';
  }
});

// Function to fetch weather data from the API
function getWeather(cityName) {
  fetch(`${apiUrl}weather?q=${cityName}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      saveSearchHistory(cityName);
    })
    .catch(error => console.error('Error fetching weather:', error));
}

// Function to display current weather data
function displayCurrentWeather(data) {
  currentWeather.innerHTML = `
    <h2>${data.name}</h2>
    <p>Date: ${new Date(data.dt * 1000).toDateString()}</p>
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

// Function to save search history and create clickable buttons
function saveSearchHistory(cityName) {
  const button = document.createElement('button');
  button.textContent = cityName;
  button.addEventListener('click', () => getWeather(cityName));
  searchHistory.appendChild(button);
}