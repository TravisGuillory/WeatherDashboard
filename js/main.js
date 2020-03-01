$(document).ready(()=>{



// city search input handler to prevent default and
// invoke same function as search button click
  $("#citySearchInput").keyup(event => {
    event.preventDefault();

    if (event.keyCode === 13 && event.target.value != "") {
      addcity(event.target.value);
      getCurrentWeather(event.target.value);
      event.target.value = "";
    }
  });

// click handler for city search buton
  $("#citySearchButton").click(function(event) {
    event.preventDefault();

    if ($("#citySearchInput").val() != "") {
      addcity($("#citySearchInput").val());
      $("#citySearchInput").val("");
    }
  });
  addcity = ((newCity) => {
    let numCityButtons = $("#cityHistoryContainer").children().length;
    if (numCityButtons < 8) {
      $("<button>")
        .addClass("input-group-text bg-light w-100 priorCityButton")
        .text(newCity)
        .prependTo($("#cityHistoryContainer"));
    } else {
      $("#cityHistoryContainer")
        .children()
        .last()
        .remove();
      $("<button>")
        .addClass("input-group-text bg-light w-100 priorCityButton")
        .text(newCity)
        .prependTo($("#cityHistoryContainer"));
    }
  });



  // function to search Weather API for current forecast
  getCurrentWeather = (() =>{
    let urlPrefix = "http://api.openweathermap.org/data/2.5/weather";
    
    let key = "appid=fe92d0ea72a5a2dbcd2810e284c670b1";
    let city = "?q=Houston";
    let units = "&units=Imperial";
    let queryURL = urlPrefix + city + "&" + key  + units;
    let uvURLPrevix = "http://api.openweathermap.org/data/2.5/uvi";
    let lat;
    let lon;

    jQuery.ajax({
      url: queryURL,
      method: "GET"
    })
    .then(function(response){
      console.log(response);
      $(".city").text(response.name);
      $(".temp").text("Temperature: " + (response.main.temp + String.fromCharCode(176)  +" F"));
      $(".humidity").text("Humidity: " + response.main.humidity + "%");
      $(".wind-speed").text("Wind speed: " + response.wind.speed + " mph");
      $(".uv-index").text("UV index: " + response);
      lon =  "&lon=" + (parseFloat(response.coord.lon)).toFixed(2);
      lat =  "&lat=" + (parseFloat(response.coord.lat).toFixed(2));
      getUVIndex(lat, lon);
    })

    getUVIndex = ((lat, lon) =>{
      jQuery.ajax({
        url: uvURLPrevix  + "?" + key  + lat + lon,
        method: "GET"
        
      })
      .then(function(uvResponse){
        console.log(uvResponse.value);
        $(".uv-index").text("UV Index: " + uvResponse.value);
      });

    })

    
  
  });




}); // End of Dom ready
/* fe92d0ea72a5a2dbcd2810e284c670b1
http://api.openweathermap.org/data/2.5/forecast?q=Lafayette,LA,us&mode=json&appid=fe92d0ea72a5a2dbcd2810e284c670b1

http://api.openweathermap.org/data/2.5/weather?q=Lafayette,LA,us&mode=json&appid=fe92d0ea72a5a2dbcd2810e284c670b1 */