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

function createMarkers(map, waypoints) {
  let markers = [];
  let geocoder = new google.maps.Geocoder;
  for(let i = 0; i < waypoints.length; i++) {
    geocoder.geocode({"placeId": waypoints[i].place_id}, function(results, status) {
      if(status == "OK") {
        let marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          icon: new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + colors[i])
        });
        markers.push(marker);
      }
    });
  }
  return markers;
}

function initMap() {
  let directionsService = new google.maps.DirectionsService;
  let directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true
  });
  let map = new google.maps.Map($("#map")[0]);
  directionsRenderer.setMap(map);
  directionsService.route({
    origin: "110 Vassal Lane, 02138",
    destination: "110 Vassal Lane, 02138",
    waypoints: createWaypoints(),
    travelMode: "WALKING",
    provideRouteAlternatives: false
  }, function(response, status) {
    if(status == "OK") {
      directionsRenderer.setDirections(response);
    } else {
      console.log(status);
    }
    createMarkers(map, response.geocoded_waypoints);
  });
}
