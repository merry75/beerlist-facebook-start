app.factory('beerFactory', function($http) {

  var beerFactory = {};

  beerFactory.getBeers = function() {
    return $http.get('/beers')
      .then(function(response) {
        //if wanted/needed you can do data manipulation and parsing here

        //our returned data is wrapped in a pre-resolved promise
        //we can access that data in our controller using '.then' 
        return response.data
      }, function(err) {
        //console.error(err)
      });
  };

  beerFactory.getBeer = function(id) {
    return $http.get('/beers/' + id)
      .then(function(response) {
        return response.data
      }, function(err) {
        console.error(err)
      });
  };

  beerFactory.updateBeer = function(beer) {
    return $http.put('/beers/' + beer._id, beer)
      .then(function(response) {
        return response.data
      });
  };
  
  //removed the error handler
  beerFactory.addBeer = function(newBeer) {
    return $http.post('/beers', newBeer)
      .then(function(response) {
        return response.data
      });
  };
  
  //removed the error handler
  beerFactory.removeBeer = function(beer) {
    return $http.delete('/beers/' + beer._id)
      .then(function(response) {
        return response.data;
      });
  };
  
  beerFactory.addReview = function(id, newReview) {
    return $http.post('/beers/' + id + '/reviews', newReview)
      .then(function(response) {
        return response.data
      }, function(err) {
        console.error(err)
      });
  };
  
  //removed the error handler
  beerFactory.deleteReview = function(beerId, reviewId) {
    return $http.delete('/beers/' + beerId + '/reviews/' + reviewId)
      .then(function(response) {
        return response.data
      });
  };

  return beerFactory;
});
