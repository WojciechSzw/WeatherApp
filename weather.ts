import { Endpoints } from "./index.js";
let cities: [nr: number, cityName: string][] = [];

type DataApi = {
  location: { name: string };
  current: { temp_c: string; wind_kph: string; condition: { code: number } };
  forecast: { forecastday: Forecastday[] };
};

type Forecastday = {
  date: Date;
  day: { daily_chance_of_rain: number; avgtemp_c: number };
  hour: HourForecast[];
};

type HourForecast = {
  chance_of_rain: number;
  temp_c: number;
};

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("menu__short__upper__img")) {
    document.querySelector<HTMLElement>("body")!.innerHTML = "";
    localStorage.clear();
    window.location.href = "index.html";
  } else if (target.classList.contains("fa-plus")) {
    addCityWindow();
  } else if (target.classList.contains("add-city-blackground")) {
    closeAddDelWindows();
  } else if (target.classList.contains("add-city__cityname__submit")) {
    findCity();
  } else if (target.classList.contains("add-city__result__submit-on")) {
    addCity();
  } else if (target.classList.contains("fa-minus")) {
    delCityWindow();
    addCitiesToDel();
  } else if (target.classList.contains("del-city__cities__city")) {
    delCity(target);
  }
});

fetchFollowedCities();
initProfile();

function initProfile() {
  document.querySelector(
    "body"
  )!.style.backgroundImage = `url(images/backgrounds/${localStorage.getItem(
    "backgroundImg"
  )}.jpg)`;
  document.querySelector<HTMLElement>(
    ".menu__short__upper__img"
  )!.style.backgroundImage = `url(images/users/${localStorage.getItem(
    "profileImg"
  )}.jpg)`;
}

function fetchFollowedCities() {
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
      cities = [];
      data.forEach((city: any) => {
        cities.push([city[0], city[1].location.name]);
        generateWeatherTiles(city[1]);
      });
    });
}

