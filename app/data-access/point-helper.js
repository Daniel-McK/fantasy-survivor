var Point = require('../models/point');
var Contestant = require('../models/contestant');
var q = require('q');

function getContestantRank(contestantId){
    var deferred = q.defer();
    var data = {};
    getContestants()
        .then(function(results){
            data.contestants = results;
            return getPoints();
        })
        .then(function(results){
            data.points = results;
            var rank = parsePointsForRank(data.contestants, data.points, contestantId);
            deferred.resolve(rank);
        });
    return deferred.promise;

}
function getContestants (){
    var deferred = q.defer();
    Contestant.find().exec(function (err, contestants) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(contestants);
        }
    });
    return deferred.promise;
}
function getPoints (){
    var deferred = q.defer();
    Point.find().populate('contestant').populate('type').populate('episode').exec(function (err, points) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(points);
        }
    });
    return deferred.promise;
}


function parsePointsForRank(contestants, points, id){
    var contestantMap = {};
    var contestant;
    for(var i = 0; i < contestants.length; i++){
        contestant = contestants[i];
        contestant.points = 0;
        contestantMap[contestant._id] = contestant;
    }
    for (i = 0; i < points.length; i++){
        var point = points[i];
        contestantMap[point.contestant._id].points += point.type.amount;
    }
    contestants.sort(function(contestantA, contestantB){
        return contestantB.points - contestantA.points;
    });

    var previousAmount = contestants[0].points;
    var rank = 1;
    var backingRank = 1;

   if(contestants[0]._id === id){
       return 1;
   }


    for (i = 1; i < contestants.length; i++){
        contestant = contestants[i];
        backingRank++;
        if(contestant.points < previousAmount){
            rank = backingRank;
        }
        if(contestant._id === id){
            return rank;
        }
        previousAmount = contestant.points;
    }
    return -1;
}


module.exports = {
    getContestantRank: getContestantRank
};
