let map;

// Function to show map on HTML
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                map = new Map(document.getElementById("map"), {
                    center: userLocation, // Set the center to the user's location
                    zoom: 18,
                });
            },
            function (error) {
                console.error("Error getting user location:", error);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Call loadGoogleMapsScript when the page loads
window.onload = function () {
    loadGoogleMapsScript();
};
