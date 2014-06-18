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

        render(currentEvent);
        query = Events.find({
            _id: currentEvent._id
        });
        var handle = query.observeChanges({
            changed: function(id, changes) {
                render(currentEvent, changes);
            }
        });
    }

    function render(current_event, changes) {
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        var map;

        directionsDisplay = new google.maps.DirectionsRenderer();
        var dest_data;
        if (changes && changes.destination)
            dest_data = changes
        else
            dest_data = current_event
        var destination = new google.maps.LatLng(dest_data.destination.lat, dest_data.destination.lng);

        var mapOptions = {
            zoom: 16,
            center: destination,
        }
        map = new google.maps.Map($('#direction-map-canvas')[0], mapOptions);
        directionsDisplay.setMap(map);
        $('#directions-panel').html('');
        directionsDisplay.setPanel($('#directions-panel')[0]);
        var start_data;
        if (changes && changes.starting)
            start_data = changes
        else
            start_data = current_event
        if (start_data.starting) {

            var origin = new google.maps.LatLng(start_data.starting.lat, start_data.starting.lng)
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