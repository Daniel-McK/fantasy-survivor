angular.module("SrvvrApp").controller("PointCtrl", [
    "$scope",
    "$stateParams",
    "dataService",
    "$q",
    "$mdToast",
    function ($scope, $stateParams, dataService, $q, $mdToast) {

        var pointTypeName = "Point";
        var pointTypeTypeName = "Point-Type";
        var ContestantTypeName = "Contestant";
        var episodeTypeName = "Episode";
        
        $scope.getColors = function(contestant){
            var style = {};
            if(typeof(contestant.eliminated) !== "undefined"){
                style['opacity'] = "0";
            }
            if(contestant.tribe._id === 1){
                style['backgroundColor'] = "#F44336";
            }
            else if (contestant.tribe._id === 2) {
                style['backgroundColor'] = "#3F51B5";
            }
            else if (contestant.tribe._id === 3) {
                style['backgroundColor'] = "#4CAF50";
            }
            return style;
        }

        $scope.selectAll = function(tribeId){
            $scope.data.selected = [];
            skipCheck = tribeId === -1;
            for (var i = 0; i < $scope.data.contestants.length; i++){
                var contestant = $scope.data.contestants[i];
                if((skipCheck || contestant.tribe._id === tribeId) && angular.isUndefined(contestant.eliminated)){
                    $scope.data.selected.push(contestant._id);
                }
            }
        }

        $scope.isEliminated = function(contestant){
            return angular.isDefined(contestant.eliminated)
        }

        function getContestants() {
            return dataService.getRecords(ContestantTypeName)
                .then(function (results) {
                    $scope.data.contestants = results.data;
                });
        }

        function getPointTypes() {
            return dataService.getRecords(pointTypeTypeName)
                .then(function (results) {
                    $scope.data.pointTypes = results.data;
                });
        }

        function getEpisodes() {
            return dataService.getRecords(episodeTypeName)
                .then(function (results) {
                    $scope.data.episodes = results.data;
                });
        }

        // from  angular material demo
        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item._id);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item._id);
            }
        };
        $scope.exists = function (item, list) {
            return list.indexOf(item._id) > -1;
        };
        // end angular material demo

        $scope.addPoints = function(){
            $scope.saving = true;

            var saveParams = {
                contestants: $scope.data.selected,
                type: $scope.data.type._id,
                episode: $scope.data.episode._id
            }

            dataService.newRecord(pointTypeName, saveParams).then(function(){
                $scope.saving = false;
                $scope.data.selected = [];
                $mdToast.showSimple("Added");

            });
            $scope.saving = false;
        }

        function init() {
            $scope.loading = true;
            $scope.data = {};
            $scope.data.selected = [];
            var episodesPromise = getEpisodes();
            var pointTypesPromise = getPointTypes();
            var contestantsPromise = getContestants();
            $q.all([episodesPromise, pointTypesPromise, contestantsPromise]).then(function (results) {
                $scope.loading = false;
            });
        }

        init();
    }
]);