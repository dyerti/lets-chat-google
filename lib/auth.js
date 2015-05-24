var fs = require('fs'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

function Google(options, core) {
    this.options = options;
    this.core = core;
    this.key = 'google';

    this.setup = this.setup.bind(this);
    this.getGoogleStrategy = this.getGoogleStrategy.bind(this);
}

Google.defaults = {
    isSSO: true
};

Google.key = 'google';

Google.prototype.setup = function() {
    passport.use(this.getGoogleStrategy());
};

Google.prototype.authenticate = function(req, res, cb) {
    if (!res) {
        return cb(null, null);
    }

    passport.authenticate('google', cb)(req, res);
};

Google.prototype.getGoogleStrategy = function() {
    return new GoogleStrategy({
            clientID: this.options.clientID,
            clientSecret: this.options.clientSecret,
            callbackURL: this.options.callbackURL,
            scope: this.options.scope
        },
        function (accessToken, refreshToken, user, done) {
            return Google.findOrCreate(this.core, user, done);
        }.bind(this)
    );
};

Google.findOrCreate = function(core, googleUser, callback) {
    var User = mongoose.model('User');

    // TODO Construct unique uid instead of username to
    //      provent collisions between multiple auth providers
    //      Ex. uid = base64(md5(googleURL + googleUser.id))
    //          base64 because current uid is limited to length <= 24
    User.findOne({ uid: googleUser.id }, function (err, user) {
        if (err) {
            return callback(err);
        }
        if (!user) {
            Google.createUser(core, googleUser, callback);
        } else {
            return callback(null, user);
        }
    });
};

Google.createUser = function(core, googleUser, callback) {
    var User = mongoose.model('User');

    var email = googleUser.emails[0].value;
    var username = email.split('@')[0];

    var data = {
        uid: googleUser.id,
        username: username,
        email: email,
        firstName: googleUser.name.givenName,
        lastName: googleUser.name.familyName,
        displayName: googleUser.displayName
    };

    core.account.create('google',
                        data,
                        function (err, user) {
        if (err) {
            console.error(err);
            return callback(err);
        }
        return callback(null, user);
    });
};


module.exports = Google;
