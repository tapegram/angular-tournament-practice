myApp.service('poolValidationService', function() {
    
    // Main function of the service. Does all the work for validating and saving pool info.
    var validateAndUpdateScores = function(fencerIndex, opponentIndex, poolIndex, pools) {
        
        //=======================================================
        // 1 - GET FENCER INFORMATION
        //=======================================================
        
        // Get references to the fencers.
        var currentFencer = pools[poolIndex][fencerIndex];
        var opponent = pools[poolIndex][opponentIndex];
        
        // Get current score value.
        var scoreInput = currentFencer.bouts[opponentIndex].displayScore
        
        //=======================================================
        // 2 - HANDLE THE CASE WHERE THE NEW SCORE IS BLANK
        //=======================================================
        
        // Handle blank value.
        if (!scoreInput) {
            // set won to false.
            currentFencer.setWon(opponentIndex,false);
            
            // blank the score.
            currentFencer.setScore(opponentIndex,-1);
            
            // If the opponent has any score, set them as the winner.
            if (opponent.getScore(fencerIndex) > -1) {
                opponent.setWon(fencerIndex, true);
                opponent.setScore(fencerIndex, opponent.getScore(fencerIndex)); // Refresh the display item (adds a "V")
            }
            
            // exit.
            return;
        }
        
        //=======================================================
        // 3 - BEGIN VALIDATION
        //=======================================================
        
        // Input should be 0-5. Optional(ish) V as second character.
        var regexTest = /^[0-5][Vv]?$/;
        
        if (regexTest.test(scoreInput)) {
            // Valid input.
            //==============
            
            //--------------------------------------------------------
            // 3.A - GET THE SCORES AND IF THE BOUT WAS MARKED AS WON.
            //--------------------------------------------------------
            
            // Get the score and the V character, if present, from the input.
            var score = scoreInput.charAt(0);
            var wonBout = scoreInput.length > 1; // Boolean if the V is present.
            
            // Get the score and the won flag from the opponent.
            var opponentScore = opponent.getScore(fencerIndex);
            var opponentWonBout = opponent.getWon(fencerIndex);
            
            //--------------------------------------------------------
            // 3.B - CHECK TO MAKE SURE SCORE ISN'T 5-5
            //--------------------------------------------------------
            
            // Do a quick check to make sure the score isn't 5-5 (which is not allowed).
            if (opponentScore == 5 && score == 5) {
                alert('You have entered a score of 5-5 which is not a valid score in a pool.');
                clearBout(fencerIndex, opponentIndex, poolIndex, pools);
                
                // exit.
                return;
            }
            
            
            //--------------------------------------------------------
            // 3.C - PROCESS AND SAVE THE SCORE / UPDATE DISPLAY
            //--------------------------------------------------------
            
            // If this score is higher than the opponents (or tied but with V)
            if (score > opponentScore || 
                ((score == opponentScore) && wonBout)) {
                
                setWinner(fencerIndex, score, opponentIndex, opponentScore, poolIndex, pools);
                
            } else if ((opponentScore > score) || 
                       ((score == opponentScore) && !wonBout)) {
                
                // If this score is worse than the opponents (or tied but with a V for the opponent)
                setWinner(opponentIndex, opponentScore, fencerIndex, score, poolIndex, pools);
                
            } else {
                
                // Unresolved bout!
                alert("Unresolved bout in pool " + (poolIndex+1) + " between " + 
                      currentFencer.lastName + " and " + opponent.lastName);
            }
            
        } else {
            // Invalid input.
            //================
            
            alert('Invalid score. Please enter a score between 0-5. You may add a "V" to indicate a victory. For example: 5V.');
            clearBout(fencerIndex, opponentIndex, poolIndex, pools);
        }
    };
    
    
    function setWinner(winningFencerIndex, winningFencerScore, losingFencerIndex, losingFencerScore, poolIndex, pools){
        var winner = pools[poolIndex][winningFencerIndex];
        var loser = pools[poolIndex][losingFencerIndex];
        
        // Update display value.
        winner.setDisplayScore(losingFencerIndex, winningFencerScore + "V");
        
        // For the other fencer, it is possible they don't have a score yet. We want to
        // leave the value blank if possible. (They don't have a score if the value is < 0).
        if (losingFencerScore < 0 ){
            loser.setDisplayScore(winningFencerIndex, "");
        } else {
            loser.setDisplayScore(winningFencerIndex, losingFencerScore); // no 'V'
        }
        
        // Update score.
        winner.setScore(losingFencerIndex, winningFencerScore);
        loser.setScore(winningFencerIndex, losingFencerScore);
        
        // Update won flag.
        winner.setWon(losingFencerIndex, true);
        loser.setWon(winningFencerIndex, false);
    }
    
    
    function clearBout(fencerIndex, opponentIndex, poolIndex, pools){
        var currentFencer = pools[poolIndex][fencerIndex];
        
        // Reset values for this fencer.
        currentFencer.setDisplayScore(opponentIndex, "");
        currentFencer.setScore(opponentIndex, -1);
        currentFencer.setWon(opponentIndex, false);
    }

    // Make available to controller.
    return {
        validateAndUpdateScores: validateAndUpdateScores
    };

});