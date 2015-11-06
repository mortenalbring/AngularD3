var myApp = angular.module("myApp", []);

myApp.controller("HomeController", function ($scope) {

    $scope.settings = {
        linkDistance: 200,
        charge: -1000
    }
    $scope.checkCustomSettings = function (customSettings) {
        if (!customSettings.linkDistance) { customSettings.linkDistance = $scope.settings.linkDistance; }
        if (!customSettings.charge) { customSettings.charge = $scope.settings.charge; }
    }

    $scope.increaseValue = function (setting, val) {
        $scope.$apply(setting, function () {
            setting = setting + val;
        })
        drawGraph();
    }
    $scope.increaseCharge = function (val) {
        $scope.settings.charge = $scope.settings.charge + val;
        drawGraph();
    }

    $scope.increaseLinkDistance = function (val) {
        $scope.settings.linkDistance = $scope.settings.linkDistance + val;
        drawGraph();
    }

    $scope.graph = {
        width: 600,
        height: 600,
        margin: 30,
        radius: 3,
        svg: null,
        force: null,
        data: {
            nodes: [{ ID: 1, Name: "Test Node 1" },
                { ID: 2, Name: 'Test Node 2' },
                { ID: 3, Name: 'Test Node 3' },
                { ID: 4, Name: 'Test Node 4' },
                { ID: 5, Name: 'Test Node 5' },
                { ID: 6, Name: 'Test Node 6' },
            ],

            edges: [{ StartNode: 1, EndNode: 2 },
                { StartNode: 2, EndNode: 3 },
                { StartNode: 3, EndNode: 4 },
                { StartNode: 4, EndNode: 5 },
                { StartNode: 5, EndNode: 6 },
                { StartNode: 6, EndNode: 3 }
            ]
        }
    };

    $scope.clicked = {
        StartNode: null,
        EndNode: null
    }
    $scope.drawMultipleCubes = function () {
        $scope.graph.data = angular.copy(multiplecubes.data);
        $scope.settings = angular.copy(multiplecubes.settings);
        drawGraph();
    }
    $scope.drawGraphene = function () {
        $scope.graph.data = angular.copy(graphene.data);
        $scope.settings = angular.copy(graphene.settings);
        drawGraph();
    }
    $scope.drawCube = function () {
        $scope.graph.data = angular.copy(cube.data);
        $scope.settings = angular.copy(cube.settings);
        drawGraph();
    }

    $scope.setClickedNode = function (node) {
        //Sets a node as 'clicked'. If it's the first time a node is clicked, we just set the property.
        //If it's the second time, we make an edge and connect the two

        if (!$scope.clicked.StartNode) {
            $scope.clicked.StartNode = node;
            node.clicked = true;
        } else {
            $scope.clicked.EndNode = node;

            makeEdges($scope.clicked.StartNode.ID, $scope.clicked.EndNode.ID);
            $scope.clicked.StartNode.clicked = false;
            $scope.clicked.EndNode.clicked = false;
            $scope.clicked.StartNode = null;
            $scope.clicked.EndNode = null;
            drawGraph();
            $scope.clearHighlights();
        }
    }

    $scope.highlightConnectedNodes = function (ID) {
        //Finds all nodes connected to specified node
        var connectedEdges = $scope.graph.data.edges.filter(function (e) {
            return ((e.StartNode == ID) || (e.EndNode == ID));
        })


        for (var i = 0; i < connectedEdges.length; i++) {
            if (connectedEdges[i].StartNode != ID) {
                $scope.setHighlight(connectedEdges[i].StartNode);
            }
            if (connectedEdges[i].EndNode != ID) {
                $scope.setHighlight(connectedEdges[i].EndNode);
            }

        }
    }


    $scope.clearHighlights = function () {
        //Clears all highlight properties
        var highlighted = $scope.graph.data.nodes.filter(function (e) {
            return e.highlight == true;
        });

        for (var i = 0; i < highlighted.length; i++) {
            highlighted[i].highlight = false;
        }

    }

    $scope.setHighlight = function (ID) {        
        //Sets the highlight property on nodes connected to given ID
        var connectedNodes = $scope.graph.data.nodes.filter(function (e) {
            return e.ID == ID;
        });
        for (var j = 0; j < connectedNodes.length; j++) {
            connectedNodes[j].highlight = true;
        }
    }

    $scope.addNode = function (ID, Name) {
        //Adds a node to the graph
        if (!ID) {
            ID = $scope.graph.data.nodes.length + 1;
        }
        if (!Name) {
            Name = "Test Node " + ID;
        }
        var newNode = { ID: ID, Name: Name };
        $scope.graph.data.nodes.push(newNode);
        drawGraph();
    }
    $scope.addEdge = function (StartNodeID, EndNodeID) {
        makeEdges(StartNodeID, EndNodeID);
        drawGraph();
    }



    $scope.randomise = function () {
        //Generates a random number of nodes and randomly connects them together and then redraws the graph
        $scope.settings = {
            linkDistance: 100,
            charge: -1000
        }

        var min = 10;
        var randmax = Math.floor((Math.random() * 20) + min);

        $scope.graph.data.nodes = [];
        for (var i = 0; i < randmax; i++) {
            var newNode = { ID: i, Name: "Node " + i };
            $scope.graph.data.nodes.push(newNode);
        }

        $scope.graph.data.edges = [];
        for (var i = 0; i < randmax; i++) {
            var r = Math.floor((Math.random() * randmax));
            if (r != i) {
                //Ensures we don't connect a node to itself
                var newEdge = { StartNode: i, EndNode: r };
                $scope.graph.data.edges.push(newEdge);
            }
        }
        drawGraph();
    }

    $scope.drawGraph = function () {
        drawGraph();
    }

    $scope.drawGraph();

    function makeEdges(StartNodeID, EndNodeID) {
        var newEdge = {
            StartNode: StartNodeID,
            EndNode: EndNodeID
        }
        var existingEdge = $scope.graph.data.edges.filter(function (e) {
            return e.StartNode == StartNodeID && e.EndNode == EndNodeID
        });
        if (existingEdge.length == 0) {
            $scope.graph.data.edges.push(newEdge);
        }

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
            .linkDistance($scope.settings.linkDistance)
            //Distance between nodes
            .charge($scope.settings.charge)
            //How much nodes repel eachother (positive is attractive)
            .friction(0.5)
            //Slows down the nodes movement
            .gravity(0.25)
            //An attractive force towards the centre of the graph
            .on("tick", tick);

        $scope.graph.force.start();


        $scope.graph.linklines = $scope.graph.svg.selectAll(".link");
        //   $scope.graph.data.linkData = linksIndexes($scope.graph.data.edges, $scope.graph.data.nodes);

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
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .classed('gnode', true)
            .on("click", makeBigger)
            .call($scope.graph.force.drag);


        var cnode = gnodes.append("circle")
            .attr("class", "cnode")
            .attr("r", 2);

        var labels = gnodes.append("text")
            .attr("class", "label-text")
            .text(function (d) { return d.Name });


        function makeBigger(d) {
            var r = parseInt(d3.select(this).select("circle").attr("r"));
            console.log(r);
            d3.select(this).select("circle").attr("r", r + 1);

            var node = $scope.graph.data.nodes.filter(function(e) {
                return e.ID == d.ID;
            });
            console.log(node);
            if (node.length > 0) {
                $scope.$apply(function() {
                    $scope.setClickedNode(node[0]);
                })
            }
        }
        function mouseover(d) {
            $scope.$apply(function() {
                $scope.highlightConnectedNodes(d.ID);
            })           
         //   d3.select(this).select("circle").transition().duration(750).attr("r", 4);           
        }
        function mouseout() {
            $scope.$apply(function() {
                $scope.clearHighlights();
            })
          //  d3.select(this).select("circle").transition().duration(750).attr("r", 2);
        }

        function linksIndexes(edges, nodes) {
            //The array of nodes and edges must be transformed into an object
            //that contains the actual node objects as source and target
            var output = [];
            for (var i = 0; i < edges.length; i++) {
                var startId = edges[i].StartNode;
                var endId = edges[i].EndNode;
                var sourceNode = nodes.filter(function (n) { return n.ID == startId; });
                var targetNode = nodes.filter(function (n) { return n.ID == endId; });

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
                if (d.x && d.y) {
                    return 'translate(' + [d.x, d.y] + ')';
                }
            });

            $scope.graph.linklines.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });
        }
    }



});
