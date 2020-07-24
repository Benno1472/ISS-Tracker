// By Ben Leszczynski

let worldmap;
let markerArray = [];
let focus = false;

window.onload = () => {
    // max bounds stuff
    let southWest = new L.LatLng(90, -180)
    let northEast = new L.LatLng(-90, 180)
    let bounds = new L.LatLngBounds(southWest, northEast);

    // create the map
    worldmap = L.map('mapid', { maxBounds: bounds, maxBoundsViscosity: 0.5 }).setView([44.63, 28.77], 13);

    // add the tile layer to the map
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        minZoom: 1.5,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        continousWorld: false,
        noWrap: true,
        bounds: [[-90, -180], [90, 180]],
        accessToken: 'pk.eyJ1IjoiYmVubm8xNDcyIiwiYSI6ImNrYnR0NzJ6ajBkNDkycWw2ZXY5ZGUxeHoifQ.4JoAWBEaULEYK4HytFGQQg'
    }).addTo(worldmap);

    // continously update every 5 seconds
    setInterval(update, 5000);

    // event listener and logic for focus button
    let focusButton = document.getElementById("focusButton");
    focusButton.onclick = () => {
        if (focus) {
            focus = false;
            focusButton.style.backgroundColor = "red";
        }
        else if (!focus) {
            focus = true;
            focusButton.style.backgroundColor = "green";
        }
        console.log(focus);
    }
}

function update() {
    getCoordinates().then(data => {
        updateMap(data);
    }).catch(err => console.error(err));
}

async function getCoordinates() {
    // fetch request to get the coordinates
    let response = await fetch("http://api.open-notify.org/iss-now.json");
    let data = await response.json();
    let coordinates = await data.iss_position;
    return (coordinates);
}

function updateMap(coordinates) {
    let latitude = coordinates.latitude;
    let longitude = coordinates.longitude;

    // create a circle at the designated coordinates
    L.circle([latitude, longitude], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(worldmap);

    // if focused update the view position
    if (focus) {
        worldmap.flyTo(new L.LatLng(latitude, longitude));
    }

    // update the coordinates element
    document.getElementById('coordinates').innerHTML = "Lat: " + latitude + " || Long: " + longitude;
}