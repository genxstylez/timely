if (Meteor.isClient) {
    Template.home.greeting = function() {
        return "Welcome to timie.";
    };

    Template.home.events({
        'click input': function() {
            Router.go('create');
            // template data, if any, is available in 'this'
        }
    });
}

// Collection definitions
Events = new Meteor.Collection("Events");

if (Meteor.isServer) {
    Meteor.startup(function() {
        Meteor.publish("Events", function() {
            return Events.find({});
        })
        // code to run on server at startup
    });
}


// Route definitions

Router.map(function() {
    this.route('home', {
        path: '/'
    });

    this.route('create');

    this.route('event', {
        path: '/events/:_id',

        waitOn: function() {
            return Meteor.subscribe('Events', this.params._id);
        },

        data: function() {
            return Events.findOne({
                _id: this.params._id
            });
        },

        action: function() {
            if (this.ready())
                this.render();
            else
                this.render('loading');
        },

        onBeforeAction: function() {
            this.subscribe('Events', this.params._id).wait();
        },
    });

});