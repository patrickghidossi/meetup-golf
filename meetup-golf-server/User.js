module.exports = function(mongoose) {

var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({

	username: {type: String, unique: true},
	email: {type: String, unique: true},
	hash: String,
  salt: String
  
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    email: this.email,
    exp: parseInt(expiry.getTime() / 1000),
  }, secret = require("./userSecret.js")); // MAKE SURE THIS SECRET WORKS
};

var UserModel = mongoose.model('User', userSchema);
return UserModel;

};