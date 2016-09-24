/**
 * Created by Daniel on 3/5/2016.
 */
var express = require('express');
var router = express.Router();
var PointType = require('../models/point-type');
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

        var pointtype = new PointType();
        Counter.increment("pointtype", function(err, result){
            pointtype._id = result.value.seq;
            pointtype.name = req.body.name;
            pointtype.amount = req.body.amount;
            pointtype.save(function(err){
                if(err) {
                    res.send(err);
                    return;
                }
                console.log(pointtype);
                res.json(pointtype);
            });
        });
    })
    // list
    .get(function(req, res){
        PointType.find(function(err, pointtypes){
            if(err) {
                res.send(err);
                return;
            }
            res.json(pointtypes);
        });
    });

router.route('/:pointtype_id')
    // select one
    .get(function(req, res){
        var results = {};

        PointType.findById(req.params.pointtype_id).populate('tribe').exec(function(err, pointtype){
            if(err) {
                res.send(err);
                return;
            }
            res.json(pointtype);
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

        PointType.findById(req.params.pointtype_id, function(err, pointtype){
            if(err) {
                res.send(err);
                return;
            }
            pointtype.name = req.body.name;
            pointtype.amount = req.body.amount;

            pointtype.save(function(err){
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

        PointType.remove({
            _id: req.params.pointtype_id
        }, function(err, pointtype){
            if(err) {
                res.send(err);
                return;
            }
            res.send(true);
        });
    });

module.exports = router;