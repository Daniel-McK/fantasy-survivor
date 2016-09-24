/**
* Created by Daniel on 3/5/2016.
*/
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var db = require('../../config/db');
var jwt = require("jsonwebtoken");


module.exports = function(app) {

    // sample api route
    router.route('/login')

        .post(function (req, res) {
            User.findOne({
                userName: req.body.userName
            }, function (err, user) {
                if (err) throw err;

                // user exists
                if (!user) {
                    res.json({success: false, message: "Authentication failed."});
                    return;
                }

                //password matches
                if (user.password != req.body.password) {
                    res.json({success: false, message: "Authentication failed."});
                    return;
                }

                // Lookup user states

                var simplifiedUser = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userName: user.userName,
                    id: user._id,
                    admin: user.admin
                };

                var payloadObject = {
                    user: simplifiedUser
                };

                var nav = [];

                var maxAgeInSeconds = 24 * 60  * 60;

                var token = jwt.sign(payloadObject, db.secret, {
                    expiresIn: maxAgeInSeconds
                });

                res.json({
                    success: true,
                    message: "Login was successful.",
                    token: token,
                    user: simplifiedUser,
                    nav: nav
                });
            });
        });

    router.route('/load')
        .get(function (req, res) {
            var token = req.headers.token;

            if (!token) {
                return res.send({
                    success: false,
                    message: 'No token provided'
                });
            }

            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err)
                    return res.json({success: false, message: "Failed to authenticate token"});

                res.json({success: true, user: decoded.user});
            });
        });


    return router;

};
