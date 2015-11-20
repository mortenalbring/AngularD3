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


norskekongehus.addIfNew = function (Element, fixed) {
    var Name = Element.Name;
    var Family = Element.FamilyType;

    var ID = norskekongehus.data.nodes.length + 1;

    var existing = norskekongehus.data.nodes.filter(function (e) {
        return (e.Name == Name) && (e.FamilyType == Family);
    });
    if (existing.length == 0) {
        var newNode = { ID: ID, Name: Name, FamilyType: Family }

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


norskekongehus.addChildren = function (parent1, parent2, children, fixParent1, fixParent2) {
    var startId = norskekongehus.data.nodes.length;

    var parent1Node = norskekongehus.addIfNew(parent1, fixParent1);
    var parent2Node = norskekongehus.addIfNew(parent2, fixParent2);

    var existingEdge = norskekongehus.data.edges.filter(function (e) {
        return e.StartNode == parent1Node.ID && e.EndNode == parent2Node.ID
    });
    if (existingEdge.length == 0) {
        var newEdge = { StartNode: parent1Node.ID, EndNode: parent2Node.ID, EdgeType: "Couple" };
        norskekongehus.data.edges.push(newEdge);
    }

    var startId = norskekongehus.data.nodes.length + 1;

    for (var i = 0; i < children.length; i++) {
        var newNode = norskekongehus.addIfNew(children[i]);
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

norskekongehus.makeTooltipText = function () {
    var nodes = norskekongehus.data.nodes;
    var edges = norskekongehus.data.edges;

    for (var i = 0; i < nodes.length; i++) {
        var t = [];
        t.push(nodes[i].Name + " - " + nodes[i].FamilyType);



        var spouseEdges = edges.filter(function (e) {
            return (e.EdgeType == "Couple" && (e.StartNode == nodes[i].ID || e.EndNode == nodes[i].ID));
        });

        var spouseID = 0;
        for (var j = 0; j < spouseEdges.length; j++) {

            if (spouseEdges[j].StartNode != nodes[i].ID) { spouseID = spouseEdges[j].StartNode }
            if (spouseEdges[j].EndNode != nodes[i].ID) { spouseID = spouseEdges[j].EndNode }

            var spouseNodes = nodes.filter(function (e) {
                return e.ID == spouseID;
            });

            if (spouseNodes.length > 0) {
                t.push("Married to " + spouseNodes[0].Name + " - " + spouseNodes[0].FamilyType);
            }

        }
        var childrenNames = [];

        var childrenEdges = edges.filter(function (e) {
            return (e.EdgeType != "Couple" && (e.StartNode == nodes[i].ID || (e.StartNode == spouseID)));
        })
        for (var k = 0; k < childrenEdges.length; k++) {
            var childNode = nodes.filter(function (e) {
                return e.ID == childrenEdges[k].EndNode;
            });
            if (childNode.length > 0) {
                childrenNames.push(childNode[0].Name)
            }
        }
        if (childrenNames.length > 0) {
            t.push("Children : " + childrenNames.join(", "));
        }

        nodes[i].TooltipText = t;
    }


}

norskekongehus.makeNorskekongehuset = function () {

    norskekongehus.data.nodes = [];
    norskekongehus.data.edges = [];

    var CarlJohan = {
        Name: "Carl III Johan",
        FamilyType: "King of Norway and Sweden"
    };
    var Desiree = {
        Name: "Desiree",
        FamilyType: "Queen of Norway and Sweden"
    }
    var OscarI = { Name: "Oscar I", FamilyType: "King of Norway and Sweden" };

    norskekongehus.addChildren(CarlJohan, Desiree, [OscarI], false, false);

    var Josephine = {
        Name: "Josephine",
        FamilyType: "Queen of Norway and Sweden"
    }
    var CarlIV = { Name: "Carl IV", FamilyType: "King of Norway and Sweden" };
    var OscarII = { Name: "Oscar II", FamilyType: "King of Norway and Sweden" };
    norskekongehus.addChildren(OscarI, Josephine, [CarlIV, OscarII]);

    var Sophie = {
        Name: "Sophie",
        FamilyType: "Queen of Norway and Sweden"
    };

    var Carl = { Name: "Carl", FamilyType: "Prince of Sweden" };
    var GustafV = { Name: "Gustaf V", FamilyType: "King of Sweden" };
    norskekongehus.addChildren(OscarII, Sophie, [Carl, GustafV]);

    var CarlIV = {
        Name: "Carl IV",
        FamilyType: "King of Norway and Sweden"
    };
    var Louise = {
        Name: "Louise",
        FamilyType: "Queen of Norway and Sweden"
    };
    var Louise2 = { Name: "Louise *", FamilyType: "Queen of Denmark" };
    norskekongehus.addChildren(CarlIV, Louise, [Louise2]);

    var FrederikVIII = { Name: "Frederik VIII", FamilyType: "King of Denmark" };

    var HaakonVII = { Name: "Haakon VII", FamilyType: "King of Norway" };
    var ChristianX = { Name: "Christian X", FamilyType: "King of Denmark" };
    var Ingeborg = { Name: "Ingeborg", FamilyType: "Princess of Sweden" };
    norskekongehus.addChildren(FrederikVIII, Louise2, [HaakonVII, ChristianX, Ingeborg]);

    var Astrid = { Name: "Astrid", FamilyType: "Queen of Belgium" };
    var Carl2 = { Name: "Carl *", FamilyType: "Prince of Sweden" }
    var Margaretha = { Name: "Margaretha", FamilyType: "Princess of Sweden" };
    var Martha = { Name: "Martha", FamilyType: "Crown Princess of Norway" };
    norskekongehus.addChildren(Carl, Ingeborg, [Astrid, Carl2, Margaretha, Martha]);

    var ChristianIX = {
        Name: "Christian IX",
        FamilyType: "King of Denmark"
    };
    var Louise3 = {
        Name: "Louise **",
        FamilyType: "Queen of Denmark"
    };
    var Alexandra = { Name: "Alexandra", FamilyType: "Queen of The United Kingdom" };

    norskekongehus.addChildren(ChristianIX, Louise3, [Alexandra, FrederikVIII]);

    var EdvardVII = {
        Name: "Edvard VII",
        FamilyType: "King of the United Kingdom"
    };

    var Maud = { Name: "Maud", FamilyType: "Queen of Norway" };
    var GeorgeV = { Name: "George V", FamilyType: "King of Denmark" };
    norskekongehus.addChildren(EdvardVII, Alexandra, [Maud, GeorgeV]);

    var GustafV = {
        Name: "Gustaf V",
        FamilyType: "King of Sweden"
    }
    var VictoriaBaden = {
        Name: "Victoria of Baden",
        FamilyType: "Queen of Sweden"
    };
    var GustafVIAdolf = { Name: "Gustaf VI Adolf", FamilyType: "King of Sweden" };

    norskekongehus.addChildren(GustafV, VictoriaBaden, [GustafVIAdolf]);

    var MargaretConnaught = {
        Name: "Margaret of Connaught",
        FamilyType: "Princess of Sweden"
    };
    var Ingrid = { Name: "Ingrid", FamilyType: "Queen of Denmark" }
    var GustafAdolf = { Name: "Gustaf Adolf", FamilyType: "Prince of Sweden" };
    norskekongehus.addChildren(GustafVIAdolf, MargaretConnaught, [Ingrid, GustafAdolf]);

    var Sibylla = {
        Name: "Sibylla",
        FamilyType: "Princess of Sachsen-Coburg-Gotha"
    };
    var CarlXVIGustaf = { Name: "Carl XVI Gustaf", FamilyType: "King of Sweden" }
    norskekongehus.addChildren(GustafAdolf, Sibylla, [CarlXVIGustaf]);

    var OlavV = { Name: "Olav V", FamilyType: "King of Norway" };
    norskekongehus.addChildren(HaakonVII, Maud, [OlavV]);

    var Ragnhild = { Name: "Ragnhild", FamilyType: "Princess of Norway" };
    var Astrid2 = { Name: "Astrid", FamilyType: "Princess of Norway" };
    var HaraldV = { Name: "Harald V", FamilyType: "King of Norway" };
    norskekongehus.addChildren(OlavV, Martha, [Ragnhild, Astrid2, HaraldV]);

    var Sonja = {
        Name: "Sonja",
        FamilyType: "Queen of Norway"
    }

    var Haakon = { Name: "Haakon", FamilyType: "Crown Prince of Norway" };
    var MarthaLouise = { Name: "Martha Louise", FamilyType: "Princess Of Norway" }

    norskekongehus.addChildren(HaraldV, Sonja, [Haakon, MarthaLouise]);

    var Victoria = {
        Name: "Victoria",
        FamilyType: "Queen of the United Kingdom"
    };
    var Albert = {
        Name: "Albert",
        FamilyType: "Prince of Sachsen-Coburg-Gotha"
    };
    var Arthur = { Name: "Arthur", FamilyType: "Duke of Connaught and Strathearn" };
    var Leopold = { Name: "Leopold", FamilyType: "Duke of Albany" }
    norskekongehus.addChildren(Victoria, Albert
, [EdvardVII, Arthur, Leopold]);

    var Helene = { Name: "Helene Friederike", FamilyType: "Duchess of Albany" };
    var Alice = { Name: "Alice of Albany", FamilyType: "Countess of Athlone" };
    var Charles = { Name: "Charles", FamilyType: "Duke of Albany" };
    norskekongehus.addChildren(Leopold, Helene, [Alice, Charles]);

    var VictoriaAdelaide = { Name: "Victoria Adelaide", FamilyType: "Princess of Schleswig-Holstein" }
    norskekongehus.addChildren(Charles, VictoriaAdelaide, [Sibylla, ]);


    var LouiseMargareth = {
        Name: "Louise Margareth",
        FamilyType: "Princess of Prussia"
    };

    norskekongehus.addChildren(Arthur, LouiseMargareth, [MargaretConnaught]);

    var Alexandrine = {
        Name: "Alexandrine",
        FamilyType: "Princess of Mecklenburg-Schwerin"
    };

    var FrederikIX = { Name: "Frederik IX", FamilyType: "King of Denmark" };

    norskekongehus.addChildren(ChristianX, Alexandrine, [FrederikIX]);

    var MargretheII = { Name: "Margrethe II", FamilyType: "Queen of Denmark" };
    norskekongehus.addChildren(FrederikIX, Ingrid, [MargretheII]);

    norskekongehus.makeTooltipText(norskekongehus.data.nodes);


}
norskekongehus.settings.linkStrength = function (edge) {
    if (edge.EdgeType == "Couple") {
        return 4;
    }
    return 0.8;
}
norskekongehus.settings.linkDistance = function (edge) {
    if (edge.EdgeType == "Couple") {
        return 0.1;
    }
    return 1;
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
    var k = 7 * e.alpha;
    linkData.forEach(function (d, i) {
        d.source.y -= k;
        d.target.y += k;
    });
}


