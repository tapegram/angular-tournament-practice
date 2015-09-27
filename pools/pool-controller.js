tournamentControllers.controller('PoolController', function($scope, $http, $route, regListService, generatePoolService, poolValidationService) {
    var pools = [];
    var regList = [];
    
    // On initialize, load regList and generate the pool.
    $scope.init = function() {
        regList = regListService.getRegList();
        pools = generatePoolService.getPools(regList);
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
    
    $scope.fencerPlace = function(fencerIndex, currentPool) {
        // Compare this fencer's results to every other fencers results.
        
        // Start off in first place (hurray!)
        var place = 1;
        
        // Get current fencer.
        var thisFencer = currentPool[fencerIndex];
        
        // Compare to each other fencer in the pool. Go back one place for every fencer with a better record.
        for (opponentIndex = 0; opponentIndex < currentPool.length; opponentIndex++) {
            if (opponentIndex != fencerIndex) {
                // Get opponent.
                var opponent = currentPool[opponentIndex];
                
                // Compare victories
                var fencerVictories = thisFencer.wins;
                var opponentVictories = opponent.wins;
                
                if (fencerVictories > opponentVictories) {
                    // Keep current place.
                    continue;
                }
                
                if (fencerVictories < opponentVictories) {
                    // Opponent should place higher. Drop down one.
                    place++;
                    continue;
                }
                
                // Tied on victories ==>
                // Compare indicators
                var fencerIndicator = thisFencer.touchesScored - thisFencer.touchesReceived;
                var opponentIndicator = opponent.touchesScored - opponent.touchesReceived;
                
                if (fencerIndicator > opponentIndicator) {
                    // Keep current place.
                    continue;
                }
                
                if (fencerIndicator < opponentIndicator) {
                    // Opponent should place higher. Drop down one.
                    place++;
                    continue;
                }
                
                
                // Tied on indicators ==>
                // Compare touches scored
                var fencerTouchesScored = thisFencer.touchesScored;
                var opponentTouchesScored = opponent.touchesScored;
                
                if (fencerTouchesScored > opponentTouchesScored) {
                    // Keep current place.
                    continue;
                }
                
                if (fencerTouchesScored < opponentTouchesScored) {
                    // Opponent should place higher. Drop down one.
                    place++;
                    continue;
                }
                
                // If we get here, it is a tie!
                // Keep the same place and move on to looking at the next fencer.
            }
        }
        
        return place;
    }

    // Call the init function.
    $scope.init();
});

/* Todo:

Add a validation check to make sure all of the pools are all the way filled out before allowing DE generation.

Add print button

*/