
var eventsLoaded = false;
var events = [];
var colors = [];
var currTime = new Date();
var startTime = new Date(currTime.getFullYear(), currTime.getMonth(), currTime.getDate(), 0, 0);
var endTime = new Date(currTime.getFullYear(), currTime.getMonth(), currTime.getDate(), 23, 59);


function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

function initClient() {
  gapi.client.init({
    'apiKey': 'AIzaSyBJQy0WVWidfsxKI5yGJM_E8trn5iWTfrY',
    'discoveryDocs': ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    'clientId': '30321865833-iv1nkopg666lvm0vufv7v64ebrk0sbrt.apps.googleusercontent.com',
    'scope': "https://www.googleapis.com/auth/calendar.readonly"
  }).then(function() {
    gapi.auth2.getAuthInstance().isSignedIn.listen(signInChange);
    if(!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      gapi.auth2.getAuthInstance().signIn();
    }
    signInChange(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

function signInChange(isIn) {
  if(isIn) {
    loadEvents();
  }
}

function loadEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': startTime.toISOString(),
    'timeMax': endTime.toISOString(),
    'orderBy': 'startTime',
    'singleEvents': 'true'
  }).then(function(results) {
    for(let i = 0; i < results.result.items.length; i++) {
      events.push(results.result.items[i]);
    }
  }).then(function() {
    setColors();
    fillTable();
    initMap();
  });
}

function setColors() {
  for(let i = 0; i < events.length; i++) {
    colors.push(randomRGB());
  }
}


function formatTime(d) {
  let hour = d.getHours();
  let min = d.getMinutes();
  let ext = "AM";
  if (hour > 12) {
    hour -= 12;
    ext = "PM";
  }
  if(hour == 0) {
    hour = 12;
  }
  if (min < 10) {
    min = "0" + min;
  }
  return hour + ":" + min + " " + ext;
}


function fillTable() {
  for(let i = 0; i < events.length; i++) {
    let sum = "";
    let start = formatTime(new Date(events[i].start.dateTime));
    let end = formatTime(new Date(events[i].end.dateTime));
    let location = events[i].location.indexOf(",") != -1 ? events[i].location.substring(0, events[i].location.indexOf(",")) : events[i].location;
    sum += events[i].summary.length <= 40 ? events[i].summary : events[i].summary.substring(0, 37) + "...";
    $("#events").append("<tr><td><div class=\"event\" style=\"background-color:" + hexToRGBATag(colors[i], 0.5) + "; border: 5px solid " + hexToRGBATag(colors[i], 1) + ";\"><div class=\"top\"><div class=\"eventTime\">" + start + "</div><div>" + location + "</div></div><div class=\"bottom\"><strong>" + sum + "</strong></div></div></td></tr>");
  }
}
