// fencer object.
function poolFencer(fencerInfo, bouts, poolIndex,pools){
    // Initializer
    this.firstName = fencerInfo.firstName; //string
    this.lastName = fencerInfo.lastName; //string
    this.rating = fencerInfo.rating; //string (maybe enumerated type?)
    this.bouts = bouts; //array of bout objects
    this.poolIndex = poolIndex; // index of pool in array of pools.
    this.pools = pools; // reference to the tournament pools. todo: can probably update this to only use the exact pool this fencer is in.

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