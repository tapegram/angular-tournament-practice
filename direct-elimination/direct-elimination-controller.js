tournamentControllers.controller('DirectEliminationController', function($scope, $http, $route, poolResultsService) {
    var fencers = [];
    
    function init() {
        fencers = poolResultsService.getFencerList(); 
    }
    
    $scope.fencers = fencers;
    
    $scope.getDETable = function() {
        return poolResultsService.getFencerList();
    }
    
    
    
    // Call init.
    init();
});