myApp.service('generatePoolService', function() {
    var pools = []
    
     // fencer object.
    function fencer(fencerInfo, bouts, poolIndex){
        // Initializer
        this.firstName = fencerInfo.firstName; //string
        this.lastName = fencerInfo.lastName; //string
        this.rating = fencerInfo.rating; //string (maybe enumerated type?)
        this.bouts = bouts; //array of bout objects
        this.poolIndex = poolIndex; // index of pool in array of pools.
        
        // End init
        //===========================================================================

        // Wrappers for accessing score, displayScore, and won in bout.
        this.setScore = function(opponentIndex,score) {
            // sanity check
            if (opponentIndex >= this.bouts.length) {
                //exit
                return;
            }
            
            // Get opponent so we can update their touches received.
            var opponent = pools[this.poolIndex][opponentIndex];
            
            // Remove previous score if it is > 0.
            var prevScore = +this.bouts[opponentIndex].score
            var intScore = +score;
            
            if (prevScore > 0) {
                this.touchesScored -= prevScore;
                
                // Update opponents touches received.
                opponent.touchesReceived -= prevScore;
            }
            
            // Now update touches scored.
            if (intScore > -1) {
                this.touchesScored += intScore;
                
                // Update opponents touches received.
                opponent.touchesReceived += intScore;
            }
            
            // Set the score.
            this.bouts[opponentIndex].score = intScore;  
        }
        
        this.getScore = function(opponentIndex) {
            return this.bouts[opponentIndex].score;
        }
        
        this.setDisplayScore = function(opponentIndex,displayScore) {
            // sanity check
            if (opponentIndex >= this.bouts.length) {
                //exit
                return;
            }
            
            // set display score.
            this.bouts[opponentIndex].displayScore = displayScore;
        }
        
        this.getDisplayScore = function(opponentIndex) {
            return this.bouts[opponentIndex].displayScore;
        }
        
        this.setWon = function(opponentIndex,didWin) {
            // sanity check
            if (opponentIndex >= this.bouts.length) {
                //exit
                return;
            }
            
            // Update total wins.
            var prevWon = this.bouts[opponentIndex].won;
            
            if (prevWon == didWin) {
                // Don't need to do anything. Count is up to date.   
            } else if (prevWon && !didWin) {
                // Win is being changed to a loss. Remove a win.
                this.wins--;
            } else {
                // Should be case where we are changing a loss or null into a win.
                this.wins++;
            }
            
            // set won.
            this.bouts[opponentIndex].won = didWin;
        }
        
        this.getWon = function(opponentIndex) {
            return this.bouts[opponentIndex].won;
        }
        
        // End Wrappers
        //===========================================================================
        
        // Store results.
        this.wins = 0;
        this.touchesScored = 0;
        this.touchesReceived = 0;
        
        // End Results
        //===========================================================================
    }
    
    // bout object.
    function bout(score, displayScore, won){
        this.score = score //int
        this.displayScore = displayScore // String
        this.won = won //boolean
    }
    
    // function to actually generate and return pools.
    var getPools = function(regList) {
        // If we have already created pools before, just return them.
        if (pools.length > 0 ) {
            return pools;   
        }
        
        // Otherwise, we need to create the pools based on the list of fencers in the RegList.
        var fencerList = regList;
        
        // Determine how many pools we are creating.
        var numberOfPools = Math.ceil(fencerList.length / 7);
        
        // Now create empty pools.
        for (i=0; i<numberOfPools; i++) {
            pools.push([]);   
        }
        
        // Add fencers to all the pools.
        var currentPoolIndex = 0;
        for (j=0; j<fencerList.length; j++){
            // Push the current fencers into the current pool.
            var fencerInfo = fencerList[j];
            var newFencer = new fencer(fencerInfo, [], currentPoolIndex);
            pools[currentPoolIndex].push(newFencer);

            // Update the index for the next pool.
            currentPoolIndex++;
            currentPoolIndex = currentPoolIndex % numberOfPools;
        }
        
        // Now add bouts to each fencer in the pool.
        //-------------------------------------------
        var currentPoolSize = 0;
        
        // Go through each pool.
        for (k=0; k<pools.length; k++){
            currentPoolSize = pools[k].length;
            
            // For each fencer in the pool.
            for (l=0; l<currentPoolSize; l++) {
                
                // Add a bout for each fencer.
                for (m=0; m<currentPoolSize; m++){
                    pools[k][l].bouts.push(new bout(-1,"",false));   
                }
            }
        }

        return pools;
    }

    // Make available to controller.
    return {
        getPools: getPools
    };

});