var windsors = {
    settings: {
        linkDistance: 30,
        linkStrength: 0.8,
        gravity: 0.1,
        friction: 0.9,
        lockToContainer: true,
        clickToConnect: false,
        charge: -900,
        radius: 1,

    },
    data: {
        nodes: [
            { ID: 1, Name: "Queen Elizabeth II" },
            { ID: 2, Name: "Philip, Duke of Edinburgh" },
            { ID: 3, Name: "Diana, Princess of Wales" },
            { ID: 4, Name: "Charles, Prince of Wales" },
            { ID: 5, Name: "Camilla, Duchess of Cornwall" },
            { ID: 6, Name: "Andrew, Duke of York" },
            { ID: 7, Name: "Sarah, Duchess of York" },
            { ID: 8, Name: "Edward, Earl of Wessex" },
        ],
        edges: [
            { StartNode: 1, EndNode: 2 },
            { StartNode: 1, EndNode: 4 },
            { StartNode: 2, EndNode: 4 },
            { StartNode: 3, EndNode: 4 },
            { StartNode: 4, EndNode: 5 },
            { StartNode: 1, EndNode: 6 },
            { StartNode: 2, EndNode: 6 },
            { StartNode: 6, EndNode: 7 },

            { StartNode: 1, EndNode: 8 },
            { StartNode: 2, EndNode: 8 },
            { StartNode: 8, EndNode: 7 },

        ],
    }
}


