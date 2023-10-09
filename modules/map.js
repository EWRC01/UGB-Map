// Create the map
var map = L.map('map').setView([13.48861, -88.19208], 13);

// Create different tile layers
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,});

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,});

var osmTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,});

// Add one of the base layers to the map by default
osm.addTo(map);

// Create a base layers object
var baseLayers = {
    "Leaflet Default": osm,
    "Leaflet Hot": osmHOT,
    "Leaflet TopoMap" : osmTopoMap,
};

var layerControl = L.control.layers(baseLayers).addTo(map);

layerControl.setPosition('bottomleft');