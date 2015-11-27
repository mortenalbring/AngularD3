var squarelattice = {
    settings : {
        linkDistance: 3,
        charge: -300,
        gravity: 0.2,
        friction: 0.5
    },
    data: {
        nodes: [],
        edges: []
    }
}

function connectChain(chain) {
    var edges = [];    
    for (var i = 0; i < (chain.length -1); i++) {
        var newEdge = { StartNode: chain[i].ID, EndNode: chain[i + 1].ID };
        edges.push(newEdge);
    }
    return edges;
}
function makeChain(size,startId) {
    var chain = { nodes: [], edges: [] };

    
    for (var i = 0; i < size; i++) {
        var node = { ID: i+startId, Name: i+startId };
        
        chain.nodes.push(node);
    }
    chain.edges = connectChain(chain.nodes);   
    return chain;
}
function connectChainsTogether(chains) {
    var newEdges = [];

    for (var i = 0; i < (chains.length-1); i++) {
        for (var j = 0; j < chains[i].nodes.length; j++) {
            var newEdge = {
                StartNode: chains[i].nodes[j].ID,
                EndNode: chains[i+1].nodes[j].ID
            }
            newEdges.push(newEdge);
        }
    }
    return newEdges;
}



squarelattice.drawLattice = function () {
    var size = 10;

    squarelattice.data.nodes = [];
    squarelattice.data.edges = [];
    var chains = [];
    for (var i = 0; i < size; i++) {
        var chain = makeChain(size, i * +size);
        chains.push(chain);        
        squarelattice.data.nodes = squarelattice.data.nodes.concat(chain.nodes);
        squarelattice.data.edges = squarelattice.data.edges.concat(chain.edges);
       
    }
    var connectedChains = connectChainsTogether(chains);
    squarelattice.data.edges = squarelattice.data.edges.concat(connectedChains);


}