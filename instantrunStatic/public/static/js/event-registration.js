/* global _gaq, moment */
(function($) {
  'use strict';

  app.config.components.include.push('eventRegistration');

  app.components.eventRegistration.initialize();

  app.config.viewModels.bindings.push({
    viewModel : "eventRegistration",
    elementIds : [ "event-registration" ]
  });

  var backupFormId = url('?conf_card');
  if (!_.isEmpty(backupFormId)) {
    backupFormId = decodeURIComponent(backupFormId);
    backupFormId = Base64.decode(backupFormId);
    backupFormId = parseInt(backupFormId, 10);
  }

  // Following get3CodeBy2Code function needs to wait the whole list of country being loaded
  app.models.eventRegistrationAttendee.on("change:country", function(model, isoAlpha2) {
    if (!_.isEmpty(isoAlpha2)) {
      app.collections.states.fetch({
        data : {
          countryCode : app.collections.countries.get3CodeBy2Code(isoAlpha2)
        },
        success : function(data) {
          app.viewModels.eventRegistration.attendee().availableStates(data.toJSON());
        }
      });
    }
  });
  app.models.eventRegistrationPayer.on("change:ircountry", function(model, isoAlpha2) {
    if (!_.isEmpty(isoAlpha2)) {
      app.collections.states.fetch({
        data : {
          countryCode : app.collections.countries.get3CodeBy2Code(isoAlpha2)
        },
        success : function(data) {
          app.viewModels.eventRegistration.payer().availableStates(data.toJSON());
        }
      });
    }
  });

  app.collections.countries.deferred = app.collections.countries.fetch({
    success : function(countries) {
      // Only show Australia and New Zealand
      var filteredCountries = countries.chain().filter(function(country) {
        return country.get('countryCode') === 'AU' || country.get('countryCode') === 'NZ';
      }).invoke('toJSON').value();
      app.viewModels.eventRegistration.attendee().availableCountries(filteredCountries);
      app.viewModels.eventRegistration.payer().availableCountries(filteredCountries);
      // Set the country to be Australia by default
      if (_.isEmpty(app.models.eventRegistrationAttendee.get('country'))) {
        app.models.eventRegistrationAttendee.set('country', 'AU');
      }
      if (_.isEmpty(app.models.eventRegistrationPayer.get('ircountry'))) {
        app.models.eventRegistrationPayer.set('ircountry', 'AU');
      }
    }
  });

  app.models.eventRegistrationPayer.on("change:irattention", function(model, fullName) {
    if (!_.isEmpty(fullName)) {
      var matchedBSUser = app.collections.bsUsers.find(function(bsUser) {
        return bsUser.get('irattention').toLowerCase() === fullName.toLowerCase();
      });
      if (!_.isUndefined(matchedBSUser)) {
        app.models.eventRegistrationAttendee.set('id', matchedBSUser.id);
      }
    }
  });

  app.pattern = app.pattern || {};
  app.pattern.email = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  app.models.eventRegistrationAttendee.on('change', function(model) {
    if (app.models.event.get('number') > 0 && !_.isEmpty(model.get('email')) && app.pattern.email.test(model.get('email'))) {
      var postData = model.toJSON();
      postData.attendDay1 = app.models.eventRegistration.get('attendDay1');
      postData.attendDay2 = app.models.eventRegistration.get('attendDay2');
      postData.eventNumber = app.models.event.get('number');
      postData.agreed = app.viewModels.eventRegistration.isAgreed();
      app.models.eventRegistration.backup(postData);
    }
  });

  app.models.dcUser.once('sync', function(model) {
    if (model.get('id') > 0) {
      app.collections.bsUsers.fetchByEmail(model.get('email')).done(function(data) {
        var attendeeData = {};
        attendeeData.email = model.get('email');
        if (!_.isEmpty(data)) {
          // Use the payer info which is from the same person if it exists
          var defaultBSUser = app.collections.bsUsers.find(function(bsUser) {
            return bsUser.getFullName().toLowerCase() === bsUser.get('irattention').toLowerCase();
          });
          // Otherwise, use the latest one instead
          if (_.isUndefined(defaultBSUser)) {
            defaultBSUser = app.collections.bsUsers.at(0);
          }

          var payerData = {};
          payerData.irattention = defaultBSUser.get('irattention');
          payerData.iraddress1 = defaultBSUser.get('iraddress1');
          payerData.iraddress2 = defaultBSUser.get('iraddress2');
          payerData.irsuburb = defaultBSUser.get('irsuburb');
          payerData.irpostcode = defaultBSUser.get('irpostcode');
          // Map loose format state code back to 2 digit code
          payerData.irstate = _.invert(app.collections.states.auStateMapping)[defaultBSUser.get('irstate')];
          payerData.ircountry = defaultBSUser.get('ircountry');
          app.models.eventRegistrationPayer.set(payerData);

        }
        attendeeData.firstname = model.get('firstname');
        attendeeData.surname = model.get('lastname');
        attendeeData.mobile = model.get('mobile');
        attendeeData.workplace = model.get('organisation');
        attendeeData.department = model.get('department');
        attendeeData.position = model.get('position');
        attendeeData.address1 = model.get('street1');
        attendeeData.address2 = model.get('street2');
        attendeeData.suburb = model.get('city');
        attendeeData.postcode = model.get('postcode');
        attendeeData.state = model.get('state');

        app.collections.countries.deferred.done(function() {
          var isoAlpha2 = app.collections.countries.get2CodeBy3Code(model.get('country'));
          app.models.eventRegistrationAttendee.set('country', isoAlpha2);
        });
        app.models.eventRegistrationAttendee.set(attendeeData);
        app.models.eventRegistrationAttendee.checkDuplicatedRecord().done(function(data) {
          if (data.isDuplicated === true) {
            app.viewModels.eventRegistration.attendee().isDuplicated(true);
          }
        });
      });
    } else {
      if (backupFormId > 0) {
        app.models.eventRegistration.restore(backupFormId).done(function(resp) {
          // Restore the view model part which is not directly related to the model
          if (resp.attendDay1 === true && resp.attendDay2 === true) {
            app.viewModels.eventRegistration.attendanceDay(3);
          } else {
            if (resp.attendDay1 === true) {
              app.viewModels.eventRegistration.attendanceDay(1);
            } else if (resp.attendDay2 === true) {
              app.viewModels.eventRegistration.attendanceDay(2);
            }
          }
          app.viewModels.eventRegistration.isAgreed(resp.agreed);
        });
      }
    }
  });

  app.models.dcUser.deferred = app.models.dcUser.fetch({
	  cache:false
  });

  app.viewModels.eventRegistration.isShowRegisterButton = ko.observable();

  $(function() {

    app.models.event.deferred.done(function() {
      if (moment() > moment(app.models.event.get('startDate'))) {
        $('#event-registration-form-wrapper').hide();
        $('#event-registration-closed-wrapper').show();
      }
    });

    app.viewModels.eventRegistration.paymentRetry = 0;

    // Override the view model method for this specific scenario
    app.viewModels.eventRegistration.submitPayment = function() {
      return app.models.eventRegistration.submitPayment().done(function() {
        if (app.models.eventRegistration.isTransactionCompleted()) {
          app.models.eventRegistration.sendInvoice(app.models.eventRegistration.get('groupRegistrationId'));
          $('#btn-open-payment-modal').button('complete').prop('disabled', true);
          $('#payRegistrationModal').modal('hide');
        } else {
          app.models.eventRegistration.set('paymentStatus', 'error');
          app.viewModels.eventRegistration.paymentRetry++;
          _gaq.push([ '_trackEvent', 'Event Registration', 'Failed to pay' ]);
        }
      }).fail(function(jqXHR, textStatus, errorThrown) {
        app.models.eventRegistration.set('paymentStatus', 'error');
        app.viewModels.eventRegistration.paymentRetry++;
        _gaq.push([ '_trackEvent', 'Event Registration', 'Failed to pay', textStatus + ' - ' + errorThrown ]);
      }).always(function() {
        $('#btn-pay-registration').button('reset');
      });
    };

    app.models.unknownErrorNotification = new app.Models.ErrorNotification({
      text : 'Unknown error. Please try again or contact us.',
      delay : 10000
    });
    app.models.setReminderEmailSuccessNotification = new app.Models.SuccessNotification({
      text : 'Thank you, your reminders have been scheduled.'
    });
    app.models.setReminderEmailErrorNotification = new app.Models.ErrorNotification({
      text : 'Failed to schedule the reminder email.'
    });

    $.validator.addMethod("minMonth", function(value, element) {
      var minMonth = 0;
      if (app.models.creditcard.get('expiryYear') == moment().year()) {
        minMonth = moment().month();
      }
      return this.optional(element) || value > minMonth;
    }, "This month is past, please select a valid month.");

    $("#event-registration-form").validate({
      rules : {
        // attend2days : {
        // required : function(element) {
        // return !$("#event-registration-form input[name='attendDay1']").is(':checked') && !$("#event-registration-form input[name='attendDay2']").is(':checked');
        // }
        // },
        attendanceDay : {
          required : true,
          min: 1
        },
        firstname : "required",
        lastname : "required",
        email : {
          required : true,
          email : true
        // remote : baseurl + "index.php?option=com_account&task=ajax_check_available_email"
        },
        mobile : "required",
        street1 : "required",
        city : "required",
        postcode : "required",
        terms : "required"
      },
      ignore : "",
      errorElement : "div",
      errorClass : "alert alert-danger",
      errorPlacement : function(error, element) {
        if (element.parent().hasClass('input-group')) {
          error.insertAfter(element.parent('.input-group'));
        } else if (element.attr("type") === "checkbox") {
          error.insertAfter(element.closest(".checkbox"));
        } else {
          error.appendTo(element.parent());
        }
      },
      messages : {
        attendanceDay : "Please select to attend both days or choose a single day",
        firstname : "Please enter your first name",
        lastname : "Please enter your last name",
        email : {
          required : "Please enter your email address",
          remote : "You already have a profile, please login to manage your details instead."
        },
        mobile : "Please enter your mobile",
        street1 : "Please enter your street",
        city : "Please enter your suburb or city",
        postcode : "Please enter your postcode",
        terms : "Please accept the terms and conditions"
      },
      highlight : function(element, errorClass, validClass) {
        /* jshint unused:false */
        $(element).closest(".form-group").removeClass("has-success").addClass("has-error");
        $(element).siblings('.form-control-feedback').removeClass('glyphicon-ok').addClass('glyphicon-remove');
      },
      unhighlight : function(element, errorClass, validClass) {
        /* jshint unused:false */
        $(element).closest(".form-group").removeClass("has-error").addClass("has-success");
        $(element).siblings('.form-control-feedback').removeClass('glyphicon-remove').addClass('glyphicon-ok');
      },
      invalidHandler : function(event, validator) {
        /* jshint unused:false */
        _gaq.push([ '_trackEvent', 'Event Registration', 'Failed to validate form', validator.errorList[0].element.name + " - " + validator.errorList[0].message ]);
        // TODO remove following legacy tracking code
        if (validator.errorList[0].element.name === 'attendanceDay') {
          _gaq.push([ '_trackEvent', 'Conference', 'Failed to Enter Account Details', 'Day(s)' ]);
        } else if (validator.errorList[0].element.name === 'email') {
          _gaq.push([ '_trackEvent', 'Conference', 'Failed to Enter Account Details', 'Email' ]);
        } else if (validator.errorList[0].element.name === 'firstname') {
          _gaq.push([ '_trackEvent', 'Conference', 'Failed to Enter Account Details', 'First Name' ]);
        } else if (validator.errorList[0].element.name === 'lastname') {
          _gaq.push([ '_trackEvent', 'Conference', 'Failed to Enter Account Details', 'Last Name' ]);
        } else if (validator.errorList[0].element.name === 'mobile') {
          _gaq.push([ '_trackEvent', 'Conference', 'Failed to Enter Account Details', 'Mobile' ]);
        } else if (validator.errorList[0].element.name === 'street1') {
          _gaq.push([ '_trackEvent', 'Conference', 'Failed to Enter Account Details', 'Address' ]);
        } else if (validator.errorList[0].element.name === 'city') {
          _gaq.push([ '_trackEvent', 'Conference', 'Failed to Enter Account Details', 'Suburb' ]);
        } else if (validator.errorList[0].element.name === 'postcode') {
          _gaq.push([ '_trackEvent', 'Conference', 'Failed to Enter Account Details', 'Postcode' ]);
        } else if (validator.errorList[0].element.name === 'terms') {
          _gaq.push([ '_trackEvent', 'Conference', 'Failed to Enter Account Details', 'Terms' ]);
        }
      },
      submitHandler : function() {
        $('#btn-register-event').button('loading');
        app.models.eventRegistration.register().done(function(data) {
          if (data.result === 'success') {
            // TODO should use view model to deal with hiding and showing
            $('#event-registration-form-wrapper').hide();
            window.scrollTo(0, 0);
            $('#event-registration-confirmation-wrapper').fadeIn();
            _gaq.push([ '_trackEvent', 'Event Registration', 'Registered', app.models.event.get('title') ]);
            var transactionId = 'ACO' + app.models.eventRegistration.get('id') + '-' + app.models.event.get('number');
            _gaq.push([ '_addTrans', transactionId, 'Ausmed Education', app.viewModels.eventRegistration.totalPriceWithFee(), (app.viewModels.eventRegistration.totalPriceWithFee() / 11).toFixed(2), '', app.models.eventRegistrationAttendee.get('suburb'), app.models.eventRegistrationAttendee.auStateMapping[app.models.eventRegistrationAttendee.get('state')], 'Australia' ]);
            _gaq.push([ '_addItem', transactionId, app.models.event.get('title'), 'invoice-' + app.models.event.get('title'), 'Conference', app.viewModels.eventRegistration.totalPriceWithFee(), '1' ]);
            _gaq.push([ '_trackTrans' ]);
            _gaq.push([ '_trackEvent', 'Conference', 'Registered Conference', app.models.event.get('title'), parseInt(app.viewModels.eventRegistration.totalPriceWithFee(), 10) ]);
          } else if (data.result === 'fail') {
            // TODO handle different fail message here
            $('#duplicatedRegistrationModal').modal({
              backdrop : 'static',
              show : true
            });
            $('#btn-register-event').button('reset');
          } else {
            $.pnotify(app.models.unknownErrorNotification.toJSON());
            $('#btn-register-event').button('reset');
            _gaq.push([ '_trackEvent', 'Event Registration', 'Failed to register', 'Unknown' ]);
          }
        }).fail(function(jqXHR, textStatus, errorThrown) {
          /* jshint unused:false */
          $.pnotify(app.models.unknownErrorNotification.toJSON());
          $('#btn-register-event').button('reset');
          _gaq.push([ '_trackEvent', 'Event Registration', 'Failed to register', textStatus + ' - ' + errorThrown ]);
        });
        _gaq.push([ '_trackEvent', 'Event Registration', 'Submit the registration form' ]);
        var userStatus;
        if (app.models.dcUser.id > 0) {
          userStatus = 'Existing User - Without Membership';
        } else {
          userStatus = 'Guest - Without Membership';
        }
        _gaq.push([ '_trackEvent', 'Conference', 'Attempt to Register Conference', 'CID: ' + app.models.event.get('number') + ' - ' + userStatus, parseInt(app.viewModels.eventRegistration.totalPriceWithFee(), 10) ]);
        return false;
      }
    });

    // Show the "Register" button once the registration form has been setup
    app.viewModels.eventRegistration.isShowRegisterButton(true);

    $("#form-pay-registration").validate({
      rules : {
        number : {
          required : true,
          creditcard : true
        },
        holdersName : "required",
        expiryMonth : {
          required : true,
          minMonth : true
        },
        expiryYear : "required",
        cvn : "required"
      },
      errorElement : "div",
      errorClass : "alert alert-danger",
      errorPlacement : function(error, element) {
        if (element.attr("type") === "checkbox") {
          error.insertAfter(element.closest(".checkbox"));
        }
        if (element.attr("name") === "expiryMonth" || element.attr("name") === "expiryYear") {
          error.appendTo(element.closest('.form-inline'));
        } else {
          error.appendTo(element.parent());
        }
      },
      messages : {
        number : {
          required : "Card number is missing",
          creditcard : "Please enter a valid credit card number",
        },
        holdersName : "Card Holder's Name is missing",
        expiryMonth : {
          required : "Please select the expiry month of your card",
          minMonth : "This month is past, please select a valid month."
        },
        expiryYear : "Please select the expiry year of your card"
      },
      highlight : function(element, errorClass, validClass) {
        /* jshint unused:false */
        $(element).closest(".form-group").removeClass("has-success").addClass("has-error");
      },
      unhighlight : function(element, errorClass, validClass) {
        /* jshint unused:false */
        $(element).closest(".form-group").removeClass("has-error").addClass("has-success");
      },
      invalidHandler : function(event, validator) {
        /* jshint unused:false */
        _gaq.push([ '_trackEvent', 'Event Registration', 'Failed to validate credit card', validator.errorList[0].element.name + " - " + validator.errorList[0].message ]);
      },
      submitHandler : function(form) {
        $('#btn-pay-registration').button('loading');
        if (app.viewModels.eventRegistration.paymentRetry <= 0) {
          app.viewModels.eventRegistration.submitPayment().done(function() {
            _gaq.push([ '_trackEvent', 'Event Registration', 'Paid', 'EID: ' + app.models.event.id ]);
            _gaq.push([ '_trackEvent', 'Conference', 'Paid Conference', app.models.event.get('title'), parseInt(app.viewModels.eventRegistration.totalPriceWithFee(), 10) ]);
          }).fail(function(jqXHR, textStatus, errorThrown) {
            /* jshint unused:false */
            _gaq.push([ '_trackEvent', 'Event Registration', 'Failed to pay', textStatus + ' - ' + errorThrown ]);
          });
          _gaq.push([ '_trackEvent', 'Event Registration', 'Submit the payment form' ]);
        } else {
          // Re-submit the payment if there is no success response
          // Re-fetch the current event registration data to check the payment status before re-submitting
          app.models.eventRegistration.fetch({
            success : function(model) {
              if (model.get('amountPaid') < model.get('amountCost')) {
                app.viewModels.eventRegistration.submitPayment().done(function() {
                  _gaq.push([ '_trackEvent', 'Event Registration', 'Paid', 'EID: ' + app.models.event.id ]);
                  _gaq.push([ '_trackEvent', 'Conference', 'Paid Conference', app.models.event.get('title'), parseInt(app.viewModels.eventRegistration.totalPriceWithFee(), 10) ]);
                }).fail(function() {
                  /* jshint unused:false */
                  _gaq.push([ '_trackEvent', 'Event Registration', 'Failed to pay', textStatus + ' - ' + errorThrown ]);
                });
              } else {
                $('#btn-open-payment-modal').button('complete').prop('disabled', true);
                $('#payRegistrationModal').modal('hide');
                $('#btn-pay-registration').button('reset');
              }
            }
          });
          _gaq.push([ '_trackEvent', 'Event Registration', 'Re-submit the payment form' ]);
        }

        return false;
      }
    });

    $("#form-email-reminder").validate({
      rules : {
        email : {
          required : true,
          email : true
        }
      },
      ignore : "",
      errorElement : "div",
      errorClass : "alert alert-danger",
      errorPlacement : function(error, element) {
        error.appendTo(element.parent());
      },
      messages : {
        email : {
          required : "Please enter your email address"
        }
      },
      highlight : function(element, errorClass, validClass) {
        /* jshint unused:false */
        $(element).closest(".form-group").removeClass("has-success").addClass("has-error");
        $(element).siblings('.form-control-feedback').removeClass('glyphicon-ok').addClass('glyphicon-remove');
      },
      unhighlight : function(element, errorClass, validClass) {
        /* jshint unused:false */
        $(element).closest(".form-group").removeClass("has-error").addClass("has-success");
        $(element).siblings('.form-control-feedback').removeClass('glyphicon-remove').addClass('glyphicon-ok');
      },
      invalidHandler : function(event, validator) {
        /* jshint unused:false */
        _gaq.push([ '_trackEvent', 'Event Registration', 'Failed to validate email for reminder', validator.errorList[0].element.name + " - " + validator.errorList[0].message ]);
      },
      submitHandler : function(form) {
        var email = $(form).find('input[name="email"]').val();
        $('#btn-set-reminder').button('loading');
        _gaq.push([ '_trackEvent', 'Event Registration', 'Confirm reminder email' ]);
        app.models.eventRegistration.setEmailReminder(email).done(function() {
          $('#emailReminderModal').modal('hide');
          $.pnotify(app.models.setReminderEmailSuccessNotification.toJSON());
          _gaq.push([ '_trackEvent', 'Event Registration', 'Set reminder email successfully' ]);
        }).fail(function(jqXHR, textStatus, errorThrown) {
          $.pnotify(app.models.setReminderEmailErrorNotification.toJSON());
          _gaq.push([ '_trackEvent', 'Event Registration', 'Failed to set reminder email', textStatus + ' - ' + errorThrown ]);
        }).always(function() {
          $('#btn-set-reminder').button('reset');
        });
        return false;
      }
    });

    // Extend the view model subscription for DOM manipulation
    app.viewModels.eventRegistration.attendee().isContinueWithDuplication.subscribe(function(value) {
      if (value) {
        _gaq.push([ '_trackEvent', 'Event Registration', 'Continue with duplicated customer records' ]);
      }
    });
    app.viewModels.eventRegistration.attendee().isShowDuplicatedCustomerModal.subscribe(function(value) {
      if (value === true) {
        $('#duplicatedCustomerModal').modal({
          backdrop : 'static',
          show : true
        });
        _gaq.push([ '_trackEvent', 'Event Registration', 'Show duplicated customer modal' ]);
      }
    });
    app.viewModels.eventRegistration.attendee().isShowAdditionalDetails.subscribe(function(value) {
      if (value === true) {
        _gaq.push([ '_trackEvent', 'Event Registration', 'Show additional basic details' ]);
      } else {
        _gaq.push([ '_trackEvent', 'Event Registration', 'Hide additional basic details' ]);
      }
    });
    app.viewModels.eventRegistration.isShowPayerSection.subscribe(function(value) {
      if (value === true) {
        _gaq.push([ '_trackEvent', 'Event Registration', 'Show payer details' ]);
      } else {
        _gaq.push([ '_trackEvent', 'Event Registration', 'Hide payer details' ]);
      }
    });

    $('#emailReminderModal').on('show.bs.modal', function() {
      _gaq.push([ '_trackEvent', 'Event Registration', 'Show reminder email modal' ]);
    });

    $('#duplicatedRegistrationModal').on('show.bs.modal', function() {
      _gaq.push([ '_trackEvent', 'Event Registration', 'Show duplicated registration modal' ]);
    });

    _gaq.push([ '_setCustomVar', 3, 'event-registration', 2, 3 ]);
  });
})(jQuery);
