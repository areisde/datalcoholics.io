document.addEventListener("DOMContentLoaded", function() {
    // Get elements form DOM
    let searchInput = document.getElementById("search-bar");
    let searchResults = document.getElementById("search-results");
    let cleanText = document.getElementById("erase-text");
    let searchContent = document.getElementById("search-content");
    let menu = document.getElementById("menu");
    let searchIcon = document.getElementById("search-icon");
    let backArrow = document.getElementById("back-arrow");

    // Add results when clicked
    let resultsContainer = document.getElementById("restaurants-container");

    // Get the available screen height
    var screenHeight = window.innerHeight;
    var resultContainerHeight = 100;

    // Calculate the maximum number of results that can be displayed
    var maxResults = Math.floor(screenHeight / resultContainerHeight);

    // Create dictionary for prices
    let priceDictOne = {
        0 : '💰',
        1 : '💰💰',
        2 : '💰💰💰',
        3 : '💰💰💰💰'}

    let priceDictTwo = {
        0 : '10 - 25 CHF',
        1 : '25 - 50 CHF',
        2 : '50 - 90 CHF',
        3 : '90+ CHF'}

    // Load CSV file using PapaParse library
    Papa.parse("data/restaurants.csv", {
        header: true,
        download: true,
        complete: function(results) {
            // Store CSV data as an array of objects
            var data = results.data;

            // Create new Fuse instance with options
            var fuse = new Fuse(data, {
                keys: ["restaurant_name"], // Columns to search
                includeScore: true, // Include search score in results
                includeMatches: true // Include matched characters in results
            });

            // Fetch the JSON file
            fetch('../images/restaurant_images/restaurant_id_to_img.json')
            .then(response => response.json())
            .then(jsonData => {
                 // Fetch the JSON file
                fetch('../data/cuisine_to_emoji.json')
                .then(response => response.json())
                .then(emojiData => {
            

                    // Add event listener to search input
                    searchInput.addEventListener("keyup", function() {
                        // Get search query
                        var query = searchInput.value;

                        // Perform search and get results
                        var searchResultsArray = fuse.search(query);

                        // Clear previous search results
                        searchResults.innerHTML = "";

                        // Display new search results (only top 10)
                        searchResultsArray.slice(0, maxResults).forEach(function(result) {
                            // Build search element to be added
                            var row = document.createElement("div");
                            row.classList.add("restaurant-result");

                            // Add image
                            var img = document.createElement("img");
                            img.src = jsonData[result.item.restaurant_link]
                            row.appendChild(img)

                            // Add restaurant name
                            var p = document.createElement("p");
                            p.classList.add("restaurant-name");
                            p.textContent = result.item.restaurant_name;
                            row.appendChild(p);

                            // Add Extra informations
                            var extra = document.createElement("div");
                            extra.classList.add("search-extra-info");

                            // Add cuisine information
                            const inputArray = result.item.cuisines.split(", ");

                            if (inputArray.length >= 1 && inputArray[0] != "None"){
                                var cuisines = document.createElement("div");
                                cuisines.classList.add("cuisine-types-results");

                                var utensils_icon = document.createElement("i");
                                utensils_icon.classList.add("fa-solid");
                                utensils_icon.classList.add("fa-utensils");

                                var cuisines_info = document.createElement("p");
                                const outputArray = result.item.cuisines.split(", ").map(item => emojiData[item]);
                                const outputString = outputArray.join(" ");
                                cuisines_info.textContent = outputString;
                                cuisines.appendChild(utensils_icon);
                                cuisines.appendChild(cuisines_info);
                                extra.appendChild(cuisines);
                            }

                            

                            // Add price range information
                            var priceRangeResults = document.createElement("div");
                            priceRangeResults.classList.add("price-range-results");

                            var dollar_icon = document.createElement("i");
                            dollar_icon.classList.add("fa-solid");
                            dollar_icon.classList.add("fa-dollar-sign");

                            var price_range_info = document.createElement("p");
                            price_range_info.textContent = priceDictTwo[result.item.price_range_estimation];

                            priceRangeResults.appendChild(dollar_icon);
                            priceRangeResults.appendChild(price_range_info);
                            extra.appendChild(priceRangeResults);
                            
                            row.appendChild(extra);
                            searchResults.appendChild(row);

                            // Adding clicking options
                            row.addEventListener("click", function(){
                                // Create main div
                                var clickedResult = document.createElement("div");
                                clickedResult.classList.add("selected-restaurant");
                                clickedResult.setAttribute("lazy-url", result.item.restaurant_link)

                                // Add image
                                var clickedImg = document.createElement("img");
                                let imgSource = jsonData[result.item.restaurant_link]
                                console.log(imgSource);
                                if (imgSource === 'images/placeholder_square.png'){
                                    clickedImg.src = 'images/placeholder_selected_rectangle.png';
                                } else {
                                    clickedImg.src = imgSource;
                                }
                                
                                clickedImg.classList.add("selected-result-image")
                                clickedResult.appendChild(clickedImg);

                                // Add in restaurant name info
                                var clickedRestaurantName = document.createElement("div");
                                clickedRestaurantName.classList.add("selected-restaurant-name");
                                var clickedRestaurantNameP = document.createElement("p");
                                clickedRestaurantNameP.textContent = result.item.restaurant_name;
                                clickedRestaurantName.appendChild(clickedRestaurantNameP);
                                clickedResult.appendChild(clickedRestaurantName);

                                // Add in bottom bar information
                                var bottomBar = document.createElement("div");
                                bottomBar.classList.add("selected-bottom-bar");

                                // Add extra info
                                var clickedExtraInfo = document.createElement("div");
                                clickedExtraInfo.classList.add("selected-extra-info");

                                // Add city info
                                var clickedCity = document.createElement("div");
                                clickedCity.classList.add("selected-city");
                                var cityI = document.createElement("i");
                                cityI.classList.add("fa-solid");
                                cityI.classList.add("fa-location-dot");
                                clickedCity.appendChild(cityI);
                                var cityP = document.createElement("p");
                                cityP.textContent = result.item.adress;
                                clickedCity.appendChild(cityP);
                                clickedExtraInfo.appendChild(clickedCity);

                                // Add price range info
                                var clickedPriceRange = document.createElement("div");
                                clickedPriceRange.classList.add("selected-price-range");
                                var PRI = document.createElement("img");
                                PRI.src = "images/swiss-franc-red.png"
                                //PRI.classList.add("fa-solid");
                                //PRI.classList.add("fa-dollar-sign");
                                var PRP = document.createElement("p");
                                PRP.textContent = priceDictOne[result.item.price_range_estimation];
                                clickedPriceRange.appendChild(PRI);
                                clickedPriceRange.appendChild(PRP);
                                clickedExtraInfo.appendChild(clickedPriceRange);

                                // Add cuisine info
                                if (inputArray.length >= 1 && inputArray[0] != "None"){
                                    const outputArray = result.item.cuisines.split(", ").map(item => emojiData[item]);
                                    const outputString = outputArray.join(" ");
                                    var clickedCuisine = document.createElement("div");
                                    clickedCuisine.classList.add("selected-cuisines");
                                    var CI = document.createElement("i");
                                    CI.classList.add("fa-solid");
                                    CI.classList.add("fa-utensils");
                                    var CP = document.createElement("p");
                                    CP.textContent = outputString;
                                    clickedCuisine.appendChild(CI);
                                    clickedCuisine.appendChild(CP);
                                    clickedExtraInfo.appendChild(clickedCuisine);
                                }


                                // Add rating info
                                var clickedRating = document.createElement("div");
                                clickedRating.classList.add("selected-rate");
                                var ratingP = document.createElement("p");
                                ratingP.textContent = "Rate it : ";
                                var starsRating = document.createElement("div");
                                starsRating.classList.add("selected-ratings");

                                for (let i = 0; i < 5; i++){
                                    var starI = document.createElement("i");
                                    starI.classList.add("fa-solid");
                                    starI.classList.add("fa-star");
                                    starI.classList.add("fa-xl");
                                    starsRating.appendChild(starI);
                                }
            
                                clickedRating.appendChild(ratingP);
                                clickedRating.appendChild(starsRating);


                                // Put everything together
                                bottomBar.appendChild(clickedExtraInfo);
                                bottomBar.appendChild(clickedRating);
                                clickedResult.appendChild(bottomBar);
                                resultsContainer.appendChild(clickedResult);

                                // Close search area
                                searchContent.style.display = "none";
                                cleanText.style.display = "none";
                                menu.style.display = "block"
                                searchIcon.style.display = "block";
                                backArrow.style.display = "none";
                                searchInput.value = "";

                            });
                        });
                    });
                });
            })
            .catch(error => console.error(error));

            cleanText.addEventListener("click", function(){
                // Get search query
                var query = "";

                // Perform search and get results
                var searchResultsArray = fuse.search(query);

                // Clear previous search results
                searchResults.innerHTML = "";
            });
        }
    });

});