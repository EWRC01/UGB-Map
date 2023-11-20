
// Function to load data from local storage
function loadBuildingDataFromLocalStorage() {
    const optionsInStorage = JSON.parse(localStorage.getItem('buildingOptions')) || [];
    return optionsInStorage;
}

async function loadCombinedBuildingData() {
    const dataFromLocalStorage = loadBuildingDataFromLocalStorage();
    const combinedData = [...dataFromLocalStorage, ...buildingsData];
    return Promise.resolve(Array.isArray(combinedData) ? combinedData : []);
}



async function populateSelectFromCombinedData() {
    const destinationSelect = document.getElementById('destinationSelect');
    const combinedData = await loadCombinedBuildingData();

    // Guarda el valor seleccionado actualmente o la opción por defecto
    const selectedValue = destinationSelect.value;

    destinationSelect.innerHTML = '';

    // Agrega la opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = 'default';
    defaultOption.selected = true;
    defaultOption.textContent = 'Selecciona una opción:';
    destinationSelect.appendChild(defaultOption);

    combinedData.forEach(location => {
        if (location.rooms) {
            // Es un edificio, agrega el nombre del edificio como un grupo
            const buildingGroup = document.createElement('optgroup');
            buildingGroup.label = location.name;

            // Luego, agrega las aulas del edificio al grupo
            location.rooms.forEach(room => {
                const roomOption = document.createElement('option');
                roomOption.value = room.coordinates;
                roomOption.textContent = room.name;
                buildingGroup.appendChild(roomOption);
            });

            destinationSelect.appendChild(buildingGroup);
        } else {
            // Es un edificio sin aulas
            const option = document.createElement('option');
            option.value = location.coordinates;
            option.textContent = location.name;
            destinationSelect.appendChild(option);
        }
    });

    // Establece el valor seleccionado nuevamente
    destinationSelect.value = selectedValue;
}

// Call the function to populate the select element from combined data when the page loads
populateSelectFromCombinedData();


