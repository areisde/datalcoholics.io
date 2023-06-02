document.addEventListener("DOMContentLoaded", function() {

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

                var marker = L.marker([row.latitude, row.longitude],{
                    icon: L.divIcon({
                        className: "leaflet-marker-icon",
                        html: markerContent.outerHTML,
                        iconAnchor: [0, 0],
                    }),
                    data: row // Add the data property to the marker options
                });

                if (markerContent.classList.contains('restaurant-icon')) {
                    marker.options.className = 'restaurant-marker'; // Add class to restaurant markers
                };

                markers.addLayer(marker).bindPopup(row.restaurant_name);
            };
        }
    });

    // Add the clusters to the map
    map.addLayer(markers);


});