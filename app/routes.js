// app/routes.js

var express = require('express');
var jwt = require("jsonwebtoken");

module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes


    var router = express.Router();

    var pointAccess = require('./data-access/point');
    var leagueAccess = require('./data-access/league');
    var tribeAccess = require('./data-access/tribe');
    var pointTypeAccess = require('./data-access/point-type');
    var contestantAccess = require('./data-access/contestant');
    var episodeAccess = require('./data-access/episode');
    var userAccess = require('./data-access/user');
    var authentication = require('./data-access/login')(app);

    // place before middleware
    router.use('/authentication', authentication);

    // sample api route
    router.use(function(req, res, next){

        var token = req.headers['token'];

        if(!token){
            req.isAdmin = false;
            next();
            return;
        }

        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if(err){
                req.isAdmin = false;
            }
            else {
                req.isAdmin = true;
                req.decoded = decoded;
            }
            next();
        });
    });

    router.use('/point', pointAccess);
    router.use('/league', leagueAccess);
    router.use('/tribe', tribeAccess);
    router.use('/point-type', pointTypeAccess);
    router.use('/contestant', contestantAccess);
    router.use('/episode', episodeAccess);
    router.use('/user', userAccess);

    app.use('/api', router);

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    app.get('*', function(req, res) {
        res.sendFile('C:\\Users\\Daniel\\VisualStudioCode\\srvvr\\apublic\\index.html'); // load our public/index.html file
    });

};