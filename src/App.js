import React, { useState, useEffect } from "react";

const api = {
  key: "###YOUR_API_KEY###",
  base: "https://api.openweathermap.org/data/2.5/",
};

const objToday = new Date(),
  weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayOfWeek = weekday[objToday.getDate()],
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  curMonth = months[objToday.getMonth()];

const todayDate = dayOfWeek + ", " + objToday.getDay() + " " + curMonth;

function App() {
  const [search, setSearch] = useState("Turkey");
  const [weather, setWeather] = useState({});
  const [weatherImage, setWeatherImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [inputClass, setInputClass] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const searchPressed = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (search !== "") {
        getWeather();
        setSearch("");
        setInputClass("");
      } else {
        setInputClass("error");
      }
    }
  };

  const getWeather = async () => {
    setIsLoading(true);
    await fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsLoading(false);
        setWeather(data);
        findImage(data.weather[0].main, data.weather[0].id);
      });
  };

  const findImage = (value, id) => {
    if (value === "Rain" || value === "Clouds") {
      if (id === 511) {
        value = "Snow";
      } else if (id >= 520 && id <= 531) {
        value = "Dark-Rain";
      } else if (id === 802) {
        value = "Scattered-Clouds";
      } else if (id === 803 || id === 804) {
        value = "Broken-Clouds";
      }
    }

    if (id >= 701 && id <= 781) {
      value = "Fog";
    }

    setWeatherImage(value + ".png");
  };

  useEffect(() => {
    getWeather();
  }, []);

  const changeTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };
  return (
    <div className="app-container">
      <div className="mode-btn" onClick={changeTheme}>
        {darkMode ? (
          <span>
            <i className="bi bi-sun"></i> Light Mode
          </span>
        ) : (
          <span>
            <i className="bi bi-moon"></i> Dark Mode
          </span>
        )}
      </div>
      <div className="weather-app">
        <input
          className={inputClass}
          type="text"
          name="location"
          value={search}
          placeholder="search.."
          onKeyPress={searchPressed}
          onChange={(e) => setSearch(e.target.value)}
        />

        {isLoading ? (
          <div className="loading"></div>
        ) : weather.cod === 200 ? (
          <div className="weather-content">
            <div className="search-info">
              <span className="date">{todayDate}</span>
              <h2 className="city">
                {weather.name}, <span>{weather.sys.country}</span>
              </h2>
            </div>
            <div className="weather-info">
              <div className="weather-icon">
                <img
                  src={require("./images/" + weatherImage)}
                  alt="weather icon"
                />
              </div>
              <div className="weather-temp">
                <p
                  className={weather.main.temp >= 20 ? "temp red" : "temp blue"}
                >
                  {Math.ceil(weather.main.temp)}
                  <span>°C</span>
                </p>
                <p className="status">{weather.weather[0].main}</p>
                <p className="status-desc">{weather.weather[0].description}</p>
              </div>
            </div>

            <div className="weather-grid">
              <div className="grid-box">
                <p className="grid-title">Wind</p>
                <p className="grid-text">
                  {Math.ceil(weather.wind.speed)} km/h
                </p>
              </div>
              <div className="grid-box">
                <p className="grid-title">Feels Like</p>
                <p className="grid-text">
                  {Math.ceil(weather.main.feels_like)}°
                </p>
              </div>
              <div className="grid-box">
                <p className="grid-title">Humidity</p>
                <p className="grid-text">{Math.ceil(weather.main.humidity)}%</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="error-message">City not found! Try again.</div>
        )}
      </div>
    </div>
  );
}

export default App;
