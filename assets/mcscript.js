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

  //creates search parameters based of selected recommendation and creates unique url
  var searchParameters = {
    key: youtubeApiKey,
    q: drink.strDrink + "recipe",
    part: "snippet",
    type: "video",
    maxResults: 3,
}
var searchUrl = youtubeApi + "?" + $.param(searchParameters);

function displayDescription(drinkId) {
    //fetches drink details from cocktaildb
    fetch(drinkApiUrl)
    .then(function(response) {
        //checks if response is ok and changes response to json
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    }).then(function(data) {
        //uses api calls to manipulate data and grab the drink name the drink image and the drink instructions and drinkId for redirection accuracy
        var drink = data.drinks[0];
        drinkTitle.text(drink.strDrink);
        drinkImg.attr("src", drink.strDrinkThumb);
        drinkInstructions.text(drink.strInstructions);

        //fetches youtube video searches
        fetch(searchUrl)
        .then(function(response) {
            //checks if response is ok and changes response to json
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        }).then(function(data) {
            //vraible assinged to data items gained from api data
            var videos = data.items;
            var videoId = video.id.videoId;
            //runs function for each item in the videos array
            videos.forEach(function(video) {
                //creates a list item and a respective reference link for each item
                var videoItem = $("<li>");
                var videoLink = $("<a>");
                //creates reference link based of videoId 
                var refLink = "https://www.youtube.com/watch?v=" + videoId;
                //grabs text of video title through data given by api 
                videoLink.text(video.snippet.title);
                //adds link attribute to each video title
                videoLink.attr("href", refLink);
                //appends the list items and links to the HTML id "youtube-list"
                videoItem.append(videoLink);
                youtubeList.append(videoItem)
            });
        });
    });
    //back button to switch from description page to results page
    descriptionBackButton.on("click", function() {
        $("description-page").hide();
        $("results-page").show();
    });
}