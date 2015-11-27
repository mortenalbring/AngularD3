//Logic for producing DNA courtesy of Dr. Naomi Pollock

var DNA = {
    data: {
        nodes: [


        ],
        edges: [
            
        ]
    },
    settings: {
        linkDistance: -30,
        charge: -300,
        radius: 2,
        clickToConnect:false
    }
}

function singleStrand(startID, maxLength) {
    /// <summary>
    /// Draws a single strand of DNA, with phosphates
    /// </summary>
    /// <param name="startID" type="type">Start ID</param>
    /// <param name="maxLength" type="type">Maximum length of chain</param>
    /// <returns type=""></returns>
    var output = {
        nodes: [],
        edges: []
    }

    var endLength = startID + maxLength;
    for (var i = startID; i < endLength; i++) {
        //First we insert some phosphates into the chain
        var phosphate = {
            ID: i, Name: "P"
        }
        output.nodes.push(phosphate);
    }

    var start = startID + output.nodes.length;
    var arrayList = ["G", "A", "T", "C"];
    for (var i = start ; i < start + maxLength; i++) {
        //Then insert some non-phosphates!
        var randomNumber = Math.round(Math.random() * 3);
        var randomThing = arrayList[randomNumber];
        var notphosphate = {
            ID: i, Name: randomThing
        }
        output.nodes.push(notphosphate);
    }

    //Now we've created our phosphates and non-phosphates, we need to link them up!
    var phosphates = output.nodes.filter(function (e) {
        return e.Name == "P";
    });

    //First we connect all the phosphates up together in a nice line    
    for (var i = 0; i < (phosphates.length - 1) ; i++) {        
        var newEdge = {
            StartNode: phosphates[i].ID,
            EndNode: phosphates[i + 1].ID
        }
        output.edges.push(newEdge);
    }

    //Then we connect every 'not' phosphate to a single phosphate
    var notPhosphates = output.nodes.filter(function (e) {
        return e.Name != "P";
    });

    //The two lists are the same length, so we just connect them at the same position in the list
    for (var i = 0; i < notPhosphates.length; i++) {        
        var newEdge = {
            StartNode: notPhosphates[i].ID,
            EndNode: phosphates[i].ID
        }
        output.edges.push(newEdge);
    }

    //Then we can return this single, connected strand 
    return output;
}


function polymerase(firstStrand) {
    /// <summary>
    /// This takes a single strand and simulates the action of the polymerase enzyme to connect the strand up to matching complementary bases
    /// </summary>
    /// <param name="firstStrand" type="type">Single strand</param>
    /// <returns type="">Connected second strand</returns>
    var output = {
        nodes: [],
        edges: []
    };    

    //First we go through all the non-phosphates in the first strand and generate complementary nodes
    var notPhosphates = firstStrand.nodes.filter(function (e) {
        return e.Name != "P";
    });

    for (var i = 0; i < notPhosphates.length; i++) {
        var nodeName = notPhosphates[i].Name;
        var complementaryName;

        if (nodeName == "A") {
            complementaryName = "T";
        }
        if (nodeName == "T") {
            complementaryName = "A";
        }
        if (nodeName == "G") {
            complementaryName = "C";
        }
        if (nodeName == "C") {
            complementaryName = "G";
        }

        var complementaryNode = {
            ID: i + firstStrand.nodes.length + 1,
            Name: complementaryName
        };

        output.nodes.push(complementaryNode);

        var complementaryEdge = {
            StartNode: notPhosphates[i].ID,
            EndNode: complementaryNode.ID,
        }
        output.edges.push(complementaryEdge);
    }

    //Now we need to generate some new phosphates and connect those up to the complementary nodes
    var newPhosphates = [];
    for (var j = 0; j < output.nodes.length; j++) {
        var newNode = { ID: j + output.nodes.length + firstStrand.nodes.length + 1, Name: "P" };

        var newEdge = { StartNode: output.nodes[j].ID, EndNode: newNode.ID };
        output.edges.push(newEdge);
        newPhosphates.push(newNode);
    }
    output.nodes = output.nodes.concat(newPhosphates);

    //And we also need to connect the new phosphates together in a chain
    for (var k = 0; k < (newPhosphates.length - 1) ; k++) {
        var newEdge = {
            StartNode: newPhosphates[k].ID,
            EndNode: newPhosphates[k + 1].ID
        }
        output.edges.push(newEdge);
    }
    return output;
}

DNA.makeDNA = function(maxLength) {
    var firstStrand = singleStrand(0, maxLength);
    DNA.data.nodes = firstStrand.nodes;
    DNA.data.edges = firstStrand.edges;

    var secondStrand = polymerase(firstStrand);

    DNA.data.nodes = DNA.data.nodes.concat(secondStrand.nodes);
    DNA.data.edges = DNA.data.edges.concat(secondStrand.edges);

}

DNA.initialise = function() {
    DNA.makeDNA(30);
}


