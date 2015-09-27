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
    when('/direct_elimination_table', {
        templateUrl: '../direct-elimination/direct-elimination-partial.html',
        controller: 'DirectEliminationController'
    }).
    otherwise({
        redirectTo: '/registration'
    });
}]);