var app = angular.module('beerList', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true);
  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'mainController',
      templateUrl: '/templates/home.html'
    })
    .state('beer', {
      url: '/beer/:id',
      controller: 'beerController',
      templateUrl: '/templates/beer.html',
      params: {
        beerParam: null
      }
    })
    .state('auth', {
      url: '/authorization?token&name',
      controller: function($rootScope, $stateParams, $state, $http) {
        if ($stateParams.token) {
          var user = {
            name: $stateParams.name,
            token: $stateParams.token
          }
          localStorage.setItem("user", JSON.stringify(user));
          $rootScope.currentUser = user.name;
          //set the header for all requests
         $http.defaults.headers.common.Authorization = 'Bearer ' + user.token;
          $state.go('home');
        }
      }
    })
  $urlRouterProvider.otherwise('/home');
});


app.run(function($rootScope, $http) {
  var user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    $rootScope.currentUser = user.name;
         $http.defaults.headers.common.Authorization = 'Bearer ' + user.token;
  }
});