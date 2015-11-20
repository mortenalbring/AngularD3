var myApp = angular.module("myApp", []);

myApp.controller("HomeController", function ($scope) {

    $scope.settings = {
        linkDistance: 20,
        linkStrength: 1,
        friction: 0.9,
        charge: -1000,
        gravity: 0.25,
        radius: 2,
        clickToConnect: true,
        lockToContainer: false,
        linkClass: function () { return 'link link-default'; },
        nodeClass: function () { return 'node-container'; },
        customTickFunction: null,
    }
    function checkCustomSettings(customSettings) {
        //The preset files come with custom settings for various parameters to make the scene look good. 
        //If I've forgotten to set one of the parameters, this should prevent the graph from breaking        
        if (!customSettings.linkDistance) { customSettings.linkDistance = 20; }
        if (!customSettings.linkStrength) { customSettings.linkStrength = 0.8; }
        if (!customSettings.friction) { customSettings.friction = 0.9; }
        if (!customSettings.charge) { customSettings.charge = -1000; }
        if (!customSettings.gravity) { customSettings.gravity = 0.25; }
        if (!customSettings.radius) { customSettings.radius = 2; }

        if (customSettings.clickToConnect == undefined) { customSettings.clickToConnect = true; }
        if (customSettings.lockToContainer == undefined) { customSettings.lockToContainer = false; }

        if (!customSettings.linkClass) { customSettings.linkClass = function () { return 'link link-default'; } }
        if (!customSettings.nodeClass) { customSettings.nodeClass = function () { return 'node-container'; } }

        return customSettings;
    }

    $scope.isNumeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    $scope.increaseLinkDistance = function (val) {
        if ($scope.isNumeric($scope.settings.linkDistance)) {
            $scope.settings.linkDistance = $scope.settings.linkDistance + val;
            drawGraph();
        }
    }
    $scope.increaseLinkStrength = function (val) {
        $scope.settings.linkStrength = $scope.settings.linkStrength + val;
        if ($scope.settings.linkStrength < 0) {
            $scope.settings.linkStrength = 0;
        }
        if ($scope.settings.linkStrength > 1) {
            $scope.settings.linkStrength = 1;
        }
        drawGraph();
    }
    $scope.increaseFriction = function (val) {
        $scope.settings.friction = $scope.settings.friction + val;
        if ($scope.settings.friction < 0) {
            $scope.settings.friction = 0;
        }
        if ($scope.settings.friction > 1) {
            $scope.settings.friction = 1;
        }
        drawGraph();
    }
    $scope.increaseCharge = function (val) {
        $scope.settings.charge = $scope.settings.charge + val;
        drawGraph();
    }
    $scope.increaseGravity = function (val) {
        $scope.settings.gravity = $scope.settings.gravity + val;

        drawGraph();
    }
    $scope.increaseRadius = function (val) {
        $scope.settings.radius = $scope.settings.radius + val;
        drawGraph();
    }


    $scope.graph = {
        width: 600,
        height: 600,
        margin: 30,
        svg: null,
        force: null,
        data: {
            nodes: [{
                ID: 1,
                Name: "Test Node 1",
                TooltipText: "Test Node 1"
            },
                {
                    ID: 2,
                    Name: 'Test Node 2',
                    TooltipText: ["Test Node 2","Test 1", "Test 2", "Test 3"]
                },
                {
                    ID: 3,
                    Name: 'Test Node 3'
                },
                {
                    ID: 4,
                    Name: 'Test Node 4'
                },
                {
                    ID: 5,
                    Name: 'Test Node 5'
                },
                {
                    ID: 6,
                    Name: 'Test Node 6'
                },
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




    $scope.randomise = function () {
        //Generates a random number of nodes and randomly connects them together and then redraws the graph

        var randomSettings =
         {
             linkDistance: Math.floor(Math.random() * 100),
             charge: Math.floor(Math.random() * 1000) * -1
         }
        $scope.settings = checkCustomSettings(randomSettings);

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

    $scope.drawNorskeKongehuset = function() {
        norskekongehus.makeNorskekongehuset();

        $scope.graph.data = angular.copy(norskekongehus.data);

        $scope.settings = angular.copy(checkCustomSettings(norskekongehus.settings));
        drawGraph();


    }

    $scope.drawWindsors = function () {
        windsors.makeWindsors();
        $scope.graph.data = angular.copy(windsors.data);

        $scope.settings = angular.copy(checkCustomSettings(windsors.settings));
        drawGraph();

    }

    $scope.drawDNA = function () {

        DNA.makeDNA(30);
        $scope.graph.data = angular.copy(DNA.data);

        $scope.settings = angular.copy(checkCustomSettings(DNA.settings));
        drawGraph();
    }

    $scope.drawMultipleCubes = function () {
        $scope.graph.data = angular.copy(multiplecubes.data);
        $scope.settings = angular.copy(checkCustomSettings(multiplecubes.settings));
        drawGraph();
    }

    $scope.drawSquareLattice = function () {
        squarelattice.drawLattice();

        $scope.graph.data = angular.copy(squarelattice.data);
        $scope.settings = angular.copy(checkCustomSettings(squarelattice.settings));
        drawGraph();
    }
    $scope.drawGraphene = function () {

        grapheneauto.drawGraphene();


        $scope.graph.data = angular.copy(graphene.data);
        $scope.settings = angular.copy(checkCustomSettings(graphene.settings));
        drawGraph();
    }
    $scope.drawCube = function () {
        $scope.graph.data = angular.copy(cube.data);
        $scope.settings = angular.copy(checkCustomSettings(cube.settings));
        drawGraph();
    }
    $scope.drawSphere = function () {
        $scope.graph.data = angular.copy(sphere.data);
        $scope.settings = angular.copy(checkCustomSettings(sphere.settings));
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
        $scope.newStartNode = null;
        $scope.newEndNode = null;
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
        if ($scope.graph.force) {
            $scope.graph.force.stop();
        }


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
            .linkStrength($scope.settings.linkStrength)
            //Distance between nodes
            .charge($scope.settings.charge)
            //How much nodes repel eachother (positive is attractive)
            .friction($scope.settings.friction)
            //Slows down the nodes movement
            .gravity($scope.settings.gravity)
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
            .attr("class", function (e) { return $scope.settings.linkClass(e); });
        $scope.graph.linklines.exit().remove();

        //Container for both the node and the label describing the node
        var gnodes = $scope.graph.svg.selectAll('g.gnode')
            .data($scope.graph.data.nodes)
            .enter()
            .append('g')
            .attr("class", function (d) {
                return $scope.settings.nodeClass(d);
            })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .classed('gnode', true)
            .on("click", connectNodes)
            .call($scope.graph.force.drag);


        var cnode = gnodes.append("circle")
            .attr("class", "cnode")
            .attr("r", $scope.settings.radius);

        var labels = gnodes.append("text")
            .attr("class", "label-text")
            .text(function (d) { return d.Name });


        function connectNodes(d) {
            if (!$scope.settings.clickToConnect) {
                return;
            }

            var r = parseInt(d3.select(this).select("circle").attr("r"));
            d3.select(this).select("circle").attr("r", r + 1);

            var node = $scope.graph.data.nodes.filter(function (e) {
                return e.ID == d.ID;
            });
            if (node.length > 0) {
                $scope.$apply(function () {
                    $scope.setClickedNode(node[0]);
                })
            }
        }

        // Generates a tooltip for a SVG circle element based on its ID
        function addTooltip(container) {
            if (!container.TooltipText) {return;}
            

            var x = parseFloat(container.x);
            var y = parseFloat(container.y);
           
           
            //If the node is quite high up, we shift it down a bit
            //Otherwise, we shift it up a bit. This is because we don't want to the tooltip covering the node itself
            if (y < 60) {
                y = y + 50;
            } else {
                y = y - 50;
            }
            //If the node is more than halfway across the graph, we shift the tooltip across a bit
            //to make sure it doesn't overflow outside the container. Probably a more elegant way of doing this
            if (x > ($scope.graph.width / 2)) {
                x = (x / 2);
            }
            var tooltip = d3.select(".svg-container")
                .append("text")                
                .attr("x", x)
                .attr("y", y)                
                .attr("id", "tooltip");

            //If the tooltip text is an array, we iterate through and put in some tspans for each element for a new 'line'.
            //Otherwise we just put it as the text propery of the tooltip
            if (!Array.isArray(container.TooltipText)) {                
                tooltip.text(container.TooltipText);
            } else {                
                for (var i = 0; i < container.TooltipText.length; i++) {                    
                    tooltip.append("tspan").text(container.TooltipText[i]).attr("x",x).attr("dy","1.2em");

                }
            }
            
            //This draws the rectangle behind the tooltip as a 'border'            
            var bbox = tooltip.node().getBBox();
            var padding = 2;
            d3.select(".svg-container")
                .insert("rect","#tooltip")
                .attr("x", bbox.x - padding)
                .attr("y", bbox.y - padding)
                .attr("width", bbox.width + (padding * 2))
                .attr("height", bbox.height + (padding * 2))                
                .attr("id", "tooltip-container");                

        }

        function mouseover(d) {

            addTooltip(d);

            $scope.$apply(function () {
                $scope.highlightConnectedNodes(d.ID);
            })
            d3.select(this).select("circle").transition().duration(750).attr("r", $scope.settings.radius * 2);
        }
        function mouseout() {

            d3.select("#tooltip").remove();
            d3.select("#tooltip-container").remove();

            $scope.$apply(function () {
                $scope.clearHighlights();
            })
            d3.select(this).select("circle").transition().duration(750).attr("r", $scope.settings.radius);
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
                    var out = {
                        source: sourceNode[0],
                        target: targetNode[0]
                    }

                    if (edges[i].EdgeType) { out.EdgeType = edges[i].EdgeType; }

                    output.push(out);
                }
            }
            return output;
        }

        function tick(e) {



            gnodes.attr("transform", function (d) {
                if (d.x && d.y) {

                    var newx = d.x;
                    var newy = d.y;


                    if ($scope.settings.lockToContainer) {
                        newx = Math.max($scope.settings.radius, Math.min($scope.graph.width - $scope.settings.radius, d.x));
                        newy = Math.max($scope.settings.radius, Math.min($scope.graph.height - $scope.settings.radius, d.y));
                    }

                    return 'translate(' + [newx, newy] + ')';
                }
            });

            if ($scope.settings.customTickFunction) {
                $scope.settings.customTickFunction(e, $scope.graph.data.linkData);
            }

            $scope.graph.linklines.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });
        }
    }
});
