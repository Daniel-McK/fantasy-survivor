var app = angular.module('SrvvrApp', ['ngMaterial', 'ui.router']);

app.config(["$mdThemingProvider", "$stateProvider", "$httpProvider", function($mdThemingProvider, $stateProvider, $httpProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('light-green')
        .accentPalette('amber');

    $stateProvider
        .state('dash',{
          url: "",
            views: {
                "header": {templateUrl: "/modules/dash/views/dash-header.html"},
                "main-content": {templateUrl: "/modules/dash/views/dash.html"}
            }
        })
        .state('users',{
            url: "/users",
            views: {
                "header": {templateUrl: "/modules/users/views/users-header.html"},
                "main-content": {templateUrl: "/modules/users/views/users.html"}
            }
        })
        .state('user', {
            url: "/user/:id",
            views: {
                "header": {templateUrl: "/modules/user/views/user-header.html"},
                "main-content": {templateUrl: "/modules/user/views/user.html"}
            }
        })
        .state('contestants',{
            url: "/contestants",
            views: {
                "header": {templateUrl: "/modules/contestants/views/contestants-header.html"},
                "main-content": {templateUrl: "/modules/contestants/views/contestants.html"}
            }
        })
        .state('contestant', {
            url: "/contestant/:id",
            views: {
                "header": {templateUrl: "/modules/contestant/views/contestant-header.html"},
                "main-content": {templateUrl: "/modules/contestant/views/contestant.html"}
            }
        })
        .state('episodes',{
            url: "/episodes",
            views: {
                "header": {templateUrl: "/modules/episodes/views/episodes-header.html"},
                "main-content": {templateUrl: "/modules/episodes/views/episodes.html"}
            }
        })
        .state('episode', {
            url: "/episode/:id",
            views: {
                "header": {templateUrl: "/modules/episode/views/episode-header.html"},
                "main-content": {templateUrl: "/modules/episode/views/episode.html"}
            }
        })
        .state('point', {
            url: "/add-point",
            views: {
                "header": {templateUrl: "/modules/point/views/point-header.html"},
                "main-content": {templateUrl: "/modules/point/views/point.html"}
            }
        })
        .state('un-authorized', {
            url: "/unauthorized",
            views: {
                "header": {templateUrl: "/modules/unauthorized/views/unauthorized-header.html"},
                "main-content": {templateUrl: "/modules/unauthorized/views/unauthorized.html"}
            }
        });

    var token = localStorage.token || "";
    $httpProvider.defaults.headers.common = {'Token' : token};

}]);

app.controller('SrvvrCtrl', ["$scope", "$mdSidenav", "navigationService", function($scope, $mdSidenav, navigationService){
    $scope.pageTitle = "AngularApp";

    navigationService.checkToken();

    $scope.navInfo = navigationService.navInfo;

    $scope.openNav = function(){
        $mdSidenav('left').open();
    };
    $scope.closeNav = function(){
        $mdSidenav('left').close();
    };


    $scope.login = function(){
        navigationService.login().then(function(results){

        });
    };
    $scope.logout = function(){
        navigationService.logout();
    };
}]);