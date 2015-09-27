myApp.service('poolResultsService', function(generatePoolService,tableSeedingService) {
    //var DEFencerList = []; // List of DEFencer objects sorted in order of their results in the pool.
    //var poolFencerList = []; //List of poolFencer objects from the pool. Used to create DEFencerList.
    
    /* Initialization function 
     * This should get the fencers + data from the generatePoolService and then do all the work necessary
     * to allow the generation of a DE table. 
     *
     * This should only be called when loading the DETable. */
    function init() {
        // Get the list of fencers from the pool service.
        var poolFencerList = generateInitialFencerListFromPools();
        
        // Now create the DEFencerList.
        // This is a bit of a process. The gist of it is that we will
        // 1 - Sort poolFencerList by fencer results to get the next round's seeding.
        // 2 - Convert those poolFencer objects to DEFencer objects and put them in the DEFencerList.
        // 3 - Fill out the rest of the DE slots by appending 'bye' fencers.
        DEFencersList = generateDEFencerList(poolFencerList);
        
        // Now we need to create the bout tree for the tournament.
        // We will create the bouts for the rounds in reverse order. So we start with the final,
        // move on to the semi finals, etc. This way we can link child bouts to their parent so
        // we can update who is fencing in the next round's bout based on the winners of those bouts.
        //
        // This will be a 2d array where the first index is the round and the second is the bout in the 
        // round in order, top -> bottom in the DE table.
        var boutTree = generateBoutTree(DEFencersList);
    
        
        // Finally, we create the array that will be used to generate the HTML to display the tableau.
        var HTMLTable = generateHTMLTable(boutTree);

    }
    
    //====================================================
    // BELOW: FUNCTIONS FOR GENERATING THE BOUT TREE
    //====================================================
    
    function generateHTMLTable(boutTree) {
        // First get the number of rows we need for the DE table, which is just numFencers - 1.
        // The rows look like the following
        
        /*
        Fencer1    Space         Space
        Space      Winner 1/2    Space
        Fencer2    Space         Space
        Space      Space         Final
        Fencer3    Space         Space
        Space      Winner 3/4    Space
        Fencer4    Space         Space
        */
        
        var numRows = (boutTree[0].length * 2) - 1;
        var numRounds = boutTree.length;
        
        
        // Each row will have exactly one fencer/bout.
        // We will create an array that maps row -> round
        var mapRowToRound = getMapRowToRound(numRows,numRounds);
    }
    
    function getMapRowToRound(numRows, numRounds) {
        // Each round there are (2^n)-1 spaces above and 2^n spaces below a fencer.
        // We will loop through each row for each round and add the round number.
        var map = [];
        var row = 0;
        var spacesAbove = 0;
        var spacesBelow = 0;
        
        // Loop over each round...
        for (var round=0; round<numRounds; round++){
            spacesBelow = Math.pow(2,round);
            spacesAbove = spacesBelow - 1;
            
            // Loop over each row...
            row = spacesAbove;
            
            while(row < numRows){
                map[row]=round;
    
                // Jump to next position.
                row = row + spacesBelow + spacesAbove + 1
            }
        }
        
    }
    
    
    //====================================================
    // ABOVE: FUNCTIONS FOR GENERATING THE BOUT TREE
    //====================================================
    
    //====================================================
    // BELOW: FUNCTIONS FOR GENERATING THE BOUT TREE
    //====================================================
    
    function generateBoutTree(tableauSeeds) {
        // Determine how many rounds of DEs there will be.
        var numRounds = Math.log2(tableauSeeds.length); // The seeds should be a power of 2, with Byes.
        
        // Create the bouts and put them in array / tree / weird thing.
        // Basically a reverse tree, each child has a reference to its parent node in the next round.
        
        // Loop from the last round (the final) to the preliminary round creating bouts.
        var boutTree = [];
        var boutsInRound = 1;
        
        // For each round...
        for (var i=numRounds-1; i>=0; i--) {
            
            // Add an empty array to hold the bouts in this round.
            boutTree[i] = [];
                
            // For each bout in round...
            for (var j=0; j<boutsInRound; j++) {
                
                if (i == numRounds-1) {
                    // This is the final bout. It has no parents.
                    // This around is just the one bout.
                    boutTree[numRounds-1].push(new DEBout());
                    
                    continue; // go to next round.
                }
                
                // Otherwise this is not the final. So lets create a bout that
                // points to its corresponding bout in the next round.
                
                // Every even (j) bouts points to the top of the bout in the next round,
                // and the odd bouts point to the bottom.
                
                var parentBoutIndex = j - (j % 2); // If odd, subtract one.
                var isTopOfParentBout = 0 == (j % 2); // If this bout is even (j).
                
                var parentBout = boutTree[i+1][parentBoutIndex];
                
                var newBout = new DEBout(parentBout, isTopOfParentBout);
                
                // Add it to the round.
                boutTree[i].push(newBout);    
            }
            
            boutsInRound *= 2; // Doubles each round back. Round of 16 -> 8 -> Semis -> final.
        }
        
        // Insert fencers into bouts in the first round.
        
        // Get an array mapping the position in the DE table (# from top to bottom)
        // to the seed of the fencer that should go in that spot.
        var boutOrder = tableSeedingService.getSeedingTemplate(tableauSeeds.length)
        
        // Loop through each fencer...
        var numFencers = tableauSeeds.length;   
        for (var l=0; l<numFencers; l+=2) {
            
            var fencerTop = tableauSeeds[boutOrder[l]-1];
            var fencerBottom = tableauSeeds[boutOrder[l+1]-1];
            
            // Get the bout to insert these fencers into.
            var bout = boutTree[0][l/2];
            
            // Add the fencers to the bout.
            bout.setFencerTop(fencerTop);
            bout.setFencerBottom(fencerBottom);
        }
        
        // Done.
        return boutTree;
        
    }
    
    //====================================================
    // ABOVE: FUNCTIONS FOR GENERATING THE BOUT TREE
    //====================================================
    
    //====================================================
    // BELOW: FUNCTIONS FOR GENERATING THE DE FENCER LIST
    //====================================================
    
    /* Uses the generatePoolsService to get a list of fencers (with pool results) */
    function generateInitialFencerListFromPools() {
        // Make sure the pool fencer list is empty.
        fencerList = [];
        
        // Get the pools.
        var pools = generatePoolService.getPools() // Not using parameter since this should be cached.
        
        // If the pools are empty display an error message.
        if (pools.length < 1) {
            alert("Could not get the pools to generate the DE table. Did you finish the pool round?");
            return; //exit.
        }
        
        // Otherwise lets get a list of poolFencer objects from the pools.
        for (var i=0; i<pools.length; i++) {
            for (var j=0; j<pools[i].length; j++) {
                fencerList.push(pools[i][j]); // Push a fencer on to the fencers array (we are removing the pools formatting).
            }
        }   
        
        return fencerList;
    }
    
    /* This function will take the pool data and create an array of DEFencer objects ranked based on their 
     * pool results. */
    function generateDEFencerList(poolFencerList) {
        // Sort the poolFencer objects based on their results.
        // We will use a bucket sort method so we only have to do serious sorting on buckets of fencers with
        // the same number of wins.
        
        // Sanity check.
        if (poolFencerList.length === 0) {
            return; //exit. 
        }
        
        // We will use a hashmap where the key is the win% (e.g. 50) and the value is an array of poolFencers.
        // We will make sure each bucket is sorted as we build it.
        var winPercentageBuckets = generateWinPercentageBuckets(poolFencerList);
        
        // Now, convert the buckets into a single array.
        var rankedPoolFencersList = generateSortedFencersListFromBuckets(winPercentageBuckets);
        
        // Convert all of those poolFencer objects to DEFencer objects.
        var rankedDEFencersList = convertPoolFencersToDEFencers(rankedPoolFencersList);
        
        // Fill out the rest of the table with Bye objects.
        addByesToFencerList(rankedDEFencersList);
        
        // Done!
        return rankedDEFencersList;
        
    }
    
    /* Fills out the remaining slots needed in the first round with byes. */
    function addByesToFencerList(rankedDEFencersList) {
        var numFencers = rankedDEFencersList.length;
        
        // Determine how many Byes we need.
        var numByes = 0;
        if (numFencers < 2) {
            // Don't know why you would do have a tournament with one or zero fencers but here we are.
            alert('Why even have a tournament with ' + numFencers + '?');
        } else if (numFencers < 4) {
            numByes = 4 - numFencers;
        } else if (numFencers < 8) {
            numByes = 8 - numFencers;
        } else if (numFencers < 16) {
            numByes = 16 - numFencers;
        } else if (numFencers < 32) {
            numByes = 32 - numFencers;
        } else if (numFencers < 64) {
            numByes = 64 - numFencers;
        } else if (numFencers < 128) {
            numByes = 128 - numFencers;
        } else if (numFencers < 256) {
            numByes = 256 - numFencers;
        } else if (numFencers < 512) {
            numByes = 512 - numFencers;
        } else {
            alert('I sincerely doubt you have a tournament with 512+ fencers.');
        }
        
        // For each bye, append a dummy DEFencer to the list.
        for (var i = 0; i < numByes; i++) {
            rankedDEFencersList.push(new DEFencer("","","",true));   
        }
    }
    
    /*
     * Replaces every poolFencer object in the list with a DEFencer (which holds less information
     * and has a flag indicating if it is a placeholder for a bye).
     */
    function convertPoolFencersToDEFencers(rankedPoolFencersList) {
        var rankedDEFencersList = [];
        
        // Loop over elements in array.
        for (i = 0; i < rankedPoolFencersList.length; i++) {
            var firstName = rankedPoolFencersList[i].firstName;
            var lastName = rankedPoolFencersList[i].lastName;
            var rating = rankedPoolFencersList[i].rating;
            
            var newDEFencer = new DEFencer(firstName, lastName, rating, false);
            
            rankedDEFencersList.push(newDEFencer);
        }
        
        return rankedDEFencersList;
    }
    
    /* Given a mostly sorted hash of poolFencers, create and return a sorted array .*/
    function generateSortedFencersListFromBuckets(winPercentageBuckets) {
        // First, get the list of keys (win %) in the hash.
        var sortedKeys = [];
        for (var key in winPercentageBuckets) {
            // Inserts the key, being mindful to keep the list sorted from greatest to least.
            insertWinPercentageKey(key,sortedKeys);
        }
        
        // Now we have a list of sorted keys. Lets append the attached values (sorted arrays of poolFencer
        // objects) to our DEFencerList. We will need to convert these objects to DEFencer objects as well.
        
        var sortedFencerList = [];
        for (var winPercentage in sortedKeys) {
            // Append values from each bucket to our sorted list.
            sortedFencerList.push.apply(sortedFencerList, winPercentageBuckets[winPercentage]);
        }
        
        return sortedFencerList;
    }
    
    /* Adds an integer key into the sortedKeys array, being mindful to keep the array sorted. */
    function insertWinPercentageKey(key,sortedKeys) {
        
        // Easy case: sortedKeys.length === 0.
        if (sortedKeys.length < 1) {
            sortedKeys.push(key);
            return; //exit.
        }
        
        // Loop through the array.
        for (var i = 0; i < sortedKeys.length; i++) {
            if (key > sortedKeys[i]) {
                sortedKeys.splice(i, 0, key);
                return; //exit, done.
            }
        }
        
        // We made it to the end of the list, just add the key to the end.
        sortedKeys.push(key);
    }
    
    function generateWinPercentageBuckets(fencerList) {
        // We will use a hashmap where the key is the win% (e.g. 50) and the value is an array of poolFencers.
        var winPercentageBuckets = {};
        
        // Loop through fencers.
        for (var i = 0; i < fencerList.length; i++){

            // Calculate the win percentage of each fencer and put them in the correct bucket.
            var fencer = fencerList[i];
            var winPercent = fencer.wins / (fencer.bouts.length - 1);
            winPercent = Math.floor(winPercent * 100); // Multiply by a hundred nd truncate decimal places so it is a bit more readable.

            // Add to the appropriate bucket if it exists, otherwise create the bucket.
            if (winPercentageBuckets[winPercent]){
                //winPercentageBuckets[winPercent].push(fencer);

                // Add the fencer to bucket while maintaining the sorted order of the bucket.
                insertFencerIntoBucket(winPercentageBuckets[winPercent], fencer);
            } else {
                // Bucket doesn't exist yet, create an array and add it.
                winPercentageBuckets[winPercent] = [fencer];
            }  
        }
        
        return winPercentageBuckets;
    }
    
    /* This function will add a poolFencer object to an array in sorted order
     * 
     * NOTE: This assumes all fencers in the pool have the same win %.
     */
    function insertFencerIntoBucket(bucket, fencer) {
        
        // Sanity check: bucket is nothing.
        if (!bucket) {
            return; // exit.   
        }
        
        // Short circuit case: bucket is empty (somehow).
        if (bucket.length < 1) {
            bucket.push(fencer);
            return; //exit.
        }
        
        // Loop through the bucket and insert the fencer at the correct index.
        for (var i = 0; i < bucket.length; i++){
            otherFencer = bucket[i]; // fencer to compare results too.
            
            var comparisonResult = compareFencerResults(fencer, otherFencer);
            
            // If the result is positive (>0): fencer should be place higher than otherFencer.
            if (comparisonResult > 0) {
                bucket.splice(i, 0, fencer);
                break; //done.
            
            // If the result is zero (0): the fencers are tied and we should randomize this a bit (though it
            // isn't completely CORRECTLY random as there are three or more tied fencers; that should 
            // be rare enough that this at least appears random).
            } else if (comparisonResult === 0) {
                // Do a coin flip.
                if (Math.floor(Math.random() * 2) == 0) {
                    // Hurray, you get to be ranked ahead of this guy!
                    bucket.splice(i, 0, fencer);
                    break; //done.
                } else {
                    // Lost the coin flip, just continue on to the next fencer.   
                }
            }
            
            // Otherwise otherFencer should be ranked higher and we can continue down the loop.
            
        }
        
        // If we made it through the above loop, this fencer did worse than everyone else in the bucket.
        // So stick him on to the end of the bucket.
        bucket.push(fencer);
        
    }
    
    /* Give two poolFencer objects returns
     * 1 if fencer has a better record than otherFencer.
     * 0 if they are tied.
     * -1 if fencer has a worse record than otherFencer.
     */
    function compareFencerResults(fencer, otherFencer) {
        
        // Compare indicators.
        var fencerInd = fencer.touchesScored - fencer.touchesReceived;
        var otherFencerInd = otherFencer.touchesScored - otherFencer.touchesReceived;
        
        if (fencerInd > otherFencerInd) {
            return 1;
        } else if (otherFencerInd > fencerInd) {
            return -1;
        }
        
        // If indicators are tied, compare touches scored.
        if (fencer.touchesScored > otherFencer.touchesScored) {
            return 1;
        } else if (otherFencer.touchesScored > fencer.touchesScored) {
            return -1;
        }
        
        // If we made it this far they are tied.
        return 0;
        
    }
    
    //====================================================
    // ABOVE: FUNCTIONS FOR GENERATING THE DE FENCER LIST
    //====================================================
    
    // Call init function.
    init();
    
    // Make above functions available to other controllers.
    return {
        
    };

});