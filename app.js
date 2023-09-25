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

// Function to display turn-by-turn instructions in Spanish using OpenRouteService
function displayInstructions(origin, destination) {
    if (origin && destination) {
        const profile1 = 'driving-car'; // Use the walking profile
        const profile2 = 'foot-walking';
        const language = 'en'; // Specify 'es' for Spanish
        const url = `https://api.openrouteservice.org/v2/directions/${profile2}?api_key=${apiKey}&start=${origin[1]},${origin[0]}&end=${destination[1]},${destination[0]}&language=${language}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.features && data.features.length > 0) {
                    const instructions = data.features[0].properties.segments[0].steps;

                    // Display instructions in a table
                    const instructionsTable = document.getElementById("instructionsTable");
                    instructionsTable.innerHTML = ''; // Clear previous instructions
                    instructions.forEach((step, index) => {
                        if (step.instruction) {
                            const instructionRow = document.createElement('tr');
                            const distanceInMeters = step.distance;
                            const distanceText = distanceInMeters >= 1000 ? (distanceInMeters / 1000).toFixed(2) + ' km' : distanceInMeters.toFixed(0) + ' meters';
                            const instructionText = `${index + 1}. ${step.instruction}. Distancia: ${distanceText}`;

                            instructionRow.innerHTML = `<td>${index + 1}.</td><td>${step.instruction}</td><td>${distanceText}</td>`;
                            instructionsTable.appendChild(instructionRow);

                            // Add a 'Speak' button to each instruction row
                            const speakButton = document.createElement('button');
                            speakButton.textContent = 'Leer';
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

                    // Create an array of coordinates for the route
                    const routeCoordinates = instructions.map(step => {
                        if (step.maneuver && step.maneuver.location) {
                            return [step.maneuver.location[1], step.maneuver.location[0]];
                        } else {
                            return null;
                        }
                    });

                    // Filter out any coordinates that are null
                    const filteredRouteCoordinates = routeCoordinates.filter(coord => coord !== null);
                    console.log(routeCoordinates);

                    // Create a polyline with the route coordinates and add it to the map
                    var route = L.polyline(filteredRouteCoordinates, { color: 'red' });
                    route.addTo(map);

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
            map.panTo(new L.LatLng(lat, lon), 12);
            showMarkerOnMap(currentLocation, true); // Show marker for the current location
        }, function (error) {
            // Handle error here, e.g., show an error message
            console.error("Error getting location:", error.message);
        });
    } else {
        alert("Geolocation is not supported in this browser.");
    }
}

// Function to create a red polyline between current location and a destination
function createRedPolyline(currentLocation, destination) {
    if (currentLocation && destination) {
        // Create an array of coordinates for the polyline
        const polylineCoordinates = [currentLocation, destination];

        // Create a polyline with the coordinates and add it to the map
        const polyline = L.polyline(polylineCoordinates, { color: 'red' }).addTo(map);
        
        // Fit the map view to the bounds of the polyline
        map.fitBounds(polyline.getBounds());
    } else {
        alert("Please provide both current location and destination.");
    }
}

// Combined function to create a red polyline, display instructions, and show marker
function createRedPolylineDisplayInstructionsAndMarker(destination) {
    if (currentLocation && destination) {
        // Create an array of coordinates for the polyline
        const polylineCoordinates = [currentLocation, destination];

        // Create a polyline with the coordinates and add it to the map
        const polyline = L.polyline(polylineCoordinates, { color: 'red' }).addTo(map);
        
        // Fit the map view to the bounds of the polyline
        map.fitBounds(polyline.getBounds());

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

// Event listener for the "Create Red Polyline and Display Instructions" button
document.getElementById("calculateInstructionsButton").addEventListener("click", function () {
    // Get the selected option from the dropdown
    const destinationSelect = document.getElementById("destinationSelect");
    const selectedOption = destinationSelect.options[destinationSelect.selectedIndex];
    
    if (selectedOption) {
        const destinationCoordinates = selectedOption.value.split(',').map(parseFloat);
        if (currentLocation) {
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
