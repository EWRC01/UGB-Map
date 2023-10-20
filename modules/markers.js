var currentLocation = null;
var currentLocationMarker = null;
var destinationMarkers = L.layerGroup().addTo(map);

function showMarkerOnMap(coordinates, isCurrentLocation = false) {
    if (coordinates) {
            // Define a custom HTML structure for the icon (only the Font Awesome icon)
            var myIcon = L.AwesomeMarkers.icon({
                prefix: 'fa',
                icon : 'location-dot',
                markerColor: 'red',
            });
        var marker = L.marker(coordinates, {icon: myIcon});
        marker.bindPopup('This is Tutorialspoint').openPopup();

        if (isCurrentLocation) {
            if (currentLocationMarker) {
                map.removeLayer(currentLocationMarker);
            }
            
            currentLocationMarker = marker.addTo(map);
        } else {
            marker.addTo(destinationMarkers);
            
        }
    }
}
