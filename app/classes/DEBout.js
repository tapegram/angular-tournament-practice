// DE bout object.
function DEBout(parentBout, parentBoutTop){
    
    // Initialize
    this.parentBout = parentBout; // DEBout
    this.parentBoutTop = parentBoutTop; //Boolean - Is the winner of this bout on top in the parent bout?
    
    // Variables.
    var fencerTop = null; // DEFencer
    var fencerBottom = null; // DEFencer
    
    var scoreFencerTop = -1;
    var scoreFencerBottom = -1;
    
    var displayScoreFencerTop = "";
    var displayScoreFencerBottom = "";
    
    var fencerWon = null;
    
    //====================
    // Property wrappers.
    //====================
    
    // Fencers
    
    this.setFencerTop = function(fencer) {
        this.fencerTop = fencer;   
    }
    
    this.getFencerTop = function() {
        return fencerTop;   
    }
    
    this.setFencerBottom = function(fencer) {
        this.fencerBottom = fencer;   
    }
    
    this.getFencerBottom = function() {
        return fencerBottom;   
    }
    
    this.getParentBout = function() {
        return parentBout;   
    }
    
    // Score
    
    this.setScoreFencerTop = function(score) {
        this.scoreFencerTop = score;   
    }
    
    this.getScoreFencerTop = function() {
        return scoreFencerTop  
    }
    
    this.setScoreFencerBottom = function(score) {
        this.scoreFencerBottom = score;   
    }
    
    this.getScoreFencerBottom = function() {
        return scoreFencerBottom 
    }
    
    // Display score.
    
    this.setDisplayScoreFencerTop = function(score) {
        this.displayScoreFencerTop = score;   
    }
    
    this.getDisplayScoreFencerTop = function() {
        return displayScoreFencerTop  
    }
    
    this.setDisplayScoreFencerBottom = function(score) {
        this.scoreFencerBottom = score;   
    }
    
    this.getDisplayScoreFencerBottom = function() {
        return displayScoreFencerBottom 
    }
    
    // Winning Fencer
    
    this.getWinningFencer = function() {
        return fencerWon;   
    }
    
}