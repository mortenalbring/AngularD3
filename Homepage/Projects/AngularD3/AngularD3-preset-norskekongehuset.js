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

        

        var spouseEdges = edges.filter(function(e) {
            return (e.EdgeType == "Couple" && (e.StartNode == nodes[i].ID || e.EndNode == nodes[i].ID));
        });

        for (var j = 0; j < spouseEdges.length; j++) {
            var spouseID;
            if (spouseEdges[j].StartNode != nodes[i].ID) { spouseID = spouseEdges[j].StartNode }
            if (spouseEdges[j].EndNode != nodes[i].ID) { spouseID = spouseEdges[j].EndNode }

            var spouseNodes = nodes.filter(function(e) {
                return e.ID == spouseID;
            });

            if (spouseNodes.length > 0) {
                t.push("Married to " + spouseNodes[0].Name + " - " + spouseNodes[0].FamilyType);
            }
            
        }

        nodes[i].TooltipText = t;
    }

    
}

norskekongehus.makeNorskekongehuset = function () {

    norskekongehus.data.nodes = [];
    norskekongehus.data.edges = [];

    norskekongehus.addChildren(
    {
        Name: "Carl III Johan",
        FamilyType: "King of Norway and Sweden"
    },
    {
        Name: "Desiree",
        FamilyType: "Queen of Norway and Sweden"
    }, [{ Name: "Oscar I", FamilyType: "King of Norway and Sweden" }], false, false);


    norskekongehus.addChildren(
    {
        Name: "Oscar I",
        FamilyType: "King of Norway and Sweden"
    },
    {
        Name: "Josephine",
        FamilyType: "Queen of Norway and Sweden"
    }, [{ Name: "Carl IV", FamilyType: "King of Norway and Sweden" },
        { Name: "Oscar II", FamilyType: "King of Norway and Sweden" }
    ]);

    norskekongehus.addChildren(
   {
       Name: "Oscar II",
       FamilyType: "King of Norway and Sweden"
   },
   {
       Name: "Sophie",
       FamilyType: "Queen of Norway and Sweden"
   }, [{ Name: "Carl", FamilyType: "Prince of Sweden" },
       { Name: "Gustaf V", FamilyType: "King of Sweden" }
   ]);

    norskekongehus.addChildren(
      {
          Name: "Carl IV",
          FamilyType: "King of Norway and Sweden"
      },
      {
          Name: "Louise",
          FamilyType: "Queen of Norway and Sweden"
      }, [{ Name: "Louise *", FamilyType: "Queen of Denmark" }]);

    norskekongehus.addChildren(
{
    Name: "Frederik VIII",
    FamilyType: "King of Denmark"
},
{
    Name: "Louise *",
    FamilyType: "Queen of Denmark"
}, [{ Name: "Haakon VII", FamilyType: "King of Norway" },
   { Name: "Christian X", FamilyType: "King of Denmark" },
   { Name: "Ingeborg", FamilyType: "Princess of Sweden" }
]);

    norskekongehus.addChildren(
{
    Name: "Carl",
    FamilyType: "Prince of Sweden"
},
{
    Name: "Ingeborg",
    FamilyType: "Princess of Sweden"
}, [{ Name: "Astrid", FamilyType: "Queen of Belgium" },
{ Name: "Carl *", FamilyType: "Prince of Sweden" },
{ Name: "Margaretha", FamilyType: "Princess of Sweden" },
{ Name: "Martha", FamilyType: "Crown Princess of Norway" }
]);

    norskekongehus.addChildren(
{
    Name: "Christian IX",
    FamilyType: "King of Denmark"
},
{
    Name: "Louise **",
    FamilyType: "Queen of Denmark"
}, [{ Name: "Alexandra", FamilyType: "Queen of The United Kingdom" },
{ Name: "Frederik VIII", FamilyType: "King of Denmark" }]);


    norskekongehus.addChildren(
{
    Name: "Edvard VII",
    FamilyType: "King of the United Kingdom"
},
{
    Name: "Alexandra",
    FamilyType: "Queen of The United Kingdom"
}, [{ Name: "Maud", FamilyType: "Queen of Norway" },
{ Name: "George V", FamilyType: "King of Denmark" }]);




    norskekongehus.addChildren(
{
    Name: "Gustaf V",
    FamilyType: "King of Sweden"
},
{
    Name: "Victoria of Baden",
    FamilyType: "Queen of Sweden"
}, [{ Name: "Gustaf VI Adolf", FamilyType: "King of Sweden" }]);

    norskekongehus.addChildren(
{
    Name: "Gustaf VI Adolf",
    FamilyType: "King of Sweden"
},
{
    Name: "Margaret of Connaught",
    FamilyType: "Princess of Sweden"
}, [{ Name: "Ingrid", FamilyType: "Queen of Denmark" },
    { Name: "Gustaf Adolf", FamilyType: "Prince of Sweden" }]);

    norskekongehus.addChildren(
{
    Name: "Gustaf Adolf",
    FamilyType: "Prince of Sweden"
},
{
    Name: "Sibylla",
    FamilyType: "Princess of Sachsen-Coburg-Gotha"
}, [{ Name: "Carl XVI Gustaf", FamilyType: "King of Sweden" }]);


    norskekongehus.addChildren(
{
    Name: "Haakon VII",
    FamilyType: "King of Norway"
},
{
    Name: "Maud",
    FamilyType: "Queen of Norway"
}, [{ Name: "Olav V", FamilyType: "King of Norway" }]);

    norskekongehus.addChildren(
{
    Name: "Olav V",
    FamilyType: "King of Norway"
},
{
    Name: "Martha",
    FamilyType: "Crown Princess of Norway"
}, [{ Name: "Ragnhild", FamilyType: "Princess of Norway" },
{ Name: "Astrid", FamilyType: "Princess of Norway" },
{ Name: "Harald V", FamilyType: "King of Norway" }
]
);

    norskekongehus.addChildren(
{
    Name: "Harald V",
    FamilyType: "King of Norway"
},
{
    Name: "Sonja",
    FamilyType: "Queen of Norway"
}, [{ Name: "Haakon", FamilyType: "Crown Prince of Norway" },
{ Name: "Martha Louise", FamilyType: "Princess Of Norway" },
{ Name: "Harald V", FamilyType: "King of Norway" }
]
);


    norskekongehus.addChildren(
{
    Name: "Victoria",
    FamilyType: "Queen of the United Kingdom"
},
{
    Name: "Albert",
    FamilyType: "Prince of Sachsen-Coburg-Gotha"
}, [{ Name: "Edvard VII", FamilyType: "King of the United Kingdom" },
    { Name: "Arthur", FamilyType: "Duke of Connaught and Strathearn" }
]
);

    norskekongehus.addChildren(
{
    Name: "Arthur",
    FamilyType: "Duke of Connaught and Strathearn"
},
{
    Name: "Louise Margareth",
    FamilyType: "Princess of Prussia"
}, [{ Name: "Margaret of Connaught", FamilyType: "Princess of Sweden" }]
);

    norskekongehus.addChildren(
{
    Name: "Christian X",
    FamilyType: "King of Denmark"
},
{
    Name: "Alexandrine",
    FamilyType: "Princess of Mecklenburg-Schwerin"
}, [{ Name: "Frederik IX", FamilyType: "King of Denmark" }]
);

    norskekongehus.addChildren(
{
    Name: "Frederik IX",
    FamilyType: "King of Denmark"
},
{
    Name: "Ingrid",
    FamilyType: "Queen of Denmark"
}, [{ Name: "Margrethe II", FamilyType: "Queen of Denmark" }]
);

    norskekongehus.makeTooltipText(norskekongehus.data.nodes);


}
norskekongehus.settings.linkStrength = function (edge) {
    if (edge.EdgeType == "Couple") {
        return 1;
    }
    return 0.8;
}
norskekongehus.settings.linkDistance = function (edge) {
    if (edge.EdgeType == "Couple") {
        return 2;
    }
    return 4;
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


