//waits for everything to render before running the page
$(document).ready(function() {
  //grabs HTML elements
  var searchBtn = $("#search-btn");
  var alcoholSelect = $("#alcohol-select");
  var spiritSelect = $("#alcohol-type");
  var categorySelect = $("#category-select");
  var changeSelection = $("#change-selection");
  var seeMore = $("#see-more");
  var backButton = $("#description-back-button");
  var resultsBackButton = $("#results-back-button")
  var resultsList = $("#results-list")

  //event listener for search button
  searchBtn.on("click", function(event) {
    event.preventDefault();
    //grabs the value selected from the drop down menu
    var alcohol = alcoholSelect.val();
    var spirit = spiritSelect.val();
    var category = categorySelect.val();

    fetchDrinks(alcohol, spirit, category);
    //hides the form
    $(".selector").hide();
  });

  //fetches data based on criteria taken from drop down menus
  function fetchDrinks(alcohol, spirit, category) {
    var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?";
    apiUrl += (alcohol !== "") ? "a=" + alcohol : "";
    apiUrl += (spirit !== "") ? "&i=" + spirit : "";
    apiUrl += (category !== "") ? "&c=" + category : "";

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw response.json();
        return response.json();
      })
      .then(data => {
        if (data.drinks && data.drinks.length > 0) {
          var drink = data.drinks[Math.floor(Math.random() * data.drinks.length)];
          fetchDrinkById(drink.idDrink);
        } else {
          alert("No drinks found for the selected criteria.");
        }
      });
  }

function fetchDrinkById(drinkId) {
  var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkId;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw response.json();
      return response.json();
    })
    .then(data => {
      if (data.drinks && data.drinks.length > 0) {
        displayDrink(data.drinks[0]);
      } else {
        alert("No drink details found.");
      }
    });
}

function displayDrink(drink) {
  $("#drink-name").text(drink.strDrink);
  $("#drink-description").text(drink.strInstructions);
  $("#drink-image").attr("src", drink.strDrinkThumb);
  $("#drink-reco").removeClass("hidden");

  // Show "Change Selection" and "See More" buttons only after the drink is displayed
  changeSelection.removeClass("hidden");
  seeMore.removeClass("hidden");
}
});

//event listener for function to show youtube video
seeMore.addEventListener("click", searchVideo);

function searchVideo() {
    //variables such as APIs drink name and search parameters
    var drinkName = drink.strDrink;
    var searchQuery = drinkName + "drink";
    var youtubeApiKey = "AIzaSyDdGH2yyQR0S7ds9kWXfv5MZx1WefCuv6E";
    var youtubeApi = "https://www.googleapis.com/youtube/v3/search";
    //grabs a video based off searchQuery value and provides one result
    var params = new URLSearchParams({
        part: "snippet",
        q: searchQuery,
        type: "video",
        maxResults: 1,
        key: youtubeApiKey
    });
    var Url = youtubeApi + "?" + params;

    fetch(Url) 
    .then(function(response) {
        //checks if response is ok and changes response to json
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    }).then(function(data) {
        //grabs first video and then plays that video in a new window
        var video = data.items[0].id.videoId;
        var videoUrl = "https://www.youtube.com/watch?v=" + video;

        window.open(videoUrl)
    });
}