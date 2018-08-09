var home = "110 Vassal Lane, 02138";
var themap;
var markers = [];
var loaded = 0;
var homecolor = "555555";
var lines = {};

function createWaypoints() {
  wpts = [];
  for(let i = 0; i < events.length; i++) {
    wpts.push({
      location: events[i].location,
      stopover: true
    });
  }
  return wpts;
}

function createMarkers() {
  let e = [{location: home}].concat(events);
  let geocoder = new google.maps.Geocoder;
  for(let i = 0; i < e.length; i++) {
    geocoder.geocode({address: e[i].location}, function(results, status) {
      if(status == "OK") {
        let marker = new google.maps.Marker({
          map: themap,
          position: results[0].geometry.location,
          icon: new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + (i > 0 ? colors[i - 1] : homecolor))
        });
        markers.push(marker);
        if(markers.length == e.length) {
          fixMap();
        }
      } else {
        console.log(status);
        return;
      }
    });
  }
}

function drawLines() {
  let e = [{location: home}].concat(events);
  for(let i = 0; i < e.length; i++) {
    let directionsService = new google.maps.DirectionsService;
    directionsService.route({
      origin: e[i].location,
      destination: e[(i + 1) % e.length].location,
      travelMode: "WALKING",
      provideRouteAlternatives: false
    }, function(response, status) {
      if(status == "OK") {
        lines[i] = createLine(response.routes[0], i < colors.length ? "#" + colors[i] : "#" + homecolor, 0.7, 8);
      } else {
        console.log(status);
      }
    });
  }
}

function createLine(route, color, op, weight) {
  let pline = new google.maps.Polyline({
    path: [],
    strokeColor: color,
    strokeOpacity: op,
    strokeWeight: weight
  });
  for(let leg = 0; leg < route.legs.length; leg++) {
    for(let step = 0; step < route.legs[leg].steps.length; step++) {
      for(let i = 0; i < route.legs[leg].steps[step].path.length; i++) {
        pline.getPath().push(route.legs[leg].steps[step].path[i]);
      }
    }
  }
  pline.setMap(themap);
  return pline;
}

function eventHover(i) {
  lines[i].setOptions({ strokeWeight: 11, strokeOpacity: 1 });
}

function eventUnhover(i) {
  lines[i].setOptions({ strokeWeight: 8, strokeOpacity: 0.7 });
}

function fixMap() {
  let bounds = new google.maps.LatLngBounds();
  let padding = {
    left: window.innerWidth * 0.25,
    right: window.innerWidth * 0.25
  };
  for(let i = 0; i < markers.length; i++) {
    bounds.extend(markers[i].position);
  }
  themap.fitBounds(bounds, padding);
}

function initMap() {
  themap = new google.maps.Map($("#map")[0]);
  drawLines();
  createMarkers();
}
