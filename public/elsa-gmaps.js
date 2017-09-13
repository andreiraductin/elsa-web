/*
  function initMap() {
	var map;
	var latLngBrasov = {lat: 45.66, lng: 25.61};
	// var $devicesMap = $("#devicesMap");
	map = new google.maps.Map(document.getElementById('devices-map'), {
	  center: latLngBrasov,
	  zoom: 11
	});
	
    var appElement = document.querySelector('[ng-app=testModule]');
    var appScope = angular.element(appElement).scope();
    var $controllerScope = appScope.$$childHead;
    var locatiiDisp  = $controllerScope.locatii;
   	
   if(locatiiDisp != undefined && locatiiDisp.length > 0){
	   angular.forEach(locatiiDisp, function(value, key) {	
			var threshold = parseInt(key);
			
			if(threshold > 9){
				var locatieGps = value.split(" ");
				var latitude = parseFloat(locatieGps[0]);
				var longitude = parseFloat(locatieGps[1]);
				var pozitieGeografica = {lat: latitude, lng: longitude};
				
				var marker = new google.maps.Marker({
				  position: pozitieGeografica,
				  map: map,
				  title: 'Dispozitiv ' + key
				});
			}
	   });
   } 
	var marker = new google.maps.Marker({
	  position: latLngBrasov,
	  map: map,
	  title: 'Dispozitiv 1'
	});
	 /*
	var marker2 = new google.maps.Marker({
	  position:{lat: 45.68, lng: 25.63},
	  map: map,
	  title: 'Dispozitiv 2'
	});
	marker2.setIcon('http://maps.google.com/mapfiles/ms/icons/purple-dot.png')
		
	var marker3 = new google.maps.Marker({
	  position:{lat: 45.65, lng: 25.64},
	  map: map,
	  title: 'Dispozitiv 3'
	});
	marker3.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
	
	var marker4 = new google.maps.Marker({
	  position:{lat: 45.68, lng: 25.58},
	  map: map,
	  title: 'Dispozitiv 4'
	});
	marker4.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png')
	
  }
*/