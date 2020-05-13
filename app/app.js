'use strict';

const personalTrainer = angular.module('personalTrainer', ['toaster', 'ngResource', 'ngRoute', 'ngAnimate', 'angularSpinner', 'ngMaterial', 'chart.js']);


personalTrainer.config(['$routeProvider', '$httpProvider', '$locationProvider', ($routeProvider, $httpProvider, $locationProvider) => {

    $httpProvider.interceptors.push(['$injector', function($injector){
        return {
            response: function(response) {
              $injector.get('userService').cacheUserFunc();
              return response;
            }}
    }])

    $locationProvider.hashPrefix('');
    
    $routeProvider.when('/',
    {
        templateUrl: /*!*/ 'HTML/landing.html',
        
    }).when('/login',
    {
        templateUrl: /*!*/ 'HTML/loggedOutMain.html',
        controller: 'loggedOutMainController',
        controllerAs: 'ctrl'
    }).when('/register',
    {
        templateUrl: /*!*/ 'HTML/register.html',
        controller: 'registerController',
        controllerAs: 'ctrl'
    }).when('/main',
    {
        templateUrl: /*!*/ 'HTML/loggedInMain.html',
        controller: 'loggedInMainController',
        controllerAs: 'ctrl'
    })
    .when('/menu',
    {
        templateUrl: /*!*/ 'HTML/menu.html',
        controller: 'menuController',
        controllerAs: 'ctrl'
    })
    .when('/editMenu',
    {
        templateUrl: /*!*/ 'HTML/editMenu.html',
        controller: 'editMenuController',
        controllerAs: 'ctrl'
    })
    .when('/updateweight',
    {
        templateUrl: /*!*/ 'HTML/update-weight.html',
        controller: 'updateWeightController',
        controllerAs: 'ctrl'
    })
    .when('/goalstats',
    {
        templateUrl: /*!*/ 'HTML/goal-stats.html',
        controller: 'goalStatsController',
        controllerAs: 'ctrl'
    })
    .when('/progstats',
    {
        templateUrl: /*!*/ 'HTML/prog-stats.html',
        controller: 'progStatsController',
        controllerAs: 'ctrl'
    })
    .when('/updategoal',
    {
        templateUrl: /*!*/ 'HTML/update-goal.html',
        controller: 'updategoalController',
        controllerAs: 'ctrl'
    })
}]);
personalTrainer.run( function($rootScope, userService, $location) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        if(next.templateUrl){
            if (!userService.hasLogged() &&   next.templateUrl.indexOf("loggedOutMain") > -1) {
                    $location.path( "/login" );
            }
            else if (!userService.hasLogged() &&  next.templateUrl.indexOf("register") > -1) {
                $location.path( "/register" );
            }
            else if (!userService.hasLogged() &&  !(next.templateUrl.indexOf("landing") > -1)) {
                $location.path( "/" );
            }
            else if (userService.hasLogged() && 
            (next.templateUrl.indexOf("loggedOutMain") > -1 || next.templateUrl.indexOf("register") > -1)) {
                $location.path( "/main" );
            }  
        }  
    });
 })
personalTrainer.factory("userPersistenceService", [
	"$cookies", function($cookies) {
		var user = "";
 
		return {
			setCookieData: function(user) {
				user = user;
				$cookies.put("user", user);
			},
			getCookieData: function() {
				user = $cookies.get("user");
				return user;
			},
			clearCookieData: function() {
				user = "";
				$cookies.remove("user");
			}
		}
	}
]);

personalTrainer.config = {
    capabilities: {
        browserName: 'chrome',
        version: '',
        platform: 'ANY',
        'chromeOptions': {
            'args': ['lang=utf8']
        }
    }
}