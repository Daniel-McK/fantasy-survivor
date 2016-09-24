angular.module("SrvvrApp").controller("ContestantsCtrl", [
    "$scope", 
    "$stateParams",  
    "dataService",
    "$q",
    function($scope, $stateParams, dataService, $q){
    
        var typeName = "Contestant";
        var pointTypeName = "Point";

        var colors = [
            "#F44336",
            "#2196F3",
            "#FF9800",
            "#673AB7"
        ];
        
        $scope.getColor = function(contestant){
            var style = {};
            if (angular.isDefined(contestant.eliminated)){
                style['backgroundColor'] = "000000";
            }
            else if (contestant.tribe._id % 2 === 1){
                style['backgroundColor'] = "#F44336";
            }
            else {
                style['backgroundColor'] = "#3F51B5";
            }
            return style;
        }

        function getContestantsData (){
            return dataService.getRecords(typeName)
                .then(function (results) {
                    $scope.contestants = results.data;
                });
        }

        function getPoints () {
            dataService.getRecords(pointTypeName)
                .then(function(results){
                    $scope.points = results.data;
                    parsePoints();
                    $scope.loading = false;
                });
        }
        
        $scope.getDescriptor = function(num){
            if (num > 3){
                return "th";
            }
            else if (num === 3){
                return "rd";
            }
            else if (num === 2){
                return "nd";
            }
            else if (num === 1){
                return "st";
            }
        }

        function parsePoints(){
            var contestantMap = {};
            for (var i = 0; i < $scope.contestants.length; i++){
                var contestant = $scope.contestants[i];
                contestant.points = 0;
                contestantMap[contestant._id] = contestant;
            }
            for (i = 0; i < $scope.points.length; i++){
                var point = $scope.points[i];
                contestantMap[point.contestant._id].points += point.type.amount;
            }
            $scope.contestants.sort(function(contestantA, contestantB){
                return contestantB.points - contestantA.points;
            });

            var previousAmount = $scope.contestants[0].points;
            var rank = 1;
            var backingRank = 1;
            $scope.contestants[0].rank = rank;

            for (i = 1; i < $scope.contestants.length; i++){
                var contestant = $scope.contestants[i];
                backingRank++;
                if(contestant.points < previousAmount){
                    rank = backingRank;
                }
                previousAmount = contestant.points;
                contestant.rank = rank;
            }
        }

        function init(){
            $scope.loading = true;
            getContestantsData()
                .then(getPoints);
        }

        init();
    }
]);