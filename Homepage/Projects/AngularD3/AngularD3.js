var myApp = angular.module("myApp", []);

myApp.controller("HomeController", function ($scope) {
    $scope.test = "moop";

    $scope.graphene = {
        nodes: [
            { ID: 1, Name: "1" },
            { ID: 2, Name: "2" },
            { ID: 3, Name: "3" },
            { ID: 4, Name: "4" },
            { ID: 5, Name: "5" },
            { ID: 6, Name: "6" },

            { ID: 7, Name: "7" },
            { ID: 8, Name: "8" },
            { ID: 9, Name: "9" },

            { ID: 10, Name: "10" },
            { ID: 11, Name: "11" },
            { ID: 12, Name: "12" },

            { ID: 13, Name: "13" },
            { ID: 14, Name: "14" },

            { ID: 15, Name: "15" },
            { ID: 15, Name: "15" },


        ],
        edges: [
            { StartNode: 1, EndNode: 2 },
            { StartNode: 2, EndNode: 3 },
            { StartNode: 3, EndNode: 4 },
            { StartNode: 4, EndNode: 5 },
            { StartNode: 5, EndNode: 6 },
            { StartNode: 6, EndNode: 1 },

            { StartNode: 2, EndNode: 7 },
            { StartNode: 7, EndNode: 8 },
            { StartNode: 8, EndNode: 9 },
            { StartNode: 9, EndNode: 10 },

            { StartNode: 10, EndNode: 3 },

            { StartNode: 1, EndNode: 11 },
            { StartNode: 11, EndNode: 12 },
            { StartNode: 12, EndNode: 13 },
            { StartNode: 13, EndNode: 7 },



        ]
    }

    $scope.graph = {
        width: 400,
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

    $scope.drawGraphene = function () {
        $scope.graph.data = $scope.graphene;
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

    $scope.findConnectedNodes = function (node) {
        //Finds all nodes connected to specified node
        var connectedEdges = $scope.graph.data.edges.filter(function (e) {
            return ((e.StartNode == node.ID) || (e.EndNode == node.ID));
        })


        for (var i = 0; i < connectedEdges.length; i++) {
            if (connectedEdges[i].StartNode != node.ID) {
                $scope.setHighlight(connectedEdges[i].StartNode);
            }
            if (connectedEdges[i].EndNode != node.ID) {
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
        console.log(connectedNodes.length);
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
