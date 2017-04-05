var passport = require('passport');
//passport configuration here
var User = require('./UserModel');
var FacebookStrategy = require('passport-facebook').Strategy;
var jwt = require('jsonwebtoken');

passport.use(new FacebookStrategy({
    clientID: '1234773033305974',
    clientSecret: '17aafbf2109b3b7ea4771bdb9540041a',
    callbackURL: 'http://localhost:8000/auth/facebook/callback',
    profileFields: ['email', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ 'socialId': profile.id }, function(err, user) {
      if (err) {
        return done(err);
      }
      //If no user was found, create a new user with details from the facebook profile
      if (!user) {
        user = new User({
          socialId: profile.id,
          name: profile.displayName,
          email: profile.emails ? profile.emails[0].value : "",
          provider: 'facebook',
          loginCount: 0
        });
      } else {
        //else, a user exists so let's add one to their login count
        user.loginCount++;
      }
      //finally let's save, make a token and call "done"
      user.save(function(err, newUser) {
        if (err) {
          return done(err);
        } else {
          var token = jwt.sign({
            id: newUser.id,
            name: newUser.name,
          }, 'thisIsTopSecret', { expiresIn: "7d" });
          return done(null, { token: token, name: newUser.name });
        }
      });
    });
  }
));



module.exports = passport;
