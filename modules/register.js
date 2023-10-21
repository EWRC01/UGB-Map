// Update your getCurrentLocation1 function
function getCurrentLocation1() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            currentLocation = [lat, lon];

            // Display the current location in the console
            console.log("Current Location: Lat " + lat + ", Lon " + lon);

            // Fill the locationCoordinates input field with the current coordinates
            document.getElementById("locationCoordinates").value = lat + ',' + lon;
        }, function (error) {
            // Handle geolocation errors with SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error a la hora de obtener tu ubicacion: ' + error.message,
            });
        });
    } else {
        // Handle browsers that don't support geolocation with SweetAlert
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener tu ubicacion',
        });
    }
}


// Function to calculate the Haversine distance between two sets of coordinates
function calculateHaversineDistance(coords1, coords2) {
    const [lat1, lon1] = coords1;
    const [lat2, lon2] = coords2;
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance * 1000; // Convert to meters
}

// Modify your updateJsonData function
async function updateJsonData(event) {
    event.preventDefault();

    const locationName = document.getElementById("locationName").value.trim();
    const locationCoordinates = document.getElementById("locationCoordinates").value.trim();

    // Check if either the name or coordinates are empty
    if (!locationName || !locationCoordinates) {
        // Show an error alert with SweetAlert
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, asegúrate de llenar ambos campos: Nombre del edificio y Coordenadas.',
        });
        return; // Exit the function if any field is empty
    }

    // Check if the data already exists in the combined data
    const combinedData = await loadCombinedBuildingData();
    const isDuplicateName = combinedData.some(location => location.name === locationName);
    const isDuplicateCoordinates = combinedData.some(location => location.coordinates === locationCoordinates);

    if (isDuplicateName || isDuplicateCoordinates) {
        // Show a SweetAlert alert for duplicate data
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El nombre del edificio o las coordenadas ya existen, revisa las opciones',
        });
        return; // Exit the function if it's a duplicate
    }

    // Check if the coordinates are too close to existing coordinates
    const minimumDistance = 100; // Minimum distance in meters
    const isTooClose = combinedData.some(location => {
        const existingCoords = location.coordinates.split(',').map(parseFloat);
        const newCoords = locationCoordinates.split(',').map(parseFloat);
        const distance = calculateHaversineDistance(existingCoords, newCoords);
        return distance < minimumDistance;
    });

    if (isTooClose) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las coordenadas están demasiado cerca de una ubicación existente.',
        });
        return; // Exit the function if it's too close
    }

    const buildingJSON = {
        name: locationName,
        coordinates: locationCoordinates,
    };

    // Save the updated options to Local Storage
    const optionsInStorage = await loadBuildingDataFromLocalStorage();
    optionsInStorage.push(buildingJSON);
    localStorage.setItem('buildingOptions', JSON.stringify(optionsInStorage));

    // Show a success alert with SweetAlert
    Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: '¡Edificio registrado con éxito!',
    });
}


// Attach the click event handler to the Register button
document.getElementById("registerLocation").addEventListener("click", updateJsonData);
// Event listener for the "Get Current Location" button
document.getElementById("getCurrentLocationButton1").addEventListener("click", getCurrentLocation1);

