(function () {
    'use strict';

    app.models.user = new app.Models.User();
    app.models.event = new app.Models.Event();
    app.models.eventRegistration = new app.Models.EventRegistration();
    app.models.eventRegistration.set('user', app.models.user);
    app.models.eventRegistration.set('event', app.models.event);

    app.viewModels.eventRegistration = new app.ViewModels.EventRegistration(app.models.eventRegistration, {
        factories: {
            'user': app.ViewModels.User,
            'event': app.ViewModels.Event
        }
    });

    $(function() {
        ko.applyBindings(app.viewModels.eventRegistration, document.getElementById("event-registration"));
    });

})();
