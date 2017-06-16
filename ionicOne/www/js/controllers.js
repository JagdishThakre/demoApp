angular.module('starter.controllers', [])

        .controller('LoginCtrl', function ($scope, $state, $http, $ionicLoading, $ionicPopup, $rootScope, $cordovaNetwork,$cordovaSQLite) {

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
                        
                            if (response) {
                                if (response.data.code == 200) {
                                    
                                    localStorage.setItem("userAPIKey", response.data.userAPIKey);
                                     var query = "SELECT * FROM people";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length == 0) {
                 

                                    
$http.get(historyUrl + "?userApiKey=" + localStorage.getItem("userAPIKey")).then(function (response) {
                $ionicLoading.hide();
                if (response.data.code == 200) {
        
                            for(var i=0; i<response.data.timeentries.length; i++){  
                                if((response.data.timeentries.length-12)< i){
                                console.log(response.data.timeentries[i].entrylat);
                                var e_lat=response.data.timeentries[i].entrylat;
                                 var e_long=response.data.timeentries[i].entrylon;
                                  var e_date=response.data.timeentries[i].entrydate;
                                 
                                
var query1 = "INSERT INTO people (lat, long, date, status) VALUES (?,?,?,?)";
        $cordovaSQLite.execute(db, query1, [e_lat,e_long,e_date, '1']).then(function(res1) {
            console.log("INSERT ID -> " + res1.insertId);
        if(i == (response.data.timeentries.length-1)){
            $ionicLoading.hide();
            $state.go('history');
        }
               
        }, function (err) {
            $ionicLoading.hide();
            console.error(err);
        });
               }
                            }      
                                    } 
                //console.log(JSON.stringify(response));
            });
             
   
            } else{
                $ionicLoading.hide();
        $state.go('history');
    }
        });                    
                                   
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
            };
        })

        .controller('historyCtrl', function ($scope, $state, $rootScope, $http, $ionicLoading, $ionicPopup, $cordovaGeolocation,$cordovaSQLite,$cordovaNetwork, $timeout) {
            
//                    function netCheck() {
//
//                    var isOnline = $cordovaNetwork.isOnline();
//
//                  // listen for Online event
//                    $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
//                        var onlineState = networkState;
//                    });
//
//                    return isOnline;
//                    //console.log("is"+ isOnline);
//            };
//             var check = netCheck();
 var check = true;
            $scope.results=[]; 
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
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;
                        console.log(lat + '   ' + long);
                    }, function (err) {
                        console.log(err);
                    });
  function d2(n) {
                if (n < 10)
                    return "0" + n;
                return n;
            };

                    console.log("check" + check);
                  
            var watchOptions = {timeout: 2000, enableHighAccuracy: false};
            var watch = $cordovaGeolocation.watchPosition(watchOptions);

            watch.then(
                    null,
                    function (err) {
                        console.log(err);
                    },
                    function (position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;
                        console.log(lat + '' + long);
                    }
            );

            watch.clearWatch();
            
            $ionicLoading.hide(); 
            
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
        
         var today1 = new Date(res.rows.item(i).date);
         var sHour =  d2(today1.getHours()) ;
           var sAMPM = "AM";

    var iHourCheck = parseInt(sHour);

    if (iHourCheck > 12) {
        sAMPM = "PM";
        sHour = iHourCheck - 12;
    }
    else if (iHourCheck === 0) {
        sHour = "12";
    }
        var newD1 =  d2(parseInt(today1.getMonth() + 1)) + "/" + d2(today1.getDate()) + "/" +today1.getFullYear() + " " + d2(today1.getHours()) + ":" + d2(today1.getMinutes()) + " " + sAMPM;
        
        $scope.results.push({date:newD1});
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
        }, 1000);

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

                   if (check == true) { 
        $timeout(function () {
       var query = "SELECT * FROM people where status = 2";
 
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
                 
    for(var i=0; i<res.rows.length; i++){ 
         console.log({userApiKey: localStorage.getItem("userAPIKey"), entrylat: res.rows.item(i).lat, entrylon: res.rows.item(i).long, entryDate: res.rows.item(i).date});
  $http.post(historyUrl, {userApiKey: localStorage.getItem("userAPIKey"), entrylat: res.rows.item(i).lat, entrylon: res.rows.item(i).long, entryDate: res.rows.item(i).date}).then(function (response) {
                                if (response.data.code == 200) {
    
   var query1 = "UPDATE people SET status=1 where status=2 ";
        $cordovaSQLite.execute(db, query1, []).then(function(res1) {
            console.log(res1);
        }      );
                  }
                                //console.log(JSON.stringify(response));
                           });
                             } 

            }
       
        });     }, 2000);
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
                            var lat = position.coords.latitude;
                            var long = position.coords.longitude;
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

                            if (check == true) {  
                            $http.post(historyUrl, {userApiKey: localStorage.getItem("userAPIKey"), entrylat: lat, entrylon: long, entryDate: newD}).then(function (response) {
                                if (response.data.code == 200) {
                                    
                                    
                                }
                                //console.log(JSON.stringify(response));
                         
                            });
                        }}, function (err) {
                            
                            console.log(err)
                        });
                        

            };
        });


