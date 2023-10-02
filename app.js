// Replace with your Grasshopper API key
const apiKey = 'ddff1e90-c186-428f-9f99-d050abc8f6a0';

// Initialize the map with different coordinates and zoom level
var map = L.map('map').setView([13.48861, -88.19208], 13);

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
        var myIcon1 = L.icon({
            iconUrl: './imgs/goal.png',
            iconSize: [50, 50],
            iconAnchor: [30, 30],
        });
        var marker = L.marker(coordinates, {icon:myIcon1});

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
// Initialize a polyline variable to store the route polyline
var routePolyline = null;
// Function to display turn-by-turn instructions in Spanish using Grasshopper
function displayInstructions(origin, destination) {
    if (origin && destination) {
        const profile = 'foot'; // Adjust the profile as needed
        const language = 'es'; // Specify 'es' for Spanish
        const grasshopperUrl = `https://graphhopper.com/api/1/route?point=${origin[0]},${origin[1]}&point=${destination[0]},${destination[1]}&vehicle=${profile}&locale=${language}&key=${apiKey}&points_encoded=false`;

        fetch(grasshopperUrl)
            .then(response => response.json())
            .then(data => {
                if (data.paths && data.paths.length > 0) {
                    const path = data.paths[0];

                    const routeCoordinates = path.points.coordinates.map(coord => [coord[1], coord[0]]);
                    var route = L.polyline(routeCoordinates, { color: 'rgb(159, 40, 28)' }); // Change color to blue
                    route.addTo(map);
                    map.setZoom(15);

                    // Inside the displayInstructions function
                    const instructionsTable = document.getElementById("instructionsTable");
                    instructionsTable.innerHTML = ''; // Clear previous instructions

                    let totalDistance = 0; // Variable to store the total distance
                    let totalDuration = 0; // Variable to store the total duration in seconds

                    if (path.instructions && path.instructions.length > 0) {
                        path.instructions.forEach((step, index) => {
                            if (step.text) {
                                const instructionRow = document.createElement('tr');
                                const distanceInMeters = step.distance;
                                const distanceText = distanceInMeters.toFixed(0) + ' Metros';

                                // Get duration in seconds and add it to the total duration
                                const durationInSeconds = step.time;
                                totalDuration += durationInSeconds;

                                // Convert duration to minutes
                                const durationInMinutes = Math.ceil(durationInSeconds/1000/60);

                                const instructionText = `${index + 1}. ${step.text}. Distancia: ${distanceText}. Tiempo: ${durationInMinutes} Minutos`;

                                instructionRow.innerHTML = `<td>${index + 1}.</td><td>${step.text}</td><td>${distanceText}</td><td>${durationInMinutes} Minutos</td>`;
                                instructionsTable.appendChild(instructionRow);

                                // Add a 'Speak' button to each instruction row
                                const speakButton = document.createElement('button');
                                speakButton.textContent = 'Repetir';
                                speakButton.className = "btn btn-dark"; // Apply Bootstrap classes
                                speakButton.addEventListener('click', () => {
                                    // Use the Web Speech API to speak the instruction with a delay
                                    setTimeout(() => {
                                        const speechSynthesis = window.speechSynthesis;
                                        const speechUtterance = new SpeechSynthesisUtterance(instructionText);
                                        speechSynthesis.speak(speechUtterance);
                                    }, index * 1000); // Delay each instruction by 1 second (adjust as needed)
                                });
                                instructionRow.appendChild(speakButton);

                                // Add distance to the total distance
                                totalDistance += distanceInMeters;
                            }
                        });
                    } else {
                        console.error('No instructions found');
                    }

                    // Calculate total distance in kilometers
                    const totalDistanceInKilometers = (totalDistance/100).toFixed(2);

                    // Calculate total duration in hours
                    const totalDurationInHours = (totalDuration/100/60).toFixed(2);

                    // Create a row for total distance and total duration in the instructions table
                    const totalRow = document.createElement('tr');
                    totalRow.innerHTML = `<td colspan="2">Total:</td><td>${totalDistanceInKilometers} Metros</td><td>${totalDurationInHours} Minutos</td>`;
                    instructionsTable.appendChild(totalRow);

                } else {
                    console.error('Invalid API RESPONSE: ', data);
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
            var myIcon = L.icon({
                iconUrl: './imgs/persona.png',
                iconSize: [80, 80],
                iconAnchor: [30, 30],
            });
            // Create a new marker for the current location
            currentLocationMarker = L.marker(currentLocation, {icon:myIcon, title:'Origen', alt:'Origen'}).addTo(map);

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
//window.addEventListener('load', repeatGetCurrentLocation);

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
