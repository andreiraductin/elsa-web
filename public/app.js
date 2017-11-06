$("#datable").DataTable();
var app=angular.module('testModule',[]);
app.controller('reportController', function($scope, $http) {
    $scope.databaseData = [];
    $http.get('http://etc.unitbv.ro/elsa/api/v1/reports')    
    .success(function(databaseData) {
        $scope.databaseData = databaseData;
		initDevicesMap($scope);
    })
    .error(function(data){
        console.log('Errors: ' + databaseData);
    });
});

app.controller('countController', function($scope, $http) {
    $scope.count = [];
    $scope.nr_locatii = [];
    $scope.locatii = [];
    $http.get('http://etc.unitbv.ro/elsa/api/v1/reports')    
    .success(function(data) {
        $scope.count = data.length;
		  // $scope.nr_locatii = data[3].length;
		  // console.log(data);
		  // $scope.nr_locatii = $filter('countBy')(data,'location');
		  data.forEach(function (item) {
			  if($scope.locatii.indexOf(item.location) == -1){ 
					$scope.locatii.push(item.location);	
			}			
		  });
		  $scope.nr_locatii =  $scope.locatii.length;
    })
    .error(function(data){
        console.log('Errors: ' + data);
    });
});

app.controller('devicesController',function($scope, $http) {    
    $scope.events = [];
    $scope.dbData = [];
        
    $http.get('http://etc.unitbv.ro/elsa/api/v1/reports')    
    .success(function(data) {
         $scope.dbData = data;  
         var log = [];
         angular.forEach($scope.dbData, function(value, key) {
           //console.log(key + ': ' + value.event);
           //push only distinct values
            if(!log.includes(value.event)){
              this.push(value.event);      
            }               
         }, log);
          $scope.events = log.length;
    })
    .error(function(data){
        console.log('Errors: ' + data);
    });          
}); 

function initDevicesMap($scope) {		
	var map;
	var latLngBrasov = {lat: 45.66, lng: 25.61};
	map = new google.maps.Map(document.getElementById("devices-map"), {
	  center: latLngBrasov,
	  zoom: 11
	});
		
   if($scope.databaseData.length != undefined && $scope.databaseData.length > 0){
		for(var i = 0; i < $scope.databaseData.length; i++){
				var locatieGps = $scope.databaseData[i].location.split(" ");				
				var latitude = parseFloat(locatieGps[0]);
				var longitude = parseFloat(locatieGps[1]);
				var pozitieGeografica = {lat: latitude, lng: longitude};
				
				var marker = new google.maps.Marker({
				  position: pozitieGeografica,
				  map: map,
				  title: 'Dispozitiv ' + $scope.databaseData[i].devid
				});
				
				var eventType =  $scope.databaseData[i].event;					
				if(eventType == 2){
					marker.setIcon('http://maps.google.com/mapfiles/ms/icons/purple-dot.png')
				}else if(eventType == 3){
					marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
				}if(eventType == 4){
					marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png')
				}		   
		} 
	}
	   /*
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
	   }); */
}

app.controller('loginController', function($scope, $http) {
    $scope.loginData = [];
    $http.get('http://etc.unitbv.ro/elsa/api/v1/users')
        .success(function(loginData) {
            $scope.loginData = loginData;
            console.log($scope.loginData);
            Login($scope.loginData);
        })
        .error(function(data){
            console.log('Errors: ' + loginData);
        });
});

function Login($loginData) {
    $("#elsa-login-form").on("submit", function () {

        var $form = $("#elsa-login-form");
        var username = $form.find("#username").val();
        var password = $form.find("#password").val();

        if($loginData.length !== undefined && $loginData.length > 0){
			for(var i = 0; i < $loginData.length; i++){
					if($loginData[i] === undefined || $loginData[i] === null ){
                        continue;
					}
					if($loginData[i].name === null || $loginData[i].name !== username)					{
                        continue;
					}
					if($loginData[i].password === null || $loginData[i].password !== password ){
                        continue;
					}
					window.location.href = "http://www.etc.unitbv.ro/elsa/admin.html";
				}
			}
	});
}