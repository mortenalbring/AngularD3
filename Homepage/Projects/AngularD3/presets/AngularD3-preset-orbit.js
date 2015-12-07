var orbit = {
    info: {
        Title: "Orbits",
        Message: "This example shows how the motions of nodes can be modified in the tick function, encouraging a circulation" +
            " motion around another node. Note that all of the other forces, such as the charge and the link distance, are also " +
            "in play here. "
    },

    settings: {
        charge: -800,
        linkDistance: 20,
        linkStrength: 2,
        gravity: 0.01,
        friction: 0.1,
        showArrows: false,
        clickToConnect: false,
        keepSimulationAlive: true
    },

    data: {
        nodes: [
            {
                ID: 1, Name: "S",
                fixed: true,
                x: 300,
                y: 300,
                orbitPoint: true,
                nodeClass: "node-container node-red"
            },
            {
                ID: 2, Name: "P1",
                orbitPoint: true,
                nodeClass: "node-container node-yellow"
            },
            {
                ID: 3,
                Name: "M1",
                nodeClass: "node-container node-orange"
            },
            {
                ID: 4, Name: "P2",
                nodeClass: "node-container node-orange",

            },
            {
                ID: 5, Name: "P3",
                nodeClass: "node-container node-orange"
            },
            {
                ID: 8, Name: "P4",
                orbitPoint: true,
                nodeClass: "node-container node-orange"
            },
            {
                ID: 9, Name: "M2",
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
            {
                StartNode: 1, EndNode: 2,                
                Properties: {
                    Distance: 0.4,
                    Speed: 0.2
                }
            },
        {
            StartNode: 2, EndNode: 3,            
            Properties: {
                Distance: 0.1,
                Speed: 0.8
            }
        },
            {
                StartNode: 1, EndNode: 4,
                Properties: {
                    Distance: 0.1,
                    Speed: 0.6
                }
            },
            {
                StartNode: 1, EndNode: 5,
                Properties: {
                    Distance: 0.1,
                    Speed: 0.7
                }
            },
            {
                StartNode: 1, EndNode: 8,
                Properties: {
                    Distance: 0.45,
                    Speed: 0.7
                }
            },


        { StartNode: 6, EndNode: 7 },
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
    links.forEach(function (d, i) {
        if (d.source.orbitPoint) {
            var distanceVal = 0.1;
            if ((links[i].Properties) && (links[i].Properties.Distance)) {
                distanceVal = links[i].Properties.Distance;
            }
            var precessVal = 0.1;
            if ((links[i].Properties) && (links[i].Properties.Speed)) {
                precessVal = links[i].Properties.Speed;
            }


            d.target.x = d.source.x + (d.target.x * distanceVal * Math.cos(precessVal * orbit.time));
            d.target.y = d.source.y + (d.target.y * distanceVal * Math.sin(precessVal * orbit.time));
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