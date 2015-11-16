var windsors = {
    settings: {
        linkDistance: 5,
        linkStrength: 0.5,
        gravity: 0.5,
        friction: 0.9,
        lockToContainer: true,
        clickToConnect: false,
        charge: -2000,
        radius: 1,

    },
    data: {
        nodes: [
        ],
        edges: [

        ],
    }
}


windsors.addIfNew = function (Name) {
    var ID = windsors.data.nodes.length + 1;

    var existing = windsors.data.nodes.filter(function (e) {
        return e.Name == Name;
    });
    if (existing.length == 0) {
        var newNode = { ID: ID, Name: Name }
        windsors.data.nodes.push(newNode)
        return newNode;
    }
    return existing[0];
}

windsors.addChildren = function (parent1Name, parent2Name, childrenNames) {
    var startId = windsors.data.nodes.length;

    var parent1Node = windsors.addIfNew(parent1Name);
    var parent2Node = windsors.addIfNew(parent2Name);

    var existingEdge = windsors.data.edges.filter(function (e) {
        return e.StartNode == parent1Node.ID && e.EndNode == parent2Node.ID
    });
    if (existingEdge.length == 0) {
        var newEdge = { StartNode: parent1Node.ID, EndNode: parent2Node.ID };
        windsors.data.edges.push(newEdge);
    }

    var startId = windsors.data.nodes.length + 1;

    for (var i = 0; i < childrenNames.length; i++) {
        var newNode = { ID: startId + i, Name: childrenNames[i] };
        windsors.data.nodes.push(newNode);
        var newEdge1 = { StartNode: parent1Node.ID, EndNode: newNode.ID }
        var newEdge2 = { StartNode: parent2Node.ID, EndNode: newNode.ID }
        windsors.data.edges.push(newEdge1);
        windsors.data.edges.push(newEdge2);
    }



}
windsors.makeWindsors = function () {

    windsors.data.nodes = [];
    windsors.data.edges = [];
    
    windsors.addChildren("Queen Elizabeth II", "Philip, Duke of Edinburgh",
        ["Charles, Prince of Wales",
            "Andrew, Duke of York",
            "Edward, Earl of Wessex",
            "Anne, Princess Royal"]);
    windsors.addChildren("Charles, Prince of Wales", "Camilla, Duchess of Cornwall", []);

    windsors.addChildren("Charles, Prince of Wales", "Diana, Princess of Wales",
    ["William, Duke of Cambridge", "Henry, Prince of Wales"]);    

    windsors.addChildren("William, Duke of Cambridge", "Catherine, Duchess of Cambridge",
        ["George, Princes of Cambridge", "?"]);

    windsors.addChildren("Andrew, Duke of York", "Sarah, Duchess of York",
        ["Beatrice, Princess of York", "Eugeine, Princess of York"]);

    windsors.addChildren("Edward, Earl of Wessex", "Sophie, Countess of Wessex",
    ["James, Viscount Severn", "Louise, Lady Louise Windsor"]);

    windsors.addChildren("Anne, Princess Royal", "Mark Phillips, Captain",
["Peter Phillips", "Zara Phillips"]);


    windsors.addChildren("Anne, Princess Royal", "Timothy Laurence, Vice-Admiral", []);
    windsors.addChildren("Zara Phillips", "Michael Tindall", ["Mia Grace"]);
    windsors.addChildren("Peter Phillips", "Autumn Phillips", ["Savannah Phillips","Isla Phillips"]);



}



