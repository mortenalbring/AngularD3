var multiplespheres = {
    info: {
        Title:"Multiple spheres",
        Message:"Draws several spheres"
    },
    settings: {        
        linkDistance: 0.001,
        linkStrength: 4,
        gravity: 0.7,
        friction: 0.5,
        lockToContainer: true,
        clickToConnect: false,
        charge: -800,
        radius: 2,
        
    },
    data: {
        nodes: [ 
        ],
        edges: [
        ],       
    }
}


multiplespheres.makeChain = function (startId,maxElements) {               
    var nodes = [];
    for (var i = startId; i < startId + maxElements; i++) {        
        var newNode = { ID: i, Name: "" };
        nodes.push(newNode);
    }
    var edges = [];
    for (var i = 0; i < (nodes.length-1); i++) {
        var newEdge = { StartNode: nodes[i].ID, EndNode: nodes[i + 1].ID };
        edges.push(newEdge);
    }
    
    var output = {};
    output.nodes = nodes;
    output.edges = edges;
    return output;
}

multiplespheres.makeNodes = function () {

    var chainCount = 9;
    var chainLength = 3;

    var startID = multiplespheres.data.nodes.length+1;

    chains = [];
    for (var i = startID; i < startID + chainCount; i++) {        
        var chain = multiplespheres.makeChain(i*chainCount, chainLength);
        console.log((i));
        chains.push(chain);
    }

    for (var i = 0; i < chains.length; i++) {
        multiplespheres.data.nodes = multiplespheres.data.nodes.concat(chains[i].nodes);
        multiplespheres.data.edges = multiplespheres.data.edges.concat(chains[i].edges);
    }

    var pole1 = {
        ID: multiplespheres.data.nodes[multiplespheres.data.nodes.length-1].ID + 1,
        Name: "",
        Type: 2
    }
    var pole2 = {
        ID: multiplespheres.data.nodes[multiplespheres.data.nodes.length - 1].ID + 2,
        Name: "",
        Type: 3
    }

    multiplespheres.data.nodes.push(pole1);
    multiplespheres.data.nodes.push(pole2);
    var newEdges = [];
    for (var j = 0; j < chains.length; j++) {
        var newEdge1 = { StartNode: pole1.ID, EndNode: chains[j].nodes[0].ID }
        var newEdge2 = { StartNode: pole2.ID, EndNode: chains[j].nodes[chains[j].nodes.length - 1].ID };
        newEdges.push(newEdge1);
        newEdges.push(newEdge2);

        
        for (var k = 0; k <= (chains[j].nodes.length - 1); k++) {
            if (j < (chains.length - 1)) {
                var newEdge = { StartNode: chains[j].nodes[k].ID, EndNode: chains[j + 1].nodes[k].ID }
                newEdges.push(newEdge);
            } else {
                var newEdge = { StartNode: chains[j].nodes[k].ID, EndNode: chains[0].nodes[k].ID }
                newEdges.push(newEdge);
            }
        } 
    }
    multiplespheres.data.edges = multiplespheres.data.edges.concat(newEdges);
}


multiplespheres.initialise = function () {
    multiplespheres.data.nodes = [];
    multiplespheres.data.edges = [];

    multiplespheres.makeNodes();
    multiplespheres.makeNodes();
    multiplespheres.makeNodes();
    multiplespheres.makeNodes();
    multiplespheres.makeNodes();
    multiplespheres.makeNodes();
}