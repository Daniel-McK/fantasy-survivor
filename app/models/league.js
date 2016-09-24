// app/models/league.js
var mongoose = require('mongoose');

module.exports = mongoose.model('League', {
    _id : {type : Number},
    name : {type : String, default: ''}
});