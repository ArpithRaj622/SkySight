// variables 

// input
const cityInput = document.querySelector("#cityInput");

// search button
const searchBtn = document.querySelector("#searchBtn");

// city
let city = localStorage.getItem("city") || "Raichur";

// city name
const cityName = document.querySelector("#cityName");
// country name
const countryName = document.querySelector("#countryName");

// temperature
const temperature = document.querySelector("#temperature");

// condition
const condition = document.querySelector("#condition");

// feels like
const feelsLike = document.querySelector("#feelsLike");

// humidity
const humidity = document.querySelector("#humidity");

// wind speed
const windSpeed = document.querySelector("#windSpeed");

// pressure
const pressure = document.querySelector("#pressure");

// visibility
const visibility = document.querySelector("#visibility");

// cloudiness
const cloudiness = document.querySelector("#cloudiness");

// sunrise
const sunrise = document.querySelector("#sunrise");

// sunset
const sunset = document.querySelector("#sunset");

// 3 hour forecast cards
const forecast3HourCards = document.querySelectorAll(".forecast-3hour-card");

// average temperature
const avgTemp = document.querySelector("#avgTemp");

// 5 days forecast
// days
const forcastDayCells = document.querySelectorAll("#forecast5DaysTableBody .day");

// weather icons
const forecastWeatherIcons = document.querySelectorAll(
    "#forecast5DaysTableBody .weather-icon"
);

// high temperature
const forecastHighCells = document.querySelectorAll("#forecast5DaysTableBody .high");

// low temperature
const forecastLowCells = document.querySelectorAll("#forecast5DaysTableBody .low");

// precipitation
const forecastPrecipitationCells = document.querySelectorAll("#forecast5DaysTableBody .precipitation");

// function - get current weather
async function getWeather() {
    // url
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        if (response.ok === false) {
            throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        localStorage.setItem("city", city);
        // console.log(data);
        // console.log(data.weather[0].icon);

        // display city
        cityName.textContent = city;
        // display country
        countryName.textContent = data.sys.country;

        // display temperature
        temperature.textContent = `${data.main.temp}°C`;

        // display weather icon
        const weatherIcon = document.querySelector("#weatherIcon");
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        // display condition
        condition.textContent = data.weather[0].description;

        // display feel like
        feelsLike.textContent = `${data.main.feels_like}°C`;

        // display humidity
        humidity.textContent = `${data.main.humidity}%`;

        // display wind speed
        windSpeed.textContent = `${data.wind.speed} m/s`;

        // display pressure
        pressure.textContent = `${data.main.pressure} hPa`;

        // display visibility
        visibility.textContent = `${data.visibility / 1000} km`;

        // display cloudiness
        cloudiness.textContent = `${data.clouds.all}%`;

        // display sunrise
        sunrise.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        // display sunset
        sunset.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch (error) {
        console.error(error);
    }
}

// function - get weather forecast
async function getForecast() {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(forecastUrl);
        if (response.ok === false) {
            throw new Error("Failed to fetch forecast data");
        }
        const data = await response.json();
        console.log(data);
        
        const forecastList = data.list;
        console.log(forecastList);

        const forecast3Hour = forecastList.slice(0,5);
        console.log(forecast3Hour);

        let totalTemperature = 0;

        // 3 hour forecast
        forecast3Hour.forEach((item, index) => {
            const card = forecast3HourCards[index];
            const time = new Date(item.dt * 1000).toLocaleTimeString([], {
                hour: "numeric"
            });
            const temperature = Math.round(item.main.temp);
            card.querySelector(".time").textContent = time;
            card.querySelector(".temp").textContent = `${temperature}°C`;

            totalTemperature += temperature;

            avgTemp.textContent = `${totalTemperature / forecast3Hour.length}°C`;
        });

        // daily forecast
        const dailyForecast = {};

        forecastList.forEach((item, index) => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!dailyForecast[date]) {
                dailyForecast[date] = [];
            }
            dailyForecast[date].push(item);
        });
        // console.log(dailyForecast);

        const dates = Object.keys(dailyForecast);
        console.log(dates);
        
        dates.forEach((date) => {
            const dayForecast = dailyForecast[date];

            // day name
            const dayName = new Date(date).toLocaleDateString([], {
                weekday: "long"
            });

            // weather icon
            const weatherIcon = `https://openweathermap.org/img/wn/${dayForecast[0].weather[0].icon}@2x.png`;

            // temperature - high/low
            const temperatures = dayForecast.map((item => {
                return item.main.temp;
            }));
            const highTemp = Math.max(...temperatures);
            const lowTemp = Math.min(...temperatures);

            // precipitation 
            const precipitation  = Math.max(...dayForecast.map((item) => {
                return item.pop;
            }));
            const precipitationPercent = precipitation * 100;

            const index = dates.indexOf(date);
            
            forcastDayCells[index].textContent = dayName;

            forecastWeatherIcons[index].src = weatherIcon;
            
            forecastHighCells[index].textContent = `${Math.round(highTemp)}°C`;

            forecastLowCells[index].textContent = `${Math.round(lowTemp)}°C`;

            forecastPrecipitationCells[index].textContent = `${precipitationPercent}%`;
        });

    } catch(error) {
        console.error(error);
    }
}


// event listener - search button click
searchBtn.addEventListener("click", () => {
    city = cityInput.value.trim().toLowerCase();
    city = city.charAt(0).toUpperCase() + city.slice(1);
    if (city === "") {
        return;
    }
    getWeather();
    getForecast();
    cityInput.value = "";
});

// event listener - press enter after input
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

getWeather();
getForecast();