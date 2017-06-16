   // Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers','ngCordova'])

.run(function($ionicPlatform,$cordovaSQLite) {
  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    cordova.plugins.diagnostic.isLocationEnabled(successCallback, errorCallback);
    function successCallback(res){
      console.log("Location is " + (res ? "Enabled" : "not Enabled"));
      !res ? cordova.plugins.diagnostic.switchToLocationSettings() : '';
    }
    
      
    function errorCallback(err){
      console.log("Error: "+JSON.stringify(err));
    }
    
      db = $cordovaSQLite.openDB({name:"my.db",location:'default'});
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, lat text, long text , date text, status integer)");
      $ionicPlatform.registerBackButtonAction(function(){
  navigator.app.exitApp();
}, 100);
  });
})


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'template/login.html',
    controller:'LoginCtrl' 
  })
   .state('history', {

    url: '/history',
    templateUrl: 'template/history.html',
    controller: 'historyCtrl'
  })
  // if none of the above states are matched, use this as the fallback
  var userAPIKey = localStorage.getItem("userAPIKey");
  var state = "login";
  if(userAPIKey) {
     state = "history";
  }
  $urlRouterProvider.otherwise('/'+state);

});
