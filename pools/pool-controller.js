tournamentControllers.controller('PoolController', function($scope, $http, $route, regListService, generatePoolService, poolValidationService) {
    var pools = [];
    var regList = [];
    
    // On initialize, load regList and generate the pool.
    $scope.init = function() {
        regList = regListService.getRegList();
        pools = generatePoolService.getPools(regList);
        
        // Also send a reference to the fencers to the pool results service.
        //sendFencerListToResultsService();
    }

    // Default to 7. This makes sure that the dropdown has a default value.
    $scope.numFencersPerPool = "7";
    
    // Expose pools to HTML.
    $scope.getPools = function() {
        return pools;
    }
    
    // Validation function called on blur.
    $scope.validateAndUpdateScores = function(fencerIndex, opponentIndex, poolIndex) {
        poolValidationService.validateAndUpdateScores(fencerIndex, opponentIndex, poolIndex, pools);
    }
    
    // Returns the current place of the fencer in the pool.
    $scope.fencerPlace = function(fencerIndex, currentPool) {
        return poolValidationService.fencerPlace(fencerIndex, currentPool);
    }

    // Call the init function.
    $scope.init();
});
