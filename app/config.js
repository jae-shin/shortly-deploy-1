var path = require('path');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

// NEW MONGODB + MONGOOSE CONFIG:

var mongoose = require('mongoose');
mongoose.Promise = Promise;
// var filename = path.join(__dirname, '../db/shortly.sqlite');
mongoose.connect('mongodb://localhost:27017');

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
//   console.log('successfully connected to mongodb');
// });

var urlSchema = mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0}
  // TODO if needed - insert timestamp field
});

urlSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});


var userSchema = mongoose.Schema({
  username: String,
  password: String,
  // TODO if needed - insert timestamp field
});

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
  .then(function(hash) {
    this.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

// define our models using mongoose.model
module.exports.Link = mongoose.model('Link', urlSchema);
module.exports.User = mongoose.model('User', userSchema);


