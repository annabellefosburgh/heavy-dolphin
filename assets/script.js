$(document).ready(function(){
    var searchBtn = $("#search-btn");
    var alcoholSelect = $("#alcohol-select");
    var spiritSelect = $("#alcohol-type");
    var categorySelect = $("#category-select");


    searchBtn.on("click", function(event){
        event.preventDefault()
        var alcohol = alcoholSelect.val();
        var spirit = spiritSelect.val();
        var category = categorySelect.val();

        fetchDrinks(alcohol, spirit, category);
        $("#results-page").show();
        $("#search-page").hide();
    });

    function fetchDrinks(alcohol, spirit, category) {
        var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?";
        if (alcohol === "Alcoholic") {
            apiUrl += "a=Alcoholic&";
        } else if(alcohol === "Non alcoholic") {
            apiUrl += "a+Non_Alcholic&";
        }
        
        if (spirit !== '') {
            apiUrl += "&i=" + spirit;
        }

        if (category !== '') {
            apiUrl += "&c=" + category;
        }

        fetch(apiUrl)
        .then(function(response) {
            if (!response.ok) {
              throw response.json();
            }
            return response.json();
        }).then(function(data) {
            console.log(response);
            console.log(data);
            var drinkList = "";
            for(var i = 0; i < data.drinks.length; i++) {
                var drinkItem = $("<li>");
                drinkItem.text(data.drinks[i])
                drinkList.append(drinkItem);
            }
        });
    }
     
    $('#back-button').on("click", function() {
        $("results-page").hide();
        $("search-page").show();
    })
});
