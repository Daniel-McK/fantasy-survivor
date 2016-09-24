var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var counter = new Schema({
    _id : { type: String },
    seq : {type : Number, default: 0}
});

counter.statics.increment = function (counter, callback) {
  return this.collection.findAndModify({ _id: counter }, [], { $inc: { seq: 1 } }, callback);
};

module.exports = mongoose.model('Counter', counter);