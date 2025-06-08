const input = document.querySelector(".city-input");
const button = document.querySelector(".search-btn");
const countryText = document.querySelector(".country-txt");
const dateText = document.querySelector(".current-date-txt.reguler-txt");
const tempText = document.querySelector(".temp-txt");
const conditionText = document.querySelector(".condition-txt");
const weatherIcon = document.querySelector(".weather-summary-img");
const windText = document.querySelector(".wind-value-text");
const humidityText = document.querySelector(".condition-item:nth-child(1) .condition-info h5:last-child");

const weatherInfo = document.querySelector(".weather-info");
const searchCity = document.querySelector(".search-city");
const notFound = document.querySelector(".not-found");

let countriesData = [];

const weather_code = {
    clear: [0, 1],
    fog: [45, 48],
    drizzle: [56, 57],
    snow: [71, 73, 75, 77],
    clouds: [2, 3],
    rain: [51, 53, 55, 61, 63, 65, 80, 81, 82],
    thunderstorm: [95, 96, 99],
};

// Fungsi konversi kode cuaca ke ikon
function getWeatherIcon(code) {
    for (let condition in weather_code) {
        if (weather_code[condition].includes(code)) {
            return `weather/${condition}.svg`;
        }
    }
    return "weather/atmosphere.svg"; // default
}

function getConditionName(code) {
    for (let condition in weather_code) {
        if (weather_code[condition].includes(code)) {
            return condition.charAt(0).toUpperCase() + condition.slice(1);
        }
    }
    return "Unknow";
}

function formatDate(date) {
    const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
}

async function loadCountries() {
    try {
        const calling = await fetch("country.json");
        countriesData = await calling.json();
    } catch (errorr) {
        console.error("Gagal memuat country.json:", errorr);
    }
}

async function fetchingData(latitude, longitude, countryName) {
    try {

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&timezone=auto`;
        const cardContainer = document.getElementById("card-container");
        const res = await fetch(url);
        const forecast = await res.json();

        countryText.textContent = countryName;
        dateText.textContent = formatDate(forecast.daily.time[0]);
        tempText.textContent = `${forecast.daily.temperature_2m_max[0]} °C`;
        conditionText.textContent = getConditionName(forecast.daily.weather_code[0]);
        weatherIcon.src = getWeatherIcon(forecast.daily.weather_code[0]);
        humidityText.textContent = `${Math.floor(Math.random() * (90 - 40 + 1)) + 40}%`;
        windText.textContent = `${forecast.daily.wind_speed_10m_max[0]} M/s`;
        

        cardContainer.innerHTML = '';

        for (let i = 0; i < forecast.daily.time.length; i++) {
            const date = forecast.daily.time[i];
            const tempMin = forecast.daily.temperature_2m_min[i];
            const code = forecast.daily.weather_code[i];
            const icon = getWeatherIcon(code);

            const newList = `
                <div class="forecast-item">
                    <h5 class="forecast-item-date reguler-txt">${formatDate(date)}</h5>
                    <img src="${icon}" alt="weather-icon" class="forecast-item-img" />
                    <h5 class="forecast-item-temp">${tempMin} °C</h5>
                </div>
            `;
            cardContainer.innerHTML += newList;
        }

        searchCity.style.display = "none";
        weatherInfo.style.display = "block";
        notFound.style.display = "none";

    } catch (error) {
        console.error("Gagal mengambil data cuaca:", error);
    }
}

button.addEventListener("click", () => {
    const searchValue = input.value.trim().toLowerCase();
    const selectedCountry = countriesData.find(
        (item) => item.country.toLowerCase() === searchValue
    );

    if (selectedCountry) {
        const { latitude, longitude, country } = selectedCountry;
        fetchingData(latitude, longitude, country);
    } else {
        searchCity.style.display = "none";
        weatherInfo.style.display = "none";
        notFound.style.display = "flex";
    }
})

//fetchingData();

loadCountries();