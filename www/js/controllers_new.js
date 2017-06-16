angular.module('starter.controllers', [])

        .controller('LoginCtrl', function ($scope, $state, $http, $ionicLoading, $ionicPopup, $rootScope, $cordovaNetwork) {

            function netCheck() {

                    var isOnline = $cordovaNetwork.isOnline()

                  // listen for Online event
                    $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                        var onlineState = networkState;
                    })

                    return isOnline;
                    //console.log("is"+ isOnline);
            }

            //netCheck();
            $scope.loginData = {};
            $scope.login = function (isValid) {
                if (isValid) {
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    var check = netCheck();
                    console.log("check" + check);
                    if (check == true) {
                        $http.get(loginUrl + "username=" + $scope.loginData.username + "&password=" + $scope.loginData.password).then(function (response) {
                            console.log(JSON.stringify(response));
                            if (response) {
                                if (response.data.code == 200) {
                                    $ionicLoading.hide();
                                    localStorage.setItem("userAPIKey", response.data.userAPIKey);
                                    $state.go('history');
                                } else {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Login Error',
                                        template: 'Incorrect user name or password.'
                                    });
                                }
                            } else {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Network Error',
                                    template: 'Network error.'
                                });
                            }
                        }, function (err) {
                            $ionicLoading.hide();
                            //console.log(err);
                            $ionicPopup.alert({
                                title: 'Login Error',
                                template: 'Incorrect user name or password.'
                            });
                        });
                    } else {
                        $ionicLoading.hide();
                        //console.log(err);
                        $ionicPopup.alert({
                            title: 'Network Error',
                            template: 'No internet connection.'
                        });
                    }
                }
            }
        })

        .controller('historyCtrl', function ($scope, $state, $stateParams, $http, $ionicLoading, $ionicPopup, $cordovaGeolocation,$cordovaSQLite,$timeout) {
       
                        
    
                    
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation
                    .getCurrentPosition(posOptions)

                    .then(function (position) {
                        var lat = position.coords.latitude
                        var long = position.coords.longitude
                        console.log(lat + '   ' + long)
                    }, function (err) {
                        console.log(err)
                    });

            var watchOptions = {timeout: 3000, enableHighAccuracy: false};
            var watch = $cordovaGeolocation.watchPosition(watchOptions);

            watch.then(
                    null,
                    function (err) {
                        console.log(err)
                    },
                    function (position) {
                        var lat = position.coords.latitude
                        var long = position.coords.longitude
                        console.log(lat + '' + long)
                    }
            );

            watch.clearWatch();
            $timeout(function () {
//            $http.get(historyUrl + "?userApiKey=" + localStorage.getItem("userAPIKey")).then(function (response) {
//               
//                if (response.data.code == 200) {
                    $scope.results=[]; 
//                    items.slice().reverse();
      var query = "SELECT * FROM people";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
                 
    for(var i=0; i<res.rows.length; i++){
        $scope.results.push({date:res.rows.item(i).date});
    } 
     console.log(JSON.stringify($scope.results));
    $scope.data= $scope.results;
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        }); 
        $ionicLoading.hide();
        }, 300);

                   // $scope.data = response.data.timeentries;
//                } else {
//                    $ionicPopup.alert({
//                        title: 'Error',
//                        template: 'Failed!'
//                    });
//                }
                //console.log(JSON.stringify(response));
//            }, function (error) {
//                $ionicLoading.hide();
//                console.log(error);
//                $ionicPopup.alert({
//                    title: 'Network Error',
//                    template: 'Please check internet coneection.'
//                });
//            });

            function d2(n) {
                if (n < 9)
                    return "0" + n;
                return n;
            }


            $scope.logout = function () {
                $ionicPopup.confirm({
                    title: 'Logout',
                    template: 'Are you sure you want to logout?'
                })
                        .then(function (result) {
                            if (result) {
//                    $ionicHistory.clearCache();
//                    $ionicHistory.clearHistory();
                                localStorage.setItem("userAPIKey", '');
                                $state.go('login');
                            }
                        });
            };

            $scope.AddHistory = function () {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
//                cordova.plugins.diagnostic.isLocationEnabled(successCallback, errorCallback);
//        function successCallback(res){
//      console.log("Location is " + (res ? "Enabled" : "not Enabled"));
//      !res ? cordova.plugins.diagnostic.switchToLocationSettings() : '';
//    }
                $cordovaGeolocation
                        .getCurrentPosition(posOptions)

                        .then(function (position) {
                            var lat = position.coords.latitude
                            var long = position.coords.longitude
                            var today = new Date();
                            var newD = today.getFullYear() + "-" + d2(parseInt(today.getMonth() + 1)) + "-" + d2(today.getDate()) + " " + d2(today.getHours()) + ":" + d2(today.getMinutes()) + ":" + d2(today.getSeconds());
                  
                                    
                                      var query = "INSERT INTO people (lat, long, date, status) VALUES (?,?,?,?)";
        $cordovaSQLite.execute(db, query, [lat, long, newD, '2']).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
        }, function (err) {
            console.error(err);
        });
                                    $ionicLoading.hide();
                                    $state.go($state.current, {}, {reload: true});
//                      $state.transitionTo($state.current, $stateParams, { 
//  reload: true, inherit: false, notify: true
//});
                           
                        }, function (err) {
                            
                            console.log(err)
                        });

            };
        });


