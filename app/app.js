var myApp = angular.module('myApp', [
    'ngRoute',
    'tournamentControllers'
]);

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/registration', {
        templateUrl: '../registration/registration-partial.html',
        controller: 'RegistrationController'
        }).
    when('/pools', {
        templateUrl: '../pools/pool-partial.html',
        controller: 'PoolController'
    }).
    otherwise({
        redirectTo: '/registration'
    });
}]);