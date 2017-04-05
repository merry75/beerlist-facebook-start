app.controller('mainController', function($scope, beerFactory) {

  $scope.addBeer = function() {
    beerFactory.addBeer($scope.newBeer)
      .then(function(beer) {
        $scope.beers.push(beer);
      })
      //this is new
      .catch(function(err) {
        alert(err.data.message)
      });
  }

  $scope.removeBeer = function() {
    var self = this;
    beerFactory.removeBeer(this.beer)
      .then(function(response) {
        $scope.beers.splice(self.$index, 1);
      })
      //this is new
      .catch(function(err) {
        alert(err.data.message)
      });
  }

  beerFactory.getBeers().then(function(beers) {
    $scope.beers = beers;
  });


  $scope.editBeer = function(index) {
    // notice that *this* refers to the element's scope - in this case a beer. 
    // so by using it below we're adding 'tempBeer' it to the beer's scope.
    this.tempBeer = angular.copy($scope.beers[index]);
  };

  $scope.updateBeer = function(beerCopy, index) {

    var self = this;

    //calling the update beer on the service to send the new info to the server
    beerFactory.updateBeer(beerCopy)
      .then(function(modifiedBeer) {
        //when the server finished updating successfully, replace the original beer with the modified version
        $scope.beers[index] = modifiedBeer;
        // 'self' refers to the beer scope (we assigned it earlier because in here 'this' is something else)
        self.tempBeer = null;
      }, function(err) {
        //if there has been a problem then alert it
        alert(err.data.message);
      })
      .then(function() {
        //finally, success or error, we need to clear the tempBeer so the view updates
        self.tempBeer = null;
      });
  };

})