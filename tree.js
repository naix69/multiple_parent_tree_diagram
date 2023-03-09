// Set the dimensions and margins of the diagram
var margin = { top: 20, right: 90, bottom: 30, left: 90 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Create a tree layout
var treemap = d3.tree()
    .size([height, width]);

// Append SVG to the div with id "tree"
var svg = d3.select("#tree")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load the JSON data
d3.json("data.json", function (error, data) {
    if (error) throw error;

    // Assign parents and children based on the "parents" and "children" fields in the JSON data
    var nodes = d3.hierarchy(data, function (d) { return d.children; });
    nodes.descendants().forEach(function (d) {
        if (d.data.parents) {
            d.data.parents.forEach(function (parent) {
                var parentNode = nodes.descendants().find(function (node) {
                    return node.data.name === parent;
                });
                if (parentNode) {
                    if (!parentNode.children) parentNode.children = [];
                    parentNode.children.push(d);
                }
            });
        }
    });

    // Compute the new tree layout
    var root = treemap(nodes);

    // Add the links between the nodes
    svg.selectAll(".link")
        .data(root.descendants().slice(1))
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", function (d) {
            return "M" + d.y + "," + d.x
                + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                + " " + d.parent.y + "," + d.parent.x;
        });

    // Add the nodes
    var node = svg.selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    // Add the circle for each node
    node.append("circle")
        .attr("r", 10);

    // Add the text for each node
    node.append("text")
        .attr("dy", ".35em")
        .attr("x", function (d) { return d.children ? -13 : 13; })
        .style("text-anchor", function (d) { return d.children ? "end" : "start"; })
        .text(function (d) { return d.data.name; });

    // Add zoom functionality
    svg.call(d3.zoom()
        .on("zoom", function () {
            svg.attr("transform", d3.event.transform);
        }));
});


        //Note: This code uses the hierarchy function to convert the JSON data into a hierarchical structure, and then assigns parents and children based on the "parents" and "children" fields in the JSON data. It then uses the tree layout to compute the positions of the nodes, and adds the links and nodes to the SVG element. Finally, it adds zoom functionality using D3's zoom behavior.



