import { Endpoints } from "./index.js";

fetch(Endpoints.weatherLinks, {
  method: "GET",
  headers: { authorization: localStorage.getItem("Ltoken") as string },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {
    fetchAllWeatherLinks(data);
  });

function fetchAllWeatherLinks(data: any) {
  data.forEach((element: { apiLink: string }) => {
    fetch(element.apiLink, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "apiLink response was not ok: " + response.statusText
          );
        }
        return response.json();
      })
      .then((data) => {
        generateWeatherTiles(data);
      });
  });
}

function generateWeatherTiles(data: any) {
  console.log(data);

  var newWeatherBox = document.createElement("div");
  newWeatherBox.className = "main__weather-box";

  // Create the inner structure of the new main__weather-box
  newWeatherBox.innerHTML = `
  <div class="main__weather-box__today-info">
          <p class="main__weather-box__today-info__cityName">${
            data.location.name
          }</p>
          <p class="main__weather-box__today-info__date">
            ${getDayTime(data)}
          </p>
          <hr class="main__weather-box__today-info__hr1" />
          <p class="main__weather-box__today-info__actualTemperature">${
            data.current.temp_c
          }°</p>
          <div class="main__weather-box__today-info__rain">
            <i class="fa-solid fa-umbrella fa-xl"></i>
            <p>${data.forecast.forecastday[0].day.daily_chance_of_rain}%</p>
          </div>
          <div class="main__weather-box__today-info__wind">
            <i class="fa-solid fa-wind fa-xl"></i>
            <p>${data.current.wind_kph}km/h</p>
          </div>
          <hr class="main__weather-box__today-info__hr2" />
          <div class="main__weather-box__today-info__hourlyWeather">
            <div class="main__weather-box__today-info__hourlyWeather__legend">
              <i class="fa-solid fa-umbrella"></i
              ><i class="fa-solid fa-temperature-quarter"></i>
              <hr />
              <i class="fa-regular fa-clock"></i>
            </div>
        ${hourlyForecastTiles()}
          </div>
        </div>
        <div class="main__weather-box__nextdays-info">
        ${dailyForecastTiles()}
          <div class="main__weather-box__nextdays-info__dayinfo">
            <p>sat</p>
            <hr />
            <p>10°</p>
            <p>10%</p>
          </div>
        </div>
`;
  function hourlyForecastTiles() {
    let returnedString = "";
    for (let x = 6; x < 23; x += 4) {
      returnedString += `<div class="main__weather-box__today-info__hourlyWeather__hourbox">
        <p>${data.forecast.forecastday[0].hour[x].chance_of_rain}%</p>
        <p>${data.forecast.forecastday[0].hour[x].temp_c}°</p>
        <hr />
        <p>${x}:00</p>
      </div>`;
    }
    return returnedString;
  }
  function dailyForecastTiles() {
    let returnedString = "";
    for (let x = 1; x < 4; x += 1) {
      returnedString += `<div class="main__weather-box__nextdays-info__dayinfo">
      <p>${day(x)}</p>
      <hr />
      <p>${data.forecast.forecastday[x].day.avgtemp_c}°</p>
      <p>${data.forecast.forecastday[x].day.daily_chance_of_rain}%</p>
    </div>`;
    }
    return returnedString;

    function day(x: number) {
      const futureDay = new Date(data.forecast.forecastday[x].date).getDay();
      let dayName = "";
      switch (futureDay) {
        case 0:
          dayName = "Sun";
          break;
        case 1:
          dayName = "Mon";
          break;
        case 2:
          dayName = "Tue";
          break;
        case 3:
          dayName = "Wed";
          break;
        case 4:
          dayName = "Thu";
          break;
        case 5:
          dayName = "Fri";
          break;
        case 6:
          dayName = "Sat";
          break;
        default:
          console.error("Invalid day value");
      }
      return dayName;
    }
  }
  // Append the new main__weather-box to the main element
  document.querySelector(".main")?.appendChild(newWeatherBox);
}

function getDayTime(data: any) {
  let returnedString = "";
  const day = new Date(data.location.localtime).getDay();
  const date = data.location.localtime;
  switch (day) {
    case 0:
      returnedString = "Sunday";
      break;
    case 1:
      returnedString = "Monday";
      break;
    case 2:
      returnedString = "Tuesday";
      break;
    case 3:
      returnedString = "Wednesday";
      break;
    case 4:
      returnedString = "Thursday";
      break;
    case 5:
      returnedString = "Friday";
      break;
    case 6:
      returnedString = "Saturday";
      break;
    default:
      console.error("Invalid day value");
  }
  returnedString += ", " + date.substring(8, 10) + " ";
  switch (date.substring(5, 7)) {
    case "1":
      returnedString += "January";
      break;
    case "2":
      returnedString += "February";
      break;
    case "3":
      returnedString += "March";
      break;
    case "4":
      returnedString += "April";
      break;
    case "5":
      returnedString += "May";
      break;
    case "6":
      returnedString += "June";
      break;
    case "7":
      returnedString += "July";
      break;
    case "8":
      returnedString += "August";
      break;
    case "9":
      returnedString += "September";
      break;
    case "10":
      returnedString += "October";
      break;
    case "11":
      returnedString += "November";
      break;
    case "12":
      returnedString += "December";
      break;
    default:
      console.error("Invalid month number");
  }
  returnedString += " " + date.substring(11);
  return returnedString;
}
