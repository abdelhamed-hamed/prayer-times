// On Bars Click

// import { all } from "axios";

// import { all } from "axios";

// import { all } from "axios";

// import axios from "axios";

let bars = document.getElementById("bars");
let navBar = document.getElementById("navBar");
let fajr = document.getElementById("fajrTime");
let shrook = document.getElementById("shrookTime");
let zohr = document.getElementById("zohrTime");
let aasr = document.getElementById("aasrTime");
let maghreb = document.getElementById("maghrebTime");
let eshaa = document.getElementById("eshaaTime");
let nextPrayer = document.querySelectorAll(".nextprayer");
let timesLeft = document.getElementById("timesLeft");
let namesAllah = document.getElementById("namesAllah");
let chosenName = document.getElementById("chosenName");
let nameExplain = document.getElementById("nameExplain");
let count = document.getElementById("count");
let allZekr = document.getElementById("allZekr");

let vallageCoords = {
  lat: "30.033333",
  lon: "31.233334",
  place: "cairo",
  timeNowHour: "",
  timeNowMinutes: "",
};

// let vallageDetails = {
//   place: "cairo",
//   date: dayDate,
// };

let country = document.querySelectorAll(".country");
let government = document.querySelectorAll(".government");
let search = document.getElementById("search");
let place = document.getElementById("place");
let findPlace = document.getElementById("findMyPlace");
let dateMel = document.getElementById("dateM");
let dayName = document.getElementById("dayName");
let dayHNumber = document.getElementById("dayHNumber");
let yearH = document.getElementById("yearH");
let timeNow = document.getElementById("timeNow");

// Click On Bars
function clickBars() {
  bars.addEventListener("click", () => {
    bars.classList.toggle("open");
    if (bars.classList.contains("open")) {
      navBar.style.cssText = ` 
      transition:1s;
      right:0;
   `;
    } else {
      navBar.style.cssText = ` 
      transition:1s;
      right:-200px;
   `;
    }
  });
}

// Get AutoLocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    getCityName();
  }
}

function showPosition(position) {
  new Promise((resolve, reject) => {
    if (position.coords.latitude && position.coords.longitude) {
      vallageCoords.lat = position.coords.latitude;
      vallageCoords.lon = position.coords.longitude;
      resolve();
    } else {
      reject();
    }
  })
    .then(() => {
      getCityName();
    })
    .catch(() => {
      getCityName();
    });
}

function showError() {
  getCityName();
}

function getCityName() {
  return new Promise((resolve, reject) => {
    if (vallageCoords.lat && vallageCoords.lon) {
      axios
        .get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${vallageCoords.lat} &lon=${vallageCoords.lon}&format=json&apiKey=b5dd1bba0bfb420da1885f9e6f0edf47&lang=ar`
        )
        .then(function (response) {
          buildCountryAndCity(response);
          resolve();
        });
    }
  }).then(() => {
    getDateMelady(vallageCoords.lon, vallageCoords.lat);
    timeCityNow(vallageCoords.lon, vallageCoords.lat);
    adhanTime(vallageCoords.place);
  });
}

function buildCountryAndCity(response) {
  vallageCoords.lat = response.data.results[0].lat;
  vallageCoords.lon = response.data.results[0].lon;
  vallageCoords.place = response.data.results[0].city;
  // vallageCoords.date
  if (response.data.results[0].city === undefined) {
    for (let gover of government) {
      gover.innerHTML = ``;
    }
  } else {
    for (let gover of government) {
      gover.innerHTML = `${response.data.results[0].city}`;
    }
  }
  for (let nums of country) {
    nums.innerHTML = `${response.data.results[0].country}`;
  }
}

function searchClick() {
  search.onclick = () => {
    if (place.value.trim() !== "") {
      cityClick(place.value);
      getCityName();
    }
  };
}

function cityClick(cityName) {
  return new Promise((resolve) => {
    if (cityName) {
      axios
        .get(
          `https://api.geoapify.com/v1/geocode/search?text=${cityName}&format=json&apiKey=b5dd1bba0bfb420da1885f9e6f0edf47&lang=ar`
        )
        .then(function (response) {
          buildCountryAndCity(response);
          place.value = "";
          resolve();
        });
    }
  }).then(() => {
    getCityName();
  });
}

function findMyPlace() {
  findPlace.addEventListener("click", () => {
    getLocation();
  });
}

function getDateMelady(lon, lat) {
  axios
    .get(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        ` https://timeapi.io/api/Time/current/coordinate?longitude=${lon}&latitude=${lat}`
      )}`
    )
    .then((response) => {
      let convert = JSON.parse(response.data.contents);
      dateMel.innerHTML = `${convert.day}/${convert.month}/${convert.year}`;
      getHijri(convert.day, convert.month, convert.year);
    });
}

function getHijri(dayMelady, monthMelady, yearMelady) {
  axios
    .get(
      `http://api.aladhan.com/v1/gToH/${dayMelady}-${monthMelady}-${yearMelady}?lang=ar`
    )
    .then(function (response) {
      dayName.innerHTML = `${response.data.data.hijri.weekday.ar}`;
      dayHNumber.innerHTML = `${response.data.data.hijri.day}`;
      yearH.innerHTML = `${response.data.data.hijri.year}`;
    });
}

