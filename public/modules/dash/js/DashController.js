angular.module("SrvvrApp").controller("DashCtrl", ["$scope", "dataService", "$state", function($scope, dataService, $state){
    
        var typeName = "Contestant";
        var pointTypeName = "Point";
        var userTypeName = "User";

        var colors = [
            "#F44336",
            "#2196F3",
            "#FF9800",
            "#673AB7"
        ];

        $scope.goToContestant = function(contestant){
            $state.go("contestant", {id: contestant._id});
        }   

        $scope.getColor = function(contestant){
            var style = {};
            if (angular.isDefined(contestant.eliminated)){
                style['backgroundColor'] = "#000000";
            }
            else if (contestant.tribe._id === 1){
                style['backgroundColor'] = "#F44336";
            }
            else if (contestant.tribe._id === 2){
                style['backgroundColor'] = "#3F51B5";
            }
            else if (contestant.tribe._id === 3){
                style['backgroundColor'] = "#4CAF50";
            }
            return style;
        }

        function getContestantsData (){
            return dataService.getRecords(typeName)
                .then(function (results) {
                    $scope.contestants = results.data;
                });
        }

        function getUsersData (){
            return dataService.getRecords(userTypeName)
                .then(function (results) {
                    $scope.users = results.data;
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
            var userMap = {};
            var contestantMap = {};
            for(i = 0; i < $scope.users.length; i++){
                var user = $scope.users[i];
                user.contestants = [];
                userMap[user._id] = user;
            }
            for (i = 0; i < $scope.contestants.length; i++){
                var contestant = $scope.contestants[i];
                contestant.points = 0;
                contestantMap[contestant._id] = contestant;
                if(userMap[contestant.pickedBy]){
                    userMap[contestant.pickedBy].contestants.push(contestant);
                }
            }
            for (i = 0; i < $scope.points.length; i++){
                var point = $scope.points[i];
                contestantMap[point.contestant._id].points += point.type.amount;
            }
            for (i = 0; i < $scope.users.length; i++){
                var points = 0;
                for(var j = 0; j < $scope.users[i].contestants.length; j++){
                    points += $scope.users[i].contestants[j].points;
                }
                $scope.users[i].points = points;
            }
            $scope.users.sort(function(userA, userB){
                return userB.points - userA.points;
            });

            var previousAmount = $scope.users[0].points;
            var rank = 1;
            var backingRank = 1;
            $scope.users[0].rank = rank;

            for (i = 1; i < $scope.users.length; i++){
                var user = $scope.users[i];
                backingRank++;
                if(user.points < previousAmount){
                    rank = backingRank;
                }
                previousAmount = user.points;
                user.rank = rank;
            }
        }

        function init(){
            $scope.loading = true;
            getContestantsData()
                .then(getUsersData)
                .then(getPoints);
        }

        init();
}]);