var customCharge = {
    settings: {        
        linkDistance: 1,
        linkStrength: 0.01,
        
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