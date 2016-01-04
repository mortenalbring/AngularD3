var angularD3Controllers = angular.module('angularD3Controllers', []);


angularD3Controllers.controller("HomeController", function ($scope, $timeout, SettingsService, GraphService) {

    $scope.display = {};
    $scope.display.tabs = 'showSettings';

    $scope.info = {
        Title: "Interactive force-directed graph simulations",
        Message: "This uses the beautiful data-visualisation library d3.js by Mike Bostock " +
            "to display force-directed graphs from an array of nodes and edges, and adds dynamic interactive elements by combining" +
            "it with AngularJS. You can create your own force-directed graph simulations or see one of the presets for examples"
    }


    $scope.settings = SettingsService.currentSettings;


    $scope.hiddenSettings = false;
    $scope.hideSettings = function () {
        $scope.hiddenSettings = !$scope.hiddenSettings;
        $timeout(function () {
            $scope.graph.width = parseInt(d3.select('#graph-container').style('width'), 10),
                console.log($scope.graph.width);
            GraphService.drawGraph();

        }, 100);

    }

    $scope.updateGraph = function () {
        $scope.settings = SettingsService.currentSettings;
        GraphService.drawGraph();
    }

    $scope.isNumeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    $scope.increaseLinkDistance = function (val) {
        SettingsService.increaseLinkDistance(val);
        $scope.updateGraph();
    }
    $scope.increaseLinkStrength = function (val) {
        SettingsService.increaseLinkStrength(val);
        $scope.updateGraph();
    }
    $scope.increaseFriction = function (val) {
        SettingsService.increaseFriction(val);
        $scope.updateGraph();
    }
    $scope.increaseCharge = function (val) {
        SettingsService.increaseCharge(val);
        $scope.updateGraph();
    }
    $scope.increaseGravity = function (val) {
        SettingsService.increaseGravity(val);
        $scope.updateGraph();
    }
    $scope.increaseRadius = function (val) {
        SettingsService.increaseRadius(val);
        $scope.updateGraph();
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
        SettingsService.currentSettings = SettingsService.checkSettings(preset.settings);
        $scope.settings = SettingsService.currentSettings;
        $scope.info = angular.copy(preset.info);
        GraphService.drawGraph();
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


});
