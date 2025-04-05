const weatherCardElement = document.getElementById('weatherCard');

export function renderWeatherCard(data) {
    weatherCardElement.innerHTML = `
        <div class="weather-card__icon"><i class="fa-solid fa-cloud-sun"></i></div>
        <h3 class="weather-card__temperature">${data.temperature}</h3>
        <p class="weather-card__rain">Chance of rain: ${data.rainChance}</p>
        <p class="weather-card__wind">Wind: ${data.wind}</p>
    `;
}