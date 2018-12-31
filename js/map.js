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
var markers = [];

/*
 * function initMap()
 * 		Responsible for loading the map in given location
 * 		Responsible for loading locations array
 * 		Invoked by the index.html script Google callback function
 */
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
		
		// Push the marker to array of markers.
		markers.push(marker);
		
		// Create an onClick event to open an infoWindow at each marker.
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});
	}
	showListings();
}

/*
 * function populateInfoWindow(marker, infowindow)
 * 		@param marker a specific marker object <Google maps API>
 * 		@param infowindow a specific infoWindow object <Google maps API>
 * 		Gets invoked when a marker is clicked by user
 * 		Opens the infoWindow and populates it
 */
function populateInfoWindow(marker, infowindow) {
	// If this maker is already open ignore.
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
		infowindow.open(map, marker);
		// Add listener in case user clicks the close window (x).
		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
        });
	}
}


/*
 * function showListings()
 * 		Traverses the markers array which was populated by initMap()
 * 		Invoked by initMap() after setting map & show all markers click
 */
function showListings() {
	var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
		bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
}