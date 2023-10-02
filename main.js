

window.addEventListener('load', getCurrentLocation);


document.getElementById("calculateInstructionsButton").addEventListener("click", function () {
    const destinationSelect = document.getElementById("destinationSelect");
    const selectedOption = destinationSelect.options[destinationSelect.selectedIndex];

    if (selectedOption) {
        const destinationCoordinates = selectedOption.value.split(',').map(parseFloat);
        if (currentLocation) {
            destinationMarkers.clearLayers();
            map.eachLayer(function (layer) {
                if (layer instanceof L.Polyline) {
                    layer.remove();
                }
            });

            createRedPolylineDisplayInstructionsAndMarker(destinationCoordinates);
        } else {
            alert("Please get your current location first.");
        }
    } else {
        alert("Please select a destination from the dropdown.");
    }
});

document.getElementById("speakInstructionsButton").addEventListener("click", function () {
    const instructionsTable = document.getElementById("instructionsTable");
    const speakButtons = instructionsTable.querySelectorAll("button");

    speakButtons.forEach(function (speakButton) {
        speakButton.click();
    });
});

// Combined function
function createRedPolylineDisplayInstructionsAndMarker(destination) {
    if (currentLocation && destination) {
        displayInstructions(currentLocation, destination);
        showMarkerOnMap(destination);
    } else {
        alert("Please provide both current location and destination.");
    }
}

// Event listener for the "Get Current Location" button (this remains the same)
document.getElementById("getCurrentLocationButton").addEventListener("click", getCurrentLocation);
