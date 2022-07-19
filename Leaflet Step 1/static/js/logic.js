var street = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    {
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    });

  
  // Create a map object, and set the default layers.
  var myMap = L.map("map", {
    center: [35, -95],
    zoom: 5
  });
  
  // Pass our map layers into our layer control.
  // Add the layer control to the map.
  street.addTo(myMap);
  
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Get the data with d3.
d3.json(url).then(function(data) {
    function getColor(depth) {
        switch (true) {
          case depth > 90:
            return "#ea2c2c";
          case depth > 70:
            return "#ea822c";
          case depth > 50:
            return "#ee9c00";
          case depth > 30:
            return "#eecc00";
          case depth > 10:
            return "#d4ee00";
          default:
            return "#98ee00";
        }
      }
    
      // This function determines the radius of the earthquake marker based on its magnitude.
      // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
      function getRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
    
        return magnitude * 4;
      }
    // Create a new marker cluster group.
    L.geoJson(data, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function.
        style: function (feature) {
            return {
              opacity: 1,
              fillOpacity: 1,
              fillColor: getColor(feature.geometry.coordinates[2]),
              color: "#000000",
              radius: getRadius(feature.properties.mag),
              stroke: true,
              weight: 0.5
            };
          },
        // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
        onEachFeature: function(feature, layer) {
          layer.bindPopup(
            "Magnitude: "
            + feature.properties.mag
            + "<br>Depth: "
            + feature.geometry.coordinates[2]
            + "<br>Location: "
            + feature.properties.place
          );
        }
      }).addTo(myMap);

      var legend = L.control({position: "bottomright"});

      legend.onAdd = function() {
        
        var div = L.DomUtil.create("div", "info legend"),
        depth = [-10, 10, 30, 50, 70, 90];
        
        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
      
    for (var i =0; i < depth.length; i++) {
        
        div.innerHTML += 
        '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
          }
        return div;
      };
      legend.addTo(myMap);
  });