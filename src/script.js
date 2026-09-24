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


// function
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
        console.log(data);
        console.log(data.weather[0].icon);

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


// event listener - search button click
searchBtn.addEventListener("click", () => {
    city = cityInput.value.trim().toLowerCase();
    city = city.charAt(0).toUpperCase() + city.slice(1);
    if (city === "") {
        return;
    }
    getWeather();
    cityInput.value = "";
});

// event listener - press enter after input
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

getWeather();