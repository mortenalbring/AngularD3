var windsors = {
    info: {
        Title: "Windsor Family Tree",
        Message:"This shows how to create a fairly rudimentary family tree structure using a force-directed graph. " +
            "This also shows how to style different links according to a custom property, as marriages and children are styled with " +
            "different link colours. There is also a weak geometric force that forces end nodes downwards, dynamically creating the tree-like structure."
    },
    settings: {
        linkDistance: 5,
        linkStrength: 1,
        gravity: 0.5,
        friction: 0.9,
        lockToContainer: true,
        clickToConnect: false,
        charge: -1500,
        radius: 1,

    },
    data: {
        nodes: [
        ],
        edges: [

        ],
    }
}


windsors.addIfNew = function (Name, fixed) {
    var ID = windsors.data.nodes.length + 1;

    var existing = windsors.data.nodes.filter(function (e) {
        return e.Name == Name;
    });
    if (existing.length == 0) {
        var newNode = { ID: ID, Name: Name }

        if (fixed) {
            var fixedCount = windsors.data.nodes.filter(function (e) {
                return e.fixed == true;
            })
            //If a node is fixed, we put it at the top and kinda in the middle and then shift it along a bit depending on 
            //how many other fixed nodes there currently are
            newNode.fixed = true;
            newNode.px = 200 + 100 * fixedCount.length;
            newNode.py = 10;
        }
        windsors.data.nodes.push(newNode)
        return newNode;
    }
    return existing[0];
}

windsors.addChildren = function (parent1Name, parent2Name, childrenNames, fixParent1, fixParent2) {
    var startId = windsors.data.nodes.length;

    var parent1Node = windsors.addIfNew(parent1Name, fixParent1);
    var parent2Node = windsors.addIfNew(parent2Name, fixParent2);

    var startId = windsors.data.nodes.length + 1;
    var connector = { ID: startId, Name: "", NodeType: "Connector" };
    windsors.data.nodes.push(connector);
    var newEdge1 = {
        StartNode: parent1Node.ID, EndNode: connector.ID, EdgeType: "Couple"
    }
    var newEdge2 = {
        StartNode: connector.ID, EndNode: parent2Node.ID, EdgeType: "Couple"
    }
    windsors.data.edges.push(newEdge1);
    windsors.data.edges.push(newEdge2);
   
    startId = windsors.data.nodes.length + 1;

    for (var i = 0; i < childrenNames.length; i++) {
        var newNode = { ID: startId + i, Name: childrenNames[i] };
        windsors.data.nodes.push(newNode);
        var newEdge1 = { StartNode: connector.ID, EndNode: newNode.ID }
        windsors.data.edges.push(newEdge1);

        //Originally I was connecting both parents to all the children, but this ended up producing quite a confusing diagram so now I only 
        //connect the first parent. Uncomment these lines to connect both parents again. 

        //  var newEdge2 = { StartNode: parent2Node.ID, EndNode: newNode.ID }        
        // windsors.data.edges.push(newEdge2);
    }



}
windsors.initialise = function () {

    windsors.data.nodes = [];
    windsors.data.edges = [];

    windsors.addChildren("Queen Elizabeth II", "Philip, Duke of Edinburgh",
        ["Charles, Prince of Wales",
            "Andrew, Duke of York",
            "Edward, Earl of Wessex",
            "Anne, Princess Royal"], true, true);
    windsors.addChildren("Charles, Prince of Wales", "Camilla, Duchess of Cornwall", []);

    windsors.addChildren("Charles, Prince of Wales", "Diana, Princess of Wales",
    ["William, Duke of Cambridge", "Henry, Prince of Wales"]);

    windsors.addChildren("William, Duke of Cambridge", "Catherine, Duchess of Cambridge",
        ["George, Prince of Cambridge", "?"]);

    windsors.addChildren("Andrew, Duke of York", "Sarah, Duchess of York",
        ["Beatrice, Princess of York", "Eugeine, Princess of York"]);

    windsors.addChildren("Edward, Earl of Wessex", "Sophie, Countess of Wessex",
    ["James, Viscount Severn", "Louise, Lady Louise Windsor"]);

    windsors.addChildren("Anne, Princess Royal", "Mark Phillips, Captain",
["Peter Phillips", "Zara Phillips"]);


    windsors.addChildren("Anne, Princess Royal", "Timothy Laurence, Vice-Admiral", []);
    windsors.addChildren("Zara Phillips", "Michael Tindall", ["Mia Grace"]);
    windsors.addChildren("Peter Phillips", "Autumn Phillips", ["Savannah Phillips", "Isla Phillips"]);



}
windsors.settings.linkStrength = function (edge) {
    if (edge.EdgeType == "Couple") {
        return 1;
    }
    return 0.3;
}
windsors.settings.linkDistance = function (edge) {
    if (edge.EdgeType == "Couple") {
        return 1;
    }
    return 4;
}

windsors.settings.linkClass = function (edge) {
    if (edge.EdgeType == "Couple") {
        return "link-couple";
    }
    return "link-children";
}

windsors.settings.charge = function (node) {
    
    if (node.NodeType == "Connector") {        
        return -100;
        
    }
    return -1500;
}

windsors.settings.nodeClass = function (d) { return 'node-container-windsor'; },

windsors.settings.customTickFunction = function (e, linkData) {
    //A gentle force that pushes sources up and targets down to force a weak tree
    var k = 9 * e.alpha;
    linkData.forEach(function (d, i) {
        if (d.EdgeType != "Couple") {
          //  d.source.y -= k;
          //  d.target.y += k;
        }
        else {
            d.source.y = d.target.y;

        }
    });
}


