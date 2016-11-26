/**
 * Created by Daniel on 3/5/2016.
 */
var express = require('express');
var router = express.Router();
var Episode = require('../models/episode');
var Counter = require('../models/counter');
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

        var episode = new Episode();
        Counter.increment("episode", function(err, result){
            episode._id = result.value.seq;
            episode.number = req.body.number;
            episode.date = req.body.date;
            episode.league  = req.body.league;
            episode.save(function(err){
                if(err) {
                    res.send(err);
                    return;
                }
                console.log(episode);
                res.json(episode);
            });
        });
    })
    // list
    .get(function(req, res){
        Episode.find(function(err, episodes){
            if(err) {
                res.send(err);
                return;
            }
            res.json(episodes);
        });
    });

router.route('/:episode_id')
    // select one
    .get(function(req, res){
        var results = {};

        Episode.findById(req.params.episode_id).populate('tribe').exec(function(err, episode){
            if(err) {
                res.send(err);
                return;
            }
            res.json(episode);
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

        Episode.findById(req.params.episode_id, function(err, episode){
            if(err) {
                res.send(err);
                return;
            }
            episode.number = req.body.number;
            episode.date = req.body.date;
            episode.league  = req.body.league;

            episode.save(function(err){
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

        Episode.remove({
            _id: req.params.episode_id
        }, function(err, episode){
            if(err) {
                res.send(err);
                return;
            }
            res.send(true);
        });
    });

module.exports = router;