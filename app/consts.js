const serverUrl = 'http://localhost/PersonalTrainerServer';

angular.module('personalTrainer').
constant('consts', {
    userApi: `${serverUrl}/user`,
    algApi: `${serverUrl}/alg`,
    nautritionGoalsApi: `${serverUrl}/api/user/NutritionGoals`,
    registerApi: `${serverUrl}/api/user/Register`,
    insertOrUpdateUser: `${serverUrl}/api/user/InsertOrUpdate`,
    menuApi: `${serverUrl}/menu`,
    similarFoodApi: `${serverUrl}/api/food/SimilarFood`,
    loginApi: `${serverUrl}/api/user/Login`,
    isUserExistsApi: `${serverUrl}/api/user/IsUserExists`,
    insertNewApi: `${serverUrl}/api/menu/InsertNew`,
    insertApi: `${serverUrl}/api/menu/Insert`,
    MeasurementsByUser: `${serverUrl}/api/measurement/GetMeasurementsByUser`,
    GetGoalsByUserId: `${serverUrl}/api/Goal/GetGoalsByUserId`,
    getUser: `${serverUrl}/api/user/user`,
    maxMenu: 4,
    minMenu:0
});