var cube = {
    info: {
        Title: "Cube",
        Message: "Draws a single cube. Due to the oddities of the simulation, sometimes this comes out a bit folded. Jiggle the simulation a bit to fix it."
    },
    settings: {
        charge: -900,
        linkDistance: 100,
        friction: 0.5,
        radius: 4,        
    },
    data: {
        nodes: [
            { ID: 1, Name: "A" },
            { ID: 2, Name: "B" },
            { ID: 3, Name: "C" },
            { ID: 4, Name: "D" },
            { ID: 5, Name: "E" },
            { ID: 6, Name: "F" },
            { ID: 7, Name: "G" },
            { ID: 8, Name: "H" },
        ],
        edges: [
            { StartNode: 1, EndNode: 2 },
            { StartNode: 1, EndNode: 3 },
            { StartNode: 1, EndNode: 5 },
            { StartNode: 2, EndNode: 6 },
            { StartNode: 2, EndNode: 4 },
            { StartNode: 3, EndNode: 4 },
            { StartNode: 3, EndNode: 7 },
            { StartNode: 4, EndNode: 8 },
            { StartNode: 7, EndNode: 8 },
            { StartNode: 5, EndNode: 7 },
            { StartNode: 5, EndNode: 6 },
            { StartNode: 6, EndNode: 8 },
        ],
       
    }
}

cube.initialise = function() {

};