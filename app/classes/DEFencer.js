// fencer object.
function DEFencer(firstName, lastName, rating, isBye, seed){
    
    // Initialize
    
    this.firstName = firstName;
    this.lastName = lastName;
    this.rating = rating;
    this.isBye = isBye;
    this.seed = seed;
    
    this.getIsBye = function() {
        return this.isBye;   
    }
    
    this.getName = function() {
        if (!this.isBye) {
            return this.lastName + ", " + this.firstName; 
        } else {
            return "Bye";
        }
    }
    
    this.getSeed = function() {
        return this.seed;   
    }

}