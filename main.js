

window.addEventListener('load', getCurrentLocation);

// Event listener for the "Get Current Location" button (this remains the same)
document.getElementById("getCurrentLocationButton").addEventListener("click", getCurrentLocation);

// Get the theme toggle button and body element
const themeToggle = document.getElementById('checkbox');
const bodyElement = document.body;

// Function to update the polyline color based on the theme
function updatePolylineColor() {
    if (currentLocation && destinationCoordinates) {
        displayInstructions(currentLocation, destinationCoordinates, bodyElement.classList.contains('dark-theme'));
    }
}

// Add a click event listener to the theme toggle button
themeToggle.addEventListener('change', () => {
    // Toggle the 'dark-theme' class on the body element
    bodyElement.classList.toggle('dark-theme');

    // You can also store the user's theme preference in localStorage
    // to remember their choice between page reloads
    if (bodyElement.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }

    // Update the polyline color based on the theme
    updatePolylineColor();
});

// Check for the user's saved theme preference (if any) and apply it
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    bodyElement.classList.add('dark-theme');
}

// ...
// Event listener for the "Calculate Instructions" button
document.getElementById("calculateInstructionsButton").addEventListener("click", function () {
    const destinationSelect = document.getElementById("destinationSelect");
    const selectedOption = destinationSelect.options[destinationSelect.selectedIndex];
    
    if (selectedOption.value === "default") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Primero Selecciona un edificio',
        });
        return; // Exit the function, no need to proceed
    }

    if (selectedOption) {
        destinationCoordinates = selectedOption.value.split(',').map(parseFloat);
        if (currentLocation) {
            destinationMarkers.clearLayers();
            map.eachLayer(function (layer) {
                if (layer instanceof L.Polyline) {
                    layer.remove();
                }
            });

            // Display instructions when both currentLocation and destinationCoordinates are defined
            updatePolylineColor();
            showMarkerOnMap(destinationCoordinates);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please get your current location first.',
            });
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select a destination from the dropdown.',
        });
    }
});
// ...
