tournamentControllers.controller('DirectEliminationController', function($scope, $http, $route, poolResultsService) {
    var table = [];
    // Expose display table in poolResultsService.
    $scope.getDisplayTable = function() {
        table = poolResultsService.getDisplayTable();  
        return table;
    }
    
    // Determines if this cell should have a right border. This is done by check to see if the row is between
    // two fencers in the same bout in this round.
    $scope.cellHasRightBorder = function(cellInRowIndex, rowInTableIndex) {
        // Some sanity checks.
        if (rowInTableIndex >= table.length) {
            return false;   
        }
        
        // More readable variable.
        var round = cellInRowIndex;
        
        // Easy case, this cell has a fencer in it.
        var currentCell = table[rowInTableIndex].getCells()[round];
        if (!currentCell.isBlank()) {
            if (currentCell.isFencerTop) {
                // Top fencer does not have a right border.
                return false;
            } else {
                return true;   
            }
        }
        
        // Find the bout of the fencer above this cell (or the end of the table).
        var topBout = null;
        
        for (var i = rowInTableIndex - 1; i >= 0; i--) {
            var currentRow = table[i];
            var currentCells = currentRow.getCells();
            
            // Exit if this round doesn't exit.
            if (round >= currentCells.length) {
                return false;   
            }
            
            var currentCell = currentCells[round];
            
            // Is there a fencer in this cell?
            if (!currentCell.isBlank()) {
                // There is. Is the fencer on top?
                if (currentCell.isFencerTop) {
                    var topBout = currentCell.bout;
                    break;
                }
            }
        }
        
        // Only continue if we found a topBout.
        if (topBout == null) {
            return false;   
        }
        
        // Find the bout of the fencer below this cell (or the end of the table).
        var bottomBout = null;
        
        for (var j = rowInTableIndex + 1; j < table.length; j++) {
            var currentRow = table[j];
            var currentCells = currentRow.getCells();
            
            // Exit if this round doesn't exit.
            if (round >= currentCells.length) {
                return false;   
            }
            
            var currentCell = currentCells[round];
            
            // Is there a fencer in this cell?
            if (!currentCell.isBlank()) {
                // There is. Is the fencer on the bottom?
                if (!currentCell.isFencerTop) {
                    var bottomBout = currentCell.bout;
                    break;
                }
            }
        }
        
        // Only continue if we found a bottomBout.
        if (bottomBout == null) {
            return false;   
        }
        
        // Are they the same bout?
        if (bottomBout.boutID == topBout.boutID) {
            return true;   
        }
        
        return false; // Otherwise they are different bouts.
        
    }
    
    

});