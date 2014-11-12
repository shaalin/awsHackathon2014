function showDefaultCarousel() {
    // alert('Calling the showDefaultCarousel function!');
}

var MatchingEngine = [];

//Backwards compatibility for logEvent & logConversion
MatchingEngine.logEvent = function (eventType,eventParameters) {
    var logEventCmd = ['logEvent',eventType];
    if(typeof(eventParameters) !== 'undefined') { logEventCmd.push(eventParameters);}
    this.push(logEventCmd);
}
MatchingEngine.logConversion = function (eventType,eventParameters) {
    var logEventCmd =['logEvent',eventType];
    var i;
    for(i=1; i < arguments.length; i++) {
       if(document.getElementById(arguments[i]) !== null) {
          logEventCmd.push(arguments[i]+ '=' + document.getElementById(arguments[i]).innerHTML);
       }
    }
    this.push(logEventCmd);
}
MatchingEngine.push(['setCustomerName','cancertypes']);

//Optional QA settings
//Force a timeout to test display-default logic
//MatchingEngine.push(['forceTimeout']);
//Enable debug logging to the browser console
//MatchingEngine.push(['enableConsole']);
//Custom handler to show original carousel on CM timeout
MatchingEngine.push(['setTimeoutHandler',showDefaultCarousel]);
MatchingEngine.push(['setup','race_hero_2012']);

//Start the asynchronous loading of the JS library
(function() {

    // alert(document.documentElement.clientWidth);

    if ( document.documentElement.clientWidth > 639 ) {
        var cacheBuster = Math.random() * 1000;
        var cmLibVersion = dctLibraryVersion;
        var cmLibUrl = ('https:' == document.location.protocol ? 'https://s-' : 'http://') + 'js.cogmatch.net/sm/' + cmLibVersion + '?rnd=' + cacheBuster;
        var cmLibEl = document.createElement('script');
        cmLibEl.type = 'text/javascript';
        cmLibEl.async = true;
        cmLibEl.src = cmLibUrl;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(cmLibEl, s);
    }
})();
