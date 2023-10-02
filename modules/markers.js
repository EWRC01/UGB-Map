var currentLocation = null;
var currentLocationMarker = null;
var destinationMarkers = L.layerGroup().addTo(map);

function showMarkerOnMap(coordinates, isCurrentLocation = false) {
    if (coordinates) {
        var myIcon1 = L.icon({
            iconUrl: './imgs/goal.png',
            iconSize: [50, 50],
            iconAnchor: [30, 30],
        });
        var marker = L.marker(coordinates, { icon: myIcon1 });

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
