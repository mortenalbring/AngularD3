var AngularD3GraphService = function (SettingsService) {

    this.graph = {
        width: parseInt(d3.select('#graph-container').style('width'), 10),
        height: 600,
        margin: 30,
        svg: null,
        force: null,
        data: {
            nodes: [],

            edges: []
        }
    };


    this.drawGraph = function () {
        var self = this;

        d3.select("svg").remove();
        if (self.graph.force) {
            self.graph.force.stop();
        }



        self.graph.data.linkData = linksIndexes(self.graph.data.edges, self.graph.data.nodes);

        self.graph.svg = d3.select('#graph-container').append('svg')
            .attr('width', self.graph.width)
            .attr('height', self.graph.height)
            .attr('class', 'svg-container');

        //This sets up the parameters for the force directed graph simulation
        self.graph.force = d3.layout.force()
            .size([self.graph.width - self.graph.margin, self.graph.height - self.graph.margin])
            .nodes(self.graph.data.nodes)
            .links(self.graph.data.linkData)
            .linkDistance(SettingsService.defaultSettings.linkDistance)
            .linkStrength(SettingsService.defaultSettings.linkStrength)
            //Distance between nodes
            .charge(SettingsService.defaultSettings.charge)
            //How much nodes repel eachother (positive is attractive)
            .friction(SettingsService.defaultSettings.friction)
            //Slows down the nodes movement
            .gravity(SettingsService.defaultSettings.gravity)
            //An attractive force towards the centre of the graph
            .on("tick", tick);

        self.graph.force.start();

        if (SettingsService.defaultSettings.showArrows) {
            //Draws little arrows on graph
            self.graph.svg.append("svg:defs").selectAll("marker")
                .data(["end"])
                .enter().append("svg:marker")
                .attr("id", String)
                .attr("class", "link-arrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 0)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");
        }

        self.graph.linklines = self.graph.svg.selectAll(".link");
        //   self.graph.data.linkData = linksIndexes(self.graph.data.edges, self.graph.data.nodes);

        self.graph.linklines = self.graph.linklines.data(self.graph.data.linkData, function (d) {
            return d.source.ID + "-" + d.target.ID;
        });

        self.graph.linklines.enter()
            .insert("polyline", ".node")
            .attr("class", function (e) { return SettingsService.defaultSettings.linkClass(e); })
            .attr("marker-mid", "url(#end)");

        self.graph.linklines.exit().remove();

        //Container for both the node and the label describing the node
        var gnodes = self.graph.svg.selectAll('g.gnode')
            .data(self.graph.data.nodes)
            .enter()
            .append('g')
            .attr("class", function (d) {
                return SettingsService.defaultSettings.nodeClass(d);
            })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .classed('gnode', true)
            .on("click", connectNodes)
            .call(self.graph.force.drag);


        var cnode = gnodes.append("circle")
            .attr("class", "cnode")
            .attr("r",

            function (d) {
                if (SettingsService.isNumeric(SettingsService.defaultSettings.radius)) {
                    return SettingsService.defaultSettings.radius;
                }
                return SettingsService.defaultSettings.radius(d);
            });
        /*
        var labels = gnodes.append("text")
.attr("class", "label-text-shadow")
.text(function (d) { return d.Name });
*/

        var labels = gnodes.append("text")
            .attr("class", "label-text")
            .text(function (d) { return d.Name });



        function connectNodes(d) {
            if (!SettingsService.defaultSettings.clickToConnect) {
                return;
            }

            var r = parseInt(d3.select(this).select("circle").attr("r"));
            d3.select(this).select("circle").attr("r", r + 1);

            var node = self.graph.data.nodes.filter(function (e) {
                return e.ID == d.ID;
            });
            /*
            if (node.length > 0) {
                $scope.$apply(function () {
                    $scope.setClickedNode(node[0]);
                })
            }
            */
        }

        // Generates a tooltip for a SVG circle element based on its ID
        function addTooltip(container) {
            if (!container.TooltipText) { return; }


            var x = parseFloat(container.x);
            var y = parseFloat(container.y);


            //If the node is quite high up, we shift it down a bit
            //Otherwise, we shift it up a bit. This is because we don't want to the tooltip covering the node itself
            if (y < 120) {
                y = y + 100;
            } else {
                y = y - 100;
            }
            //If the node is more than halfway across the graph, we shift the tooltip across a bit
            //to make sure it doesn't overflow outside the container. Probably a more elegant way of doing this
            if (x > (self.graph.width / 2)) {
                x = (x / 2);
            }
            var tooltip = d3.select(".svg-container")
                .append("text")
                .attr("x", x)
                .attr("y", y)
                .attr("id", "tooltip");

            //If the tooltip text is an array, we iterate through and put in some tspans for each element for a new 'line'.
            //Otherwise we just put it as the text propery of the tooltip
            if (!Array.isArray(container.TooltipText)) {
                tooltip.text(container.TooltipText);
            } else {
                for (var i = 0; i < container.TooltipText.length; i++) {
                    tooltip.append("tspan").text(container.TooltipText[i]).attr("x", x).attr("dy", "1.2em");

                }
            }

            //This draws the rectangle behind the tooltip as a 'border'            
            var bbox = tooltip.node().getBBox();
            var padding = 2;
            d3.select(".svg-container")
                .insert("rect", "#tooltip")
                .attr("x", bbox.x - padding)
                .attr("y", bbox.y - padding)
                .attr("width", bbox.width + (padding * 2))
                .attr("height", bbox.height + (padding * 2))
                .attr("id", "tooltip-container");

        }

        function mouseover(d) {

            addTooltip(d);

            /*
            $scope.$apply(function () {
                $scope.highlightConnectedNodes(d.ID);
            })
            */
            var thisRadius = d3.select(this).select("circle").attr("r");

            d3.select(this).select("circle").transition().duration(750).attr("r", thisRadius * 2);
        }
        function mouseout() {

            d3.select("#tooltip").remove();
            d3.select("#tooltip-container").remove();

            /*
            $scope.$apply(function () {
                $scope.clearHighlights();
            })
            */

            var thisRadius = d3.select(this).select("circle").attr("r");

            d3.select(this).select("circle").transition().duration(750).attr("r", thisRadius / 2);
        }

        function linksIndexes(edges, nodes) {
            //The array of nodes and edges must be transformed into an object
            //that contains the actual node objects as source and target
            var output = [];
            for (var i = 0; i < edges.length; i++) {
                var startId = edges[i].StartNode;
                var endId = edges[i].EndNode;
                var sourceNode = nodes.filter(function (n) { return n.ID == startId; });
                var targetNode = nodes.filter(function (n) { return n.ID == endId; });

                if ((sourceNode.length == 1) && (targetNode.length == 1)) {
                    var out = {
                        source: sourceNode[0],
                        target: targetNode[0]
                    }

                    if (edges[i].EdgeType) { out.EdgeType = edges[i].EdgeType; }
                    if (edges[i].Properties) {
                        out.Properties = edges[i].Properties;
                    }

                    output.push(out);
                }
            }
            return output;
        }

        function tick(e) {

            if (SettingsService.defaultSettings.keepSimulationAlive) {
                self.graph.force.resume();

            }
            if (SettingsService.defaultSettings.customTickFunction) {
                SettingsService.defaultSettings.customTickFunction(e, self.graph.data.linkData);
            }


            gnodes.attr("transform", function (d) {
                if (d.x && d.y) {

                    var newx = d.x;
                    var newy = d.y;


                    if (SettingsService.defaultSettings.lockToContainer) {
                        newx = Math.max(SettingsService.defaultSettings.radius, Math.min(self.graph.width - SettingsService.defaultSettings.radius, d.x));
                        newy = Math.max(SettingsService.defaultSettings.radius, Math.min(self.graph.height - SettingsService.defaultSettings.radius, d.y));
                    }

                    return 'translate(' + [newx, newy] + ')';
                }
            });


            self.graph.linklines.attr("points", function (d) {
                return d.source.x + "," + d.source.y + " " +
                       (d.source.x + d.target.x) / 2 + "," + (d.source.y + d.target.y) / 2 + " " +
                       d.target.x + "," + d.target.y;
            });
        }
    }
}