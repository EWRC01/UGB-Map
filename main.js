

// Initialize a counter to keep track of the number of times 'Calculate Instructions' is clicked
let calculateInstructionsClickCount = 0;

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
async function handleDestinationSelection() {
    const destinationSelect = document.getElementById("destinationSelect");
    const selectedOption = destinationSelect.options[destinationSelect.selectedIndex];

    if (selectedOption.value === "default") {
        console.log("No building selected");
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Primero Selecciona un edificio',
        });
        return; // Exit the function, no need to proceed
    }

    toggleSidebar();
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
            text: 'Por favor habilita la geolocalizacion!',
        });
    }
}







// Function to enable/disable buttons based on combobox selection
function handleComboBoxChange() {
    const selectElement = document.getElementById('destinationSelect');
    const calculateButton = document.getElementById('reloadLocationButton');
    const speakButton = document.getElementById('speakInstructionsButton');

    if (selectElement.value == 'default') {
        calculateButton.disabled = true;
        speakButton.disabled = true;
        calculateInstructionsClickCount = 0; // Reset the click count when default option is selected
    } else {
        calculateButton.disabled = false;
        speakButton.disabled = false;
        clickButton();
        
       
    }
}

// Add an event listener to the combobox to handle changes
document.getElementById('destinationSelect').addEventListener('change', handleComboBoxChange);

reloadInstructionsButton = document.getElementById("reloadLocationButton");
getCurrentLocationButton = document.getElementById("getCurrentLocationButton");
// Event listener for the "Calculate Instructions" button
document.getElementById("calculateInstructionsButton").addEventListener("click", function () {
    calculateInstructionsClickCount++;
    handleDestinationSelection();
});


function reloadInstructions(e) {
    e.preventDefault();

    Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Esta a punto de reiniciar las instrucciones',
        showCancelButton: true, // Display a cancel button
        confirmButtonText: 'OK', // Text for the OK button
        cancelButtonText: 'Cancel', // Text for the Cancel button
    }).then((result) => {
        if (result.isConfirmed) {
            // If the user clicks "OK," perform these actions
            getCurrentLocationButton.click();
            calculateInstructionsButton.click();
        } else if (result.isDismissed) {
            // If the user clicks "Cancel" or closes the SweetAlert without choosing an option, you can handle that here.
            // You can choose to do nothing or any other action as needed.
        }
    });
}



reloadInstructionsButton.addEventListener("click", reloadInstructions, false);

document.getElementById("speakInstructionsButton").addEventListener("click", function () {
    const greetingsSpeech = "Bienvenido a UGB Maps, sere tu guia virtual, a continuación te diré las instrucciones:"
    const speechSynthesis2 = window.speechSynthesis;
    const speechUtterance2 = new SpeechSynthesisUtterance(greetingsSpeech);
    speechUtterance2.lang='es-US';
    speechSynthesis2.speak(speechUtterance2)

    const instructionsTable = document.getElementById("instructionsTable");
    const speakButtons = instructionsTable.querySelectorAll("button");

    speakButtons.forEach(function (speakButton) {
        speakButton.click();
    });
});



// ...
