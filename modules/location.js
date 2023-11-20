var map;
var currentLocationMarker;
var currentLocation = [0, 0];
var isFirstLocation = true;

function getCurrentLocation() {
    if ("geolocation" in navigator) {
        var options = {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        };

        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            currentLocation = [lat, lon];

            if (currentLocationMarker) {
                map.removeLayer(currentLocationMarker);
            }

            var myIcon = L.AwesomeMarkers.icon({
                prefix: 'fa',
                icon: 'person-walking',
                markerColor: 'red',
            });

            currentLocationMarker = L.marker(currentLocation, { icon: myIcon }).addTo(map);

            if (isFirstLocation) {
                map.setView(new L.LatLng(lat, lon), 12);
                isFirstLocation = false;
            }
        }, function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error getting location: ' + error.message,
            });
        }, options);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Geolocation is not supported in this browser.',
        });
    }
}

window.addEventListener('load', function () {
    // Initialize your map here

    // Assuming you have initialized your map (map = L.map(...)) here

    // Get current location on page load
    getCurrentLocation();

    // Event listener for the "Get Current Location" button
    document.getElementById("getCurrentLocationButton").addEventListener("click", function () {
        // Get current location on button click
        getCurrentLocation();

        // Center the map on the current location marker
        var latLng = currentLocationMarker.getLatLng();
        map.setView(latLng, 12);
    });
});
