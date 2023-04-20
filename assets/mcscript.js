$(document).ready(function() {
  // grabs HTML elements
  var searchBtn = $("#search-btn");
  var alcoholSelect = $("#alcohol-select");
  var spiritSelect = $("#alcohol-type");
  var categorySelect = $("#category-select");
  var changeSelection = $("#change-selection");
  var seeMore = $("#see-more");
  var heading = $(".headertext");
  var nameInput = $("#name-input");
  var welcomeMessage = $("#welcome-message")

  //grabs local storage element with key "name"
  var storedName = localStorage.getItem("name");
  //checks if their is value for stored name and changes the text
  if(storedName) {
    welcomeMessage.text(storedName + ", welcome to ThirstTrap!");
  }
  //when an input is entered the function runs
  nameInput.on("input", function() {
    //grabs value of input and trims it 
    var name = nameInput.val().trim();
    //if the input is greater than 0 it sets the local storage item with key "name" and changes text
    if (name.length > 0) {
      welcomeMessage.text(name + ", welcome to ThirstTrap!");
      localStorage.setItem("name", name);
    } else {
      //if input is empty then it clears the name from the message and removes the item from local storage
      welcomeMessage.text("");
      localStorage.removeItem("name")
    }
  });

  // event listener for search button
  searchBtn.on("click", function(event) {
    event.preventDefault();
    //grabs the value selected from the drop down menu
    var alcohol = alcoholSelect.val();
    var spirit = spiritSelect.val();
    var category = categorySelect.val();

    fetchDrinks(alcohol, spirit, category);
    // hides the form
    $(".selector").hide();
    welcomeMessage.addClass("hidden");
    nameInput.addClass("hidden")

  // update heading text
  heading.text("Here is your drink recommendation!");
  });

  // fetches data based on criteria taken from drop down menus
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
        console.log(data);
        if (data.drinks && data.drinks.length > 0) {
          var drink = data.drinks[Math.floor(Math.random() * data.drinks.length)];
          fetchDrinkById(drink.idDrink);
        } else {
          // commenting out alert
          // alert("No drinks found for the selected criteria.");
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
        // commenting out alert
        // alert("No drink details found.");
      }
    });
}

function displayDrink(drink) {
  $("#drink-name").text(drink.strDrink);
  $("#drink-description").text(drink.strInstructions);
  $("#drink-image").attr("src", drink.strDrinkThumb);
  $("#drink-reco").removeClass("hidden");

  // show "Change Selection" and "See More" buttons only after the drink is displayed
  changeSelection.removeClass("hidden");
  seeMore.removeClass("hidden");

}

// event listener for function to show youtube video
$("#see-more").on("click", function() {
  //variables grabs drink name text and adds drink to specify search and API URL parameters
  drinkName = $("#drink-name").text()
  var searchQuery = drinkName + "drink";
  var youtubeApiKey = "AIzaSyDdGH2yyQR0S7ds9kWXfv5MZx1WefCuv6E";
  var youtubeApi = "https://www.googleapis.com/youtube/v3/search?";
  // grabs a video based off searchQuery value and provides one result
  var Url = youtubeApi + "part=snippet&maxResults=1&q=" + searchQuery + "&type=video&key=" + youtubeApiKey;

  fetch(Url) 
  .then(function(response) {
      // checks if response is ok and changes response to json
      if (!response.ok) {
          throw response.json();
      }
      return response.json();
  }).then(function(data) {
      // grabs first video and then plays that video in a new window
      var video = data.items[0].id.videoId;
      var videoUrl = "https://www.youtube.com/watch?v=" + video;

      window.open(videoUrl)
  });
});

$("#change-selection").on("click", function() {
  $("#drink-reco").addClass("hidden");
  $(".selector").show();
  $(".headertext").text("Enter the criteria of your drink");
  nameInput.removeClass("hidden");
  welcomeMessage.removeClass("hidden");
});
});