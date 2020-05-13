angular.module('personalTrainer').
controller('updategoalController', function($scope, $location, $http, consts, userService) {
    const ctrl = this;
    
    ctrl.update = function () {
        userService.getUser(null, function(usr){
            usr.Goal.GoalWeight = ctrl.GoalWeight;
            usr.Goal.BodyFat = ctrl.BodyFat;
            usr.Goal.StartingWeight = usr.Measurement.Weight;
            usr.Goal.MenuID = 0;
            usr.Goal.GoalID = 0;
            usr.Goal.CreationDate = null;
            $http.post(`${consts.insertOrUpdateUser}`, usr).then(function({data}) {
                userService.updateGoalCache(usr.Goal);
                $location.path("/menu");
            });
        });
    }

    return ctrl;
});