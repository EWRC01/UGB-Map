let map;

// Function to show map on HTML
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                map = new Map(document.getElementById("map"), {
                    center: userLocation, // Set the center to the user's location
                    zoom: 18,
                });
            },
            function (error) {
                console.error("Error getting user location:", error);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Function to perform a location search on the map using Nominatim via HTTP request
function searchTest() {
    const searchInput = document.getElementById("searchInput").value;

    // Use Nominatim for geocoding via HTTP request
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const location = data[0];

                // Pan the map to the searched location
                map.panTo({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
            } else {
                console.error("Location not found.");
                // Handle error here, e.g., display a message to the user
            }
        })
        .catch(error => {
            console.error("Error:", error);
            // Handle error here
        });
}

// Add an event listener to the Search button
document.getElementById("searchButton").addEventListener("click", searchTest);
