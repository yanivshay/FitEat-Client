angular.module('personalTrainer').
controller('loggedInMainController', function($scope, $location, $http, consts, userService) {
    const ctrl = this;
    
    userService.getUser(null, function(usr){
        ctrl.user = usr;
    });
    
    return ctrl;
});