var tournamentControllers = angular.module('tournamentControllers', []);

/* Registration screen controller */
tournamentControllers.controller('RegistrationController', function($scope, $http, regListService) {

    // Allow html to get the entire reg list.
    $scope.getRegList = function() {
        return regListService.getRegList();
    }
    
    // Allow html to add fencers to reg list.
    $scope.addFencerToRegList = function(fencerFirstName, fencerLastName, fencerRating) {
        // Push new fencer onto array.
        regListService.addFencerToRegList(fencerFirstName, fencerLastName, fencerRating);
    }
    
});