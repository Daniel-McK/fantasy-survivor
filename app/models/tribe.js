// app/models/tribe.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Tribe', {
    _id : {type : Number},
    name : {type : String, default: ''},
    league : {type: Number, ref: 'League'}
});