$(document).ready(() => {
  // get stored cities from local memory
  let priorCities = JSON.parse(localStorage.getItem("storedCities")) || [];
  // Loop through stored cities backwards to to add a button for each one
  for (let i = priorCities.length - 1; i > 0; i--) {
    addButton(priorCities[i]);
  }
  // Get the weather info of the most recently input city from local storage memory
   if (priorCities[0] != null || priorCities[0] != undefined){
     getWeatherInfo(priorCities[0]);
   }

  // capture citySearchInput value with search button click if text is not blank
  // ajax call the Weather API to get weather data of the input city
  $("#citySearchButton").click(function(event) {
    event.preventDefault();

    if ($("#citySearchInput").val() != "") {
      getWeatherInfo(titleCaseConvert($("#citySearchInput").val()));

      $("#citySearchInput").val("");
    }
  });

  // enter key handler to capture citySearchInput value for city search in Weather API
  $("#citySearchInput").keyup(event => {
    event.preventDefault();
    if (event.keyCode === 13 && event.target.value != "") {
      getWeatherInfo(titleCaseConvert($("#citySearchInput").val()));

      $("#citySearchInput").val("");
    }
  });

  // get city weather of city search input text
  function getWeatherInfo(checkCity) {
    let urlForecastPrefix = "https://api.openweathermap.org/data/2.5/weather";
    let urlFiveDayPrefix = "https://api.openweathermap.org/data/2.5/forecast";
    let key = "appid=fe92d0ea72a5a2dbcd2810e284c670b1";
    let units = "&units=Imperial";
    let city = "?q=" + checkCity;

    $.ajax({
      url: urlForecastPrefix + city + units + "&" + key + "&mode=json",
      method: "GET",
      success: function() {
        addButton(checkCity);
      },
      error: function() {
        alert("No Info Available for User Input");
      }
    }).then(function(response) {
      updateWeather(response);
    });

    // Now get 5 day extended forecast
    $.ajax({
      url: urlFiveDayPrefix + city + units + "&" + key,
      method: "GET",
      error: function() {
        console.log("Extended Forecast Not Available");
      }
    }).then(function(extendedResponse) {
      $("#forecastExtendedContainer").empty();
      // using 12 noon as time of day to display weather
      for (let i = 4; i < extendedResponse.list.length; i += 8) {
        $("#forecastExtendedContainer").append(
          $("<div>")
            .addClass("col card bg-primary m-2 p-2")
            .append(
              $("<h4>").text(
                moment.unix(extendedResponse.list[i].dt).format("M/DD/YYYY")
              )
            )
            .append(
              $("<img>").attr(
                "src",
                "https://openweathermap.org/img/wn/" +
                  extendedResponse.list[i].weather[0].icon +
                  ".png"
              )
            )
            .append(
              $("<p>").text(
                "Temp: " +
                  extendedResponse.list[i].main.temp +
                  String.fromCharCode(176) +
                  "F"
              )
            )
            .append(
              $("<p>").text(
                "Humidity: " + extendedResponse.list[i].main.humidity
              )
            )
        );
      }
    });
  }

  function getUVIndex(lat, lon) {
    $.ajax({
      method: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/uvi" +
        "?" +
        "appid=fe92d0ea72a5a2dbcd2810e284c670b1" +
        "&lat=" +
        lat +
        "&lon=" +
        lon +
        "&mode=json",
      method: "GET",
      error: function() {
        alert("No UV Index available for stated location");
      }
    }).done(function(uvResponse) {
      $(".uv-intensity")
        .text(uvResponse.value)
        .css("color", "white")
        .css("F=font-weight: bold");
      let uvRanges = [
        [0, 2.9, "#3EA72D"],
        [3.1, 7, "#FFF300"],
        [8.0, 999, "#E53210"]
      ];
      uvRanges.forEach(element => {
        if (
          uvResponse.value < Math.max(...element.slice(0, 2)) &&
          uvResponse.value > Math.min(...element.slice(0, 2))
        ) {
          $(".uv-intensity").css("background-color", element[2]);
        }
      });
    });
  }

  // Function to  add a button to left container with the city name captured in input text
  function addButton(newCity) {
    let numCityButtons = $("#cityHistoryContainer").children().length;
    let cities = [];
    // If there is a prior city button with the same name as the input city name then delete it
    $("#cityHistoryContainer")
      .children()
      .each((index, element) => {
        if (element.innerHTML == newCity) {
          element.remove();
        }
      });
    // ceate a button with the city name
    let newCityButtton = $("<button>") // ceate a button with the city name
      .addClass("input-group-text bg-light w-100 priorCityButton")
      .text(newCity)
      .click(() => {
        getWeatherInfo(event.target.innerHTML);
        event.target.remove();
      });
    if (numCityButtons < 8) {
      // If the number of current buttons is less than 8, prepend it
      newCityButtton.prependTo($("#cityHistoryContainer"));
    } else {
      // If the number of current city buttons is 8 or more delete the last one then prepend
      $("#cityHistoryContainer")
        .children()
        .last()
        .remove()
        .prepend(newCityButtton);
    }

    $("#cityHistoryContainer")
      .children()
      .each((index, element) => {
        cities.push(element.innerHTML);
      });
    // store list of cities to local starage
    localStorage.setItem("storedCities", JSON.stringify(cities));
  }

  function updateWeather(data) {
    $("#forecastCurrentContainer").empty();
    $("#forecastCurrentContainer")
      .append(
        $("<h2>")
          .text(data.name + " " + moment().format("(M/d/YYYY)"))
          .addClass("d-inline")
      )
      .append(
        $("<img>").attr(
          "src",
          "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png"
        )
      )
      .append(
        $("<p>").text(
          "Temperature: " + data.main.temp + String.fromCharCode(176) + "F"
        )
      )
      .append(
        $("<p>").text(
          "Humidity: " + data.main.humidity + String.fromCharCode(37)
        )
      )
      .append($("<p>").text("Wind Speed: " + data.wind.speed + " MPH"))
      .append(
        $("<p>")
          .text("UV index: ")
          .append($("<span>").addClass("uv-intensity alert b-1"))
      );

    // Get uv index
    getUVIndex(data.coord.lat, data.coord.lon);
  }

  // Function to convert a string to titleCase to correct user type on case
  titleCaseConvert = str => {
    return str
      .toLowerCase()
      .split(" ")
      .map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };
}); // End of Dom ready
