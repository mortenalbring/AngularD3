var sphere = {
    settings: {        
        linkDistance: 10,
        linkStrength: 0.8,
        gravity: 0.2,
        friction: 0.9,
        lockToContainer: true,
        clickToConnect: false,
        charge: -300,
        radius: 4,
        
    },
    data: {
        nodes: [ 
        ],
        edges: [
        ],       
    }
}


sphere.makeChain = function (startId,maxElements) {               
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

sphere.makeNodes = function () {
    sphere.data.nodes = [];
    sphere.data.edges = [];

    var chainCount = 15;
    var chainLength = 5;


    chains = [];
    for (var i = 0; i < chainCount; i++) {        
        var chain = sphere.makeChain(i * chainCount, chainLength);
        chains.push(chain);
    }

    for (var i = 0; i < chains.length; i++) {
        sphere.data.nodes = sphere.data.nodes.concat(chains[i].nodes);
        sphere.data.edges = sphere.data.edges.concat(chains[i].edges);
    }

    var pole1 = {
        ID: -2,
        Name: "",
        Type: 2
    }
    var pole2 = {
        ID: -3,
        Name: "",
        Type: 2
    }

    sphere.data.nodes.push(pole1);
    sphere.data.nodes.push(pole2);
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
    sphere.data.edges = sphere.data.edges.concat(newEdges);
}

sphere.makeNodes();
