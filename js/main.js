// city search input handler to prevent default and
// invoke same function as search button click
$("#citySearchInput").keyup(event => {
  event.preventDefault();

  if (event.keyCode === 13 && event.target.value != "") {
    addcity(event.target.value);
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

addcity = newCity => {
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

  getCurrentWeather(place){
        let urlPrefix = "http://api.openweathermap.org/data/2.5/forecast";
        let city = "q=" + place +"usmode=json";
        let key = "&appid=fe92d0ea72a5a2dbcd2810e284c670b1";
        let queryURL = urlPrefix + city + key;

        jQuery.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response){
            console.log(response);
        })

  }


};

/* fe92d0ea72a5a2dbcd2810e284c670b1
http://api.openweathermap.org/data/2.5/forecast?q=Lafayette,LA,us&mode=json&appid=fe92d0ea72a5a2dbcd2810e284c670b1

http://api.openweathermap.org/data/2.5/weather?q=Lafayette,LA,us&mode=json&appid=fe92d0ea72a5a2dbcd2810e284c670b1 */