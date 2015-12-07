var orbit = {
    info: {
        Title: "Orbits",
        Message: "This example shows how the motions of nodes can be modified in the tick function, encouraging a circulation" +
            " motion around another node. Note that all of the other forces, such as the charge and the link distance, are also " +
            "in play here. "
    },

    settings: {
        charge: -500,
        linkDistance: 20,
        linkStrength: 4,
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
                Mass: 3000,
                orbitPoint: true,
                nodeClass: "node-container node-red"
            },
            {
                ID: 2, Name: "P1",
                orbitPoint: true,
                Mass: 500,
                nodeClass: "node-container node-yellow"
            },
            {
                ID: 3,
                Name: "M1",
                Mass: 10,
                orbitPoint: true,
                nodeClass: "node-container node-orange"
            },
            {
                ID: 4,
                Name: "P2",
                Mass: 400,
                nodeClass: "node-container node-orange",

            },
            {
                ID: 5,
                Name: "P3",
                Mass: 300,
                nodeClass: "node-container node-orange"
            },
            {
                ID: 8,
                Name: "P4",
                Mass: 600,
                orbitPoint: true,
                nodeClass: "node-container node-orange"
            },
            {
                ID: 9,
                Name: "M2",
                Mass: 20,
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
                    Distance: 0.35,
                    Speed: 0.7
                }
            },
            {
                StartNode: 3, EndNode: 9,
                Properties: {
                    Distance: 0.05,
                    Speed: 1.5
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

            var bigG = 0.00001;
            var precessVal = 0.1;
            if (d.source.Mass && d.target.Mass) {
                var precessVal = Math.sqrt((bigG * (d.source.Mass + d.target.Mass)) / distanceVal);                
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

orbit.makeSystem = function () {
    var startId = orbit.data.nodes.length + 1;
    var sun = {
        ID: startId,
        Name: "S",
        fixed: true,
        x: 500,
        y: 300,
        orbitPoint: true,
        Mass: 1000,
        nodeClass: "node-container node-red"
    };
    orbit.data.nodes.push(sun);

    var planets = orbit.makePlanets(5);

    for (var i = 0; i < planets.length; i++) {
        orbit.data.nodes.push(planets[i]);        


        var randomVal = getRandomInt(30,100) / 100; 
        
        var planetEdge = {
            StartNode: sun.ID,
            EndNode: planets[i].ID,
            Properties: {
                Distance: randomVal * 0.5,                
                Speed: 1 - (randomVal * 0.8)
            }
        }
        orbit.data.edges.push(planetEdge);

        
        planets[i].orbitPoint = true;
        var moons = orbit.makeMoons(1);
        for (var j = 0; j < moons.length; j++) {
            console.log(moons[j]);
            orbit.data.nodes.push(moons[j]);

            var subrandomVal = Math.random();
            var moonEdge = {
                StartNode: planets[i].ID,
                EndNode: moons[j].ID,
                Properties: {
                    Distance: (planetEdge.Properties.Distance + (subrandomVal * 0.2)) / 10,
                    Speed: 1 - ( subrandomVal * 0.1)
                }
            }
            orbit.data.edges.push(moonEdge);
        }
        

    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

orbit.makeMoons = function(number) {
    var startId = orbit.data.nodes.length + 100;
    var moons = [];

    for (var i = 0; i < number; i++) {
        var moon =
        {
            ID: startId + i,
            Name: "M" + i,
            Mass: 10,
            nodeClass: "node-container node-red"
        }
        moons.push(moon);
    }


    return moons;
}
orbit.makePlanets = function(number) {
    var startId = orbit.data.nodes.length + 1;
    var planets = [];

    for (var i = 0; i < number; i++) {
        var planet = 
        {
            ID: startId + i,
            Name: "P" + i,
            Mass: 100,
            nodeClass: "node-container node-yellow"
        }
        planets.push(planet);
    }

    return planets;
}

orbit.initialise = function() {
    orbit.makeSystem();

};