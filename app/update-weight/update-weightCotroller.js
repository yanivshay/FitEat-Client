angular.module('personalTrainer').
controller('updateWeightController', function($scope, $location, $http, consts, userService, $mdDialog) {
    const ctrl = this;
    
    ctrl.update = function () {
        userService.getUser(null, function(usr){
            usr.Measurement.Weight = ctrl.Weight;
            usr.Measurement.BodyFat = ctrl.BodyFat;
            $http.post(`${consts.insertOrUpdateUser}`, usr).then(function({data}) {
                userService.updateMeasurementCache(usr.Measurement);
                if (usr.Measurement.Weight == usr.Goal.GoalWeight){
                    showAlert();
                    $location.path("/updategoal");
                }
                else{
                    $location.path("/main");
                }
            });
        });
    }

    function showAlert() {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Good job!')
            .textContent('You have reached your goal! let us create a new one')
            .ariaLabel('Alert Dialog')
            .ok('yay!')
        );
      };

    return ctrl;
});