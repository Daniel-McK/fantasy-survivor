// app/models/user.js
var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    _id : {type : Number},
    firstName : {type : String, default: ''},
    lastName : {type : String, default: ''},
    userName : {type: String, default: ''},
    password : {type: String, default:''},
    admin : {type: Boolean, default: false}
});