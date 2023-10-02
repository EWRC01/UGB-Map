var routePolyline = null;

function displayInstructions(origin, destination) {
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
                    var route = L.polyline(routeCoordinates, { color: 'rgb(159, 40, 28)' });
                    route.addTo(map);
                    map.setZoom(15);

                    const instructionsTable = document.getElementById("instructionsTable");
                    instructionsTable.innerHTML = '';

                    let totalDistance = 0;
                    let totalDuration = 0;

                    if (path.instructions && path.instructions.length > 0) {
                        path.instructions.forEach((step, index) => {
                            if (step.text) {
                                const instructionRow = document.createElement('tr');
                                const distanceInMeters = step.distance;
                                const distanceText = distanceInMeters.toFixed(0) + ' Metros';

                                const durationInSeconds = step.time;
                                totalDuration += durationInSeconds;

                                const durationInMinutes = Math.ceil(durationInSeconds / 1000 / 60);

                                const instructionText = `${index + 1}. ${step.text}. Distancia: ${distanceText}. Tiempo: ${durationInMinutes} Minutos`;

                                instructionRow.innerHTML = `<td>${index + 1}.</td><td>${step.text}</td><td>${distanceText}</td><td>${durationInMinutes} Minutos</td>`;
                                instructionsTable.appendChild(instructionRow);

                                const speakButton = document.createElement('button');
                                speakButton.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
                                speakButton.className = "btn btn-dark";
                                speakButton.addEventListener('click', () => {
                                    setTimeout(() => {
                                        const speechSynthesis = window.speechSynthesis;
                                        const speechUtterance = new SpeechSynthesisUtterance(instructionText);
                                        speechSynthesis.speak(speechUtterance);
                                    }, index * 1000);
                                });
                                instructionRow.appendChild(speakButton);

                                totalDistance += distanceInMeters;
                            }
                        });
                    } else {
                        console.error('No instructions found');
                    }

                    const totalDistanceInKilometers = (totalDistance).toFixed(2);
                    const totalDurationInHours = (totalDuration / 1000 / 60).toFixed(2);

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
