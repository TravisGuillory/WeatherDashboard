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
};
