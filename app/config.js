var path = require('path');
var crypto = require('crypto');

/* 
// OLD SQLITE + BOOKSHELF CONFIG:

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../db/shortly.sqlite')
  },
  useNullAsDefault: true
});
var db = require('bookshelf')(knex);

db.knex.schema.hasTable('urls').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('urls', function (link) {
      link.increments('id').primary();
      link.string('url', 255);
      link.string('baseUrl', 255);
      link.string('code', 100);
      link.string('title', 255);
      link.integer('visits');
      link.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('username', 100).unique();
      user.string('password', 100);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

*/

// NEW MONGODB + MONGOOSE CONFIG:

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
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
  visits: String,
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

// define our models using mongoose.model
module.exports.Link = mongoose.model('Link', urlSchema);
module.exports.User = mongoose.model('User', userSchema);


