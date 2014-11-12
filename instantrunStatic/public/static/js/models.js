/* global _, Backbone, moment, app */
(function ($) {
    'use strict';

    // A bundle for all models and collections

    app.Models.User = Backbone.AssociatedModel.extend({
        urlRoot: 'http://54.67.26.254:9080/users',
        defaults: {
            "id": null,
            "email": null,
            "title": null,
            "firstname": null,
            "lastname": null,
            "birthday": null,
            "mobile": null,
            "street1": null,
            "city": null,
            "postcode": null,
            "state": null,
            "country": null
        }
    });

    app.Models.Event = Backbone.AssociatedModel.extend({
        urlRoot: 'http://54.67.26.254:9080/events',
        defaults: {
            "id": null
        }
    });

    app.Models.EventRegistration = Backbone.AssociatedModel.extend({
        urlRoot: 'http://54.67.26.254:9080/registration',
        defaults: {
            "id": null
        },
        relations: [{
            type: Backbone.One,
            key: 'event',
            relatedModel: 'app.Models.Event'
    }, {
            type: Backbone.One,
            key: 'dcUser',
            relatedModel: 'app.Models.User'
    }]
    });

})(jQuery);
