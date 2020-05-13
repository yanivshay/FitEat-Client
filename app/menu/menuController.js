
angular.module('personalTrainer').controller('menuController', function($scope, $http, consts, userService, $location) {
    const ctrl = this;
    ctrl.selectedMenu = null;
    ctrl.menuIndex = 0;

    ctrl.load = function() {
        userService.getUser(null, function(usr){
            ctrl.loader = true;
            $http.get(`${consts.algApi}/${usr.UserID}`)
                .then(function(response){
                    ctrl.menus = response.data;
                    distinctMenuItems();
                    ctrl.selectedMenu = ctrl.CountedMenus[ctrl.menuIndex];
                    ctrl.loader = false;
                });
        });
    }

    function distinctMenuItems(){
        var CountedMenu;
        ctrl.CountedMenus = [];

        for (const menuID in ctrl.menus) {
            CountedMenu = {
                Breakfast : [],
                Lunch : [],
                Dinner : []
            };
    
            CountedMenu.Breakfast = dashydash.uniqBy(ctrl.menus[menuID].Breakfast, 'FoodID');
            CountedMenu.Lunch = dashydash.uniqBy(ctrl.menus[menuID].Lunch, 'FoodID');
            CountedMenu.Dinner = dashydash.uniqBy(ctrl.menus[menuID].Dinner, 'FoodID');
            
            for (const mealType in CountedMenu) {
                for (const i in CountedMenu[mealType]) {
                    CountedMenu[mealType][i].Count = dashydash.filter(ctrl.menus[menuID][mealType], ['FoodID', CountedMenu[mealType][i].FoodID]).length;       
                }
                dashydash.sortBy(CountedMenu[mealType], ['FoodID']);
            }

            ctrl.CountedMenus.push(angular.copy(CountedMenu));
        }
    }

    ctrl.nextMenu = function() {
        if (ctrl.menuIndex < consts.maxMenu)
            ctrl.selectedMenu = ctrl.CountedMenus[++ctrl.menuIndex];
    }
    ctrl.prevMenu = function() {
        if (ctrl.menuIndex > consts.minMenu)
            ctrl.selectedMenu = ctrl.CountedMenus[--ctrl.menuIndex];
    }

    ctrl.chooseMenu = function() {
        userService.getUser(null, function(usr){
            var value = {
                UserId : usr.UserID,
                Menu : ctrl.menus[ctrl.menuIndex]
            }
    
            var url;
            if  (ctrl.menus[ctrl.menuIndex].MenuID != 0)
            {
                url= `${consts.insertApi}`;
            }
            else
            {
                url= `${consts.insertNewApi}`;
            }
    
            $http.post(url, value).then(function({data}) {
               
            });
        });


    }

    ctrl.editMenu = function() {
        userService.getUser(null, function(usr){
            usr.menu = ctrl.menus[ctrl.menuIndex];
            var menuHelper = {
                UserID: usr.UserID, 
                menu: ctrl.menus[ctrl.menuIndex]
            };

            $http.post(`${consts.insertApi}`, menuHelper).then(function({data}) {
                userService.setMenu(ctrl.menus[ctrl.menuIndex]);
                usr.Goal.MenuID = data.MenuID;
                userService.updateGoalCache(usr.Goal);
                $location.path("/editMenu");
            });
        });
    }
    
    ctrl.load();
    return ctrl;
});