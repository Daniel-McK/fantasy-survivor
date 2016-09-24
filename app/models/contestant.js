// app/models/character.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Contestant', {
    _id : {type : Number},
    firstName : {type : String, default: ''},
    lastName : {type : String, default: ''},
    tribe : {type : Number, ref: 'Tribe'},
    imageName : { type: String },
    eliminated : {type: Number, ref: 'Episode'},
    pickedBy : {type: Number, ref: 'User'}
});