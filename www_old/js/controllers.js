angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('searchCtrl', function($scope, $ionicPopup, $ionicActionSheet, $cordovaCamera) {
    $scope.clickMe = function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
                correctOrientation:true
          };

          $cordovaCamera.getPicture(options).then(function(imageData) {
              $scope.src = "data:image/jpeg;base64," +imageData;
              console.log(imageData);
//             $scope.image = document.getElementById('myImage');
//            $scope.image.src = "data:image/jpeg;base64," + imageData;
          }, function(err) {
            // error
          });

//  }, false);
//        $ionicActionSheet.show({
//            titleText: 'ActionSheet Example',
//            buttons: [
//              { text: '<i class="icon ion-share"></i> Share' },
//              { text: '<i class="icon ion-arrow-move"></i> Move' },
//            ],
//            destructiveText: 'Delete',
//            cancelText: 'Cancel',
//            cancel: function() {
//              console.log('CANCELLED');
//            },
//            buttonClicked: function(index) {
//              console.log('BUTTON CLICKED', index);
//              return true;
//            },
//            destructiveButtonClicked: function() {
//              console.log('DESTRUCT');
//              return true;
//            }
//          });
//        var alertPopup = $ionicPopup.alert({
//            title: 'Dont eat that!',
//            template: 'It might taste good'
//          });
//          alertPopup.then(function(res) {
//            console.log('Thank you for not eating my delicious ice cream cone');
//          });
    };
})
;
