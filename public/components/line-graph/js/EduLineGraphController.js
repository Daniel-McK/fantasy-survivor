var app = angular.module("SrvvrApp");
app.directive("eduLineGraph", function () {
    return {
        restrict: "E",
        scope: {
            data: "=",
            yPropertyName: "@",
        },
        controller: ["$scope", "$interval", "$timeout", EduLineGraphController],
        templateUrl: "components/line-graph/html/edu-line-graph.html"
    };
});

function Uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function EduLineGraphController($scope, $interval, $timeout) {

    for (var datumIndex = 0; datumIndex < $scope.data.length; datumIndex++) {
        var datum = $scope.data[datumIndex];
        datum.style = {};
        datum.style["border-bottom"] = "3px solid rgba(" + datum.color + ",0.5)";
    }
    $scope.width = 0;
    $scope.id = Uuid();
    $timeout(function(){
        var canvas = document.getElementById($scope.id);
        canvas.width = canvas.parentElement.scrollWidth;

        $scope.max = findMax($scope.data, $scope.yPropertyName);
        $scope.width = canvas.width;
        $scope.graphWidth = $scope.width - 50;
        $scope.segmentWidth = $scope.graphWidth / Math.max(($scope.data.length - 1), 1);
        waitAndRedraw();
    }, 0);

    function translateX(x){
        return x + 25;
    }

    function translateY(y){
        return 225 - y;
    }

    function findMax(arr, yProp){
        var max = 0;
        for (var i = 0; i < arr.length; i++) {
            max = Math.max(max, arr[i][yProp]);
        }
        return max;
    }

    function resetContext(canvas, ctx){
        ctx.strokeStyle = "grey";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(20, 225);
        ctx.lineTo(canvas.width - 20, 225);
        ctx.stroke();
    }

    function drawPoint(ctx, point, i, pct){
        ctx.beginPath();
        var x = $scope.segmentWidth * i;
        x = translateX(x);
        var y = point[$scope.yPropertyName] * 200 / $scope.max;
        y = translateY(y * pct);
        ctx.moveTo(x, y);
        ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.restore();

        //store for subsequent uses
        point._x = x;
        point._y  = y;
    }

    function drawConnecter(ctx, pointA, pointB){
        ctx.beginPath();
        ctx.moveTo(pointA._x, pointA._y);
        ctx.lineTo(pointB._x, pointB._y);
        ctx.stroke();
    }

    function drawSegment(canvas, context, i, percent) {
        context.save();
        var currentPoint = $scope.data[i];

        drawPoint(context, currentPoint, i, percent);

        if(i > 0){
            var lastPoint = $scope.data[i - 1];
            drawConnecter(context, lastPoint, currentPoint, percent);
        }
    }

    function ease(u) {
        u = u / 100;
        return 0.3 * u * Math.pow(1 - u, 2) + 3 * Math.pow(u, 2) * (1 - u) + Math.pow(u, 3);
    }

    function waitAndRedraw(){
        $interval(function (count) {
            if (count === 100) {
                layoutComplete = true;
            }
            redraw(ease(count));
        }, 1, 100);

    }

    function redraw(percent) {
        var canvas = document.getElementById($scope.id);
        var context = canvas.getContext("2d");

        resetContext(canvas, context);

        context.strokeStyle = "rgba(63, 81, 181, 1)";
        context.fillStyle = "rgba(63, 81, 181, 1)";
        
        for (var i = 0; i < $scope.data.length; i++) {
            drawSegment(canvas, context, i, percent);
        }
    }
}