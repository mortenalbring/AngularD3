var angularD3Controllers = angular.module('angularD3Controllers', []);


angularD3Controllers.controller("HomeController", function ($scope,$timeout,SettingsService,GraphService) {

    $scope.display = {};
    $scope.display.tabs = 'showSettings';

    $scope.info = {
        Title: "Interactive force-directed graph simulations",
        Message: "This uses the beautiful data-visualisation library d3.js by Mike Bostock " +
            "to display force-directed graphs from an array of nodes and edges, and adds dynamic interactive elements by combining" +
            "it with AngularJS. You can create your own force-directed graph simulations or see one of the presets for examples"
    }


    $scope.settings = SettingsService.defaultSettings;


    $scope.hiddenSettings = false;
    $scope.hideSettings = function () {
        console.log($scope.graph.width);
        $scope.hiddenSettings = !$scope.hiddenSettings;
        console.log($scope.graph.width);
        $timeout(function() {
            $scope.graph.width = parseInt(d3.select('#graph-container').style('width'), 10),
                console.log($scope.graph.width);
            GraphService.drawGraph();

        }, 100);

    }

    $scope.isNumeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    $scope.increaseLinkDistance = function (val) {
        if ($scope.isNumeric($scope.settings.linkDistance)) {
            $scope.settings.linkDistance = $scope.settings.linkDistance + val;
            GraphService.drawGraph();
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
        GraphService.drawGraph();
    }
    $scope.increaseFriction = function (val) {
        $scope.settings.friction = $scope.settings.friction + val;
        if ($scope.settings.friction < 0) {
            $scope.settings.friction = 0;
        }
        if ($scope.settings.friction > 1) {
            $scope.settings.friction = 1;
        }
        GraphService.drawGraph();
    }
    $scope.increaseCharge = function (val) {
        $scope.settings.charge = $scope.settings.charge + val;
        GraphService.drawGraph();
    }
    $scope.increaseGravity = function (val) {
        $scope.settings.gravity = $scope.settings.gravity + val;

        GraphService.drawGraph();
    }
    $scope.increaseRadius = function (val) {
        $scope.settings.radius = $scope.settings.radius + val;
        GraphService.drawGraph();
    }


    $scope.graph = GraphService.graph;

    $scope.clicked = {
        StartNode: null,
        EndNode: null
    }

    $scope.preset = {};


    $scope.preset.options = [
        {
            ID: 0,
            Title: "Custom",
            RunFunction: function () {
                $scope.makeCustom();
            }
        },
        {
            ID: 1,
            Title: "Randomise!",
            RunFunction: function () {
                $scope.randomise();
            }
        },
        {
            ID: 2,
            Title: "Square lattice",
            RunFunction: function () {
                $scope.drawPreset(squarelattice);
            }
        },
        {
            ID: 3,
            Title: "Hexagonal lattice",
            RunFunction: function () {
                $scope.drawPreset(graphene);
            }
        },
        {
            ID: 4,
            Title: "Cube",
            RunFunction: function () {
                $scope.drawPreset(cube);
            }
        },
        {
            ID: 5,
            Title: "Sphere",
            RunFunction: function () {
                $scope.drawPreset(sphere);
            }
        },
        {
            ID: 10,
            Title: "Multiple spheres",
            RunFunction: function () {
                $scope.drawPreset(multiplespheres);
            }
        },
        {
            ID: 6,
            Title: "Multiple cubes",
            RunFunction: function () {
                $scope.drawPreset(multiplecubes);
            }
        },
        {
            ID: 7,
            Title: "DNA",
            RunFunction: function () {
                $scope.drawPreset(DNA);
            }
        },
        {
            ID: 8,
            Title: "British monarchy",
            RunFunction: function () {
                $scope.drawPreset(windsors);
            }
        },
        {
            ID: 9,
            Title: "Norwegian monarchy",
            RunFunction: function () {
                $scope.drawPreset(norskekongehus);
            }
        },
        {
            ID: 11,
            Title: "Orbit",
            RunFunction: function () {
                $scope.drawPreset(orbit);
            }
        },

    ]

    $scope.preset.select = $scope.preset.options[0];


    $scope.redrawGraph = function () {
        if ($scope.preset.select.ID != 0) {
            if ($scope.preset.select.RunFunction) {
                $scope.preset.select.RunFunction();
            }
        }
    }


    $scope.changePreset = function () {

        var match = $scope.preset.options.filter(function (e) { return e.ID == $scope.preset.select.ID });

        if (match.length == 0) { return; }

        if (match[0].RunFunction) {
            match[0].RunFunction();
        }
    }

    $scope.makeCustom = function () {
        var customSettings =
        {
            linkDistance: Math.floor(Math.random() * 100),
            charge: Math.floor(Math.random() * 1000) * -1,
            clickToConnect: true,
        }
        $scope.settings = SettingsService.checkSettings(customSettings);

        $scope.info.Title = "Custom graph";
        $scope.info.Message = "Draw your own custom force-directed graph. Use the control to add new nodes and link them together.";
        $scope.graph.data.nodes = [];
        $scope.graph.data.edges = [];
        $scope.display.tabs = 'nodesTable';
        GraphService.drawGraph();
    };

    $scope.randomise = function () {
        //Generates a random number of nodes and randomly connects them together and then redraws the graph

        $scope.info.Title = "Random graph";
        $scope.info.Message = "A random set of nodes and a random set of connections.";


        var randomSettings =
         {
             linkDistance: Math.floor(Math.random() * 100),
             charge: Math.floor(Math.random() * 1000) * -1
         }
        $scope.settings = SettingsService.checkSettings(randomSettings);

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
        GraphService.drawGraph();
    }

    $scope.drawPreset = function (preset) {
        if (!preset) {
            alert("Preset not loaded");
            return;
        }
        if (!preset.initialise) {
            alert("Preset has no initialise function");
            return;
        }
        preset.initialise();
        $scope.graph.data = angular.copy(preset.data);
        $scope.settings = angular.copy(SettingsService.checkSettings(preset.settings));
        $scope.info = angular.copy(preset.info);
        GraphService.drawGraph();
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
            GraphService.drawGraph();
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
        GraphService.drawGraph();
    }
    $scope.addEdge = function (StartNodeID, EndNodeID) {
        makeEdges(StartNodeID, EndNodeID);
        GraphService.drawGraph();
        $scope.newStartNode = null;
        $scope.newEndNode = null;
    }


    $scope.drawGraph = function () {
        GraphService.drawGraph();
    }

    $timeout(function () {
        $scope.graph.width = parseInt(d3.select('#graph-container').style('width'), 10),
         $scope.graph.height = parseInt(d3.select('#graph-container').style('height'), 10),
            

        $scope.drawPreset(home);

    }, 100);
    


    function resize() {
        console.log("moop");
    }

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
});
