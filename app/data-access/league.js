var express = require('express');
var router = express.Router();
var League = require('../models/league');
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

        var league = new League();
        Counter.increment("league", function(err, result){ 
            league._id = result.value.seq;
            league.name = req.body.name;
            league.save(function(err){
                if(err) {
                    res.send(err);
                    return;
                }
                console.log(league);
                res.json(league);
            });
        });
    })
    // list
    .get(function(req, res){
        League.find(function(err, leagues){
            if(err) {
                res.send(err);
                return;
            }
            res.json(leagues);
        });
    });

router.route('/:league_id')
    // select one
    .get(function(req, res){
        var results = {};

        League.findById(req.params.league_id, function(err, leauge){
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

        League.findById(req.params.league_id, function(err, league){
            if(err) {
                res.send(err);
                return;
            }
            league.name = req.body.name;

            league.save(function(err){
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

        League.remove({
            _id: req.params.league_id
        }, function(err, leauge){
            if(err) {
                res.send(err);
                return;
            }
            res.send(true);
        });
    });

module.exports = router;