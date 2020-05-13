
angular.module('personalTrainer').controller('mainController', function($scope, userService, $location, $http, consts) {
    $scope.logout = function() {
        userService.logout();
        $location.path("/");
    }

    $scope.hasLogged = function() {
        return userService.hasLogged();
    }

    $scope.createMenu = function () {
        $location.path("/menu");
    }


    $scope.editMenu = function() {
        userService.getUser(null, function(usr){

            if(angular.isUndefinedOrNull(usr.Goal.MenuID)) {
                $location.path("/menu");
            }
            else {
                $http.get(`${consts.menuApi}/` + usr.Goal.MenuID)
                    .then(function(response){
                        userService.setMenu(response.data);
                        $location.path("/editMenu");
                });
            }
        });
    }
});