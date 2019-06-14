// Create a map object
var myMap = L.map("map-id", {
  center: [37.7749, -122.4194],
  zoom: 4
});

// Add a tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Create function to fill color based on magnitude
function getColor(d) {
  return d > 5 ? '#f44242' :
         d > 4 ? '#f49541' :
         d > 3 ? '#f4cd41' :
         d > 2 ? '#f1f441' :
         d > 1 ? '#41f44c' :
         d > 0 ? '#c4f441' :
                  '#FFEDA0';
}

// Retrieve data from the web and create map
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var cities = [];
d3.json(url, function(error, response) {
  if (error) throw (error);
  var locations = response.features;
  locations.forEach(function(d) {
    var loc = {
      "location": [parseFloat(d.geometry.coordinates[1]), parseFloat(d.geometry.coordinates[0])],
      "name": d.properties.place,
      "magnitude": parseFloat(d.properties.mag)
    };
    cities.push(loc);
    // console.log(d.lat);
    // console.log(d.lon);
  })
  for (var i = 0; i < cities.length; i++) {
    var city = cities[i];
    var magStr = city.magnitude;
    L.circleMarker(city.location, {
      radius: magStr*4,
      fillColor: getColor(magStr),
      color: getColor(magStr),
      fillOpacity: 0.7,
      weight: 0
    })
      .bindPopup("<h1>" + city.name + "</h1> <hr> <h3>Magnitude " + city.magnitude + "</h3>")
      .addTo(myMap);
  }
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our magnitude intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
