if (Meteor.isClient) {
    var map;
    var eventId;

    function create() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                eventId = Events.insert({
                    destination: {
                        lng: position.coords.longitude,
                        lat: position.coords.latitude
                    }
                });
                if (eventId) {
                    Router.go('event', {_id: eventId});
                } else {
                    alert('Error occured!');
                }
            }, function(error) {
                alert('Error occurred, Sample data is being used!');
                eventId = Events.insert({
                    destination: {
                        lng: 121.559769, //sample data
                        lat: 25.091623 //sample data
                    }
                });
                if (eventId) {
                    Router.go('event', {_id: eventId});
                } else {
                    alert('Error occured!');
                }
            }, {timeout: 1000});
        } else {
            alert("Geolocation is not available!");
        }
    }

    Template.create.rendered = function() {
        create();
    }
}