function boutIndexHelper(numRounds){
    
    // Initialize
    
    this.numRounds = numRounds;
    
    // Index we are maintaining.
    var boutIndex = [];
    var boutIndexIncrementFlag = [];
    
    if (this.numRounds > 0) {
        // Init bout of our arrays for this number of rounds.
        for (var round=0; round < this.numRounds; round++) {
        
            boutIndex[round] = 0;
            boutIndexIncrementFlag[round] = false;
        }
    }
    // Get / Set functions
    
    this.getBoutIndexForRound = function(round){
        return boutIndex[round];
    }
    
    this.isFencerTop = function(round) {
        // First fencer is top, second is bottom.
        return !boutIndexIncrementFlag[round]; 
    }
    
    this.incrementBoutIndexForRound = function(round) {
        if (boutIndexIncrementFlag[round]) {
            // Two fencers are in a bout, so we only increment every two calls.
            boutIndex[round] += 1;   
        }
        
        boutIndexIncrementFlag[round] = !boutIndexIncrementFlag[round];
    }
    
    

}