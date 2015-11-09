// DE bout object.
function DEBout(parentBout, parentBoutTop, boutID){
    
    // Initialize
    this.parentBout = parentBout; // DEBout
    this.parentBoutTop = parentBoutTop; //Boolean - Is the winner of this bout on top in the parent bout?
    this.boutID = boutID;
    
    // Variables.
    var fencerTop = null; // DEFencer
    var fencerBottom = null; // DEFencer
    
    var scoreFencerTop = -1;
    var scoreFencerBottom = -1;
    
    var displayScoreFencerTop = "";
    var displayScoreFencerBottom = "";
    
    var fencerWon = null;
    
    var cellFencerTop = null;
    var cellFencerBottom = null;
    
    //====================
    // Property wrappers.
    //====================
    
    // Fencers
    
    this.setFencerTop = function(fencer) {
        var previousFencer = fencerTop;
        fencerTop = fencer;
        
        if (previousFencer != fencerTop) {
            // The fencer changed so clear the score.   
            clearScoreForBothFencers();
        }
        
        
        // Update winner
        updateWinnerForBye();
        
        checkWinnerValid();
    }
    
    this.getFencerTop = function() {
        return fencerTop;   
    }
    
    this.setFencerBottom = function(fencer) {
        var previousFencer = fencerBottom;
        fencerBottom = fencer;
        
        if (previousFencer != fencerBottom) {
            // The fencer changed so clear the score.   
            clearScoreForBothFencers();
        }
        
        // Update winner
        updateWinnerForBye();
        
        checkWinnerValid();
    }
    
    this.getFencerBottom = function() {
        return fencerBottom;   
    }
    
    this.getParentBout = function() {
        return parentBout;   
    }
    
    // Score
    
    this.setScoreFencerTop = function(score) {
        scoreFencerTop = score;   
    }
    
    this.getScoreFencerTop = function() {
        return scoreFencerTop  
    }
    
    this.setScoreFencerBottom = function(score) {
        scoreFencerBottom = score;   
    }
    
    this.getScoreFencerBottom = function() {
        return scoreFencerBottom 
    }
    
    // Display score.
    
    this.setDisplayScoreFencerTop = function(score) {
        validateAndUpdateScore(score, true);
    }
    
    this.getDisplayScoreFencerTop = function() {
        return displayScoreFencerTop  
    }
    
    this.setDisplayScoreFencerBottom = function(score) {
        validateAndUpdateScore(score, false); 
    }
    
    this.getDisplayScoreFencerBottom = function() {
        return displayScoreFencerBottom 
    }
    
    // Winning Fencer
    
    this.getWinningFencer = function() {
        return fencerWon;   
    }
    
    // Wrappers for cell references.
    
    this.setCellFencerTop = function(cell) {
        cellFencerTop = cell;   
    }
    
    this.setCellFencerBottom = function(cell) {
        cellFencerBottom = cell;   
    }
    
    this.getCellFencerTop = function() {
        return cellFencerTop; 
    }
    
    this.getCellFencerBottom = function() {
        return cellFencerBottom;   
    }
    
    // Validation handling.
    // Validates the inpute score and saves it to the bout, updates the winner, and updates the parent bout.
    function validateAndUpdateScore(scoreInput, isFencerTop) {
        
        // Handle a blank score.
        if (!scoreInput) {
            
            clearScore(isFencerTop);

            // exit.
            return;
        }
        
        // Otherwise, lets validate it.
        // Input should be 0-15. Optional(ish) V as last character.
        var regexTest = /^([0-9]|1[0-5])[Vv]?$/;
        
        if (regexTest.test(scoreInput)) {
            // Valid input.
            
            // Get the component score and victory flag from input.
            var hasV = /[Vv]$/.test(scoreInput);
            if (hasV) {
                var score = scoreInput.substring(0,scoreInput.length-1);   
            } else {
                var score = scoreInput;   
            }
            
            // Save the score.
            setScore(isFencerTop, score, hasV);
            
        } else {
            alert('Invalid score. Please enter a score between 0-15. You may add a "V" to indicate a victory. For example: 15V.');
            clearScore(isFencerTop);
        }     
    }
    
    // Clear the score for both fencers.
    function clearScoreForBothFencers(){
        clearScore(true);
        clearScore(false);
    }
    
    // Clears the score and the display score for the given fencer.
    function clearScore(isFencerTop) {
        setScore(isFencerTop, -1, false);
    }
    
    function setScore(isFencerTop, score, hasV) {
        score= +score;
        
        // Is this fencer the winner?
        var opponentScore = +getFencerScore(!isFencerTop);
        var fencerWon = ((score > opponentScore) || ((score == opponentScore) && hasV))
        
        // Update this fencers score.
        setFencerScore(isFencerTop, score);
        
        // Set the flag for the winning fencer (and update the parent bout).
        if (fencerWon) {
            setFencerWon(isFencerTop);   
        } else {
            // Also check for the case where the score is -1 -1 (aka both have been cleared).
            if (opponentScore == -1 && score == -1){
                setNoFencerWon(); // No one has one, bout is incomplete.   
            } else {
                setFencerWon(!isFencerTop);
            }
        }
        
        // Update the display scores (move the V around).
        updateDisplayScores();
    }
    
    // private wrappers for getting / setting fencer info
    
    function getFencerScore(isFencerTop) {
        if (isFencerTop) {
            return scoreFencerTop;
        } else {
            return scoreFencerBottom;
        }
    }
    
    function setFencerScore(isFencerTop, score) {
        if (isFencerTop) {
            scoreFencerTop = score;
        } else {
            scoreFencerBottom = score;
        }
    }
    
    function setFencerWon(isFencerTop) {
        if (isFencerTop) {
            fencerWon = fencerTop; // top
        } else {
            fencerWon = fencerBottom; // bottom;
        }
        
        updateParentBout();
    }
    
    function setNoFencerWon() {
        fencerWon = null;
        updateParentBout();
    }
    
    function updateWinnerForBye() {
        // Check both fencers. If they both exist and one is a bye, set the other as the winner.
        if (fencerTop != null && fencerBottom != null){
            if (fencerTop.getIsBye() && !fencerBottom.getIsBye()){
                setFencerWon(false);
            } else if (fencerBottom.getIsBye() && !fencerTop.getIsBye()){
                setFencerWon(true);
            }
        }
    }
    
    // Expose to calls from other bouts.
    this.updateParentBout = function() {
        updateParentBout();   
        
        // refresh cell.
        refreshBoutCells();
    }
    
    function refreshBoutCells() {
        refreshTopCell();
        refreshBottomCell();
    }
    
    function refreshTopCell() {
        if (cellFencerTop != null) {
            cellFencerTop.refresh();   
        }
    }
    
    function refreshBottomCell() {
        if (cellFencerBottom != null) {
            cellFencerBottom.refresh();
        }
    }
    
    function updateParentBout() {
        if (parentBout == null) {
            return; //exit.   
        }
        
        if (parentBoutTop) {
            parentBout.setFencerTop(fencerWon); 
        } else {
            parentBout.setFencerBottom(fencerWon); 
        }
        
        // Recursively update parents TODO.
        parentBout.updateParentBout();
    }
    
    function updateDisplayScores() {
        // Update top display score.
        if (scoreFencerTop < 0) {
            displayScoreFencerTop = "";
        } else {
            displayScoreFencerTop = scoreFencerTop;
            
            if (fencerWon == fencerTop) {
                displayScoreFencerTop += "V";   
            }
        }
        
        // Update bottom display score.
        if (scoreFencerBottom < 0) {
            displayScoreFencerBottom = "";
        } else {
            displayScoreFencerBottom = scoreFencerBottom;
            
            if (fencerWon == fencerBottom) {
                displayScoreFencerBottom += "V";   
            }
        }
        
        // Refresh value in cells.
        refreshDisplayScoresInCells();
        
    }
    
    function refreshDisplayScoresInCells(){
        if (cellFencerTop != null) {
            cellFencerTop.refreshDisplayScore();
        }
        
        if (cellFencerBottom != null) {
            cellFencerBottom.refreshDisplayScore();
        }
        
        // Refresh parent cells, which should have had their fencers updated by now.
//        if (parentBout != null) {
//            if (parentBoutTop){
//                var cell = parentBout.getCellFencerTop();   
//            } else {
//                var cell = parentBout.getCellFencerBottom();  
//            }
//            
//            cell.refresh();
//        }
    }
    
    function checkWinnerValid() {
        // After updating fencers in the bout, check to make sure any previously set winner is actually possible.
        if (fencerWon != null) {
            if (fencerWon != fencerTop && fencerWon != fencerBottom) {
                // fencerWon is set to a fencer not in this bout. Clear it out.
                fencerWon = null;
            }
        }
    }
}