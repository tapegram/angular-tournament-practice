// fencer object.
function DETableRow(activeRound, bout, isFencerInRowTop, numRounds){
    // Keep an array of table cells.
    var cells = [];
    
    // Initialize
    this.activeRound = activeRound;
    this.bout = bout;
    this.isFencerInRowTop = isFencerInRowTop;
    this.numRounds = numRounds;
    
    // Initialize cells array.
    for (var i=0; i < numRounds; i++) {
        var newCell = null;
        
        if (i == activeRound) {
            // This is the round where the bout is.
            newCell = new DETableCell(this.bout, this.isFencerInRowTop);
        } else {
            // Otherwise this is just a blank cell.
            newCell = new DETableCell(null, this.isFencerInRowTop);
        }
        
        // Add the cell to the array.
        cells.push(newCell);
    }
    
    // Expose getting the cell in a round.
    this.getCellForRound = function(round) {
        if (round < cells.length) {
            return cells[round];
        }
        
        // Otherwise return nothing, this shouldn't happen and should break.
        return null;
    }
    
    this.getCells = function() {
        return cells;   
    }
    
    
    

}