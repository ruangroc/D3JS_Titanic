function create_nodes_table(data) {
    // console.log("made it into the create nodes table with data:", data);

    node_columns = ["conditions", "number of samples", "number of correct samples", "ratio of correct samples"];

    // insert an html table to display the nodes of the decision tree
    var nodes_table = d3.select("#left").append("table").attr("class", "table table-sm table-hover");
    var nodes_head = nodes_table.append("thead").append("tr");
    var nodes_body = nodes_table.append("tbody");
    
    nodes_head.selectAll("th").data(node_columns).enter().append("th").text(function(d) { return d; });
    
    // I want to create nodes.length number of rows
    // then for every row (tr), I want to insert four data (td) for nodes[i].condition, nodes[i].num_samples, etc
    nodes_body.selectAll("tr").data(data).enter().append("tr")
        .selectAll("td").data(function(node) {
            return [node.conditions, node.num_samples, node.num_correct, node.ratio_correct]; 
        }).enter().append("td").text(function(d) { return d; })
        .style("background-color", function(d) {
            if (d > 0.5 && d < 1) {
                return "#b7e4c7";
            }
            else if (d < 1) {
                return "#fec3a6";
            }
        });
}

fetch('/get_nodes')
.then(function(response) {
    return response.json();
}).then(function(data) {
    if (data) {
        create_nodes_table(data);
    }
    else {
        console.log('nodes not received');
    }
}).catch(function(error) {
    console.log("error:", error);
});

// will turn the strings in the csv file into numbers
function strings_to_nums(d){
    d.id = +d.id;
    d.survived = +d.survived;
    d.age = +d.age;
    d.n_siblings_spouses = +d.n_siblings_spouses;
    d.parch = + d.parch;
    d.fare = +d.fare;
    d.confidence = +d.confidence;
    d.predicted = +d.predicted;
    return d;
}

function create_instances_table(data) {
    // console.log("made it into create instances table with data:", data);

    instances_columns = ['id', 'survived', 'sex', 'age', 'number of siblings and spouses', 
    'number of parents and children', 'fare', 'class', 'deck', 'port of embarkation', 
    'alone', 'confidence', 'predicted', 'is prediction correct'];

    var instances_table = d3.select("#bottom_row").append("table").attr("class", "table table-sm table-hover");
    var instances_head = instances_table.append("thead").append("tr");
    var instances_body = instances_table.append("tbody");

    instances_head.selectAll("th").data(instances_columns)
    .enter().append("th").text(function(d) { return d; });
    
    instances_body.selectAll("tr").data(data).enter().append("tr")
    .selectAll("td").data(function(d) {
        return [d.id, d.survived, d.sex, d.age, d.n_siblings_spouses, d.parch, 
                d.fare, d.class, d.deck, d.embark_town, d.alone, d.confidence, 
                d.predicted, d.is_prediction_correct]; 
    }).enter().append("td").text(function(d) { return d; });
}

fetch('/get_instances')
.then(function(response) {
    return response.json();
}).then(function(data) {
    if (data) {
        create_instances_table(data);
    }
    else {
        console.log('instances not received');
    }
}).catch(function(error) {
    console.log("error:", error);
});

function create_scatterplot(data) {
    // console.log("made it into create scatterplot with data:", data);

    if (data) {
        // create a basic scatterplot for the json data
        // source: https://www.d3-graph-gallery.com/graph/scatter_basic.html
        var vis_div = d3.select("#right").append("div");

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 60};
        var width = 460 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = vis_div
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        var x = d3.scaleLinear()
                .domain([-30, 30])
                .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
                .domain([-30, 30])
                .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // json_data = JSON.parse(data);
        var data_array = [];
        Object.values(data).forEach(val => data_array.push(val));
        
        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data_array)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.tsne1); } )
            .attr("cy", function (d) { return y(d.tsne2); } )
            .attr("r", 1.5)
            .style("fill", "#69b3a2");
    }
    else {
        console.log("no data:", data);
    }
}

fetch('/get_tsne')
.then(function(response) {
    return response.json();
}).then(function(data) {
    if (data) {
        create_scatterplot(data);
    }
    else {
        console.log('tsne data not received');
    }
}).catch(function(error) {
    console.log("error:", error);
});


