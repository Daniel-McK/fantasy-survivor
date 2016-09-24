/**
 * Created by Daniel on 3/5/2016.
 */
var express = require('express');
var router = express.Router();
var Point = require('../models/point');
var Counter = require('../models/counter');
var mongoose = require('mongoose');
var q = require('q');

var ObjectId = mongoose.Schema.Types.ObjectId;


function createPoint(contestant, type, episode, pointList, errorList) {
    var deferred = q.defer();
    var point = new Point();
    Counter.increment("point", function (err, result) {
        point._id = result.value.seq;
        point.contestant = contestant;
        point.type = type;
        point.episode = episode;
        point.save(function (err) {
            if (err) {
                errorList.push(err);
            }
            else {
                pointList.push(point);
            }
            deferred.resolve();
        });
    });
    return deferred.promise;
}

// sample api route
router.route('')
    //create
    .post(function (req, res) {

        if(!req.isAdmin){
            return res.status(403).send({
                 success: false,
                 message: 'No token provided'
             });
        }

        var type = req.body.type;
        var episode = req.body.episode;
        var promises = [];
        var errorList = [];
        var pointList = [];

        for (var i = 0; i < req.body.contestants.length; i++) {
            var contestantId = req.body.contestants[i];
            promises.push(createPoint(contestantId, type, episode, pointList, errorList));
        }
        q.all(promises).then(function () {
            res.send({ errors: errorList, points: pointList });
        });
    })
    // list
    .get(function (req, res) {
        Point.find().populate('contestant').populate('type').populate('episode').exec(function (err, points) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(points);
        });
    });

router.route('/by-contestant/:contestant_id')
    .get(function (req, res) {
        Point.find({ 'contestant': req.params.contestant_id }).populate('type').populate('episode').exec(function (err, points) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(points);
        });
    });

router.route('/:point_id')
    // select one
    .get(function (req, res) {
        var results = {};

        Point.findById(req.params.point_id).populate('contestant').populate('type').populate('episode').exec(function (err, point) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(point);
        });
    })
    // update
    .put(function (req, res) {

        if(!req.isAdmin){
            return res.status(403).send({
                 success: false,
                 message: 'No token provided'
             });
        }

        Point.findById(req.params.point_id, function (err, point) {
            if (err) {
                res.send(err);
                return;
            }
            point.contestant = req.body.contestant;
            point.type = req.body.type;
            point.episode = req.body.episode;

            point.save(function (err) {
                if (err) {
                    res.send(err)
                    return;
                }
                res.send(true);
            });
        });
    })
    // delete
    .delete(function (req, res) {

        if(!req.isAdmin){
            return res.status(403).send({
                 success: false,
                 message: 'No token provided'
             });
        }

        Point.remove({
            _id: req.params.point_id
        }, function (err, point) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(true);
        });
    });

module.exports = router;