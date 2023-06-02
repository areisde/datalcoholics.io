document.addEventListener("DOMContentLoaded", function() {
    
    window.onload = function() {
        updateRestaurantStats();
    };
    var heatLayer;
    var map = L.map('map').setView([46.5196535, 6.6322734], 17);

    // Cluster bespoke display based on size
    var markers = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
            var childCount = cluster.getChildCount();
            var c = 'custom-cluster-';

            if (childCount < 10) {
                c += 'small';
            } else if (childCount < 100) {
                c += 'medium';
            } else {
                c += 'large';
            }

            return L.divIcon({
                html: '<div><span>' + childCount + '</span></div>',
                className: 'custom-cluster ' + c,
                iconSize: new L.Point(40, 40)
            });
        }
    });

    // Display the map :
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Load CSV file using PapaParse library
    Papa.parse("data/restaurants.csv", {
        header: true,
        download: true,
        complete: function(results) {
            // Store CSV data as an array of objects
            var data = results.data;
            var heatData = [];

            for (var i in data) {
                var row = data[i];

                var markerContent = document.createElement("div");
                markerContent.className = 'restaurant-icon';

                var markerFoodType = document.createElement("div");
                markerFoodType.className = 'marker-FoodType';
                markerFoodType.innerHTML = row.cuisines;

                var markerRating = document.createElement("div");
                markerRating.className = 'marker-Rating';
                markerRating.innerHTML = row.overall_rating;
                
                markerContent.appendChild(markerRating);
                //markerContent.appendChild(markerFoodType);
                
                // Validate latitude and longitude values
                var latitude = parseFloat(row.latitude);
                var longitude = parseFloat(row.longitude);

                if (isNaN(latitude) || isNaN(longitude)) {
                    //console.warn("Invalid coordinates for row");
                    continue; // Skip this row and proceed to the next iteration
                } else {
                    if ((latitude == 0) || (longitude == 0)){
                        continue;
                    } else {
                        var marker = L.marker([row.latitude, row.longitude],{
                            icon: L.divIcon({
                                className: "leaflet-marker-icon",
                                html: markerContent.outerHTML,
                                iconAnchor: [0, 0],
                            }),
                            data: row, // Add the data property to the marker options
                            id : i
                        });
        
                        if (markerContent.classList.contains('restaurant-icon')) {
                            marker.options.className = 'restaurant-marker'; // Add class to restaurant markers
                        };
        
                        markers.addLayer(marker);
                    }
                }
            };
            // Empty heat map at first
            heatLayer = L.heatLayer(heatData)
            map.addLayer(heatLayer)
            // Add the clusters to the map
            map.addLayer(markers);
            // Update display
            updateRestaurantStats(); 
        }
    });

    // Recenter on most popular restaurant
    var mostPop = document.getElementById("most_popular");
    mostPop.addEventListener("click", function(){
        var mostPopName = mostPop.textContent;
        var mostPopMarker = markers.getLayers().find(function(marker) {
            return marker.options.data.restaurant_name === mostPopName;
        });
        map.setView(mostPopMarker.getLatLng(), 30);
    });

    // close restaurant card when clicking on the cross
    var close = document.getElementById("closing_button");
    close.addEventListener("click", function(){
        main_disp = document.querySelector('#restaurant-cards-container');
        main_disp.style.display = "none";
    });

    // close filter panel when clicking on more stats
    var moreStats = document.getElementById("general_stats");
    moreStats.addEventListener("click", function(){
        main_disp = document.querySelector('#header');
        main_disp.style.display = "none";
    });

    //Update heat map when filter has changed
    var e = document.getElementById("filterSelector");
    e.addEventListener("change", function(){
        var filter = e.value;
        var heatData = [];
        Papa.parse("data/restaurants.csv", {
            header: true,
            download: true,
            complete: function(results) {
                // Store CSV data as an array of objects
                var data = results.data;
                var values = [];
                for (var i in data) {
                    var row = data[i];
                    // Validate latitude and longitude values
                    var latitude = parseFloat(row.latitude);
                    var longitude = parseFloat(row.longitude);
                    if (isNaN(latitude) || isNaN(longitude)) {
                        continue; // Skip this row and proceed to the next iteration
                    } else {
                        if (filter !== "no_filter"){
                            values.push(parseFloat(row[filter]));
                            heatData.push([latitude, longitude, parseFloat(row[filter])])
                        }
                    }
                };
                // update heat map
                updateHeatMap(heatData,values);
            }
        });
    });


    /*// Heat map layer
    var heatData = []

    Papa.parse("data/restaurants.csv", {
        header: true,
        download: true,
        complete: function(results) {
            heatData = results.data.map(function(row) {
                return [parseFloat(row.latitude), parseFloat(row.longitude), parseFloat(row.price_range_estimation)];
            });

            L.heatLayer(heatData).addTo(map);
        }
    });*/

    

    // Event listener function : marker selection
    markers.on('click', function(e) {
        if (e.layer.options.className === 'restaurant-marker') { // Check if the clicked marker is a restaurant marker
        // Retrieve the data for the clicked restaurant
        var restaurantData = e.layer.options.data;

        var restIndex = parseInt(e.layer.options.id) + 2;


        //Update the content of the card in the "restaurant-cards-container"
        updateRestaurantCard(restaurantData, restIndex);
        }

        main_disp = document.querySelector('#restaurant-cards-container');
        main_disp.style.display = "flex";
        
    });


    // Get the bounds of the displayed map to display only the cards
    var bounds = map.getBounds();

    // Check if the element overflows the container
    function isOverflown(element,containerSize){
        return element.scrollHeight > containerSize.clientHeight;
    }

    // Adapt the Font size if the element overflowns the container
    function adaptFontSize(element,elementFontSize,containerSize){
        if (elementFontSize == 28){
            elementFontSize = 28;
            element.style.fontSize = elementFontSize + 'px';
        }
        else if(elementFontSize == 12){
            elementFontSize = 12;
            element.style.fontSize = elementFontSize + 'px';
        };
        while ((isOverflown(element,containerSize)== true)){

            elementFontSize--;
            element.style.fontSize = elementFontSize + 'px';
        };
        return element.style.setProperty('--name-font-size', elementFontSize + 'px');
    }

    // Change Background of Michelin Badge if Michelin Star :
    /*function checkForStar(star,bg,container){
        if(star == 1){
            bg = "white";
        }
        else if(star == 0){
            bg = "grey";
        }
        return container.style.setProperty('--bg-michelin', bg);
    }*/

    //function that add dollars icon depending on price range :
    function dolladolla(sign,price_range_estimation){
        sign = '';

        if (price_range_estimation == 0) {
            sign = '<i class="fa-solid fa-dollar-sign" style="color: #ffffff;"></i>';
        } else if (price_range_estimation == 1) {
            sign = '<i class="fa-solid fa-dollar-sign" style="color: #ffffff;"></i><i class="fa-solid fa-dollar-sign" style="color: #ffffff;"></i>';
        } else if (price_range_estimation == 2) {
            sign = '<i class="fa-solid fa-dollar-sign" style="color: #ffffff;"></i><i class="fa-solid fa-dollar-sign" style="color: #ffffff;"></i><i class="fa-solid fa-dollar-sign" style="color: #ffffff;"></i>';
        }
        else if(price_range_estimation == 3){
            sign = '<i class="fa-solid fa-dollar-sign" style="color: #ffffff;"></i><i class="fa-solid fa-dollar-sign" style="color: #ffffff;"></i><i class="fa-solid fa-dollar-sign" style="color: #ffffff;"></i><i class="fa-solid fa-dollar-sign" style="color: #ffffff;"></i>'
        }

        return sign;
    }

    function updateRestaurantCard(restaurantData,restIndex){

        //Get index of the restaurant in the csv file

        // Get a reference to the card element in the "restaurant-cards-container"
        var vignette = document.querySelector('.vignette-content');

        // Update the price range
        var dollarSigns = dolladolla(dollarSigns,restaurantData.price_range_estimation);

        //Restaurant name&Adress size adaptation
        var restNameContainer = document.querySelector('.vignette-restaurant-name-container');
        var restNameText = document.querySelector('.vignette-restaurant-name');
        var adressContainer = document.querySelector('.vignette-restaurant-adress-container');
        var adressText = document.querySelector('.vignette-restaurant-adress');
        var foodContainer = document.querySelector('.vignette-food-container')
        var foodText = document.querySelector('.vignette-food-type');
        let nameFontSize = 28;
        let adressFontSize = 12;
        let foodFontSize = 28;


        // Check if Michelin star or not :
        //var MichelinBadge = document.querySelector('.vignette-michelin');
        //var MichelinBG = "";
        //var MichelinStar = restaurantData.michelin;
        //checkForStar(MichelinStar,MichelinBG,MichelinBadge);


        // Update the content of the card with the data for the selected restaurant
        vignette.querySelector('.vignette-restaurant-name').innerHTML = restaurantData.restaurant_name;
        vignette.querySelector('.vignette-restaurant-adress').innerHTML = restaurantData.adress;
        vignette.querySelector('.vignette-rating').innerHTML = restaurantData.overall_rating;
        vignette.querySelector('.vignette-price').innerHTML = dollarSigns;
        vignette.querySelector('.vignette-food-type').innerHTML = restaurantData.cuisines;

        // vignette.querySelector('.vignette-special-regimes-popup').innerHTML = restaurantData.special_regimes;

        adaptFontSize(restNameText,nameFontSize,restNameContainer);
        adaptFontSize(adressText,adressFontSize,adressContainer);
        //adaptFontSize(foodText, foodFontSize, foodContainer);

        // Add image :
        //main_image_0

        //var restaurantImageCont = document.querySelector('vignette-restaurant-image');
        //var restaurantImage = document.querySelector('.restaurant-image');
        //var imagePath = 'data/restaurant_images/' + restIndex + '/main_image_0.jpg';
        //restaurantImage.setAttribute('src', imagePath);
    }

    function updateRestaurantStats(){
        // Get the current bounds of the visible map area
        var bounds = map.getBounds();

        // Initialize an array to hold the visible markers
        //var visibleMarkers = [];
        var ratings = [];
        var cuisines = [];
        var reviews = {};
        var price = []

        // Iterate over the cluster group layers
        markers.eachLayer(function (layer) {
            // Check if the layer is a cluster
            if (layer.getChildCount) {
                // Iterate over the child markers within the cluster
                layer.getAllChildMarkers().forEach(function (marker) {
                    // Check if the marker is within the visible bounds
                    if (bounds.contains(marker.getLatLng())) {
                        //visibleMarkers.push(marker.layer.options.data.restaurant_link);
                        ratings.push(marker.layer.options.data.overall_rating);
                        cuisines.push(marker.layer.options.data.cuisines);
                        reviews[marker.layer.options.data.restaurant_name] = marker.layer.options.data.number_of_reviews;
                        price.push([marker.layer.options.data.latitude, marker.layer.options.data.longitude, marker.layer.options.data.price_range_estimation]);

                    }
                });
            } else {
                // Individual marker case
                if (bounds.contains(layer.getLatLng())) {
                    //visibleMarkers.push(layer.options.data.restaurant_link);
                    ratings.push(layer.options.data.overall_rating);
                    cuisines.push(layer.options.data.cuisines);
                    reviews[layer.options.data.restaurant_name] = layer.options.data.number_of_reviews;
                    price.push([layer.options.data.latitude, layer.options.data.longitude, layer.options.data.price_range_estimation]);
                }
            }
        });

        updateRatingDistribution(ratings);
        updateCuisineRanking(cuisines);
        updateTopInfo(reviews);
        //updateHeatMap(price);
    }

    function updateRatingDistribution(ratings){
        // Counter object to store the rating counts
        var ratingCounts = {};

        // Initialize the counter for each rating value
        for (var i = 1; i <= 5; i++) {
            ratingCounts[i] = 0;
        }
        
        // Count the ratings
        ratings.forEach(function(ratingStr) {
            var rating = parseFloat(ratingStr);
            if (!isNaN(rating) && rating >= 1 && rating <= 5) {
                ratingCounts[Math.round(rating)]++;
            }
        });
        
        // Print the rating distribution
        /*for (var rating in ratingCounts) {
            console.log("Rating " + rating + ": " + ratingCounts[rating]);
        }*/

        // Plot rating
        // Chart.js configuration
        var chartOptions = {
            scales: {
            x: {
                grid: {
                display: false // Hide x-axis grid lines
                },
                ticks: {
                color: 'white' // Set x-axis tick color to white
                }
            },
            y: {
                grid: {
                display: false // Hide y-axis grid lines
                },
                ticks: {
                color: 'white' // Set y-axis tick color to white
                }
            }
            },
            plugins: {
                legend: {
                display: false // Hide legend
                }
            }
        };
    
    
        var ctx = document.getElementById("chart").getContext("2d");

        // Destroy existing chart if it exists
        if (window.myChart) {
            window.myChart.destroy();
        }

        // Create new chart
        window.myChart = new Chart(ctx, {
            type: "bar",
            data: {
            labels: ["1", "2", "3", "4", "5"],
            datasets: [
                {
                backgroundColor: "white",
                data: ratingCounts
                }
            ]
            },
            options: chartOptions
        });
    }

    function updateCuisineRanking(cuisineStrings){
        // Counter object to store the cuisine counts
        var cuisineCounts = {};

        // Count the cuisines
        cuisineStrings.forEach(function(cuisineString) {
        var cuisines = cuisineString.split(", ");
            cuisines.forEach(function(cuisine) {
                if (cuisine !== "None") {
                    if (cuisineCounts[cuisine]) {
                    cuisineCounts[cuisine]++;
                    } else {
                    cuisineCounts[cuisine] = 1;
                    }
                }
            });
        });

        // Create an array of cuisine objects
        var cuisineRanking = Object.keys(cuisineCounts).map(function(cuisine) {
            return { cuisine: cuisine, count: cuisineCounts[cuisine] };
        });

        // Sort the cuisine ranking based on count in descending order
        cuisineRanking.sort(function(a, b) {
            return b.count - a.count;
        });

        // Display only the top 5 cuisines
        var top5Cuisines = cuisineRanking.slice(0, 5);

        // Update the existing list with the top 5 cuisines
        var listElement = document.getElementById("cuisine_ranking");
        var listItems = listElement.getElementsByTagName("li");

        // Update the list items with the top 5 cuisines
        for (var i = 0; i < top5Cuisines.length; i++) {
            var listItem = listItems[i];
            listItem.setAttribute("id", "cuisine_" + (i + 1));
            listItem.textContent = top5Cuisines[i].cuisine + " (" + top5Cuisines[i].count + ")";
        }
    }

    function updateTopInfo(restaurantReviews){

        // Find the restaurant with the most reviews
        var maxReviews = 0;
        var maxReviewsRestaurant = "";

        Object.keys(restaurantReviews).forEach(function(restaurantName) {
            var numberOfReviews = parseInt(restaurantReviews[restaurantName], 10);

            if (numberOfReviews > maxReviews) {
                maxReviews = numberOfReviews;
                maxReviewsRestaurant = restaurantName;
            }
        });


        var mostPop = document.getElementById("most_popular");
        var mostPopNumber = document.getElementById("most_popular_reviews");
        mostPop.textContent = maxReviewsRestaurant;
        mostPopNumber.textContent = maxReviews;
    }

    function updateHeatMap(data,values){
        //meanValue = mean(values);
        //stdValue = std(values);
        maxVal = Math.max(...values)/10;
        //set the max of heat map to the max of the values
        heatLayer.options.max = maxVal;
        //set the min of heat map to the min of the values
        // normalize values of data
        for (var i = 0; i < data.length; i++){
            data[i][2] = data[i][2]/10;
        }
        var newHeatLayer = L.heatLayer(data);
        newHeatLayer.options.max = maxVal;
        map.removeLayer(heatLayer);
        heatLayer = newHeatLayer;
        map.addLayer(heatLayer);
    }

    // // compute mean of an array
    // function mean(array){
    //     var sum = 0;
    //     for (var i = 0; i < array.length; i++){
    //         sum += array[i];
    //     }
    //     return sum/array.length;
    // }
    // // Compute standard deviation of an array
    // function std(array){
    //     var meanVal = mean(array);
    //     var sum = 0;
    //     for (var i = 0; i < array.length; i++){
    //         sum += Math.pow(array[i]-meanVal,2);
    //     }
    //     return Math.sqrt(sum/array.length);
    // }


    map.on('moveend', updateRestaurantStats);

    
});