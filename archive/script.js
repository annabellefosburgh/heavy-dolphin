//waits for everything to render before running the page
$(document).ready(function(){
  //grabs HTML elements
  var searchBtn = $("#search-btn");
  var alcoholSelect = $("#alcohol-select");
  var spiritSelect = $("#alcohol-type");
  var categorySelect = $("#category-select");
  var resultsBackButton = $("#results-back-button")
  var resultsList = $("#results-list")


  //event listener for search button
  searchBtn.on("click", function(event){
      event.preventDefault()
      //grabs the value selected from the drop down menu
      var alcohol = alcoholSelect.val();
      var spirit = spiritSelect.val();
      var category = categorySelect.val();

      fetchDrinks(alcohol, spirit, category);
      //hides the search page and shows the recommendations page
      $("#results-page").show();
      $("#search-page").hide();
  });

  //fetches data based on criteria taken from drop down menus
  function fetchDrinks(alcohol, spirit, category) {
      //these if statements change the api url based on what criteria was selected
      var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?";
      if (alcohol === "Alcoholic") {
          apiUrl += "a=Alcoholic";
      } else if(alcohol === "Non alcoholic") {
          apiUrl += "a=Non_Alcholic";
      }
      
      if (spirit !== '') {
          apiUrl += "&i=" + spirit;
      }

      if (category !== '') {
          apiUrl += "&c=" + category;
      }

      //fetches the api url created from criteria
      fetch(apiUrl)
      //checks if response is ok and changes response to json
      .then(function(response) {
          if (!response.ok) {
            throw response.json();
          }
          return response.json();
      }).then(function(data) {
          console.log(response);
          console.log(data);
          //empties any previous data in the results list
          resultsList.empty();
          //runs a function for each variable in the data.drinks array 
          //creates a link item for each drink name and adds an href that goes to the description page
          data.drinks.forEach(function(drink){
              var drinkElement = $("<div>").addClass("recommendation").text(drink.strDrink);
              drinkElement.data("id", drink.idDrink);
              resultsList.append(drinkElement);
          });
      });
  }
   //grabs any item under the class recommendation and then changes the page when clicked and runs the displayDescription() for that specifc drink
  $(".recommendation").on("click", function() {
      var drinkId = $(this).data("id");
      $("#results-page").hide();
      $("#description-page").show();
      displayDescription(drinkId);
  })
   
  //back button for going back to the search page 
  resultsBackButton.on("click", function() {
      $("#results-page").hide();
      $("#search-page").show();
  })

  //grabs HTML elements for description page
  var drinkTitle = $("#drink-title");
  var drinkImg = $("#drink-img");
  var drinkInstructions = $("#drink-instructions");
  var youtubeList = $("#youtube-list");
  var descriptionBackButton = $("#description-back-button");
  //api urls for fetching and api key
  var drinkApiUrl = "https://www.cocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkId;
  var youtubeApiKey = "AIzaSyDdGH2yyQR0S7ds9kWXfv5MZx1WefCuv6E";
  var youtubeApi = "https://www.googleapis.com/youtube/v3/search";

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
});