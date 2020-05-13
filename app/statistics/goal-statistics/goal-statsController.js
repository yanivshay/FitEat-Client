angular.module('personalTrainer').
controller('goalStatsController', function($scope, $location, $http, consts, userService) {
    const ctrl = this;
    ctrl.showSorryMessage = true;
    
    userService.getUser(null, function(usr){
        ctrl.usr = usr;
        
        ctrl.options = {
            fill: false,
            lineTension: 0
        };

        $http.get(`${consts.GetGoalsByUserId}/${usr.UserID}`).then(function({data}){
            dashydash.orderBy(data, ['CreationDate'], ['desc']);

            ctrl.data = dashydash.map(data, 'GoalWeight');

            if(ctrl.data.length > 1)
                ctrl.showSorryMessage = false;
            else
                return 0;
    
            ctrl.labels = [];
            let i = 0;
    
            dashydash.forEach(ctrl.data, function(value) {
                ctrl.labels.push(`Goal ${1 + (i++)}`);
            });
            
            ctrl.labels[0] = "First goal";
            ctrl.labels[ctrl.data.length - 1] = "Current goal";

            
            ctrl.chartData=[];
            let j = 0;

            dashydash.forEach(ctrl.data, function(value) {
                j++;
                ctrl.chartData.push( {x: j, y: value, label: `${j}`, indexLabel:"", markerColor:""});
            });
            ctrl.chartData[0].indexLabel="First goal";
            ctrl.chartData[0].markerColor ="green";
            ctrl.chartData[j-1].indexLabel="Current goal";
            ctrl.chartData[j-1].markerColor ="red";
            
            var chart = new CanvasJS.Chart("goalChart", {
                animationEnabled: true,
                backgroundColor: "#ff000000",
                axisX: {
                    minimum: 1,
                    maximum: j,
                },
                data: [{
                    indexLabelMaxWidth: 50,
                    indexLabelFontSize: 12,
                    indexLabelFontColor: "darkSlateGray",
                    name: "views",
                    type: "area",
                    fillOpacity: .5,
                    dataPoints: ctrl.chartData
                }]
            });
            chart.render();

        });
    });

    return ctrl;
});