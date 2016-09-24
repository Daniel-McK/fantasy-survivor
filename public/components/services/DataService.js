angular.module('SrvvrApp').factory('dataService',
    [
        "$http",
        "$q",
        "$state",
        function ($http, $q, $state) {

            function deleteRecord(typeName, id) {
                var typeNameLower = typeName.toLowerCase();
                var promise = $http.delete("/api/" + typeNameLower + "/" + id);
                return promise;
            }

            function newRecord(typeName, parameters) {
                var typeNameLower = typeName.toLowerCase();
                var promise = $http.post("/api/" + typeNameLower, parameters);
                return promise.catch(catch403);
            }

            function getCustomData(url) {
                var promise = $http.get(url);
                return promise.catch(catch403);
            }

            function getRecords(typeName) {
                var typeNameLower = typeName.toLowerCase();
                var promise = $http.get("/api/" + typeNameLower);
                return promise.catch(catch403);
            }

            function getRecordById(typeName, id) {
                var typeNameLower = typeName.toLowerCase();
                var promise = $http.get("/api/" + typeNameLower + "/" + id);
                return promise.catch(catch403);
            }

            function login(userName, password) {
                var deferred = $q.defer();

                $http.post("/api/authentication/login", { userName: userName, password: password })
                    .then(function (results) {
                        if (results.data.success) {
                            localStorage.token = results.data.token;
                            deferred.resolve(results.data);
                        }
                        else
                            deferred.reject();
                    });

                return deferred.promise;
            }

            function logout() {
                localStorage.removeItem("token");
            }

            function checkToken() {
                return $http.get("/api/authentication/load");
            }

            function loadNavigation() {

                var nav = {};
                var deferred = $q.defer();

                /*var userPromise = getRecords("User")
                    .then(function(results){
                        nav.users = results;
                    });*/
                var contestantPromise = getRecords("Contestant")
                    .then(function (results) {
                        nav.contestants = results.data;
                    });
                /*var episodePromise = getRecords("Episode")
                    .then(function(results){
                        nav.episodes = results;
                    });*/

                $q.all([contestantPromise]).then(function () {
                    deferred.resolve(nav);
                },
                    function () {
                        deferred.reject();
                    });

                return deferred.promise;
            }

            function catch403(results) {
                $state.go("un-authorized");
                $q.reject(results);
            }

            var service = {
                newRecord: newRecord,
                deleteRecord: deleteRecord,
                getRecords: getRecords,
                getRecordById: getRecordById,
                login: login,
                logout: logout,
                checkToken: checkToken,
                loadNavigation: loadNavigation,
                getCustomData: getCustomData
            };

            return service;

        }]);