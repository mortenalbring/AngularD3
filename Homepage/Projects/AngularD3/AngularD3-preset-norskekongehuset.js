//Data courtesy of http://www.royalcourt.no/slektstre.html?tid=28695

var norskekongehus = {
    settings: {
        linkDistance: 5,
        linkStrength: 1,
        gravity: 0.5,
        friction: 0.6,
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


norskekongehus.addIfNew = function (Name, fixed) {
    var ID = norskekongehus.data.nodes.length + 1;

    var existing = norskekongehus.data.nodes.filter(function (e) {
        return e.Name == Name;
    });
    if (existing.length == 0) {
        var newNode = { ID: ID, Name: Name }

        if (fixed) {
            var fixedCount = norskekongehus.data.nodes.filter(function (e) {
                return e.fixed == true;
            })
            //If a node is fixed, we put it at the top and kinda in the middle and then shift it along a bit depending on 
            //how many other fixed nodes there currently are
            newNode.fixed = true;
            newNode.px = 200 + 100 * fixedCount.length;
            newNode.py = 10;
        }
        norskekongehus.data.nodes.push(newNode)
        return newNode;
    }
    return existing[0];
}

norskekongehus.setFamilyType = function(names, type) {
    for (var i = 0; i < names.length; i++) {
        var matching = norskekongehus.data.nodes.filter(function(e) {
            return e.Name == names[i];
        });

        for (var j = 0; j < matching.length; j++) {
            matching[j].FamilyType = type;
        }
    }
}

norskekongehus.addChildren = function (parent1Name, parent2Name, childrenNames, fixParent1, fixParent2) {
    var startId = norskekongehus.data.nodes.length;

    var parent1Node = norskekongehus.addIfNew(parent1Name, fixParent1);
    var parent2Node = norskekongehus.addIfNew(parent2Name, fixParent2);

    var existingEdge = norskekongehus.data.edges.filter(function (e) {
        return e.StartNode == parent1Node.ID && e.EndNode == parent2Node.ID
    });
    if (existingEdge.length == 0) {
        var newEdge = { StartNode: parent1Node.ID, EndNode: parent2Node.ID, EdgeType: "Couple" };
        norskekongehus.data.edges.push(newEdge);
    }

    var startId = norskekongehus.data.nodes.length + 1;

    for (var i = 0; i < childrenNames.length; i++) {
        var newNode = norskekongehus.addIfNew(childrenNames[i]);
        //var newNode = { ID: startId + i, Name: childrenNames[i] };

        //norskekongehus.data.nodes.push(newNode);
        var newEdge1 = { StartNode: parent1Node.ID, EndNode: newNode.ID }
        norskekongehus.data.edges.push(newEdge1);

        //Originally I was connecting both parents to all the children, but this ended up producing quite a confusing diagram so now I only 
        //connect the first parent. Uncomment these lines to connect both parents again. 

        //  var newEdge2 = { StartNode: parent2Node.ID, EndNode: newNode.ID }        
        // norskekongehus.data.edges.push(newEdge2);
    }



}
norskekongehus.makeNorskekongehuset = function () {

    norskekongehus.data.nodes = [];
    norskekongehus.data.edges = [];

    norskekongehus.addChildren("Carl II Johan", "Desiree", ["Oscar I"]);

    norskekongehus.addChildren("Oscar I", "Josephine", ["Carl IV", "Oscar II"]);

    norskekongehus.addChildren("Oscar II", "Sophie", ["Carl", "Gustaf V"]);
    norskekongehus.addChildren("Carl IV", "Louise", ["Louise *"]);
    norskekongehus.addChildren("Frederik VIII", "Louise *", ["Haakon VII","Christian X", "Ingeborg"]);
    norskekongehus.addChildren("Ingeborg", "Carl", ["Astrid", "Carl *"]);

    norskekongehus.addChildren("Christian IX", "Louise **", ["Alexandra", "Frederik VIII"]);

    norskekongehus.addChildren("Gustaf V", "Victoria of Baden", ["Gustaf VI Adolf"]);
    norskekongehus.addChildren("Gustaf VI Adolf", "Margaret of Connaught", ["Gustaf Adolf"]);
    norskekongehus.addChildren("Gustaf Adolf", "Sibylla", ["Carl XVI Gustaf"]);

    norskekongehus.addChildren("Haakon VII", "Maud", ["Olav V"]);

    norskekongehus.setFamilyType(["Carl II Johan", "Oscar I", "Carl IV", "Oscar II"], "King of Norway and Sweden");
    norskekongehus.setFamilyType(["Desiree", "Josephine", "Sophie", "Louise"], "Queen of Norway and Sweden");

    norskekongehus.setFamilyType(["Louise **","Louise *"], "Queen of Denmark");
    norskekongehus.setFamilyType(["Christian IX","Frederik VIII","Christian X"], "King of Denmark");
    norskekongehus.setFamilyType(["Gustaf V", "Gustaf VI Adolf", "Carl XVI Gustaf"], "King of Sweden");
    norskekongehus.setFamilyType(["Victoria of Baden"], "Queen of Sweden");
    norskekongehus.setFamilyType(["Gustaf Adolf", "Prince of Sweden"]);
    norskekongehus.setFamilyType(["Sibylla", "Princess of Sachsen-Coburg-Gotha"]);

    norskekongehus.setFamilyType(["Haakon VII","Olav V"], "King of Norway");
    norskekongehus.setFamilyType(["Maud"], "Queen of Norway");


}
norskekongehus.settings.linkStrength = function (edge) {
    if (edge.EdgeType == "Couple") {
        return 1;
    }
    return 0.3;
}
norskekongehus.settings.linkDistance = function (edge) {
    if (edge.EdgeType == "Couple") {
        return 2;
    }
    return 10;
}

norskekongehus.settings.linkClass = function (edge) {
    if (edge.EdgeType == "Couple") {
        return "link-couple";
    }
    return "link-children";
}

norskekongehus.settings.nodeClass = function (d) {        
    if (d.FamilyType == "King of Norway and Sweden") {
        return 'node-container-kongehus node-container-norway-and-sweden-king'
    }
    if (d.FamilyType == "Queen of Norway and Sweden") {
        return 'node-container-kongehus node-container-norway-and-sweden-queen'
    }
    if (d.FamilyType == "Queen of Denmark") {
        return 'node-container-kongehus node-container-denmark-queen'
    }
    if (d.FamilyType == "King of Denmark") {
        return 'node-container-kongehus node-container-denmark-king'
    }
    if (d.FamilyType == "King of Sweden") {
        return 'node-container-kongehus node-container-sweden-king'
    }
    if (d.FamilyType == "Queen of Sweden") {
        return 'node-container-kongehus node-container-sweden-queen'
    }
    if (d.FamilyType == "King of Norway") {
        return 'node-container-kongehus node-container-norway-king'
    }
    if (d.FamilyType == "Queen of Norway") {
        return 'node-container-kongehus node-container-norway-queen'
    }


    return 'node-container-kongehus node-container-kongehus-default';
    },

norskekongehus.settings.customTickFunction = function (e, linkData) {
    //A gentle force that pushes sources up and targets down to force a weak tree
    var k = 9 * e.alpha;
    linkData.forEach(function (d, i) {
        d.source.y -= k;
        d.target.y += k;
    });
}


