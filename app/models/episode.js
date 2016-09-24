// app/models/episode.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Episode', {
    _id : {type : Number},
    number : {type : String, default: ''},
    date : {type: Date, default: new Date()},
    league : {type: Number, ref: 'League'}
});