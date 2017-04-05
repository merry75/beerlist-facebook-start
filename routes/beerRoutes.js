var express = require('express');
var router = express.Router();
var Beer = require("../models/BeerModel");
var expressJWT = require('express-jwt');
var ensureAuthenticated = expressJWT({ secret: 'thisIsTopSecret'});


router.get('/', function(req, res, next) {
  Beer.find(function(error, beers) {
    if (error) {
      console.error(error)
      return next(error);
    } else {
      res.send(beers);
    }
  });
});

router.get('/:id', function(req, res, next) {
  Beer.findById(req.params.id, function(error, beer) {
    if (error) {
      console.error(error)
      return next(error);
    } else {
      res.send(beer);
    }
  });
});

router.put('/:id', ensureAuthenticated, function(req, res, next) {
  Beer.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(error, beer) {
    if (error) {
      console.error(error)
      return next(error);
    } else {
      res.send(beer);
    }
  });
});

router.delete('/:id', ensureAuthenticated, function(req, res, next) {
  Beer.findByIdAndRemove(req.params.id, function(err, foundBeer) {
    if (err) {
      console.error(err)
      return next(err);
    } else {
      res.send("Beer Deleted");
    }
  });
});

router.post('/:id/reviews', ensureAuthenticated, function(req, res, next) {
  Beer.findById(req.params.id, function(err, foundBeer) {
    if (err) {
      console.error(err);
      return next(err);
    } else if (!foundBeer) {
      return res.send("Error! No beer found with that ID");
    } else {
      foundBeer.reviews.push(req.body)
      foundBeer.save(function(err, updatedBeer) {
        if (err) {
          return next(err);
        } else {
          res.send(updatedBeer);
        }
      });
    }
  });
});

router.delete('/:beerid/reviews/:reviewid', ensureAuthenticated, function(req, res, next) {
  Beer.findById(req.params.beerid, function(err, foundBeer) {
    if (err) {
      return next(err);
    } else if (!foundBeer) {
      return res.send("Error! No beer found with that ID");
    } else {
      var reviewToDelete = foundBeer.reviews.id(req.params.reviewid)
      if (reviewToDelete) {
        reviewToDelete.remove()
        foundBeer.save(function(err, updatedBeer) {
          if (err) {
            return next(err);
          } else {
            res.send(updatedBeer);
          }
        });
      } else {
        return res.send("Error! No review found with that ID");
      }
    }
  });
});


router.post('/', ensureAuthenticated, function(req, res, next) {
  Beer.create(req.body, function(err, beer) {
    if (err) {
      console.error(err)
      return next(err);
    } else {
      res.json(beer);
    }
  });
});



module.exports = router
