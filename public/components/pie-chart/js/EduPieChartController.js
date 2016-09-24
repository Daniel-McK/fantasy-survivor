var app = angular.module("SrvvrApp");
app.directive("eduPieChart", function () {
    return {
        restrict: "E",
        scope: {
            data: "="
        },
        controller: ["$scope", "$interval", EduPieChartController],
        templateUrl: "components/pie-chart/html/edu-pie-chart.html"
    };
});

function Uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function EduPieChartController($scope, $interval) {

    var layoutComplete = false;
    $scope.selected = null;

    for (var datumIndex = 0; datumIndex < $scope.data.length; datumIndex++) {
        var datum = $scope.data[datumIndex];
        datum.style = {};
        datum.style["border-bottom"] = "3px solid rgba(" + datum.color + ",0.5)";
    }

    $scope.id = Uuid();
    $interval(function (count) {
        if (count === 100) {
            layoutComplete = true;
        }
        redraw(ease(count));
    }, 1, 100);

    $scope.findHovered = function (event) {
        if (!layoutComplete) {
            return;
        }
        var canvas = document.getElementById($scope.id);
        var width = canvas.width;
        var height = canvas.height;
        //var x = event.offsetX - (width / 2);
        //var y = (height / 2) - event.offsetY;
        var x = event.offsetX;
        var y = event.offsetY;

        for (var i = 0; i < $scope.data.length; i++) {
            var datum = $scope.data[i];
            var opposite = (y - datum.realY);
            var adjacent = (x - datum.realX);

            var theta = Math.atan(Math.abs(opposite) / Math.abs(adjacent));
            if (opposite < 0 && adjacent < 0) {  // o- a-
                theta = Math.PI + theta;
            } else if (adjacent < 0) { // o+ a-
                theta = Math.PI - theta;
            } else if (opposite < 0){ // o- a+
                theta = 2 * Math.PI - theta;
            }

            if (datum.startingAngle > theta || datum.endingAngle < theta) {
                continue;
            }
            var distance = Math.sqrt(Math.pow(opposite, 2) + Math.pow(adjacent, 2));
            if (distance > datum.radius) {
                continue;
            }
            $scope.selected = datum;
            return;
        }
        $scope.selected = null;
    }

    $scope.$watch("selected",
        function (newValue, oldValue) {
            if (layoutComplete) {
                redraw(1);
            }
        });
    
    function ease(u) {
        u = u / 100;
        // dervied from the cubic-bezier function (ignoring the y component) with parameters
        //      [   0,   0], 
        //      [0.25, 0.1], 
        //      [0.25,   1], 
        //      [   1,   1]
        return 0.3 * u * Math.pow(1 - u, 2) + 3 * Math.pow(u, 2) * (1 - u) + Math.pow(u, 3);
    }

    function drawSegment(canvas, context, i, percent) {
        context.save();
        var datum = $scope.data[i];
        if (i === 0) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        var centerX = Math.floor(canvas.width / 2);
        var centerY = Math.floor(canvas.height / 2);
        datum.radius = Math.floor(canvas.width / 2) - 5;

        datum.startingAngle = percentsToRadians(sumTo($scope.data, i)) * percent;
        var arcSize = percentsToRadians(datum.value) * percent;

        var unitVector = datum.startingAngle + (arcSize / 2);
        var xOffset = Math.cos(unitVector) * 5;
        var yOffset = Math.sin(unitVector) * 5;

        datum.realX = centerX + xOffset;
        datum.realY = centerY + yOffset;

        datum.endingAngle = datum.startingAngle + arcSize;

        context.beginPath();
        context.moveTo(datum.realX, datum.realY);
        context.arc(datum.realX, datum.realY, datum.radius,
                    datum.startingAngle, datum.endingAngle, false);
        context.closePath();

        var opacity = datum === $scope.selected ? "0.25" : "0.5";
        context.fillStyle = "rgba(" + datum.color + "," + opacity + ")";
        context.fill();

        context.restore();
    }

    function percentsToRadians(percents) {
        return (percents * Math.PI) / 50;
    }

    function sumTo(a, i) {
        var sum = 0;
        for (var j = 0; j < i; j++) {
            sum += a[j].value;
        }
        return sum;
    }

    function redraw(percent) {
        var canvas = document.getElementById($scope.id);
        var context = canvas.getContext("2d");
        for (var i = 0; i < $scope.data.length; i++) {
            drawSegment(canvas, context, i, percent);
        }
    }
}