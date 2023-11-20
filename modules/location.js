var map;
var currentLocationMarker;
var currentLocation = [0, 0];

function getCurrentLocation() {
    if ("geolocation" in navigator) {
        // Set options for watchPosition (you can adjust these according to your needs)
        var options = {
            enableHighAccuracy: true, // Enable high accuracy mode if available
            maximumAge: 0, // Get the current location regardless of the cached position age
            timeout: 5000 // Set a timeout for 5 seconds
        };

        // Start watching the position changes
        var watchId = navigator.geolocation.watchPosition(function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            currentLocation = [lat, lon];

            if (currentLocationMarker) {
                map.removeLayer(currentLocationMarker);
            }

            var myIcon = L.AwesomeMarkers.icon({
                prefix: 'fa',
                icon : 'person-walking',
                markerColor: 'red',
            });

            currentLocationMarker = L.marker(currentLocation, {icon: myIcon,}).addTo(map);

            map.panTo(new L.LatLng(lat, lon), 12);
        }, function (error) {
            // Handle geolocation errors
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error getting location: ' + error.message,
            });
        }, options);
    } else {
        // Handle browsers that don't support geolocation
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Geolocation is not supported in this browser.',
        });
    }
}
