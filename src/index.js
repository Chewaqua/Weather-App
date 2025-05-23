import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const clear_icon = "assets/clear.png";
const cloud_icon = "assets/cloud.png";
const drizzle_icon = "assets/drizzle.png";
const humidity_icon = "assets/humidity.png";
const rain_icon = "assets/rain.png";
const search_icon = "assets/search.png";
const snow_icon = "assets/snow.png";
const wind_icon = "assets/wind.png";

function App() {
  return (
    <div className="app">
      <Weather />
    </div>
  );
}

function Weather() {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const search = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_ID}`;
      const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
      };

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }
      console.log(data);
      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      setWeatherData(false);
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    search("New York");
  }, []);

  return (
    <div className="weather">
      <SearchBar inputRef={inputRef} onSearch={search} />
      <WeatherIcon icon={weatherData.icon} />
      <Temperature temp={weatherData.temperature} />
      <City location={weatherData.location} />
      <WeatherData
        humidity={weatherData.humidity}
        windSpeed={weatherData.windSpeed}
      />
    </div>
  );
}

function SearchBar({ inputRef, onSearch }) {
  return (
    <div className="search-bar">
      <input ref={inputRef} type="text" placeholder="Search"></input>
      <img
        src={search_icon}
        alt="search"
        onClick={() => onSearch(inputRef.current.value)}
      ></img>
    </div>
  );
}

function WeatherIcon({ icon, weatherData }) {
  return icon ? (
    <img src={icon} alt="weather" className="weather-icon" />
  ) : null;
}

function Temperature({ temp }) {
  return temp ? <p className="temperature">{temp}°c</p> : null;
}

function City({ location }) {
  return location ? <p className="location">{location}</p> : null;
}

function WeatherData({ humidity, windSpeed }) {
  return humidity ? (
    <div className="weather-data">
      <div className="col">
        <img src={humidity_icon} alt="humidity"></img>
        <div>
          <p>{humidity} %</p>
          <span>Humidity</span>
        </div>
      </div>
      <div className="col">
        <img src={wind_icon} alt="wind"></img>
        <div>
          <p>{windSpeed} Km/h</p>
          <span>Wind Speed</span>
        </div>
      </div>
    </div>
  ) : null;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
