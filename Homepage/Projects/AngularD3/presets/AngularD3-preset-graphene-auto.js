var grapheneauto = {
    settings: {
        charge: -450,
        linkDistance: 5,        
        clickToConnect: false
    },
    data: {
        nodes: [

        ],
        edges: [

        ]
    }
}

function connectHexConnections(hexagons) {
    var edges = [];

    for (var i = 0; i < (hexagons.length-1); i++) {
        for (var j = 0; j < 5; j++) {
            var newEdge = {
                StartNode: hexagons[i].nodes[j].ID,
                EndNode: hexagons[i+1].nodes[j+1].ID,
            }
            edges.push(newEdge);
        }
    }
    return edges;
}

function drawHexConnections(startID) {
    var hexagon = {
        nodes: [],
        edges: []
    }

    for (var i = startID; i < startID + 6; i++) {
        var newNode = {
            ID: i,
            Name: i
        }
        hexagon.nodes.push(newNode);
    }
    for (var i = 1; i < 6; i++) {        
        var newEdge = {
            StartNode: hexagon.nodes[0].ID,
            EndNode: hexagon.nodes[i].ID
        }
        hexagon.edges.push(newEdge);
    }

    return hexagon;
}

function drawHexagon(startID) {
    var hexagon =
    {
        nodes: [],
        edges: []
    }

    for (var i = startID; i < startID + 6; i++) {
        var newNode = {
            ID: i,
            Name: i
        }
        hexagon.nodes.push(newNode);
    }

    for (var i = 0; i < 5; i++) {
        var newEdge = {
            StartNode: hexagon.nodes[i].ID,
            EndNode: hexagon.nodes[i + 1].ID,
        }
        hexagon.edges.push(newEdge);
    }
    var lastEdge = {
        StartNode: hexagon.nodes[0].ID,
        EndNode: hexagon.nodes[5].ID
    }
    hexagon.edges.push(lastEdge);

    return hexagon;
}

function connecthex(hexagons, hexindex1, nodeindex1, hexindex2, nodeindex2) {
    var edge = {
        StartNode: hexagons[hexindex1].nodes[nodeindex1].ID,
        EndNode: hexagons[hexindex2].nodes[nodeindex2].ID
    }
    return edge;
}

function connectHexagons(hexagons) {
    var newEdges = [];

    var nodeindex = 0;
    var hexindex = 0;

    newEdges.push(connecthex(hexagons, 0, 0, 1, 0));
    newEdges.push(connecthex(hexagons, 0, 0, 2, 0));
    newEdges.push(connecthex(hexagons, 0, 1, 3, 0));
    newEdges.push(connecthex(hexagons, 0, 1, 4, 0));
    newEdges.push(connecthex(hexagons, 0, 2, 5, 0));
    newEdges.push(connecthex(hexagons, 0, 3, 6, 0));
    newEdges.push(connecthex(hexagons, 0, 4, 7, 0));
    newEdges.push(connecthex(hexagons, 0, 5, 8, 0));

    newEdges.push(connecthex(hexagons, 1, 1, 2, 1));

    //newEdges.push(connecthex(hexagons, 4, 5, 2, 0));


    newEdges.push(connecthex(hexagons, 4, 1, 3, 1));

    
    newEdges.push(connecthex(hexagons, 5, 1, 3, 5));

    newEdges.push(connecthex(hexagons, 6, 1, 5, 5));

    
    newEdges.push(connecthex(hexagons, 7, 1, 6, 5));

    newEdges.push(connecthex(hexagons, 8, 5, 1, 5));
    newEdges.push(connecthex(hexagons, 8, 1, 7, 5));




    






    return newEdges;
}

function drawVertex(startID) {

    var vertexNodes = [];

    for (var i = startID; i < startID + 4; i++) {
        var newNode = {
            ID: i,
            Name: i
        }
        vertexNodes.push(newNode);
    }

    var vertexEdges = [];

    var newEdge1 = {
        StartNode: vertexNodes[0].ID,
        EndNode: vertexNodes[1].ID
    }
    vertexEdges.push(newEdge1);
    var newEdge2 = {
        StartNode: vertexNodes[0].ID,
        EndNode: vertexNodes[2].ID
    }
    vertexEdges.push(newEdge2);
    var newEdge3 = {
        StartNode: vertexNodes[0].ID,
        EndNode: vertexNodes[3].ID
    }
    vertexEdges.push(newEdge3);


    var vertex = {
        nodes: vertexNodes,
        edges: vertexEdges
    }

    return vertex;
}

function connectVertices(vertices) {

    var newEdges = [];

    for (var i = 0; i < (vertices.length - 1) ; i++) {
        var newEdge1 = {
            StartNode: vertices[i].nodes[1].ID,
            EndNode: vertices[i + 1].nodes[1].ID
        }
        newEdges.push(newEdge1);

        var newEdge2 = {
            StartNode: vertices[i].nodes[2].ID,
            EndNode: vertices[i + 1].nodes[2].ID
        }
        newEdges.push(newEdge2);
        var newEdge3 = {
            StartNode: vertices[i].nodes[3].ID,
            EndNode: vertices[i + 1].nodes[3].ID
        }
        newEdges.push(newEdge3);


    }

    return newEdges;
}


grapheneauto.drawGraphene = function () {
    grapheneauto.data.nodes = [];
    grapheneauto.data.edges = [];


    var hexagons = [];

    for (var i = 0; i < 10; i++) {
        var hexagon = drawHexConnections(i * 100);
        hexagons.push(hexagon);
        grapheneauto.data.nodes = grapheneauto.data.nodes.concat(hexagon.nodes);
        grapheneauto.data.edges = grapheneauto.data.edges.concat(hexagon.edges);

    }

    var connections = connectHexConnections(hexagons);
    grapheneauto.data.edges = grapheneauto.data.edges.concat(connections);


}