(function() {
  'use strict';

  app.components.eventRegistration = {
    initialize : function() {
      app.collections.bsUsers = new app.Collections.BSUsers();
      app.models.event = new app.Models.Event();
      app.models.eventRegistrationAttendee = new app.Models.EventRegistrationAttendee();
      app.models.eventRegistrationPayer = new app.Models.EventRegistrationPayer();
      app.models.eventRegistration = new app.Models.EventRegistration();
      app.models.creditcard = new app.Models.CreditCard();
      app.models.eWayPayment = new app.Models.EWayPayment();
      app.collections.countries = new app.Collections.Countries();
      app.collections.states = new app.Collections.States();
      if (app.config.env == 'dev' || app.config.env == 'test') {
        app.models.eventRegistration.paymentMode = 'test';
      }
      app.models.eventRegistration.set('event', app.models.event);
      app.models.eventRegistration.set('attendee', app.models.eventRegistrationAttendee);
      app.models.eventRegistration.set('payer', app.models.eventRegistrationPayer);
      app.models.eventRegistration.set('dcUser', app.models.dcUser);
      app.models.eventRegistration.set('user', app.models.user);
      app.models.eventRegistration.set('creditcard', app.models.creditcard);
      app.models.eventRegistration.set('eWayPayment', app.models.eWayPayment);
      app.models.event.initDeferred = $.Deferred();
      // Start to fetch event data once the id is set
      app.models.event.deferred = app.models.event.initDeferred.then(function() {
        return app.models.event.fetch();
      });

      app.viewModels.eventRegistration = new app.ViewModels.EventRegistration(app.models.eventRegistration, {
        factories : {
          'attendee' : app.ViewModels.EventRegistrationAttendee,
          'payer' : app.ViewModels.EventRegistrationPayer,
          'creditcard' : app.ViewModels.CreditCard,
          'eWayPayment' : app.ViewModels.EWayPayment,
          'dcUser' : app.ViewModels.DCUser,
          'user' : app.ViewModels.DeepUser
        }
      });
    }
  };

})();
