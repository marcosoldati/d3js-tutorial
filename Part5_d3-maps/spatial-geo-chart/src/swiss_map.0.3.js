// create svg canvas
const canvHeight = 600, canvWidth = 960;
const svg = d3.select("body").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .style("border", "1px solid");

// calc the width and height depending on margins.
const margin = {top: 50, right: 80, bottom: 50, left: 60};
const width = canvWidth - margin.left - margin.right;
const height = canvHeight - margin.top - margin.bottom;

// create parent group and add left and top margin
const g = svg.append("g")
    .attr("id", "chart-area")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// chart title
svg.append("text")
    .attr("id", "chart-title")
    .attr("y", 0)
    .attr("x", margin.left)
    .attr("dy", "1.5em")
    .text("Switzerland");

//-----------------------------------------------------------
function doPlot() {
    // adapt from https://bl.ocks.org/mbostock/4207744
    var projection = d3.geoAlbers()  // Albers is best at lat 45°
        .rotate([0, 0])       // rotate around globe by lat and long
        .center([8.3, 46.8])  // lat and long in degrees
        .scale(16000)         // zoom into small switzerland, depends on the projection
        .translate([width / 2, height / 2])  // move to center of map
        .precision(.1);

    // change to d3-fetch        
    d3.json("./data/readme-swiss.json").then(function(topology) {
        var cantons = topojson.feature(topology, topology.objects.cantons);

        var pathGenerator = d3.geoPath().projection(projection);
        //g.append("path")
        //    .datum(cantons)
        //    .attr("class", "canton")
        //    .attr("d", pathGenerator);
        
        var cant = g.selectAll("path.canton")
            .data(cantons.features)
            .enter()
            .append("path")
              .attr("id", d=> d.id)
              .attr("class", "canton")
              .attr("d", pathGenerator);

        g.append("path")
            .datum(topojson.mesh(topology, topology.objects.cantons))
            .attr("class", "canton-boundary")
            .attr("d", pathGenerator);

        g.selectAll("text")
            .data(cantons.features)
              .enter().append("text")
                .attr("transform", d => "translate(" + pathGenerator.centroid(d) + ")")
                .attr("dy", ".35em")
                .text(d => d.properties.name);
    });
}

doPlot();