var orbit = {
    info: {
        Title: "",
        Message: ""
    },

    settings: {
        charge: -300,
        linkDistance: 10,
        linkStrength: 0.8,
        showArrows: false,
        clickToConnect: false,
        keepSimulationAlive: true
    },

    data: {
        nodes: [
            { ID: 1, Name: "Node 1", fixed: true, nodeClass: "node-container node-red" },           
            { ID: 2, Name: "Node 21", nodeClass: "node-container node-yellow" },            
            { ID: 30, Name: "Node 30", nodeClass: "node-container node-orange" },
            { ID: 40, Name: "Node 30", nodeClass: "node-container node-orange" },
            { ID: 50, Name: "Node 30", nodeClass: "node-container node-orange" },

        ],
        edges: [
            { StartNode: 1, EndNode: 2 },
        { StartNode: 2, EndNode: 30 },
        { StartNode: 30, EndNode: 40 },
        { StartNode: 40, EndNode: 50 }
        ]
    }

}

orbit.settings.nodeClass = function (d) {
    if (d.nodeClass) { return d.nodeClass; }
    return "node-container";
}

orbit.time = 0;

orbit.settings.customTickFunction = function (e, links) {
    orbit.time = orbit.time + 0.05;
    links.forEach(function(d, i) {
        if (d.source.fixed) {
            d.target.x = d.source.x + (d.target.x * 0.2 * Math.cos(orbit.time));
            d.target.y = d.source.y + (d.target.y * 0.2 * Math.sin(orbit.time));
        }
    })
    

}



orbit.initialise = function () { };