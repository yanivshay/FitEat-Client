angular.module('personalTrainer').
controller('progStatsController', function($scope, $location, $http, consts, userService) {
    const ctrl = this;
    
    ctrl.options = {
        fill: false,
        lineTension: 0
    };


    userService.getUser(null, function(usr){
        ctrl.usr = usr;

        ctrl.labels = ["Starting weight", "Current weight", "Goal weight"];
        ctrl.data = [usr.Goal.StartingWeight, usr.Measurement.Weight, usr.Goal.GoalWeight];
        ctrl.series = ['Goals'];
        ctrl.Golas = {};
        ctrl.Golas.series = ['Goals'];
        $http.get(`${consts.MeasurementsByUser}/${usr.UserID}`).then(function({data}){
            dashydash.orderBy(data, ['CreationDate'], ['desc']);
    
            if(data[0].Weight == usr.Goal.StartingWeight)
                ctrl.data = dashydash.map(data, 'Weight');
            else {
                ctrl.data = dashydash.map(data, 'Weight');
                ctrl.data.unshift(usr.Goal.StartingWeight);
            }
    
            ctrl.labels = [];
            let i = 0;
    
            dashydash.forEach(ctrl.data, function(value) {
                ctrl.labels.push(`${i++}`);
            });
            
            ctrl.labels[0] = "Starting weight";
    
            ctrl.labels[ctrl.data.length - 1] = "Current weight";
            
            ctrl.data.push(usr.Goal.GoalWeight);
            ctrl.labels.push("Goal weight");

            ctrl.chartData=[];
            let j = 0;

            dashydash.forEach(ctrl.data, function(value) {
                j++;
                ctrl.chartData.push( {x: j, y: value, label: `${j}`, indexLabel:"", markerColor:""});
            });
            ctrl.chartData[0].indexLabel="Starting weight";
            ctrl.chartData[0].markerColor ="green";
            ctrl.chartData[j-2].indexLabel="Current weight";
            ctrl.chartData[j-2].markerColor ="blue";
            ctrl.chartData[j-1].indexLabel="Goal weight";
            ctrl.chartData[j-1].markerColor ="red";
            
            var chart = new CanvasJS.Chart("chartContainer", {
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