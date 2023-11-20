var map;
var currentLocationMarker;
var currentLocation = [0, 0];
var isFirstLocation = true;
var watchId; // To store the ID returned by watchPosition

function trackCurrentLocation() {
    if ("geolocation" in navigator) {
        var options = {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        };

        watchId = navigator.geolocation.watchPosition(function (position) {
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

function centerMapOnMarker() {
    if (currentLocationMarker) {
        var latLng = currentLocationMarker.getLatLng();
        map.setView(latLng, 12);
    }
}

window.addEventListener('load', function () {
    // Start tracking the current location on page load
    trackCurrentLocation();

    // Event listener for the "Get Current Location" button
    document.getElementById("getCurrentLocationButton").addEventListener("click", function () {
        centerMapOnMarker();
    });
});
