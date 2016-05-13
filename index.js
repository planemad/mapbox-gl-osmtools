'use strict';

var util = require('util');
var xhr = require('xhr');

var osm_notes_data = new mapboxgl.GeoJSONSource();


function OSM(map){

  this._map = map;
  // Create new map layers for OSM stuff

  map.on('load', function(e) {
    // this._createLayers();
  });

  // Create a some UI controls for OSM
  var osmControl = document.createElement('div');
  osmControl.className = 'osm-control';

  var a = document.createElement('a');
  a.href =  '#';
  a.className = 'button';
  a.innerHTML = "OSM Notes";
  a.addEventListener('mousedown', this._requestNotes.bind(this));

  osmControl.appendChild(a);
  map.getContainer().appendChild(osmControl);


  // Add queries on click
  map.on('click', function(e) {

      // Show popup of feature from an OSM layer
      var osmFeature = map.queryRenderedFeatures(e.point, {layers:['noturn']})

      if (osmFeature.length) {

        // Check if feature is node or a way
        var osmType = osmFeature[0].geometry.type == 'LineString' ? 'way' : 'node';
        var point = osmType == 'way' ? e.lngLat : osmFeature[0].geometry.coordinates ;
        var popupHTML = "<strong>OpenStreetMap Feature</strong><br>" + osmType + "</b>: <a href='https://www.openstreetmap.org/" + osmType + "/" + osmFeature[0].properties.id + "'>" + osmFeature[0].properties.id + "</a>"

        var popup = new mapboxgl.Popup()
        .setLngLat(point)
        .setHTML(popupHTML)
        .addTo(map);
      }

      // Get map coordinates
      var bounds = map.getBounds();
      var top = bounds.getNorth();
      var bottom = bounds.getSouth();
      var left = bounds.getWest();
      var right = bounds.getEast();

      //Open in JOSM
      var josmUrl = 'https://127.0.0.1:8112/load_and_zoom?left='+left+'&right='+right+'&top='+top+'&bottom='+bottom;
      xhr.get(josmUrl, function() {});

  });

}


OSM.prototype = {

  // Set OSM variables
  _apiURL: 'http://api.openstreetmap.org/',

  // Create interactive layers
  _createLayers: function(){
    console.log('Adding Layer');
    this._map.on('load', function () {
      // Add a notes layer
      console.log('Adding Layer');
      this._map.addSource('osm-notes-source', osm_notes_data);
      this._map.addLayer({
          "id": "osm-notes",
          "type": "symbol",
          "source": "osm-notes-source",
          "layout": {
              "icon-image": "rocket-15",
              }
          });
      });
    },

  // Request OSM Notes
  _requestNotes: function() {
    var notesXHR = OSM.prototype._apiURL + 'api/0.6/notes.json?closed=-1&bbox=%s,%s,%s,%s';
    var map = this._map;
    var bounds = map.getBounds();
    var top = bounds.getNorth();
    var bottom = bounds.getSouth();
    var left = bounds.getWest();
    var right = bounds.getEast();

    notesXHR = util.format(notesXHR, left, bottom, right, top);

    console.log('Requesting Notes')

    xhr.get(notesXHR, function(err,resp) {
      console.log(resp.body);
      console.log(map);
      map.getSource('osm-notes-source').setData(resp.body)
    });

  }

};

// Export OSM module
if (window.mapboxgl) {
  mapboxgl.OSM = OSM;
} else if (typeof module !== 'undefined') {
  module.exports = OSM;
}
