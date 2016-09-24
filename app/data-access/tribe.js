var express = require('express');
var router = express.Router();
var Tribe = require('../models/tribe');
var Counter = require('../models/counter');
var mongoose = require('mongoose');

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

        var tribe = new Tribe();
        Counter.increment("tribe", function(err, result){
            tribe._id = result.value.seq;
            tribe.name = req.body.name;
            tribe.league = req.body.league;
            tribe.save(function(err){
                if(err) {
                    res.send(err);
                    return;
                }
                console.log(tribe);
                res.json(tribe);
            });
        });
    })
    // list
    .get(function(req, res){
        Tribe.find(function(err, tribes){
            if(err) {
                res.send(err);
                return;
            }
            res.json(tribes);
        });
    });

router.route('/:tribe_id')
    // select one
    .get(function(req, res){
        var results = {};

        Tribe.findById(req.params.tribe_id, function(err, leauge){
            if(err) {
                res.send(err);
                return;
            }
            res.json(leauge);
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

        Tribe.findById(req.params.tribe_id, function(err, tribe){
            if(err) {
                res.send(err);
                return;
            }
            tribe.name = req.body.name;
            tribe.league = req.body.league;

            tribe.save(function(err){
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

        Tribe.remove({
            _id: req.params.tribe_id
        }, function(err, leauge){
            if(err) {
                res.send(err);
                return;
            }
            res.send(true);
        });
    });

module.exports = router;