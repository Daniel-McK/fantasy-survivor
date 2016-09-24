// app/models/point-type.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('PointType', {
    _id : {type : Number},
    name : {type : String, default: ''},
    amount : {type : Number, default: 0}
});