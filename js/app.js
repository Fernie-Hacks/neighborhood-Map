/*
 *  Model Data
 *  	Locations in the Riverside County
 */
var locations = [
    {
        title: 'Perris High School',
        location: {
            lat: 33.8007538,
            lng: -117.22364399999998
        }
    },
    {
        title: 'University of California, Riverside',
        location: {
            lat: 33.9756518,
            lng: -117.33111059999999
        }
    },
    {
        title: 'In & Out',
        location: {
            lat: 33.9421134,
            lng: -117.26013929999999
        }
    },
    {
        title: 'The "C" Hike Trail',
        location: {
            lat: 33.9756409,
            lng: -117.312588
        }
    },
    {
        title: 'AhiPoki Bowl',
        location: {
            lat: 33.9393618,
            lng: -117.2785237
        }
    },
    {
        title: 'Chicago Pasta House',
        location: {
            lat: 33.9387766,
            lng: -117.23218710000003
        }
    }
];

var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 33.9425, lng: -117.2297},
		zoom: 11,
		mapTypeControl: false
	});
	
	var largeInfowindow = new google.maps.InfoWindow();
	// The following group uses the location array to create an array of markers on initialize.
	for (var i = 0; i < locations.length; i++) {
		// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
		});
		
		// Push the marker to our array of markers.
		markers.push(marker);
		// Create an onclick event to open an infowindow at each marker.
		
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});
	}
	
	document.getElementById('show-listings').addEventListener('click', showListings);
	document.getElementById('hide-listings').addEventListener('click', hideListings);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.

function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
		infowindow.open(map, marker);
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
        });
	}
}


// This function will loop through the markers array and display them all.
function showListings() {
	var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
		bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
}

/*
 * ViewModel <Octopus Controller>
 *		Responsible for passing data between Viewer & Model.
 */
var ViewModel = function(){
	
}

// Call to start KO application
ko.applyBindings(new ViewModel());





