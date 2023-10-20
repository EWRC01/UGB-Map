var map;
var currentLocationMarker;
var currentLocation = [0, 0];

function getCurrentLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            currentLocation = [lat, lon];

            if (currentLocationMarker) {
                map.removeLayer(currentLocationMarker);
            }

            // Define a custom HTML structure for the icon (only the Font Awesome icon)
            var myIcon = L.AwesomeMarkers.icon({
                prefix: 'fa',
                icon : 'person-walking',
                markerColor: 'red',
            });

            // Create a marker with the custom icon and add it to the map
            currentLocationMarker = L.marker(currentLocation, {icon: myIcon,}).addTo(map);

            map.panTo(new L.LatLng(lat, lon), 12);

        }, function (error) {
            // Handle geolocation errors
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error getting location: ' + error.message,
            });
        });
    } else {
        // Handle browsers that don't support geolocation
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Geolocation is not supported in this browser.',
        });
    }
}
