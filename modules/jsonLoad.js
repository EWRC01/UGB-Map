// Function to load and populate the select element from JSON data
function populateSelectFromJSON() {
    fetch('../buildings.JSON') // Replace 'locations.json' with the path to your JSON file
        .then(response => response.json())
        .then(data => {
            const destinationSelect = document.getElementById('destinationSelect');
            
            data.forEach(location => {
                const option = document.createElement('option');
                option.value = location.coordinates;
                option.textContent = location.name;
                destinationSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });
}

// Call the function to populate the select element from JSON
populateSelectFromJSON();
