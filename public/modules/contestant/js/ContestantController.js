angular.module('SrvvrApp').controller('ContestantCtrl', [
    '$scope',
    '$stateParams',
    'dataService',
    '$q',
    function ($scope, $stateParams, dataService, $q) {

        var typeName = 'Contestant';
        var pointTypeName = 'Point'
        var colors = [
            '255,87,34',
            '63,81,181',
            '0,150,36',
            '205,220,57',
            '0,255,0',
            '0,0,255',
            '255,125,125'
        ];
        var colorPos = 0;

        function getContestantData(id) {
            return dataService.getRecordById(typeName, id)
                .then(function (results) {
                    $scope.data.profile = results.data;
                });
        }

        function getPoints(id) {
            return dataService.getCustomData('/api/point/by-contestant/' + id)
                .then(function (results) {
                    $scope.data.points = results.data;
                    compilePieChart();
                    compileLineGraph();
                });
        }

        function compilePieChart() {
            var typeIdMap = {};
            $scope.data.pieChart = [];
            var sum = 0;

            for (var i = 0; i < $scope.data.points.length; i++) {
                var datum = $scope.data.points[i];
                var point = typeIdMap[datum.type._id];
                if (typeof (typeIdMap[datum.type._id]) == 'undefined') {
                    point = {};
                    point.title = datum.type.name;
                    point.color = colors[colorPos++];
                    point.value = datum.type.amount;
                    typeIdMap[datum.type._id] = point;
                    $scope.data.pieChart.push(point);
                }
                else {
                    point.value += datum.type.amount;
                }
                sum += datum.type.amount;
            }
            for (var i = 0; i < $scope.data.pieChart.length; i++) {
                var datum = $scope.data.pieChart[i];
                datum.value = datum.value * 100 / sum;
            }

        }

        function compileLineGraph() {
            var episodeMap = {};
            var maxEpisode = 0;
            var maxPoints = 0;
            for (var i = 0; i < $scope.data.points.length; i++) {
                var point = $scope.data.points[i];
                maxEpisode = Math.max(maxEpisode, point.episode.number);
                if (!episodeMap[point.episode.number]) {
                    episodeMap[point.episode.number] = 0;
                }
                episodeMap[point.episode.number] += point.type.amount;
            }
            $scope.data.barGraph = [];
            for (i = 0; i < maxEpisode; i++) {
                var val = episodeMap[i + 1]
                if (val) {
                    $scope.data.barGraph[i] = val;
                }
                else {
                    $scope.data.barGraph[i] = 0;
                }
                maxPoints = Math.max(maxPoints, $scope.data.barGraph[i]);
            }
            $scope.data.maxPoints = maxPoints;
            createLineGraph();
        }

        function createLineGraph() {
            var width = 300;
            var height = 250;
            var topMargin = 0;
            var bottomMargin = 35;
            var spacer = 5;
            var n = $scope.data.barGraph.length;
            var blockWidth = ((width + spacer) / n) - spacer;

            var vertScale = d3.scaleLinear()
                .domain([0, $scope.data.maxPoints])
                .range([0, height - topMargin - bottomMargin]);

            var svg = d3.select('#contestant-episode')
                .attr('width', function (d) {
                    return width;
                })
                .attr('height', function (d) {
                    return height;
                });

            svg.selectAll('rect')
                .data($scope.data.barGraph)
                .enter()
                .append('rect')
                .attr('x', function (d, i) {
                    return (blockWidth + spacer) * i;
                })
                .attr('y', function (d) {
                    return height - vertScale(d) - bottomMargin;
                })
                .attr('width', blockWidth)
                .attr('height', function (d) {
                    return vertScale(d);
                })
                .classed('point-bar', true);

            function isValueTooSmall(d){
                var val = vertScale(d);
                if(val < 30){
                    return true;
                }
                else {
                    return false;
                }
            }

            svg.selectAll('text.point-text')
                .data($scope.data.barGraph)
                .enter()
                .append('text')
                .text(function (d) {
                    return d ? d : "";
                })
                .attr('x', function (d, i) {
                    return (blockWidth + spacer) * i + blockWidth * 0.49;
                })
                .attr('y', function (d) {
                    var baseLine = height - vertScale(d) - bottomMargin; 
                    return isValueTooSmall(d) ? baseLine - 5 : baseLine + 20;
                })
                .classed('point-text', true)
                .attr('fill', function (d) {
                    return isValueTooSmall(d) ? "black" : "white";                    
                });

            svg.selectAll('text.episode-text')
                .data($scope.data.barGraph)
                .enter()
                .append('text')
                .text(function (d, i) {
                    return i + 1;
                })
                .attr('x', function (d, i) {
                    return (blockWidth + spacer) * i + blockWidth * 0.49;
                })
                .attr('y', 230);

            svg.append("line")
                .attr('x1', 0)
                .attr('y1', height - bottomMargin)
                .attr('x2', width)
                .attr('y2', height - bottomMargin)
                .classed("axis", true);


        }

        function init() {
            $scope.loading = true;
            $scope.data = {};
            var contestantPromise = getContestantData($stateParams.id);
            var pointsPromise = getPoints($stateParams.id);
            $q.all([contestantPromise, pointsPromise]).then(function (results) {
                $scope.loading = false;
            });
        }

        init();
    }
]);