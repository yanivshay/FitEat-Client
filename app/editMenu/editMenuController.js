angular.module('personalTrainer').
controller('editMenuController', function($scope, $http, consts, userService, $mdDialog, $location) {
    const ctrl = this;
    ctrl.exceedProteins = ctrl.exceedFats = ctrl.exceedCarbohydrates = ctrl.exceedCalories = false;
    ctrl.editable = false;
    ctrl.Amount = [1,2,3,4,5];
    var emptyFood = {
        Calories: 0,
        Carbohydrates: 0,
        Fat: 0,
        FoodID: 0,
        Grams: 0,
        Name: "",
        Protein: 0,
        Count: 1,
    };

    ctrl.load = function() {
        userService.getUser(null, function(usr){
            ctrl.menu = userService.getMenu();
            if(angular.isUndefinedOrNull(ctrl.menu)) {
                $location.path("/main");
            }
            else {
                ctrl.loader = true;
                $http.get(`${consts.nautritionGoalsApi}/`+ usr.UserID)
                            .then(function(response){
                                ctrl.nautritionGoals = new nautritionGoalsRange(response.data);
                                $http.get(`${consts.similarFoodApi}`)
                                    .then(function(response2){
                                        ctrl.FoodByMealType = response2.data;
                                        
                                        // The md-select directive eats keydown events for some quick select
                                        // logic. Since we have a search input here, we don't need that logic.
                                        $('.menuTable').find('input').on('keydown', function(ev) {
                                            ev.stopPropagation();
                                        });
                                        ctrl.loader = false;
                                        showAlert();
                                        distinctMenuItems();
                                });
                        }); 
                }
        });       
    }

    ctrl.clearSearchTerm = function() {
        ctrl.searchTerm = '';
    };
      

    ctrl.Finish = function() {
        $location.path("/main");
    }

    function distinctMenuItems() {
        ctrl.CountedMenu = {
            Breakfast : [],
            Lunch : [],
            Dinner : []
        };

        ctrl.CountedMenu.Breakfast = dashydash.uniqBy(ctrl.menu.Breakfast, 'FoodID');
        ctrl.CountedMenu.Lunch = dashydash.uniqBy(ctrl.menu.Lunch, 'FoodID');
        ctrl.CountedMenu.Dinner = dashydash.uniqBy(ctrl.menu.Dinner, 'FoodID');
        
        for (const mealType in ctrl.CountedMenu) {
            for (const i in ctrl.CountedMenu[mealType]) {
                ctrl.CountedMenu[mealType][i].Count = dashydash.filter(ctrl.menu[mealType], ['FoodID', ctrl.CountedMenu[mealType][i].FoodID]).length;       
            }
            dashydash.sortBy(ctrl.CountedMenu[mealType], ['FoodID']);
        }

        ctrl.DistinctMenu = angular.copy(ctrl.CountedMenu);        
    }

     ctrl.getSelectedFoodText = function(food, mealType) {
        if (!ctrl.editable) {
            return food.Name + " (" + food.Grams * dashydash.find(ctrl.CountedMenu[mealType], ['FoodID', food.FoodID]).Count + " g.)";
        }
        else {
            return food.Name;
        }
    }

    ctrl.onChangeAmount = function(food, mealType) {
        updateMenuInfo();
        var foodAppearance = dashydash.filter(ctrl.menu[mealType], ['FoodID', food.FoodID]).length;

        if (foodAppearance > food.Count) {
            dashydash.remove(ctrl.menu[mealType], {'FoodID' : food.FoodID});

            for (let i = 0; i < food.Count; i++) {
                ctrl.menu[mealType].push(angular.copy(food));
            }
        }
        else {
            for (let i = 0; i < (food.Count - foodAppearance); i++) {
                ctrl.menu[mealType].push(angular.copy(food));
            }
        }

        dashydash.sortBy(ctrl.menu[mealType], ['FoodID']);
    }

    ctrl.removeFoodFromMealType = function(index, mealType){
        updateMenuInfo();
        var food = ctrl.DistinctMenu[mealType][index];

        dashydash.remove(ctrl.menu[mealType], {'FoodID' : food.FoodID});
        dashydash.remove(ctrl.DistinctMenu[mealType], {'FoodID' : food.FoodID});
        dashydash.remove(ctrl.CountedMenu[mealType], {'FoodID' : food.FoodID});
    }

    ctrl.addFoodToMealType = function(mealType){
        ctrl.DistinctMenu[mealType].push(angular.copy(emptyFood));
        ctrl.CountedMenu[mealType].push(angular.copy(emptyFood));
    }

    ctrl.Edit = function() {
        if (ctrl.editable) {
            dashydash.remove(ctrl.DistinctMenu.Breakfast, {'FoodID' : 0});
            dashydash.remove(ctrl.DistinctMenu.Lunch, {'FoodID' : 0});
            dashydash.remove(ctrl.DistinctMenu.Dinner, {'FoodID' : 0});

            if (ctrl.menu.MenuID == 0) {
                userService.getUser(null, function(usr){
                    usr.menu = ctrl.menu;
                    var menuHelper = {
                        UserID: usr.UserID, 
                        menu: ctrl.menu
                    };
        
                    $http.post(`${consts.insertApi}`, menuHelper).then(function({data}) {
                        usr.Goal.MenuID = data.MenuID;
                        userService.updateGoalCache(usr.Goal);
                        userService.setMenu(data);
                    });
                });
            }
        }

        ctrl.editable = !ctrl.editable;
        ctrl.DistinctMenu = angular.copy(ctrl.DistinctMenu);
    }

    function showAlert() {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Pay Attention')
            .textContent('You can change items on your menu, but you can\'t exceed the nutrition ranges shown below.')
            .ariaLabel('Alert Dialog')
            .ok('Got it!')
        );
      };

    function updateMenuInfo() {
        ctrl.menu.MenuID = 0;
        calculateNautritionGoals();
    }

    ctrl.onChangeFood = function(oldFood, newFood, index, mealType) {
        if (oldFood.FoodID != newFood.FoodID) {           
            ctrl.clearSearchTerm();

            if (oldFood.FoodID == 0) {
                ctrl.menu[mealType].push(newFood);
            }
            else {
                var indexOldFood = dashydash.findIndex(ctrl.menu[mealType], ['FoodID', oldFood.FoodID]);
                while (indexOldFood != -1) {
                    ctrl.menu[mealType][indexOldFood] = angular.copy(newFood);

                    indexOldFood = dashydash.findIndex(ctrl.menu[mealType], ['FoodID', oldFood.FoodID]);
                }
            }

            newFood.Count = ctrl.CountedMenu[mealType][index].Count;
            ctrl.CountedMenu[mealType][index] = angular.copy(newFood);            
        }
    }

    function calculateNautritionGoals() {
        var TotalProtien = 0, TotalFats = 0, TotalCarbohydrates = 0, TotalCalories = 0;

        for (const index in ctrl.menu.Breakfast) {
            TotalProtien += ctrl.menu.Breakfast[index].Protein;
            TotalFats += ctrl.menu.Breakfast[index].Fat;
            TotalCarbohydrates += ctrl.menu.Breakfast[index].Carbohydrates;
            TotalCalories += ctrl.menu.Breakfast[index].Calories;
        }
        for (const index in ctrl.menu.Lunch) {
            TotalProtien += ctrl.menu.Lunch[index].Protein;
            TotalFats += ctrl.menu.Lunch[index].Fat;
            TotalCarbohydrates += ctrl.menu.Lunch[index].Carbohydrates;
            TotalCalories += ctrl.menu.Lunch[index].Calories;
        }
        for (const index in ctrl.menu.Dinner) {
            TotalProtien += ctrl.menu.Dinner[index].Protein;
            TotalFats += ctrl.menu.Dinner[index].Fat;
            TotalCarbohydrates += ctrl.menu.Dinner[index].Carbohydrates;
            TotalCalories += ctrl.menu.Dinner[index].Calories;
        }

        ctrl.exceedProteins = ctrl.exceedFats = ctrl.exceedCarbohydrates = ctrl.exceedCalories = false;

        if(TotalProtien > ctrl.nautritionGoals.maxProteins || TotalProtien < ctrl.nautritionGoals.minProteins){
            ctrl.exceedProteins = true;
        }
        if(TotalFats > ctrl.nautritionGoals.maxFats || TotalFats < ctrl.nautritionGoals.minFats){
            ctrl.exceedFats = true;
        }
        if(TotalCarbohydrates > ctrl.nautritionGoals.maxCarbohydrates || TotalCarbohydrates < ctrl.nautritionGoals.minCarbohydrates){
            ctrl.exceedCarbohydrates = true;
        }
        if(TotalCalories > ctrl.nautritionGoals.maxCalories || TotalCalories < ctrl.nautritionGoals.minCalories){
            ctrl.exceedCalories = true;
        }
    }

    function nautritionGoalsRange(ng){
        this.minProteins = ng.Proteins - 10;
        this.maxProteins = ng.Proteins + 20;
        this.minFats = ng.Fats - 5;
        this.maxFats = ng.Fats + 5;
        this.minCalories = ng.Calories - 100;
        this.maxCalories = ng.Calories + 100;
        this.minCarbohydrates = ng.Carbohydrates - 100;
        this.maxCarbohydrates = ng.Carbohydrates + 100;
    }
    
    ctrl.load();
    return ctrl;
});