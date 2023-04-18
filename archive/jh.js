// waits for everything to render before running the page
$(document).ready(function() {
    // grabs HTML elements
    var searchBtn = $("#search-btn");
    var alcoholSelect = $("#alcohol-select");
    var spiritSelect = $("#alcohol-type");
    var categorySelect = $("#category-select");
    var resultsBackButton = $("#results-back-button");
    var resultsList = $("#results-list");
    var drinkTitle = $("#drink-title");
    var drinkImg = $("#drink-img");
    var drinkInstructions = $("#drink-instructions");
    var youtubeList = $("#youtube-list");
    var descriptionBackButton = $("#description-back-button");
    var searchUrl;
    var drinkApiUrl;
    var drinkId;

  // event listener for search button
    searchBtn.on("click", function(event) {
      event.preventDefault();

      // grabs the value selected from the drop down menu
      var alcohol = alcoholSelect.val();
      var spirit = spiritSelect.val();
      var category = categorySelect.val();
        //runs the fetchDrinks function with the values from the drop down menus
      fetchDrinks(alcohol, spirit, category);

      // hides the search page and shows the recommendations page
      $("#results-page").show();
      $("#search-page").hide();
    });

    // function that fetches drinks from API using the selected values
    function fetchDrinks(alcohol, spirit, category) {
        //creates the URL to the API
      var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?";
        // checks if the alcohol value is not empty and adds it to the URL
      if (alcohol === "Alcoholic") {
        apiUrl += "a=Alcoholic";
      } else if (alcohol === "Non alcoholic") {
        apiUrl += "a=Non_Alcoholic";
      }
      if (spirit !== "") {
        apiUrl += "&i=" + spirit;
      }
      if (category !== "") {
        apiUrl += "&c=" + category;
      }
      // fetches the api url created from criteria
      fetch(apiUrl)
      // checks if response is ok and changes response to json
        .then(function(response) {
          if (!response.ok) {
            throw new Error(response.status);
          }
          return response.json();
        })
        .then(function(data) {
            // empties any previous data in the results list
          resultsList.empty();
          //runs a function for each variable in the data.drinks array 
          data.drinks.forEach(function(drink) {
             // creates a link item for each drink name and adds an href that goes to the description page
            var drinkElement = $("<div>").addClass("recommendation").text(drink.strDrink);
            drinkElement.data("id", drink.idDrink);
            resultsList.append(drinkElement);
          });


           // grabs any item under the class recommendation and then changes the page when clicked and runs the displayDescription() for that specifc drink
          $(".recommendation").on("click", function() {
            drinkId = $(this).data("id");
            $("#results-page").hide();
            $("#description-page").show();
            displayDescription();
          });
        })
        .catch(function(error) {
          console.log("Error:", error);
        });
    }

      // function that displays drink details
    function displayDescription() {
      drinkApiUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkId;
     
    // fetches drink details from API
      fetch(drinkApiUrl)
        .then(function(response) {
          if (!response.ok) {
            throw new Error(response.status);
          }
          return response.json();
        })
        .then(function(data) {
          var drink = data.drinks[0];
          drinkTitle.text(drink.strDrink);
          drinkImg.attr("src", drink.strDrinkThumb);
          drinkInstructions.text(drink.strInstructions);

           // set up parameters for YouTube API request
          var youtubeApiKey = "AIzaSyDdGH2yyQR0S7ds9kWXfv5MZx1WefCuv6E";
          var youtubeApi = "https://www.googleapis.com/youtube/v3/search";
          var searchParameters = {
            key: youtubeApiKey,
            q: drink.strDrink + " recipe",
            part: "snippet",
            type: "video",
            maxResults: 3,
          };

          // build the YouTube API request URL
          searchUrl = youtubeApi + "?" + $.param(searchParameters);
          // fetch YouTube videos related to the drink
          fetch(searchUrl)
            .then(function(response) {
              if (!response.ok) {
                throw new Error(response.status);
              }
              return response.json();
            })
            .then(function(data) {
              youtubeList.empty();
              // add new YouTube video links to the page
              data.items.forEach(function(video) {
                var videoItem = $("<li>");
                var videoLink = $("<a>");
                var videoId = video.id.videoId;
                var refLink = "https://www.youtube.com/watch?v=" + videoId;
                videoLink.attr("href", refLink);
                videoLink.attr("target", "_blank");
                var videoTitle = $("<h4>").text(video.snippet.title);
                var videoThumbnail = $("<img>").attr("src", video.snippet.thumbnails.high.url);
                videoLink.append(videoThumbnail);
                videoLink.append(videoTitle);
                videoItem.append(videoLink);
                youtubeList.append(videoItem);
                });
                })
                .catch(function(error) {
                console.log("Error fetching YouTube videos:", error);
                });
                })
                .catch(function(error) {
                console.log("Error fetching drink details:", error);
                });
            }});