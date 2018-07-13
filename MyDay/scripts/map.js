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

function initMap() {
  let directionsService = new google.maps.DirectionsService;
  let directionsRenderer = new google.maps.DirectionsRenderer;
  let map = new google.maps.Map($("#map")[0]);
  directionsRenderer.setMap(map);
  directionsService.route({
    origin: "110 Vassal Lane, 02138",
    destination: "110 Vassal Lane, 02138",
    waypoints: createWaypoints(),
    travelMode: "WALKING"
  }, function(response, status) {
    if(status == "OK") {
      directionsRenderer.setDirections(response);
    } else {
      console.log(status);
    }
  });
}
