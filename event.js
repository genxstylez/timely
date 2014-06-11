if (Meteor.isClient) {
    function initialize() {
        var current = Router.current();
        var currentEvent = Events.findOne({
            _id: current.params._id
        });
        var mode = current.params.hash;

        if (navigator.geolocation) {
            Meteor.setInterval(function() {
                navigator.geolocation.getCurrentPosition(function(position) {
                    if (mode == 'recv') {
                        Events.update(currentEvent._id, {
                            $set: {
                                starting: {
                                    lng: position.coords.longitude,
                                    lat: position.coords.latitude
                                }
                            }
                        });
                    } else {
                        Events.update(currentEvent._id, {
                            $set: {
                                destination: {
                                    lng: 121.559769, //position.coords.longitude,
                                    lat: 25.091623 //position.coords.latitude
                                }
                            }
                        });
                    }
                });
            }, 1000);
        } else {
            alert("Geolocation is not available!");
        }


        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        var map;

        directionsDisplay = new google.maps.DirectionsRenderer();
        var destination = new google.maps.LatLng(currentEvent.destination.lat, currentEvent.destination.lng);

        var mapOptions = {
            zoom: 16,
            center: destination,
        }
        map = new google.maps.Map($('#direction-map-canvas')[0], mapOptions);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel($('#directions-panel')[0]);
        if (currentEvent.starting) {

            var origin = new google.maps.LatLng(currentEvent.starting.lat, currentEvent.starting.lng)
            var request = {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });
        } else {
            $('#pending').show();
        }
    }


    Template.event.rendered = function() {
        initialize();
    }
}