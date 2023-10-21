        // Function to load data from local storage
        function loadBuildingDataFromLocalStorage() {
            const optionsInStorage = JSON.parse(localStorage.getItem('buildingOptions')) || [];
            return optionsInStorage;
        }

        // Function to load data from the JSON file
        function loadBuildingDataFromJSON() {
            return fetch('../buildings.JSON')
                .then(response => response.json())
                .catch(error => {
                    console.error('Error loading JSON:', error);
                    return [];
                });
        }

        // Function to combine data from local storage and JSON file
        async function loadCombinedBuildingData() {
            const dataFromLocalStorage = loadBuildingDataFromLocalStorage();
            const dataFromJSON = await loadBuildingDataFromJSON();
            return [...dataFromLocalStorage, ...dataFromJSON];
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