function generateWeatherTiles(data: DataApi) {
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
        <div class="main__weather-box__nextdays-info__legend">
        <i class="fa-solid fa-calendar-days"></i>
        <hr />
        <i class="fa-solid fa-temperature-quarter"></i>
        <i class="fa-solid fa-umbrella"></i>
      </div>
        ${dailyForecastTiles()}
          
        </div>
`;
  newWeatherBox.style.backgroundImage = `url(images/weathericons/${data.current.condition.code}.jpg)`;
  function hourlyForecastTiles() {
    let returnedString = "";
    for (let x = 6; x < 24; x = x + 2) {
      returnedString += `<div class="main__weather-box__today-info__hourlyWeather__hourbox">
        <p>${data.forecast.forecastday[0].hour[x].chance_of_rain}</p>
        <p>${Math.round(data.forecast.forecastday[0].hour[x].temp_c)}</p>
        <hr />
        <p>${x}</p>
      </div>`;
    }
    return returnedString;
  }

  function dailyForecastTiles() {
    let returnedString = "";
    for (let x = 1; x < 3; x++) {
      returnedString += `<div class="main__weather-box__nextdays-info__dayinfo">
      <p>${day(x)}</p>
      <hr />
      <p>${Math.round(data.forecast.forecastday[x].day.avgtemp_c)}°</p>
      <p>${data.forecast.forecastday[x].day.daily_chance_of_rain}%</p>
    </div>`;
    }
    return returnedString;

    function day(x: number) {
      const futureDay = data.forecast.forecastday[x].date.getDay();
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
    case "01":
      returnedString += "January";
      break;
    case "02":
      returnedString += "February";
      break;
    case "03":
      returnedString += "March";
      break;
    case "04":
      returnedString += "April";
      break;
    case "05":
      returnedString += "May";
      break;
    case "06":
      returnedString += "June";
      break;
    case "07":
      returnedString += "July";
      break;
    case "08":
      returnedString += "August";
      break;
    case "09":
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

function findCity() {
  const outCityName = document.querySelector<HTMLElement>(
    ".add-city__result__name-output"
  ) as HTMLElement;
  const outCountryName = document.querySelector<HTMLElement>(
    ".add-city__result__country-output"
  );
  const outLocalTime = document.querySelector<HTMLElement>(
    ".add-city__result__localtime-output"
  );
  const inputCityName = document.querySelector<HTMLInputElement>(
    ".add-city__cityname__input"
  );
  const addBtn = document.querySelector<HTMLElement>(
    ".add-city__result__submit-off"
  );
  if (inputCityName!.value) {
    const cityName = inputCityName!.value;
    fetch(Endpoints.findCity + "?cityName=" + cityName, {
      method: "GET",
      headers: {
        authorization: localStorage.getItem("Ltoken") as string,
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        outCityName!.textContent = "";
        outCountryName!.textContent = "";
        outLocalTime!.textContent = "";
        addBtn!.classList.remove("add-city__result__submit-on");
        if (!response.ok) {
          throw new Error(
            "apiLink response was not ok: " + response.statusText
          );
        }

        return response.json();
      })
      .then((data) => {
        outCityName!.textContent = data.location.name;
        outCountryName!.textContent = data.location.country;
        outLocalTime!.textContent = data.location.localtime;

        addBtn?.classList.add("add-city__result__submit-on");
      });
  }
}

function addCity() {
  const outCityName = (
    document.querySelector<HTMLElement>(
      ".add-city__result__name-output"
    ) as HTMLElement
  ).textContent;

  fetch(Endpoints.weatherLinks, {
    method: "POST",
    headers: {
      authorization: localStorage.getItem("Ltoken") as string,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      cityName: outCityName as string,
    }),
  })
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      location.reload();
    });
}

function addCityWindow() {
  const blackground = document.querySelector<HTMLElement>(
    ".add-city-blackground"
  );
  const addCityWindow = document.querySelector<HTMLElement>(".add-city");

  addCityWindow!.style.display = "block";
  blackground!.style.display = "block";
}

function delCityWindow() {
  const blackground = document.querySelector<HTMLElement>(
    ".add-city-blackground"
  );
  const delCityWindow = document.querySelector<HTMLElement>(".del-city");

  delCityWindow!.style.display = "block";
  blackground!.style.display = "block";
}

function closeAddDelWindows() {
  const blackground = document.querySelector<HTMLElement>(
    ".add-city-blackground"
  );
  const addCityWindow = document.querySelector<HTMLElement>(".add-city");
  const delCityWindow = document.querySelector<HTMLElement>(".del-city");
  const box = document.querySelector<HTMLElement>(".del-city__cities");

  addCityWindow!.style.display = "none";
  blackground!.style.display = "none";

  delCityWindow!.style.display = "none";
  box!.innerHTML = "";
  console.log(box!.innerHTML);
}

function addCitiesToDel() {
  const box = document.querySelector<HTMLElement>(".del-city__cities");
  console.log(box);
  box!.innerHTML = "";
  cities.forEach((city) => {
    const CityToDel = document.createElement("p");
    CityToDel.className = "del-city__cities__city";
    CityToDel.innerHTML = city[1];
    box?.appendChild(CityToDel);
  });
}

function delCity(target: HTMLElement) {
  const buttonsCitiesToDel = document.querySelectorAll(
    ".del-city__cities__city"
  );
  buttonsCitiesToDel.forEach((button, i) => {
    let idToDel = -1;
    if (target === button) {
      for (let x = 0; x < cities.length; x++) {
        if (cities[x][1] === button.textContent) {
          idToDel = cities[x][0];
          x = cities.length;
        }
      }
      button.remove();
      fetch(Endpoints.weatherLinks, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("Ltoken") as string,
        },
        body: JSON.stringify({ idToDel }),
      }).then((response) => {
        if (response.ok) {
          document.querySelector(".main")!.innerHTML = "";
          fetchFollowedCities();
        }
      });
    }
  });
}
