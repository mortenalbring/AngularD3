var myApp = angular.module("myApp",[]);

myApp.controller("HomeController", function($scope) {
    $scope.test = "moop";

    $scope.graph = {
        width: 400,
        height: 200,
        margin: 30,
        radius: 3,
        svg: null,
        force: null,
        data: {
            nodes: [{ID:1, Name: "Test Node 1"},
                {ID: 2, Name: 'Test Node 2'}],
            edges: [{StartNode: 1, EndNode: 2}]
        }
    };

    $scope.addNode = function(ID,Name) {
        var newNode = {ID : ID, Name :Name};
        $scope.graph.data.nodes.push(newNode);
    }
    $scope.addEdge = function(StartNode,EndNode) {
        var newEdge = {StartNode: StartNode, EndNode: EndNode};
        $scope.graph.data.edges.push(newEdge);
    }




    function drawGraph() {

        d3.select("svg").remove();

        $scope.graph.data.linkData = linksIndexes($scope.graph.data.edges, $scope.graph.data.nodes);

        $scope.graph.svg = d3.select('#graph-container').append('svg')
            .attr('width', $scope.graph.width)
            .attr('height', $scope.graph.height)
            .attr('class', 'svg-container');

        //This sets up the parameters for the force directed graph simulation
        $scope.graph.force = d3.layout.force()
            .size([$scope.graph.width - $scope.graph.margin, $scope.graph.height - $scope.graph.margin])
            .nodes($scope.graph.data.nodes)
            .links($scope.graph.data.linkData)
            .linkDistance(50)
            //Distance between nodes
            .charge(-400)
            //How much nodes repel eachother (positive is attractive)
            .friction(0.5)
            //Slows down the nodes movement
            .gravity(0.25)
            //An attractive force towards the centre of the graph
            .on("tick", tick);

        $scope.graph.force.start();


        $scope.graph.linklines = $scope.graph.svg.selectAll(".link");
        $scope.graph.data.linkData = linksIndexes($scope.graph.data.edges, $scope.graph.data.nodes);

        $scope.graph.linklines = $scope.graph.linklines.data($scope.graph.data.linkData, function (d) {
            return d.source.ID + "-" + d.target.ID;
        });

        $scope.graph.linklines.enter()
            .insert("line", ".node")
            .attr("class", function (e) {
                return "link link-default";
            });
        $scope.graph.linklines.exit().remove();

        //Container for both the node and the label describing the node
        var gnodes = $scope.graph.svg.selectAll('g.gnode')
            .data($scope.graph.data.nodes)
            .enter()
            .append('g')
            .attr("class", function (d) {
                return "node-container";
            })
            .classed('gnode', true)
            .on("click", function (d) {
                console.log(d);
            })
            .call($scope.graph.force.drag);

        var cnode = gnodes.append("circle")
            .attr("class", "cnode")
            .attr("r", 2);

        var labels = gnodes.append("text")
            .attr("class", "label-text")
            .text(function (d) { return d.Name });


        function linksIndexes(dbEdges, dbNodes) {
            //The array of nodes and edges must be transformed into an object
            //that contains the actual node objects as source and target
            var output = [];
            for (var i = 0; i < dbEdges.length; i++) {
                var startId = dbEdges[i].StartNode;
                var endId = dbEdges[i].EndNode;
                var sourceNode = dbNodes.filter(function (n) { return n.ID == startId; });
                var targetNode = dbNodes.filter(function (n) { return n.ID == endId; });

                if ((sourceNode.length == 1) && (targetNode.length == 1)) {
                    output.push({
                        source: sourceNode[0],
                        target: targetNode[0]
                    });
                }
            }
            return output;
        }

        function tick() {
            gnodes.attr("transform", function (d) {
                return 'translate(' + [d.x, d.y] + ')';
            });

            $scope.graph.linklines.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });
        }
    }

    $scope.drawGraph = function() {
        drawGraph();
    }


});
