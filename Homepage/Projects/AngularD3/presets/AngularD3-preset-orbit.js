var orbit = {
    info: {
        Title: "",
        Message: ""
    },

    settings: {
        charge: -3,        
        linkStrength: 2,
        gravity: 0.01,
        friction:0.1,
        showArrows: false,
        clickToConnect: false,
        keepSimulationAlive: true
    },

    data: {
        nodes: [
            {
                ID: 1, Name: "Node 1",
                fixed: true,
                x: 300,
                y: 300,
                orbitPoint: true,
                distanceVal: 0.3,
                precessVal: 0.2,
                nodeClass: "node-container node-red"
            },
            {
                ID: 2, Name: "Node 21",
                precessVal: 0.5,
                distanceVal: 0.1,
                orbitPoint: true,

                nodeClass: "node-container node-yellow"
            },
            {
                ID: 3, Name: "Node 30",
                nodeClass: "node-container node-orange"
            },
            {
                ID: 4, Name: "Node 30",
                nodeClass: "node-container node-orange",
                
            },
            {
                ID: 5, Name: "Node 30",
                nodeClass: "node-container node-orange"
            },
            {
                ID: 6, Name: "A",
                nodeClass: "node-container node-blue",
                freeMoving: true,
                moveDirection: 1,
                x: 2,
                y: 400
            },
            {
                ID: 7, Name: "B",
                nodeClass: "node-container node-blue",
                x: 2,
                y: 450
            },




        ],
        edges: [
            { StartNode: 1, EndNode: 2, EdgeType:"Long" },
        { StartNode: 2, EndNode: 3, EdgeType: "Short" },
        { StartNode: 4, EndNode: 5 },
        { StartNode: 6, EndNode: 7 },
        ]
    }

}
orbit.settings.linkDistance = function(edge) {
    if ((edge.EdgeType) && (edge.EdgeType == "Long")) {
        
        return 250;
    }
    if ((edge.EdgeType) && (edge.EdgeType == "Short")) {        
        return 0.1;
    }

    return 20;
}

orbit.settings.nodeClass = function (d) {
    if (d.nodeClass) { return d.nodeClass; }
    return "node-container";
}

orbit.time = 0;

orbit.settings.customTickFunction = function (e, links) {
    orbit.time = orbit.time + 0.05;
    links.forEach(function(d, i) {
        if (d.source.orbitPoint) {
            d.target.x = d.source.x + (d.target.x * d.source.distanceVal * Math.cos(d.source.precessVal * orbit.time));
            d.target.y = d.source.y + (d.target.y * d.source.distanceVal * Math.sin(d.source.precessVal * orbit.time));
        }
        if (d.source.freeMoving) {            

            if (d.source.moveDirection > 0) {
                d.source.x = d.source.x + 0.8;
                d.target.x = d.target.x + 0.8;
            } else {
                d.source.x = d.source.x - 0.8;
                d.target.x = d.target.x - 0.8;
            }

            if (d.source.x > 600) {
                d.source.moveDirection = -1
            }
            if (d.source.x < 0) {
                d.source.moveDirection = 1
            }
            
        }


    })

 

}



orbit.initialise = function () { };