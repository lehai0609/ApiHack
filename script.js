/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
  $(document).ready(function() {
      initialize();
      $("form").submit(calcRoute);
      $("#clear").click(clearMarker);
  });
    var map = null;
    var gresults = [];
    var directions = null;
    var routeBoxer = null;
    var bounds;
    var distance = 40; //km
    var directionService = new google.maps.DirectionsService();
    var initialize = function () {
      // Default the map view to the continental U.S.
      var mapOptions = {
        center: new google.maps.LatLng(37.09024, -95.712891),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 4
      };
      map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
      directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
    };
    
    var calcRoute = function () {
     
      routeBoxer = new RouteBoxer();
      var request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING
      };
      // Make the directions request
      directionService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(response);
          // Box around the overview path of the first route
          var path = response.routes[0].overview_path;
          var boxes = routeBoxer.box(path, distance);
          for (var i = 0; i < boxes.length; i++) {
              bounds = boxes[i];
          //Places service over boxes[i]
              placeService(bounds);
            }
        } else {
          alert("Directions query failed: " + status);
        }
      });
     return false;
    };
    
    var placeService = function(bounds) {
        
        var selected_Index = document.userInput.userSelect.selectedIndex;
        var typeOfPlace = document.userInput.userSelect.options[selected_Index].value;
        var request = {
            bounds: bounds,
            types: [typeOfPlace]
        };
        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    };

    function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }     
    }
    
    var createMarker = function(results) {
        /*var img = {
            url: results.icon,
            size: new google.maps.Size(20,32),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 32)
        };*/
        var marker = new google.maps.Marker({
            position: results.geometry.location,
            map: map,
            //icon: img
            title:results.name + ": "+ results.vicinity
        });
        gresults.push(marker);
    };
    
    var clearMarker = function() {
        for (var i=0; i<gresults.length; i++){
            gresults[i].setMap(null); 
        };
    };
    
