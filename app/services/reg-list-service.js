myApp.service('regListService', function() {
    // including test fencers. delete later.
    var regList = [
        {firstName: 'first1', lastName: 'last1', rating: 'A13'},
        {firstName: 'first2', lastName: 'last2', rating: 'A13'},
        {firstName: 'first3', lastName: 'last3', rating: 'A13'},
        {firstName: 'first4', lastName: 'last4', rating: 'A13'},
        {firstName: 'first5', lastName: 'last5', rating: 'A13'},
        {firstName: 'first6', lastName: 'last6', rating: 'A13'},
        {firstName: 'first7', lastName: 'last7', rating: 'A13'},
        {firstName: 'first8', lastName: 'last8', rating: 'A13'},
        {firstName: 'first9', lastName: 'last9', rating: 'A13'},
        {firstName: 'first10', lastName: 'last10', rating: 'A13'},
        {firstName: 'first11', lastName: 'last11', rating: 'A13'},
        {firstName: 'first12', lastName: 'last12', rating: 'A13'},
        {firstName: 'first13', lastName: 'last13', rating: 'A13'},
        {firstName: 'first14', lastName: 'last14', rating: 'A13'},
        {firstName: 'first15', lastName: 'last15', rating: 'A13'},
        {firstName: 'first16', lastName: 'last16', rating: 'A13'},
        {firstName: 'first17', lastName: 'last17', rating: 'A13'},
        {firstName: 'first18', lastName: 'last18', rating: 'A13'},
        {firstName: 'first19', lastName: 'last19', rating: 'A13'},
        {firstName: 'first20', lastName: 'last20', rating: 'A13'},
        {firstName: 'first21', lastName: 'last21', rating: 'A13'},
        {firstName: 'first22', lastName: 'last22', rating: 'A13'},
        {firstName: 'first23', lastName: 'last23', rating: 'A13'},
        {firstName: 'first24', lastName: 'last24', rating: 'A13'},
        {firstName: 'first25', lastName: 'last25', rating: 'A13'}
    ];

    // Add a fencer to the reg list.
    var addFencerToRegList = function(fencerFirstName, fencerLastName, fencerRating) {
        regList.push({firstName: fencerFirstName, lastName: fencerLastName, rating: fencerRating});
    };

    // Return the array of fencers.
    var getRegList = function(){
        return regList;
    };

    // Make above functions available to other controllers.
    return {
        addFencerToRegList: addFencerToRegList,
        getRegList: getRegList
    };

});