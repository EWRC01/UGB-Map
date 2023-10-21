const buildingsData = [
    {
        name: "Laboratorio Dennis Ritchie",
        coordinates: "13.48850,-88.19343"
    },
    {
        name: "Edificio Innova",
        coordinates: "13.4886243,-88.1936105"
    },
    {
        name: "Edificio Juan Jose Cañas",
        coordinates: "13.4886574,-88.1938024"
    },
    {
        name: "Edificio Hugo Lindo",
        coordinates: "13.4896262, -88.1930545"
    },
    {
        name: "Edificio Gerardo Barrios",
        coordinates: "13.4900917, -88.1935302"
    },
    {
        name: "Admisiones Universidad Gerardo Barrios",
        coordinates: "13.4889261, -88.1932690"
    },
    {
        name: "Auditorio Universidad Gerardo Barrios",
        coordinates: "13.4885195, -88.1928500"
    },
    {
        name: "Bienestar Estudiantil Universidad Gerardo Barrios",
        coordinates: "13.4886101, -88.1933524"
    }
];

// Function to load data from local storage
function loadBuildingDataFromLocalStorage() {
    const optionsInStorage = JSON.parse(localStorage.getItem('buildingOptions')) || [];
    return optionsInStorage;
}

// Function to combine data from local storage and JavaScript object
async function loadCombinedBuildingData() {
    const dataFromLocalStorage = loadBuildingDataFromLocalStorage();
    return [...dataFromLocalStorage, ...buildingsData]; // Combine with the new JavaScript object
}

// Function to populate the select element from combined data
async function populateSelectFromCombinedData() {
    const destinationSelect = document.getElementById('destinationSelect');
    const combinedData = await loadCombinedBuildingData();
    destinationSelect.innerHTML = '';

    combinedData.forEach(location => {
        const option = document.createElement('option');
        option.value = location.coordinates;
        option.textContent = location.name;
        destinationSelect.appendChild(option);
    });
}

// Call the function to populate the select element from combined data when the page loads
populateSelectFromCombinedData();
