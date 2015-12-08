var orbit = {
    info: {
        Title: "Orbits",
        Message: "This example shows how the motions of nodes can be modified in the tick function, encouraging a circulation" +
            " motion around another node. Note that all of the other forces, such as the charge and the link distance, are also " +
            "in play here. "
    },

    settings: {
        charge: -0.001,
        linkDistance: 20,
        linkStrength: 1,
        gravity: 0.001,
        friction: 0.001,
        showArrows: false,
        clickToConnect: false,
        keepSimulationAlive: true
    },

    data: {
        nodes: [          
            {
                ID: 1, Name: "A",
                nodeClass: "node-container node-blue",
                freeMoving: true,
                moveDirection: 1,
                x: 2,
                y: 400
            },
            {
                ID: 2, Name: "B",
                nodeClass: "node-container node-blue",
                x: 2,
                y: 450
            },

        ],
        edges: [
           

        { StartNode: 1, EndNode: 2 },
        ]
    }

}


orbit.settings.radius = function (d) {
    if (!d.Mass) {
        return 1;}
    var masslog = Math.log10(d.Mass);



    return masslog;
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

            var bigG = 0.0000001;
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
        x: 400,
        y: 300,
        orbitPoint: true,
        Mass: 100000,
        nodeClass: "node-container node-red"
    };
    orbit.data.nodes.push(sun);

    var maxPlanetNumber = 5;

    var planets = orbit.makePlanets(maxPlanetNumber);

    for (var i = 0; i < planets.length; i++) {
        orbit.data.nodes.push(planets[i]);        
        
        
        var planetEdge = {
            StartNode: sun.ID,
            EndNode: planets[i].ID,
            Properties: {
                Distance: 0.1 + ((i/maxPlanetNumber)*0.5),
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
            Mass: 1000,
            nodeClass: "node-container node-yellow"
        }
        planets.push(planet);
    }

    return planets;
}

orbit.initialise = function() {
    orbit.makeSystem();

};