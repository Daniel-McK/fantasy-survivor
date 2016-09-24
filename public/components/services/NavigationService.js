/**
 * Created by Daniel on 3/6/2016.
 */
angular.module('SrvvrApp').factory('navigationService',["$http", "dataService", "$mdDialog",
    function($http, dataService, $mdDialog){

        var service = {
            login: login,
            logout: logout,
            checkToken: checkToken,
            navInfo: {
                user: null,
                isLoggedIn: false,
                navLoaded: false,
                data: null
            }
        };

        function login(event) {
            $mdDialog.show({
                controller: LoginController,
                templateUrl: "/components/login/views/login-dialog.html",
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true
            }).then(function(results){
                dataService.login(results.userName, results.password)
                    .then(function(results){
                        service.navInfo.user = results.user;
                        service.navInfo.isLoggedIn = true;
                        loadNavigation();
                    });
                });
        }

        function logout (){
            dataService.logout();
            service.navInfo.isLoggedIn = false;
            service.navInfo.user = null;
        }

        function loadNavigation (){
            dataService.loadNavigation()
                .then(function(results){
                    service.navInfo.data = results;
                    service.navInfo.navLoaded = true;
                });
        }

        function checkToken(){
            dataService.checkToken()
                .then(function(results){
                    if(results.data.success){
                        service.navInfo.user = results.data.user;
                        service.navInfo.isLoggedIn = true;
                    }
                });
            loadNavigation();
        }

        function LoginController ($scope, $mdDialog){
            $scope.data = {};
            $scope.cancel = function(){
              $mdDialog.cancel();
            };
            $scope.login = function(userName, password){
                $mdDialog.hide({ userName: userName, password: password });
            }
        }

        return service;

    }]);