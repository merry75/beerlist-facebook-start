//package and module requirements
var express = require('express')
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('./models/passport');
var beerRoutes = require('./routes/beerRoutes');
var authRoutes = require('./routes/authRoutes');

//let's get going...
var app = express();
mongoose.connect(process.env.CONNECTION_STRING||'mongodb://localhost/beers');

app.use(passport.initialize());

app.use(express.static('public'));
app.use(express.static('node_modules'));

//some middleware that we need
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/beers', beerRoutes);
app.use('/auth', authRoutes);

app.all('*', function(req, res) {
  res.sendFile(__dirname + "/public/index.html")
});

// main error handler
// warning - not for use in production code!
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err
  });
});

//start the server
app.listen(process.env.PORT || '8000');