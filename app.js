// Replace with your OpenRouteService API key
const apiKey = '5b3ce3597851110001cf624843656783377449108c86b360b7cf906c';

// Initialize the map with different coordinates and zoom level
var map = L.map('map').setView([13.48861,-88.19208], 13);

// Add OpenStreetMap as the base layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 21,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Initialize currentLocation variable
var currentLocation = null;

// Create a marker for the current location
var currentLocationMarker = null;

// Create a layer group for destination markers
var destinationMarkers = L.layerGroup().addTo(map);

// Function to show a marker (pin) on the map
function showMarkerOnMap(coordinates, isCurrentLocation = false) {
    if (coordinates) {
        // Create a new marker
        var marker = L.marker(coordinates);
        
        // If it's the current location marker, add it to the map directly
        if (isCurrentLocation) {
            if (currentLocationMarker) {
                map.removeLayer(currentLocationMarker);
            }
            currentLocationMarker = marker.addTo(map);
        } else {
            // Otherwise, add it to the destination markers layer group
            marker.addTo(destinationMarkers);
        }
    }
}
// Replace with your OSRM server URL
const osrmServerUrl = 'http://localhost:5000'; // Change to your OSRM server URL

// Function to display turn-by-turn instructions using OSRM
function displayInstructions(origin, destination) {
    if (origin && destination) {
        const language = 'en'; // Specify 'es' for Spanish
        const url = `${osrmServerUrl}/route/v1/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?language=${language}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.routes && data.routes.length > 0) {
                    const routeGeometry = data.routes[0].geometry.coordinates;

                    // Create an array of coordinates for the route
                    const routeCoordinates = routeGeometry.map(coord => [coord[1], coord[0]]);

                    // Create a polyline with the route coordinates and add it to the map
                    var route = L.polyline(routeCoordinates, { color: 'blue' }); // Change color to blue
                    route.addTo(map);

                    // Display instructions in a table
                    const instructionsTable = document.getElementById("instructionsTable");
                    instructionsTable.innerHTML = ''; // Clear previous instructions
                    data.routes[0].legs[0].steps.forEach((step, index) => {
                        if (step.maneuver.instruction) {
                            const instructionRow = document.createElement('tr');
                            const distanceInMeters = step.distance;
                            const distanceText = distanceInMeters >= 1000 ? (distanceInMeters / 1000).toFixed(2) + ' km' : distanceInMeters.toFixed(0) + ' meters';
                            const instructionText = `${index + 1}. ${step.maneuver.instruction}. Distance: ${distanceText}`;

                            instructionRow.innerHTML = `<td>${index + 1}.</td><td>${step.maneuver.instruction}</td><td>${distanceText}</td>`;
                            instructionsTable.appendChild(instructionRow);

                            // Add a 'Speak' button to each instruction row
                            const speakButton = document.createElement('button');
                            speakButton.textContent = 'Speak';
                            speakButton.className = "btn btn-primary"; // Apply Bootstrap classes
                            speakButton.addEventListener('click', () => {
                                // Use the Web Speech API to speak the instruction with a delay
                                setTimeout(() => {
                                    const speechSynthesis = window.speechSynthesis;
                                    const speechUtterance = new SpeechSynthesisUtterance(instructionText);
                                    speechSynthesis.speak(speechUtterance);
                                }, index * 1000); // Delay each instruction by 1 second (adjust as needed)
                            });
                            instructionRow.appendChild(speakButton);
                        }
                    });
                } else {
                    console.error('No route found.');
                }
            })
            .catch(error => {
                console.error('Error getting directions:', error);
            });
    } else {
        alert("Please provide both origin and destination.");
    }
}



// Function to parse coordinates entered by the user
function parseCoordinates(input) {
    var parts = input.split(",");
    if (parts.length === 2) {
        var lat = parseFloat(parts[0].trim());
        var lon = parseFloat(parts[1].trim());
        if (!isNaN(lat) && !isNaN(lon)) {
            return [lat, lon];
        }
    }
    return null;
}

// Function to get current location
function getCurrentLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            currentLocation = [lat, lon];
            
            // Remove the previous pan if it exists
            if (currentLocationMarker) {
                map.removeLayer(currentLocationMarker);
            }

            // Create a new marker for the current location
            currentLocationMarker = L.marker(currentLocation).addTo(map);

            // Pan to the new current location
            map.panTo(new L.LatLng(lat, lon), 12);
        }, function (error) {
            // Handle error here, e.g., show an error message
            console.error("Error getting location:", error.message);
        });
    } else {
        alert("Geolocation is not supported in this browser.");
    }
}



// Combined function to create a red polyline, display instructions, and show marker
function createRedPolylineDisplayInstructionsAndMarker(destination) {
    if (currentLocation && destination) {


        // Display turn-by-turn instructions
        displayInstructions(currentLocation, destination);

        // Show marker for the destination
        showMarkerOnMap(destination);
    } else {
        alert("Please provide both current location and destination.");
    }
}


// Call getCurrentLocation() when the page loads
window.addEventListener('load', getCurrentLocation);


// Function to repeatedly get the current location every 5 seconds
function repeatGetCurrentLocation() {
    setInterval(getCurrentLocation, 5000); // Repeat every 5 seconds
}

// Call repeatGetCurrentLocation() when the page loads
window.addEventListener('load', repeatGetCurrentLocation);

// Event listener for the "Create Red Polyline and Display Instructions" button
document.getElementById("calculateInstructionsButton").addEventListener("click", function () {
    // Get the selected option from the dropdown
    const destinationSelect = document.getElementById("destinationSelect");
    const selectedOption = destinationSelect.options[destinationSelect.selectedIndex];
    
    if (selectedOption) {
        const destinationCoordinates = selectedOption.value.split(',').map(parseFloat);
        if (currentLocation) {
            // Clear previous destination markers and polylines
            destinationMarkers.clearLayers();
            map.eachLayer(function (layer) {
                if (layer instanceof L.Polyline) {
                    map.removeLayer(layer);
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


// Event listener for the "Speak Instructions" button
document.getElementById("speakInstructionsButton").addEventListener("click", function () {
    const instructionsTable = document.getElementById("instructionsTable");
    const speakButtons = instructionsTable.querySelectorAll("button");

    // Trigger reading out all instructions using the "Speak" buttons
    speakButtons.forEach(function (speakButton) {
        speakButton.click();
    });
});

// Event listener for the "Get Current Location" button (this remains the same)
document.getElementById("getCurrentLocationButton").addEventListener("click", getCurrentLocation);
