/* global _, ko, kb, moment, _gaq */
(function ($) {

    app.ViewModels.User = kb.ViewModel.extend({
        constructor: function (model) {
            kb.ViewModel.prototype.constructor.apply(this, arguments);
            var self = this;
            this.fullAddress = ko.computed(function () {
                var fullAddress = "";
                fullAddress = this.street1() + ', ' + this.city() + ' ' + this.postcode();
                return fullAddress;
            }, this);
        }
    });

    app.ViewModels.Event = kb.ViewModel.extend({
        constructor: function (model, options) {
            kb.ViewModel.prototype.constructor.apply(this, arguments);
            var self = this;
        }
    });

    app.ViewModels.EventRegistration = kb.ViewModel.extend({
        constructor: function (model, options) {
            kb.ViewModel.prototype.constructor.call(this, model, {
                factories: {
                    'user': app.ViewModels.User,
                    'event': app.ViewModels.Event
                },
                options: options
            });
            var self = this;
            self.isAgreed = ko.observable(false);
            self.onStep = ko.observable(1);
            self.selectTab = function (step) {
                self.onStep(step);
                window.scrollTo(0, 0);
            };
            self.goToStep = function (step) {
                self.onStep(step);
                window.scrollTo(0, 0);
            };
        }
    });

    // Custom Animation Bindings
    ko.bindingHandlers.slideVisible = {
        update: function (element, valueAccessor, allBindings) {
            var value = valueAccessor();
            var valueUnwrapped = ko.unwrap(value);
            var duration = allBindings.get('slideDuration') || 400;
            if (valueUnwrapped === true)
                $(element).slideDown(duration);
            else
                $(element).slideUp(duration);
        }
    };

})(jQuery);
