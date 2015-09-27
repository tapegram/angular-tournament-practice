myApp.service('generatePoolService', function() {
    var pools = []
    
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
        for (var i=0; i<numberOfPools; i++) {
            pools.push([]);   
        }
        
        // Add fencers to all the pools.
        var currentPoolIndex = 0;
        for (var j=0; j<fencerList.length; j++){
            // Push the current fencers into the current pool.
            var fencerInfo = fencerList[j];
            var newFencer = new poolFencer(fencerInfo, [], currentPoolIndex,pools);
            pools[currentPoolIndex].push(newFencer);

            // Update the index for the next pool.
            currentPoolIndex++;
            currentPoolIndex = currentPoolIndex % numberOfPools;
        }
        
        // Now add bouts to each fencer in the pool.
        //-------------------------------------------
        var currentPoolSize = 0;
        
        // Go through each pool.
        for (var k=0; k<pools.length; k++){
            currentPoolSize = pools[k].length;
            
            // For each fencer in the pool.
            for (var l=0; l<currentPoolSize; l++) {
                
                // Add a bout for each fencer.
                for (var m=0; m<currentPoolSize; m++){
                    pools[k][l].bouts.push(new poolBout(-1,"",false));   
                }
            }
        }

        return pools;
    }

    // Make available.
    return {
        getPools: getPools
    };

});