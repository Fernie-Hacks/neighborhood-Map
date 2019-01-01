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
var bounds;
var infoWindow;
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
	
	infoWindow = new google.maps.InfoWindow();
	bounds = new google.maps.LatLngBounds();
	
	// Call to start KO application
	ko.applyBindings(new ViewModel());
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
		infowindow.setContent('');
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
 * function placeMarker(location)
 * 		@param location a single location entry
 * 		Creates a marker in the map using the location details
 * 		Invoked in the ViewModel 
 */
var placeMarker = function(location) {
	var self = this;
	// Get the position from the location array.
	var position = location.location;
	var title = location.title;
	
	this.isVisible = ko.observable(true);
	
	// Create a marker per location
	this.marker = new google.maps.Marker({
		position: position,
		title: title,
		animation: google.maps.Animation.DROP,
	});
	
	this.filterMarkers = ko.computed(function () {
        // set marker and extend bounds (showListings)
        if(self.isVisible() === true) {
            self.marker.setMap(map);
            bounds.extend(self.marker.position);
            map.fitBounds(bounds);
        } else {
            self.marker.setMap(null);
        }
    });
	
	// Create an onClick event to open an infoWindow at each marker.
	this.marker.addListener('click', function() {
		populateInfoWindow(this, infoWindow);
	});
}

/*
 * ViewModel <Octopus, Controller>
 *		Responsible for passing data between Viewer & Model.
 */
var ViewModel = function(){
	var self = this;
	
	this.locationsArray = ko.observableArray([]);
	
	// The following group uses the location array to create an array of markers.
	for (var i = 0; i < locations.length; i++) {
		this.locationsArray.push( new placeMarker(locations[i]) );
	}
	
	this.filter = ko.observable();
	  
	this.search = ko.observable('');

	/*this.search = function(value) {
		viewModel.locations.removeAll();

		if (value == '') return;

		for (var user in users) {
			if (users[user].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				viewModel.users.push(users[user]);
			}
		}
	}*/
	
	
	
	this.selectPlace = function(location){		
		self.locationsArray().forEach(function(place) {
			if(place.marker.title != location.title)
				place.isVisible(false);
			else
				place.isVisible(true);
        });
	};
	
	//this.selectPlace = ko.computed(function() {
	//	self.locationArray
	//}, self);
	
	/*
    this.locationList = ko.computed(function() {
        var searchFilter = self.searchItem().toLowerCase();
        if (searchFilter) {
            return ko.utils.arrayFilter(self.mapList(), function(location) {
                var str = location.title.toLowerCase();
                var result = str.includes(searchFilter);
                location.visible(result);
				return result;
			});
        }
        self.mapList().forEach(function(location) {
            location.visible(true);
        });
        return self.mapList();
    }, self);*/
	
	
	this.showPlaces = function(){
		self.locationsArray().forEach(function(place) {
				place.isVisible(true);
        });
	}
}





