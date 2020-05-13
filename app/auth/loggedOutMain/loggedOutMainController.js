angular.module('personalTrainer').
controller('loggedOutMainController' , function($scope, $location, $http, consts, userService, toaster, passwordValidation) {
    const ctrl = this;
    
    ctrl.model = {Email:"", Password:""};
    var Regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");

    ctrl.register = function () {
        $location.path("/register");
    }
    
    ctrl.login = function () {
        if(loginForm.email.checkValidity() && loginForm.password.checkValidity())
        {
            passwordValidation.checkValid(loginForm.password.value ,function() {
                userService.login( ctrl.model ,function(user) {
                    (user !=null)?$location.path("/main"): toaster.pop('error', "", "user doesnt exist");
                });
            });
        }
    };

    return ctrl;
});