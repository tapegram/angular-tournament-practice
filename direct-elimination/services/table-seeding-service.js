myApp.service('tableSeedingService', function() {
    var tableOf2 = [1,2];
    var tableOf4 = [1,4,3,2];
    var tableOf8 = [1,8,5,4,3,6,7,2];
    var tableOf16 = [1,16,9,8,5,12,13,4,3,14,11,6,7,10,15,2];
    var tableOf32 = [1,32,17,16,9,24,25,8,5,28,21,12,13,20,29,4,3,30,19,14,11,22,27,6,7,26,23,10,15,18,31,2];
    var tableOf64 = [1,64,33,32,17,48,49,16,9,56,41,24,25,40,57,8,5,60,37,28,21,44,53,12,13,52,45,20,29,36,61,4,3,62,35,30,19,46,51,14,11,54,43,22,27,38,59,6,7,58,39,26,23,42,55,10,15,50,47,18,31,34,63,2];
    var tableOf128 = [1,128,65,64,33,96,97,32,17,112,81,48,49,80,113,16,9,120,73,56,41,88,105,24,25,104,89,40,57,72,121,8,5,124,69,60,37,92,101,28,21,108,85,44,53,76,117,12,13,116,77,52,45,84,109,20,29,100,93,36,61,68,125,4,3,126,67,62,35,94,99,30,19,110,83,46,51,78,115,14,11,118,75,54,43,86,107,22,27,102,91,38,59,70,123,6,,7,122,71,58,39,90,103,26,23,106,87,42,55,74,119,10,15,114,79,50,47,82,111,18,31,98,95,34,63,66,127,2];
    var tableOf256 = [];
    
    var getSeedingTemplate =function(roundOf) {
        switch(roundOf) {
            case 2:
                return tableOf2;
                break;
            case 4:
                return tableOf4;
                break;
            case 8:
                return tableOf8;
                break;
            case 16:
                return tableOf16;
                break;
            case 32:
                return tableOf32;
                break;
            case 64:
                return tableOf64;
                break;
            case 128:
                return tableOf128;
                break;
            default:
                alert("We don't support tournaments of more than 128 fencers. Sorry!");
                      break;
                
        }
    }
    
    
    // Make above functions available to other controllers.
    return {
        getSeedingTemplate: getSeedingTemplate
    };

});