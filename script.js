/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
  $(document).ready(function() {
      initialize();
      $("form").submit(route);
  });
    var map = null;
    var directions = null;
    var routeBoxer = null;
    var bounds;
    var distance = 50; //km
    
    var initialize = function () {
      // Default the map view to the continental U.S.
      var mapOptions = {
        center: new google.maps.LatLng(37.09024, -95.712891),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 4
      };
      map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
      
      directionService = new google.maps.DirectionsService();
      directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
    };
    
    var route = function () {
      var request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING
      }
      // Make the directions request
      directionService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          // Box around the overview path of the first route
          var path = result.routes[0].overview_path;
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
    }
    
    var placeService = function(bounds) {
        var request = {
            bounds: bounds,
            types: ['store']
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
 