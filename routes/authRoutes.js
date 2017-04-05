var express = require('express');
var router = express.Router();
var passport = require('../models/passport');

router.get('/facebook',
  passport.authenticate('facebook', { scope: 'email' }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user);
    res.redirect('/authorization?token=' + req.user.token + "&name=" + req.user.name);
    res.redirect('/');
  });


module.exports = router;




