var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Counter = require('../models/counter');
var mongoose = require('mongoose');

// sample api route
router.route('')
    .get(function(req, res){

        if(!req.isAdmin){
            return res.status(403).send({
                 success: false,
                 message: 'No token provided'
             });
        }

        User.find(function(err, users){
            if(err) {
                res.send(err);
                return;
            }
            res.json(users);
        });
    });

module.exports = router;