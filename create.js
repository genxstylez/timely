if (Meteor.isClient) {
    var map;
    var eventId;

    function showURL(mode) {
        return Router.routes['event'].path({
            _id: eventId
        }, {
            hash: mode
        });
    }

    function create() {
        mapOptions = {
            zoom: 16,
            maptypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map($("#map-canvas")[0], mapOptions);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                eventId = Events.insert({
                    destination: {
                        lng: position.coords.longitude,
                        lat: position.coords.latitude
                    }
                });
                initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                marker = new google.maps.Marker({
                    position: initialLocation,
                    map: map,
                    animation: google.maps.Animation.DROP
                });

                map.setCenter(initialLocation);
            });
        } else {
            alert("Geolocation is not available!");
        }
    }
    Template.create.rendered = function() {
        create();
    }

    Template.create.events({
        'click #link': function() {
            $('#requester-link').attr('href', showURL());
            $('#requester-link').html(showURL());
            $('#receiver-link').attr('href', showURL('recv'));
            $('#receiver-link').html(showURL('recv'));
        }
    });
}