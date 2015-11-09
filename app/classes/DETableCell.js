// fencer object.
function DETableCell(bout, isFencerTop){
    
    // Initialize
    
    this.bout = bout;
    this.displayScore = ""; // This is the ng-model for the input box for a score.
    this.isFencerTop = isFencerTop;
    
    this.fencerName = getFencerName();
    
    if (this.bout != null){
        if (isFencerTop) {
            this.bout.setCellFencerTop(this);
        } else {
            this.bout.setCellFencerBottom(this);
        }
    }
    
    // Called by on-blur in view.
    this.validateScore = function() {
        // Set the display score in the bout and let internal validation handle it.
        setDisplayScore(this.displayScore);
        
        // The bout will update the display score here when it is done processing the new display score via getDisplayScore.
    }
    
    // Called by bout to force refresh of display score.
    this.refreshDisplayScore = function() {
        this.displayScore = getDisplayScore();
    }
    
    // Called by bout to force refresh of score & fencer name.
    this.refresh = function(){
        this.displayScore = getDisplayScore();
        this.fencerName = getFencerName();
    }
    
    // Called in view to determine if there is any information here.
    this.isBlank = function() {
        return ((this.bout === null) || (typeof this.bout === 'undefined'));
    }
    
    function getFencerName() {
        if (bout == null) {
            return "No bout";   
        }
        
        var fencer = null;
        
        if (isFencerTop) {
            fencer = bout.getFencerTop();   
        } else {
            fencer = bout.getFencerBottom(); 
        }
        
        if ((typeof fencer != 'undefined') &&
            (fencer != null)) {
            // Name + seed.
            var nameToReturn = fencer.getName();
            if (!fencer.getIsBye()) {
                // If this is not a bye, also include the seeding of the fencer.
                nameToReturn = nameToReturn + " (" + fencer.getSeed() + ")";
            }
            
            return nameToReturn;
        } else {
            return "TBD";   
        }
    }
    
    // Get if this cell is ready to go (can enter score).
    this.boutReady = function() {
        if (this.bout != null && 
            typeof this.bout != 'undefined' &&
            this.bout.getFencerBottom() != null &&
            typeof this.bout.getFencerBottom() != 'undefined' &&
            this.bout.getFencerTop() != null &&
            typeof this.bout.getFencerTop() != 'undefined') {
            
            // One last check: make sure neither fencers are byes.
            if (this.bout.getFencerBottom().getIsBye() ||
                this.bout.getFencerTop().getIsBye()){
                return false;
            } else {
                return true;  
            }
        } else {
            return false;   
        }
    }
    
    // Helper functions for getting and setting display score in the bout.
    
    function setDisplayScore(score) {
        if (isFencerTop) {
            bout.setDisplayScoreFencerTop(score);   
        } else {
            bout.setDisplayScoreFencerBottom(score); 
        }
    }
    
    function getDisplayScore() {
        if (isFencerTop) {
            return bout.getDisplayScoreFencerTop();   
        } else {
            return bout.getDisplayScoreFencerBottom(); 
        }
    }

}