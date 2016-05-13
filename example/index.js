'use strict';
/* global mapboxgl */

require('../');
mapboxgl.accessToken = window.localStorage.getItem('MapboxAccessToken');

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
    center: [-74.50, 40], // starting position
    zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.OSM());
