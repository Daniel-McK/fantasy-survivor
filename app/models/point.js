// app/models/point.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Point', {
    _id : {type : Number},
    contestant : {type : Number, ref: 'Contestant'},
    type : {type : Number, ref: 'PointType'},
    episode : {type :Number, ref: 'Episode'}
});