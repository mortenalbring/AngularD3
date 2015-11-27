var graphene = {
    settings: {
        charge: -500,
        linkDistance: 10
    },
    data: {
        nodes: [
            { ID: 1, Name: "1" },
            { ID: 2, Name: "2" },
            { ID: 3, Name: "3" },
            { ID: 4, Name: "4" },
            { ID: 5, Name: "5" },
            { ID: 6, Name: "6" },

            { ID: 7, Name: "7" },
            { ID: 8, Name: "8" },
            { ID: 9, Name: "9" },

            { ID: 10, Name: "10" },
            { ID: 11, Name: "11" },
            { ID: 12, Name: "12" },

            { ID: 13, Name: "13" },
            { ID: 14, Name: "14" },

            { ID: 15, Name: "15" },
            { ID: 16, Name: "16" },
            { ID: 17, Name: "17" },

            { ID: 18, Name: "18" },
            { ID: 19, Name: "19" },
            { ID: 20, Name: "20" },
            { ID: 21, Name: "21" },
            { ID: 22, Name: "22" },
            { ID: 23, Name: "23" },
            { ID: 24, Name: "24" },
            { ID: 25, Name: "25" },
            { ID: 26, Name: "26" },
            { ID: 27, Name: "27" },
            { ID: 28, Name: "28" },
            { ID: 29, Name: "29" },
            { ID: 30, Name: "30" },
            { ID: 31, Name: "31" },
            { ID: 32, Name: "32" },
        ],
        edges: [
            { StartNode: 1, EndNode: 2 },
            { StartNode: 2, EndNode: 3 },
            { StartNode: 3, EndNode: 4 },
            { StartNode: 4, EndNode: 5 },
            { StartNode: 5, EndNode: 6 },
            { StartNode: 6, EndNode: 1 },

            { StartNode: 2, EndNode: 16 },
            { StartNode: 16, EndNode: 15 },
            { StartNode: 15, EndNode: 14 },
            { StartNode: 14, EndNode: 13 },

            { StartNode: 13, EndNode: 3 },

            { StartNode: 13, EndNode: 12 },
            { StartNode: 12, EndNode: 11 },
            { StartNode: 11, EndNode: 10 },
            { StartNode: 10, EndNode: 4 },

            { StartNode: 10, EndNode: 9 },
            { StartNode: 9, EndNode: 8 },
            { StartNode: 8, EndNode: 7 },
            { StartNode: 7, EndNode: 5 },

            { StartNode: 7, EndNode: 17 },
            { StartNode: 17, EndNode: 18 },
            { StartNode: 18, EndNode: 19 },
            { StartNode: 19, EndNode: 6 },
            { StartNode: 19, EndNode: 20 },
            { StartNode: 20, EndNode: 21 },
            { StartNode: 21, EndNode: 22 },
            { StartNode: 22, EndNode: 1 },

            { StartNode: 23, EndNode: 21 },
            { StartNode: 23, EndNode: 24 },
            { StartNode: 24, EndNode: 25 },
            { StartNode: 25, EndNode: 26 },
            { StartNode: 26, EndNode: 27 },
            { StartNode: 22, EndNode: 26 },
            { StartNode: 27, EndNode: 16 },

            { StartNode: 27, EndNode: 28 },
            { StartNode: 28, EndNode: 29 },
            { StartNode: 29, EndNode: 30 },
            { StartNode: 30, EndNode: 15 },

            { StartNode: 25, EndNode: 31 },
            { StartNode: 31, EndNode: 32 },
            { StartNode: 32, EndNode: 28 }
        ]
    }
}

graphene.initialise = function() {

};