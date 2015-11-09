var DNA = {
    data: {
        nodes: [


        ],
        edges: [
            
        ]
    },
    settings: {
        linkDistance: -30,
        charge: -300
    }

}

function singleStrand(startID, maxLength) {
    var output = {
        nodes: [],
        edges: []
    }

    var endLength = startID + maxLength;

    for (var i = startID; i < endLength; i++) {
        //First insert some phosphates
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

    //Now we've created our stuff, we need to link them up!

    var phosphates = output.nodes.filter(function (e) {
        return e.Name == "P";
    });


    for (var i = 0; i < (phosphates.length - 1) ; i++) {
        //Connects all phosphates up together in a nice line
        var thisPhosphate = phosphates[i];
        var newEdge = {
            StartNode: phosphates[i].ID,
            EndNode: phosphates[i + 1].ID
        }
        output.edges.push(newEdge);
    }


    var notPhosphates = output.nodes.filter(function (e) {
        return e.Name != "P";
    });


    for (var i = 0; i < notPhosphates.length; i++) {
        //Connects every 'not' phosphate to a single phosphate at the same position in the list
        var newEdge = {
            StartNode: notPhosphates[i].ID,
            EndNode: phosphates[i].ID
        }
        output.edges.push(newEdge);
    }


    return output;
}


function polymerase(firstStrand) {
    var output = {
        nodes: [],
        edges: []
    };

    console.log(firstStrand.nodes.length);

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
            ID: i + 1000,
            Name: complementaryName
        };

        output.nodes.push(complementaryNode);

        var complementaryEdge = {
            StartNode: notPhosphates[i].ID,
            EndNode: complementaryNode.ID,
        }
        output.edges.push(complementaryEdge);
    }

    var newPhosphates = [];
    for (var j = 0; j < output.nodes.length; j++) {
        var newNode = { ID: j + 5000, Name: "P" };

        var newEdge = { StartNode: output.nodes[j].ID, EndNode: newNode.ID };
        output.edges.push(newEdge);
        newPhosphates.push(newNode);
    }
    output.nodes = output.nodes.concat(newPhosphates);


    for (var k = 0; k < (newPhosphates.length - 1) ; k++) {
        var newEdge = {
            StartNode: newPhosphates[k].ID,
            EndNode: newPhosphates[k + 1].ID
        }
        output.edges.push(newEdge);
    }


    return output;

}

var maxLength = 30;

var firstStrand = singleStrand(0, maxLength);
DNA.data.nodes = firstStrand.nodes;
DNA.data.edges = firstStrand.edges;

var secondStrand = polymerase(firstStrand);

DNA.data.nodes = DNA.data.nodes.concat(secondStrand.nodes);
DNA.data.edges = DNA.data.edges.concat(secondStrand.edges);
