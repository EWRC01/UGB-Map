function displayInstructions(origin, destination, isDarkTheme) {
    if (origin && destination) {
        const profile = 'foot';
        const language = 'es';
        const grasshopperUrl = `https://graphhopper.com/api/1/route?point=${origin[0]},${origin[1]}&point=${destination[0]},${destination[1]}&vehicle=${profile}&locale=${language}&key=${apiKey}&points_encoded=false`;



        fetch(grasshopperUrl)
            .then(response => response.json())
            .then(data => {
                if (data.paths && data.paths.length > 0) {
                    const path = data.paths[0];

                    const routeCoordinates = path.points.coordinates.map(coord => [coord[1], coord[0]]);
                    var route = L.polyline(routeCoordinates, { color: isDarkTheme ? 'white' : 'black' });
                    route.addTo(map);

                    const instructionsTable = document.getElementById("instructionsTable");
                    instructionsTable.innerHTML = '';

                    let totalDistance = 0;
                    let totalDuration = 0;

                    if (path.instructions && path.instructions.length > 0) {
                        path.instructions.forEach((step, index) => {
                            if (step.text) {
                                const instructionRow = document.createElement('tr');
                                const distanceInMeters = step.distance;
                                const durationInSeconds = step.time;
                                const durationInMinutes = Math.ceil(durationInSeconds / 1000 / 60);


                                const instructionText = `En, ${distanceInMeters.toFixed(0)} Metros, ${step.text}`;

                                instructionRow.innerHTML = `<td>${index + 1}.</td><td>${step.text}</td><td>${distanceInMeters.toFixed(0)} Metros</td><td>${durationInMinutes} Minutos</td>`;
                                instructionsTable.appendChild(instructionRow);

                                const speakButton = document.createElement('button');
                                speakButton.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
                                speakButton.className = "btn btn-dark";
                                speakButton.addEventListener('click', () => {
                                    setTimeout(() => {
                                        const speechSynthesis = window.speechSynthesis;
                                        
                                        const speechUtterance = new SpeechSynthesisUtterance(instructionText);
                                        
                                       
                                        speechUtterance.lang='es-US';
                                        
                                        speechSynthesis.speak(speechUtterance);
                                    }, index * 1000);
                                });
                                instructionRow.appendChild(speakButton);

                                totalDistance += distanceInMeters;
                                totalDuration += durationInSeconds;
                            }
                        });
                    } else {
                        // Use SweetAlert for the error message
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No instructions found',
                        });
                    }

                    const totalDistanceInKilometers = (totalDistance).toFixed(2);
                    const totalDurationInHours = (totalDuration / 1000 / 60).toFixed(2);

                    const totalRow = document.createElement('tr');
                    totalRow.innerHTML = `<td colspan="2">Total:</td><td>${totalDistanceInKilometers} Metros</td><td>${totalDurationInHours} Minutos</td>`;
                    instructionsTable.appendChild(totalRow);
                } else {
                    // Use SweetAlert for the error message
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Invalid API RESPONSE',
                    });
                }
            })
            .catch(error => {
                // Use SweetAlert for the error message
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error getting directions: ' + error,
                });
            });
    } else {
        // Use SweetAlert for the error message
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please provide both origin and destination.',
        });
    }
}
