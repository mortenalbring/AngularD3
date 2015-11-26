var customCharge = {
    settings: {        
        linkDistance: 1,
        linkStrength: 0.5,
        
        radius: 4,
        
    },
    data: {
        nodes: [
            { ID: 1, Name: "A", Type:1 },
            { ID: 2, Name: "B", Type:1 },
            { ID: 3, Name: "C", Type:2 },
            { ID: 4, Name: "D", Type:2 },
            { ID: 5, Name: "E", Type:3 },
            { ID: 6, Name: "F", Type:3 },

        ],
        edges: [
            { StartNode: 1, EndNode: 2 },
            { StartNode: 3, EndNode: 4 },
            { StartNode: 5, EndNode: 6 },
        ],
       
    }
}


customCharge.makeNodesOfType = function (startId,maxElements,type) {
            
    var type = Math.floor(Math.random() * 2) + 1;

    var nodes = [];
    for (var i = startId; i <  startId + maxElements; i++) {
        var newNode = { ID: i, Name: i, Type: type };
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

customCharge.makeNodes = function () {

    customCharge.data.nodes = [];
    customCharge.data.edges = [];    

    var type1 = customCharge.makeNodesOfType(0, 15, 1);
    customCharge.data.nodes = customCharge.data.nodes.concat(type1.nodes);
    customCharge.data.edges = customCharge.data.edges.concat(type1.edges);

}

customCharge.makeNodes();


customCharge.settings.charge = function (node) {
    console.log(node);
    if ((node.Type) && (node.Type == 1)) {
        return -30;
    }
    if ((node.Type) && (node.Type == 2)) {
        return -300;
    }
    if ((node.Type) && (node.Type == 3)) {
        return -3000;
    }

    return 0;
}