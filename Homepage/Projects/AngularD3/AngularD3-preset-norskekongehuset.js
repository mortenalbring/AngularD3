//Data courtesy of http://www.royalcourt.no/slektstre.html?tid=28695

var norskekongehus = {
    settings: {
        linkDistance: 5,
        linkStrength: 1,
        gravity: 0.5,
        friction: 0.6,
        lockToContainer: true,
        clickToConnect: false,
        charge: -800,
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
    var Family = Element.Country;

    var ID = norskekongehus.data.nodes.length + 1;

    var existing = norskekongehus.data.nodes.filter(function (e) {
        return (e.Name == Name) && (e.Country == Family);
    });
    if (existing.length == 0) {
        var newNode = {
            ID: ID, Name: Name,
            Country: Family,
            Born: Element.Born,
            Died: Element.Died,
            Titles: Element.Titles,
            House: Element.House
        }

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
        var nodeName = nodes[i].Name + " (" + nodes[i].Born + " - ";

        if (nodes[i].Died) {
            nodeName = nodeName + nodes[i].Died;
        }
        nodeName = nodeName + ")";

        t.push(nodeName);

        if (nodes[i].Titles) {
            var titles = nodes[i].Titles.join(", ");
            t.push(titles);
        }

        if (nodes[i].House) {
            t.push("House of " + nodes[i].House);
        }


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
                t.push("Married to " + spouseNodes[0].Name + " - " + spouseNodes[0].Country);
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

norskekongehus.orderByBorn = function () {
    var orderedNodes = norskekongehus.data.nodes.sort(function (a, b) {
        var aParam = a.Born;
        var bParam = b.Born;
        return (aParam == bParam) ? 0 : (aParam > bParam) ? 1 : -1;
    });    
}


norskekongehus.makeNorskekongehuset = function () {

    norskekongehus.constructData();

    norskekongehus.makeTooltipText(norskekongehus.data.nodes);

    var temphouses = [];
    for (var i = 0; i < norskekongehus.data.nodes.length; i++) {
        console.log(norskekongehus.data.nodes[i]);
        if (norskekongehus.data.nodes[i].House) {        
            var indx = temphouses.indexOf(norskekongehus.data.nodes[i].House);
            if (indx === -1) {
                temphouses.push(norskekongehus.data.nodes[i].House);
            }
        }
    }

    for (var i = 0; i < temphouses.length; i++) {
        var nodecount = norskekongehus.data.nodes.filter(function (e) {
            return e.House == temphouses[i];
        });

        console.log(temphouses[i] + " " + nodecount.length)

    }
    //console.log(temphouses);

   // norskekongehus.data.nodes = norskekongehus.orderByBorn();

}
norskekongehus.settings.linkStrength = function (edge) {
    if (edge.EdgeType == "Couple") {
        return 4;
    }
    return 2;
}
norskekongehus.settings.linkDistance = function (edge) {
    if (edge.EdgeType == "Couple") {
        return 0.1;
    }
    return 0.1;
}

norskekongehus.settings.linkClass = function (edge) {
    if (edge.EdgeType == "Couple") {
        return "link-couple";
    }
    return "link-children";
}

norskekongehus.settings.nodeClass = function (d) {

    if (d.Country == "Norway") {
        return 'node-container-kongehus node-container-norway';
    }
    if (d.Country == "Sweden") {
        return 'node-container-kongehus node-container-sweden';
    }
    if (d.Country == "Denmark") {
        return 'node-container-kongehus node-container-denmark';
    }
    if (d.Country == "Germany") {
        return 'node-container-kongehus node-container-germany';
    }
    if (d.Country == "United Kingdom") {
        return 'node-container-kongehus node-container-united-kingdom';
    }

    return 'node-container-kongehus node-container-kongehus-default';
},

norskekongehus.settings.customTickFunction = function (e, linkData) {
    //A gentle force that pushes sources up and targets down to force a weak tree
    var k = 20 * e.alpha;
    linkData.forEach(function (d, i) {       
            if (d.source.Born > d.target.Born) {
                d.source.y -= k;
                d.target.y += k;
            } else {
                d.source.y += k;
                d.target.y -= k;
            }
        
    });

}


norskekongehus.constructData = function () {

    norskekongehus.data.nodes = [];
    norskekongehus.data.edges = [];

    var CarlJohan = {
        Name: "Carl III Johan",
        Country: "Norway and Sweden",
        Titles: ["King of Norway and Sweden", "Marshal of France", "Prince of Ponte Corvo"],
        House: "Bernadotte",
        Born: 1763,
        Died: 1844
    };
    var Desiree = {
        Name: "Desiree",
        Country: "Norway and Sweden",
        Titles: ["Queen of Norway and Sweden", "Princess of Ponte Corvo"],
        Born: 1777,
        Died: 1860
    }
    var OscarI = {
        Name: "Oscar I",
        Country: "Norway and Sweden",
        Titles: ["King of Norway and Sweden"],
        House: "Bernadotte",
        Born: 1799,
        Died: 1859
    };

    norskekongehus.addChildren(CarlJohan, Desiree, [OscarI], false, false);

    var Josephine = {
        Name: "Josephine",
        Country: "Norway and Sweden",
        Titles: ["Queen of Norway and Sweden", "Princess of Leuchtenberg"],
        House: "Beauharnais",
        Born: 1807,
        Died: 1876
    }
    var CarlIV = {
        Name: "Carl IV",
        Country: "Norway and Sweden",
        Titles: ["King of Norway and Sweden"],
        House: "Bernadotte",
        Born: 1826,
        Died: 1872
    };
    var OscarII = {
        Name: "Oscar II",
        Country: "Norway and Sweden",
        Titles: ["King of Norway", "King of Sweden"],
        House: "Bernadotte",
        Born: 1829,
        Died: 1907
    };
    norskekongehus.addChildren(OscarI, Josephine, [CarlIV, OscarII]);

    var Sophie = {
        Name: "Sophie",
        Country: "Norway and Sweden",
        Titles: ["Queen consort of Sweden", "Queen consort of Norway", "Princess of Nassau"],
        House: "Nassau-Weilburg",
        Born: 1836,
        Died: 1913
    };

    var Carl = {
        Name: "Carl",
        Country: "Sweden",
        Titles: ["Prince of Sweden", "Duke of Vastergotland"],
        House: "Bernadotte",
        Born: 1861,
        Died: 1951
    };
    var GustafV = {
        Name: "Gustaf V",
        Country: "Sweden",
        Titles: ["King of Sweden"],
        House: "Bernadotte",
        Born: 1858,
        Died: 1950
    };
    norskekongehus.addChildren(OscarII, Sophie, [Carl, GustafV]);

    var CarlIV = {
        Name: "Carl IV",
        Country: "Norway and Sweden",
        Titles: ["King of Norway and Sweden"],
        House: "Bernadotte",
        Born: 1826,
        Died: 1872
    };
    var Louise = {
        Name: "Louise",
        Country: "Norway and Sweden",
        Titles: ["Princess of the Netherlands", "Queen of Norway and Sweden"],
        House: "Orange-Nassau",
        Born: 1828,
        Died: 1871
    };
    var Louise2 = {
        Name: "Louise *",
        Country: "Denmark",
        Titles: ["Queen of Denmark", "Princess of Norway and Sweden"],
        House: "Bernadotte",
        Born: 1851,
        Died: 1926
    };
    norskekongehus.addChildren(CarlIV, Louise, [Louise2]);

    var FrederikVIII = {
        Name: "Frederik VIII",
        Country: "Denmark",
        Titles: ["King of Denmark"],
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1843,
        Died: 1912
    };

    var HaakonVII = {
        Name: "Haakon VII",
        Country: "Norway",
        Titles: ["King of Norway", "Prince of Denmark"],
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1872,
        Died: 1957
    };
    var ChristianX = {
        Name: "Christian X",
        Country: "Denmark",
        Titles: ["King of Denmark", "King of Iceland"],
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1870,
        Died: 1947
    };
    var Ingeborg = {
        Name: "Ingeborg",
       Country: "Sweden",
        Titles: ["Princess of Sweden", "Princess of Denmark"],
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1878,
        Died: 1958
    };
    norskekongehus.addChildren(FrederikVIII, Louise2, [HaakonVII, ChristianX, Ingeborg]);

    var Astrid = {
        Name: "Astrid",
        Country: "Belgium",
        Titles: ["Queen of Belgium", "Princess of Sweden"],
        House: "Bernadotte",
        Born: 1905,
        Died: 1935
    };
    var Carl2 = {
        Name: "Carl *",
        Country: "Sweden",
        Titles: ["Prince of Sweden", "Duke of Ostergotland"],
        House: "Bernadotte",
        Born: 1911,
        Died: 2003
    }
    var Margaretha = {
        Name: "Margaretha",
       Country: "Sweden",
        Titles: ["Princess of Sweden and Norway", "Princess of Sweden"],
        House: "Bernadotte",
        Born: 1899,
        Died: 1977
    };
    var Martha = {
        Name: "Martha",
        Country: "Norway",
        Titles: ["Princess of Norway"],
        House: "Bernadotte",
        Born: 1901,
        Died: 1954
    };
    norskekongehus.addChildren(Carl, Ingeborg, [Astrid, Carl2, Margaretha, Martha]);

    var ChristianIX = {
        Name: "Christian IX",
        Country: "Denmark",
        Titles: ["King of Denmark", "Prince of Schleswig-Holstein-Sonderburg-Glucksburg"],
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1818,
        Died: 1906
    };
    var Louise3 = {
        Name: "Louise **",
        Country: "Denmark",
        Titles: ["Queen of Denmark", "Princess of Hessen-Kassel"],
        House: "Hesse-Kassel",
        Born: 1817,
        Died: 1898
    };
    var Alexandra = {
        Name: "Alexandra",
        Country: "United Kingdom",
        Titles: ["Queen of The United Kingdom", "Princess of Denmark"],
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1844,
        Died: 1925
    };

    norskekongehus.addChildren(ChristianIX, Louise3, [Alexandra, FrederikVIII]);

    var EdvardVII = {
        Name: "Edward VII",
        Country: "United Kingdom",
        House: "Saxe-Coburg and Gotha",
        Born: 1841,
        Died: 1910
    };

    var Maud = {
        Name: "Maud",
        Country: "Norway",
        Titles: ["Queen of Norway", "Princess of Wales"],
        House: "Saxe-Coburg and Gotha",
        Born: 1869,
        Died: 1938
    };
    var GeorgeV = {
        Name: "George V",
        Country: "United Kingdom",
        Titles: ["King of the United Kingdom"],
        House: "Windsor",
        Born: 1865,
        Died: 1936
    };
    norskekongehus.addChildren(EdvardVII, Alexandra, [Maud, GeorgeV]);

    var MaryOfTeck = {
        Name: "Mary of Teck",
        Country: "United Kingdom",
        Titles: ["Queen of the United Kingdom"],
        House: "Wurttemberg",
        Born: 1867,
        Died: 1953
    }
    
    var GeorgeIV = {
        Name: "George VI",
        Country: "United Kingdom",
        Titles: ["King of the United Kingdom"],
        House: "Windsor",
        Born: 1895,
        Died: 1952
    }

    norskekongehus.addChildren(GeorgeV, MaryOfTeck, [GeorgeIV]);

    var ElizabethBowes = {
        Name: "Elizabeth Bowes-Lyon",
        Country: "United Kingdom",
        Titles: ["Queen of the United Kingdom"],
        House: "Windsor",
        Born: 1900,
        Died: 2002
    }

    var Elizabeth = {
        Name: "Elizabeth II",
        Country: "United Kingdom",
        Titles: ["Queen of the United Kingdom"],
        House: "Windsor",
        Born: 1952,        
    }

    norskekongehus.addChildren(GeorgeIV, ElizabethBowes, [Elizabeth]);


    var GustafV = {
        Name: "Gustaf V",
        Country: "Sweden",
        Titles: ["King of Sweden"],
        House: "Bernadotte",
        Born: 1858,
        Died: 1950
    }
    var VictoriaBaden = {
        Name: "Victoria of Baden",
        Country: "Sweden",
        Titles: ["Queen of Sweden", "Princess of Baden"],
        House: "Zahringen",
        Born: 1862,
        Died: 1930
    };
    var GustafVIAdolf = {
        Name: "Gustaf VI Adolf",
        Country: "Sweden",
        Titles: ["King of Sweden"],
        House: "Bernadotte",
        Born: 1882,
        Died: 1973
    };

    norskekongehus.addChildren(GustafV, VictoriaBaden, [GustafVIAdolf]);


    var MargaretConnaught = {
        Name: "Margaret of Connaught",
       Country: "Sweden",
        Titles: ["Princess of Sweden", "Duchess of Skane"],
        House: "Saxe-Coburg and Gotha",
        Born: 1882,
        Died: 1920
    };
    var Ingrid = {
        Name: "Ingrid",
        Country: "Denmark",
        Titles: ["Queen of Denmark", "Princess of Sweden"],
        House: "Bernadotte",
        Born: 1910,
        Died: 2000
    }
    var GustafAdolf = {
        Name: "Gustaf Adolf",
        Country: "Sweden",
        Titles: ["Prince of Sweden", "Duke of Vasterbotten"],
        House: "Bernadotte",
        Born: 1906,
        Died: 1947
    };
    norskekongehus.addChildren(GustafVIAdolf, MargaretConnaught, [Ingrid, GustafAdolf]);


    var LouiseMountbatten = {
        Name: "Louise Mountbatten",
        Country: "Sweden",
        Titles: ["Queen of Sweden", "Princess of Battenberg"],
        House: "Battenberg",
        Born: 1889,
        Died: 1965
    }

    norskekongehus.addChildren(GustafVIAdolf, LouiseMountbatten, []);


    var Sibylla = {
        Name: "Sibylla",
        Country: "Sweden",
        Titles: ["Duchess of Vasterbotten"],
        House: "Saxe-Coburg and Gotha",
        Born: 1908,
        Died: 1972
    };
    var CarlXVIGustaf = {
        Name: "Carl XVI Gustaf",
        Country: "Sweden",
        Titles: ["King of Sweden"],
        House: "Bernadotte",
        Born: 1946
    }
    norskekongehus.addChildren(GustafAdolf, Sibylla, [CarlXVIGustaf]);

    var OlavV = {
        Name: "Olav V",
        Country: "Norway",
        Titles: ["King of Norway", "Prince of Denmark"],
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1903,
        Died: 1991
    };
    norskekongehus.addChildren(HaakonVII, Maud, [OlavV]);

    var Ragnhild = {
        Name: "Ragnhild",
       Country: "Norway",
        Titles: ["Princess of Norway"],
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1930,
        Died: 2012
    };
    var Astrid2 = {
        Name: "Astrid",
       Country: "Norway",
        Titles: ["Princess of Norway"],
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1932
    };
    var HaraldV = {
        Name: "Harald V",
        Country: "Norway",
        Titles: ["King of Norway"],
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1937
    };
    norskekongehus.addChildren(OlavV, Martha, [Ragnhild, Astrid2, HaraldV]);

    var Sonja = {
        Name: "Sonja",
        Country: "Norway",
        Titles: ["Queen of Norway"],
        Born: 1937
    }

    var Haakon = {
        Name: "Haakon",
        Country: "Norway",
        Titles: ["Crown Prince of Norway"],
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1973
    };
    var MarthaLouise = {
        Name: "Martha Louise",
       Country: "Norway",
        Titles: ["Princess of Norway"],
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1971
    }

    norskekongehus.addChildren(HaraldV, Sonja, [Haakon, MarthaLouise]);

    var Victoria = {
        Name: "Victoria",
        Country: "United Kingdom",
        Titles: ["Queen of the United Kingdom"],
        House: "Hanover",
        Born: 1819,
        Died: 1901
    };
    var Albert = {
        Name: "Albert",
        Country: "United Kingdom",
        Titles: ["Prince consort of the United Kingdom"],
        House: "Saxe-Coburg and Gotha",
        Born: 1819,
        Died: 1861
    };
    var Arthur = {
        Name: "Arthur",
        Country: "United Kingdom",
        Titles: ["Duke of Connaught and Strathearn"],
        House: "Windsor",
        Born: 1874,
        Died: 1942
    };
    var Leopold = {
        Name: "Leopold",
        Country: "United Kingdom",
        Titles: ["Duke of Albany"],
        House: "Saxe-Coburg and Gotha",
        Born: 1853,
        Died: 1884
    }
    norskekongehus.addChildren(Victoria, Albert, [EdvardVII, Arthur, Leopold]);

    var Helene = {
        Name: "Helene Friederike",
        Country: "Germany",
        Titles: ["Duchess of Albany"],
        House: "Waldeck and Pyrmont",
        Born: 1861,
        Died: 1922
    };
    var Alice = {
        Name: "Alice of Albany",
        Country: "United Kingdom",
        Titles: ["Countess of Athlone"],
        House: "Windsor",
        Born: 1883,
        Died: 1981
    };
    var Charles = {
        Name: "Charles",
        Country: "Germany",
        Titles: ["Duke of Albany"],
        House: "Saxe-Coburg and Gotha",
        Born: 1884,
        Died: 1954
    };
    norskekongehus.addChildren(Leopold, Helene, [Alice, Charles]);

    var VictoriaAdelaide = {
        Name: "Victoria Adelaide",
       Country: "Prussia",
        Titles: ["Princess of Schleswig-Holstein"],
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1885,
        Died: 1970
    }
    norskekongehus.addChildren(Charles, VictoriaAdelaide, [Sibylla, ]);

    var LouiseMargareth = {
        Name: "Louise Margareth",
       Country: "Prussia",
        Titles: ["Princess of Prussia", "Duchess of Connaught and Strathearn"],
        House: "Hohenzollern",
        Born: 1860,
        Died: 1917
    };

    norskekongehus.addChildren(Arthur, LouiseMargareth, [MargaretConnaught]);

    var Alexandrine = {
        Name: "Alexandrine",
        Country: "Denmark",
        Titles: ["Queen of Denmark", "Queen of Iceland", "Duchess of Mecklenburg-Schwerin"],
        House: "Mecklenburg-Schwerin",
        Born: 1879,
        Died: 1952
    };

    var FrederikIX = {
        Name: "Frederik IX",
        Country: "Denmark",
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1899,
        Died: 1972
    };

    norskekongehus.addChildren(ChristianX, Alexandrine, [FrederikIX]);

    var MargretheII = {
        Name: "Margrethe II",
        Country: "Denmark",
        House: "Schleswig-Holstein-Sonderburg-Glucksburg",
        Born: 1972
    };
    norskekongehus.addChildren(FrederikIX, Ingrid, [MargretheII]);


}