function timeCityNow(lon, lat) {
  axios
    .get(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://timeapi.io/api/Time/current/coordinate?longitude=${lon}&latitude=${lat}`
      )}`
    )
    .then(function (response) {
      let convert = JSON.parse(response.data.contents);
      vallageCoords.timeNowHour = convert.hour;
      vallageCoords.timeNowMinutes = convert.minute;

      if (convert.minute < 10) {
        convert.minute = "0" + convert.minute;
      }

      if (convert.hour > 12) {
        convert.hour = -(12 - convert.hour);
        if (convert.hour < 10) {
          convert.hour = "0" + convert.hour;
        }
      } else if (convert.hour === 0) {
        convert.hour = 12 - convert.hour;
      } else {
        if (convert.hour < 10) {
          convert.hour = "0" + convert.hour;
        }
      }
      timeNow.innerHTML = `${convert.hour}:${convert.minute}`;
      nextPrayerName(vallageCoords.place, vallageCoords.timeNow);
    })
    .catch(() => {
      timeNow.innerHTML = `00:00:00`;
    });
}

function setIntervalTime() {
  timeCityNow(vallageCoords.lon, vallageCoords.lat);
}

function adhanTime(place) {
  axios
    .get(`http://api.aladhan.com/v1/timingsByAddress?address=${place}`)
    .then(function (response) {
      fajr.innerHTML = `${response.data.data.timings.Fajr}`;
      shrook.innerHTML = `${response.data.data.timings.Sunrise}`;
      zohr.innerHTML = `${response.data.data.timings.Dhuhr}`;
      aasr.innerHTML = `${response.data.data.timings.Asr}`;
      maghreb.innerHTML = `${response.data.data.timings.Maghrib}`;
      eshaa.innerHTML = `${response.data.data.timings.Isha}`;
    });
}
function nextPrayerName(place, timeHours, timeMinutes) {
  axios
    .get(`https://api.aladhan.com/v1/nextPrayerByAddress?address=${place}`)
    .then(function (response) {
      for (let nextName of nextPrayer) {
        nextName.innerHTML = Object.keys(response.data.data.timings);
      }
      let regHour = /[0-9]+\w/gi;
      let x = Object.values(response.data.data.timings).toString();
      let nextPrayerHour = x.match(regHour)[0];
      let nextPrayerminutes = x.match(regHour)[1];
      let hourDiffrence = nextPrayerHour - vallageCoords.timeNowHour;
      let minutes;
      if (nextPrayerminutes > vallageCoords.timeNowMinutes) {
        minutes = nextPrayerminutes - vallageCoords.timeNowMinutes;
      } else {
        minutes = vallageCoords.timeNowMinutes - nextPrayerminutes;
      }

      if (hourDiffrence < 10) {
        hourDiffrence = "0" + hourDiffrence;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      timesLeft.innerHTML = `${hourDiffrence}:${minutes}`;
    });
}

function getAllahName() {
  axios.get("../json/asmaa.json").then(function (response) {
    buildAllahName(response);
  });
}

function buildAllahName(response) {
  let names;
  let allName;

  for (let allAllahNames of response.data) {
    names = document.createElement("div");
    names.classList.add("name");

    names.setAttribute("id", `name-${allAllahNames.id}`);

    let spanName = document.createElement("span");

    spanName.innerHTML = `${allAllahNames.name}`;

    names.append(spanName);
    namesAllah.append(names);

    allName = document.querySelectorAll(".name");

    names.addEventListener("click", (el) => {
      buildAllahMeansOnclick(allAllahNames.name, allAllahNames.text);

      sessionStorage.setItem("mean", `${allAllahNames.text}`);
    });
  }

  storageNameSet(allName);
  storageNameGet(allName);
  removeAndAddActive(allName);
  buildMeansFromStorage(allName);
}

function buildAllahMeansOnclick(allahChosenName, allahNameExplan) {
  chosenName.innerHTML = allahChosenName;
  nameExplain.innerHTML = allahNameExplan;
}

function removeAndAddActive(allName) {
  if (sessionStorage.length < 1 || sessionStorage.getItem("id") == undefined) {
    allName[0].classList.add("active");
  }

  allName.forEach((e) => {
    e.addEventListener("click", (el) => {
      allName.forEach((elRemove) => {
        elRemove.classList.remove("active");
      });
      e.classList.add("active");
    });
  });
}

function storageNameSet(allName) {
  allName.forEach((el) => {
    el.addEventListener("click", () => {
      sessionStorage.setItem("id", `${el.id}`);
    });
  });
}

function storageNameGet(allName) {
  for (let x of allName) {
    if (x.id == sessionStorage.getItem("id")) {
      x.classList.add("active");
    }
  }
}

function buildMeansFromStorage(allName) {
  for (let storeNameMean of allName) {
    if (storeNameMean.classList.contains("active")) {
      chosenName.innerHTML = storeNameMean.textContent;
      if (sessionStorage.mean !== undefined) {
        nameExplain.innerHTML = sessionStorage.getItem("mean");
      }
    }
  }
}

function getAzkarSabah() {
  axios.get("../json/alsabah.json").then(function (response) {
    bulidAzkarSabah(response);
  });
}

function bulidAzkarSabah(response) {
  for (let x of response.data[0].array) {
    let cr = document.createElement("div");
    cr.classList.add("zekr");
    cr.innerHTML = `<p>
          "${x.text}
        </p>
        <span class="d-block mainCount"
          >عدد مرات التكرار : <span id="count">${x.count}</span>
        </span>`;
    allZekr.append(cr);
  }
}
getAzkarSabah();
export {
  clickBars,
  getLocation,
  showPosition,
  showError,
  getCityName,
  searchClick,
  findMyPlace,
  getDateMelady,
  getAllahName,
};
