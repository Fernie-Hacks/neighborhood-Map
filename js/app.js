/*
 * ViewModel <Octopus, Controller>
 *		Responsible for passing data between Viewer & Model.
 */
var ViewModel = function(){
	this.filter = ko.observable();
	
	this.selectPlace = function(location){
		for (var i = 0; i < markers.length; i++) {
			if(markers[i].title != location.title)
				markers[i].setMap(null);
			else
				markers[i].setMap(map);
		}
	};
	
	this.showPlaces = function(){
		showListings();
	}
}

// Call to start KO application
ko.applyBindings(new ViewModel());





