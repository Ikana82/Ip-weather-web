const url = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min,weather_code";

const weather_code = {
    clear: [0, 1, 2, 3],
    fog: [45, 48],
    drizzle: [56, 57],
    snow: [71, 73, 75, 77],
    clouds: [2, 3],
    rain: [51, 53, 55],
    thunderstorm: [95, 96, 99],
};

// Fungsi konversi kode cuaca ke ikon
function getWeatherIcon(code) {
    for (let condition in weather_code) {
        if (weather_code[condition].includes(code)) {
            return `weather/${condition}.svg`;
        }
    }
    return "weather/unknown.svg"; // default
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

async function fetchingData() {
    try {
        const cardContainer = document.getElementById("card-container");
        const res = await fetch(url);
        const forecast = await res.json();

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
    } catch (error) {
        console.error("Gagal mengambil data cuaca:", error);
    }
}

fetchingData();