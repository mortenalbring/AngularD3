var AngularD3SettingsService = function () {
    //This service is responsible for storing and manipulating the graph settings 

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
        //The default values given in the d3 documentation
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

    this.currentSettings = angular.copy(this.defaultSettings);

    this.increaseLinkDistance = function (val) {
        var self = this;
        if (self.isNumeric(val)) {
            self.currentSettings.linkDistance = self.currentSettings.linkDistance + val;
        }
    }
    this.increaseLinkStrength = function (val) {
        var self = this;
        if (self.isNumeric(val)) {
            self.currentSettings.increaseLinkStrength = self.currentSettings.increaseLinkStrength + val;
        }
    }
    this.increaseFriction = function (val) {
        var self = this;
        if (self.isNumeric(val)) {
            self.currentSettings.friction = self.currentSettings.friction + val;
        }
    }
    this.increaseCharge = function (val) {
        var self = this;
        if (self.isNumeric(val)) {
            self.currentSettings.charge = self.currentSettings.charge + val;
        }
    }
    this.increaseGravity = function (val) {
        var self = this;
        if (self.isNumeric(val)) {
            self.currentSettings.gravity = self.currentSettings.gravity + val;
        }
    }
    this.increaseRadius = function (val) {
        var self = this;
        if (self.isNumeric(val)) {
            self.currentSettings.radius = self.currentSettings.radius + val;
        }
    }
    this.isNumeric = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}