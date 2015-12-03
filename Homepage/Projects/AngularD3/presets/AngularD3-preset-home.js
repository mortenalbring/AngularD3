var home = {
    info: {
        Title: "Interactive force-directed graph simulations",
        Message: "This uses the beautiful data-visualisation library d3.js by Mike Bostock " +
            "to display force-directed graphs from an array of nodes and edges, and adds dynamic interactive elements by combining" +
            "it with AngularJS. You can create your own force-directed graph simulations or see one of the presets for examples"
    },

    settings: {
        charge: -800,
        linkDistance: 30,
        showArrows: true
    },

    data: {
        nodes: [
            { ID: 1, Name: "Node 1", nodeClass: "node-container node-red" },
            { ID: 2, Name: "Node 2", nodeClass: "node-container node-red" },
            { ID: 3, Name: "Node 3", nodeClass: "node-container node-red" },
            { ID: 4, Name: "Node 4", nodeClass: "node-container node-red" },
            { ID: 5, Name: "Node 5", nodeClass: "node-container node-red" },
            { ID: 6, Name: "Node 6", nodeClass: "node-container node-blue" },
            { ID: 7, Name: "Node 7", nodeClass: "node-container node-blue" },
            { ID: 8, Name: "Node 8", nodeClass: "node-container node-blue" },
            { ID: 9, Name: "Node 9", nodeClass: "node-container node-blue" },
            { ID: 10, Name: "Node 10", nodeClass: "node-container node-purple" },
            { ID: 11, Name: "Node 11", nodeClass: "node-container node-purple" },
            { ID: 12, Name: "Node 12", nodeClass: "node-container node-purple" },
            { ID: 13, Name: "Node 13", nodeClass: "node-container node-purple" },
            { ID: 14, Name: "Node 14", nodeClass: "node-container node-purple" },
            { ID: 15, Name: "Node 15", nodeClass: "node-container node-green" },
            { ID: 16, Name: "Node 16", nodeClass: "node-container node-green" },
            { ID: 17, Name: "Node 17", nodeClass: "node-container node-green" },
            { ID: 18, Name: "Node 18", nodeClass: "node-container node-green" },
            { ID: 19, Name: "Node 19", nodeClass: "node-container node-orange" },
            { ID: 20, Name: "Node 20", nodeClass: "node-container node-orange" },

            { ID: 21, Name: "Node 21", nodeClass: "node-container node-yellow" },
            { ID: 22, Name: "Node 22", nodeClass: "node-container node-yellow" },
            { ID: 23, Name: "Node 23", nodeClass: "node-container node-yellow" },
            { ID: 24, Name: "Node 24", nodeClass: "node-container node-yellow" },
            { ID: 25, Name: "Node 25", nodeClass: "node-container node-orange" },
            { ID: 26, Name: "Node 26", nodeClass: "node-container node-orange" },
            { ID: 27, Name: "Node 27", nodeClass: "node-container node-orange" },
            { ID: 28, Name: "Node 28", nodeClass: "node-container node-orange" },
            { ID: 29, Name: "Node 29", nodeClass: "node-container node-orange" },
            { ID: 30, Name: "Node 30", nodeClass: "node-container node-orange" },

        ],
        edges: [
            { StartNode: 1, EndNode: 2 },
            { StartNode: 2, EndNode: 3 },
            { StartNode: 3, EndNode: 4 },
            { StartNode: 4, EndNode: 5 },
            { StartNode: 6, EndNode: 7 },
            { StartNode: 7, EndNode: 8 },
            { StartNode: 8, EndNode: 9 },
            { StartNode: 3, EndNode: 7 },
            { StartNode: 10, EndNode: 11 },
            { StartNode: 11, EndNode: 12 },
            { StartNode: 10, EndNode: 12 },
            { StartNode: 13, EndNode: 14 },
            { StartNode: 14, EndNode: 15 },
            { StartNode: 15, EndNode: 16 },
            { StartNode: 13, EndNode: 16 },
            { StartNode: 17, EndNode: 18 },
            { StartNode: 18, EndNode: 19 },
            { StartNode: 19, EndNode: 20 },
            { StartNode: 13, EndNode: 20 },

            { StartNode: 21, EndNode: 22 },
            { StartNode: 22, EndNode: 23 },
            { StartNode: 23, EndNode: 24 },
            { StartNode: 21, EndNode: 24 },

            { StartNode: 25, EndNode: 26 },
            { StartNode: 26, EndNode: 27 },
            { StartNode: 26, EndNode: 28 },
            { StartNode: 26, EndNode: 29 },
            { StartNode: 26, EndNode: 30 },

            { StartNode: 20, EndNode: 30 },

            { StartNode: 10, EndNode: 28 },

            { StartNode: 5, EndNode: 25 },

            { StartNode: 9, EndNode: 15 },

        ]
    }

}

home.settings.nodeClass = function (d) {
    if (d.nodeClass) { return d.nodeClass; }
    return "node-container";
}

home.initialise = function () { };