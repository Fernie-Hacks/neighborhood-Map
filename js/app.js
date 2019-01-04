/*
 *  Model Data
 *  	Locations in the Riverside County
 */
var locations = [
    {
        title: 'Perris High School',
        city: 'Perris',
        location: {
            lat: 33.8007538,
            lng: -117.22364399999998
        }
    },
    {
        title: 'University of California, Riverside',
        city: 'Riverside',
        location: {
            lat: 33.9756518,
            lng: -117.33111059999999
        }
    },
    {
        title: 'In & Out',
        city: 'Moreno Valley',
        location: {
            lat: 33.9421134,
            lng: -117.26013929999999
        }
    },
    {
        title: 'AhiPoki Bowl',
        city: 'Moreno Valley',
        location: {
            lat: 33.9393618,
            lng: -117.2785237
        }
    },
    {
        title: 'Chicago Pasta House',
        city: 'Moreno Valley',
        location: {
            lat: 33.9387766,
            lng: -117.23218710000003
        }
    },
    {
        title: 'GLO Mini Golf Arcade',
        city: 'Riverside',
        location: {
            lat: 33.923290,
            lng: -117.470720
        }
    },
    {
        title: 'Lake Perris',
        city: 'Perris',
        location: {
            lat: 33.862040,
            lng: -117.200570
        }
    }
];

var map;
var bounds;
var infoWindow;
var markers = [];

/*
 * function initMap() Responsible for loading the map in given location
 * Responsible for loading locations array Invoked by the index.html script
 * Google callback function
 */
function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 33.9756518, lng: -117.33111059999999},
		zoom: 11,
		mapTypeControl: false
	});
	
	infoWindow = new google.maps.InfoWindow();
	bounds = new google.maps.LatLngBounds();
	
	// Call to start KO application
	ko.applyBindings(new ViewModel());
}

/*
 * function googleAPIError() Gets invoked when the call to load the Google API
 * fails
 */
function googleAPIError(){
	alert('An error occurred while loading Google Maps API.');
}

/*
 * function populateInfoWindow(marker, infowindow) @param marker a specific
 * marker object <Google maps API> @param infowindow a specific infoWindow
 * object <Google maps API> Gets invoked when a marker is clicked by user Opens
 * the infoWindow and populates it
 */
function populateInfoWindow(marker, infowindow, address, rating) {
	// Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
    	// Clear the infowindow content to give the streetview time to load.
    	infowindow.setContent('');
    	infowindow.marker = marker;
    	// Make sure the marker property is cleared if the infowindow is closed.
    	infowindow.addListener('closeclick', function() {
    		infowindow.marker = null;
    	});
    	var streetViewService = new google.maps.StreetViewService();
    	var radius = 50;
    	var title = '<div>' + marker.title + '</div><div>';
    	var addressStr = '<div>' + address + '</div><div>';
    	
    	var ratingStr = "<div>";
    	
    	for(i = 0; i < 5; i++){
    		if(i < rating){
    			ratingStr += '<span class="fa fa-star checked"></span>';
    		}
    		else{
    			ratingStr += '<span class="fa fa-star">';
    		}
    	}
    	ratingStr += "</div>";
    	
    	var windowContent = title + addressStr + ratingStr + '<div id="pano"></div>';
    	
    	// In case the status is OK, which means the pano was found, compute the
    	// position of the streetview image, then calculate the heading, then
		// get a
    	// panorama from that and set the options
    	function getStreetView(data, status) {
    		if (status == google.maps.StreetViewStatus.OK) {
    			var nearStreetViewLocation = data.location.latLng;
    			var heading = google.maps.geometry.spherical.computeHeading(
    					nearStreetViewLocation, marker.position);
    			infowindow.setContent(windowContent);
    			var panoramaOptions = {
    					position: nearStreetViewLocation,
    					pov: {
    						heading: heading,
    						pitch: 30
    					}
    			};
    			var panorama = new google.maps.StreetViewPanorama(
    					document.getElementById('pano'), panoramaOptions);
    		} else {
    			infowindow.setContent(windowContent +
    			'<div>No Street View Found</div>');
    		}
    	}
    	// Use streetview service to get the closest streetview image within
    	// 50 meters of the markers position
    	streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    	// Open the infowindow on the correct marker.
    	infowindow.open(map, marker);
    }
}

/*
 * function placeMarker(location) @param location a single location entry
 * Creates a marker in the map using the location details Invoked in the
 * ViewModel
 */
var placeMarker = function(location) {
	var self = this;
	// Get the position from the location array.
	this.position = location.location;
	this.title = location.title;
	this.city = location.city;
	this.rating = '';
	this.address = '';
	
	this.isVisible = ko.observable(true);
	
	// Yelp Data
	
    var yelpAPI = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?";
    var params = "term="+ this.title + "&location="+ this.city + "  CA";
    var myUrl = yelpAPI+params;
    $.ajax({
       url: myUrl,
       headers: {
    	   'Authorization':'Bearer YelpAccessKey',
       },
       method: 'GET',
       dataType: 'json',
       success: function(data){
    	   if(data.total > 0){
        	   self.rating = data.businesses[0].rating;
        	   self.address = data.businesses[0].location.display_address[0] + ", " +
        	   			data.businesses[0].location.display_address[1];
        	   setTimeout(function () {
        		   if(data.total > 0){
        			   
        		   }
        	    }, 1000);
           }
       }
    });
	
	// Create a marker for the location
	this.marker = new google.maps.Marker({
		position: self.position,
		title: self.title,
		city: self.city,
		animation: google.maps.Animation.DROP,
	});
	
	self.updateMarkers = ko.computed(function () {
        // set marker and extend bounds (showListings)
        if(self.isVisible() === true) {
        	// Set map
            self.marker.setMap(map);
            bounds.extend(self.marker.position);
            map.fitBounds(bounds);
        } else {
            self.marker.setMap(null);
        }
    });
	
	// Create an onClick event to open an infoWindow at each marker.
	this.marker.addListener('click', function() {
		populateInfoWindow(this, infoWindow, self.address, self.rating);
	});
	
}

/*
 * ViewModel <Octopus, Controller> Responsible for passing data between Viewer &
 * Model.
 */
var ViewModel = function(){
	var self = this;
	
	this.locationsArray = ko.observableArray([]);
	
	// The following group uses the location array to create an array of
	// markers.
	for (var i = 0; i < locations.length; i++) {
		self.locationsArray.push( new placeMarker(locations[i]) );
	}
	
	this.filter = ko.observable();
	  
	this.search = ko.observable('');
	
	this.selectPlace = function(location){		
		self.locationsArray().forEach(function(place) {
			if(place.marker.title != location.marker.title)
				place.isVisible(false);
			else
				place.isVisible(true);
        });
	};
	
	this.searchText = ko.computed(function() {
		var textToSearch = self.search().toLowerCase();
		if(textToSearch) {
			return ko.utils.arrayFilter(self.locationsArray(), function(location) {
				var locStr = location.marker.title.toLowerCase();
				var isValid = locStr.includes(textToSearch)
				location.isVisible(isValid);
				return isValid;
			});
		}
		self.locationsArray().forEach(function(location) {
			location.isVisible(true);
		});
		return self.locationsArray();
	}, self);
	
	this.showPlaces = function(){
		self.locationsArray().forEach(function(place) {
				place.isVisible(true);
        });
	}
}