var AngularD3SettingsService = function() {
    this.checkSettings = function(customSettings) {
        //The preset files come with custom settings for various parameters to make the scene look good. 
        //If I've forgotten to set one of the parameters, this should prevent the graph from breaking        
        if (!customSettings.linkDistance) { customSettings.linkDistance = 20; }
        if (!customSettings.linkStrength) { customSettings.linkStrength = 0.8; }
        if (!customSettings.friction) { customSettings.friction = 0.9; }
        if (!customSettings.charge) { customSettings.charge = -1000; }
        if (!customSettings.gravity) { customSettings.gravity = 0.25; }
        if (!customSettings.radius) { customSettings.radius = 2; }

        if (customSettings.clickToConnect == undefined) { customSettings.clickToConnect = true; }
        if (customSettings.lockToContainer == undefined) { customSettings.lockToContainer = false; }
        if (customSettings.showArrows == undefined) { customSettings.showArrows = false; }
        if (customSettings.keepSimulationAlive == undefined) { customSettings.keepSimulationAlive = false; }

        if (!customSettings.linkClass) { customSettings.linkClass = function () { return 'link link-default'; } }
        if (!customSettings.nodeClass) { customSettings.nodeClass = function () { return 'node-container'; } }

        return customSettings;
    }


    this.defaultSettings = {
        linkDistance: 20,
        linkStrength: 1,
        friction: 0.9,
        charge: -1000,
        gravity: 0.25,
        radius: 2,
        clickToConnect: true,
        lockToContainer: false,
        linkClass: function () { return 'link link-default'; },
        nodeClass: function () { return 'node-container'; },
        customTickFunction: null,
        showArrows: true
    }

    this.isNumeric = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}