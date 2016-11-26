/**
 * Created by Daniel on 3/5/2016.
 */
var express = require('express');
var router = express.Router();
var Contestant = require('../models/contestant');
var Counter = require('../models/counter');
var PointHelper = require('./point-helper');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// sample api route
router.route('')
    //create
    .post(function(req, res){

        if(!req.isAdmin){
            return res.status(403).send({
                 success: false,
                 message: 'No token provided'
             });
        }

        var contestant = new Contestant();
        Counter.increment("contestant", function(err, result){
            contestant._id = result.value.seq;
            contestant.firstName = req.body.firstName;
            contestant.lastName = req.body.lastName;
            contestant.tribe  = req.body.tribe;
            contestant.eliminated  = req.body.eliminated;
            contestant.imageName  = req.body.imageName;
            contestant.pickedBy = req.body.pickedBy;
            contestant.save(function(err){
                if(err) {
                    res.send(err);
                    return;
                }
                console.log(contestant);
                res.json(contestant);
            });
        });
    })
    // list
    .get(function(req, res){
        Contestant.find().populate('tribe').exec(function(err, contestants){
            if(err) {
                res.send(err);
                return;
            }
            else {
                res.json(contestants);
            }
        });
    });

router.route('/:contestant_id')
    // select one
    .get(function(req, res){
        var results = {};

        Contestant.findById(req.params.contestant_id).populate('pickedBy', 'firstName lastName').populate('tribe').exec(function(err, contestant){
            if(err) {
                res.send(err);
                return;
            }
            PointHelper.getContestantRank(contestant._id).then(function(rank){
                contestant._doc.rank = rank;
                res.json(contestant);
            });
        });
    })
    // update
    .put(function(req, res){

        if(!req.isAdmin){
            return res.status(403).send({
                 success: false,
                 message: 'No token provided'
             });
        }

        Contestant.findById(req.params.contestant_id, function(err, contestant){
            if(err) {
                res.send(err);
                return;
            }
            contestant.firstName = req.body.firstName;
            contestant.lastName = req.body.lastName;
            contestant.tribe  = req.body.tribe;
            contestant.eliminated  = req.body.eliminated;
            contestant.imageName  = req.body.imageName;
            contestant.pickedBy = req.body.pickedBy;

            contestant.save(function(err){
                if(err) {
                    res.send(err)
                    return;
                }
                res.send(true);
            });
        });
    })
    // delete
    .delete(function(req, res){

        if(!req.isAdmin){
            return res.status(403).send({
                 success: false,
                 message: 'No token provided'
             });
        }

        Contestant.remove({
            _id: req.params.contestant_id
        }, function(err, contestant){
            if(err) {
                res.send(err);
                return;
            }
            res.send(true);
        });
    });

module.exports = router;