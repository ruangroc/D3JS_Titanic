/*************** Re-render the instances table and scatterplot ************/
function rerender_instances_plot(data) {
    // data = an array of arrays, each array representing a row
    instances_objects = []

    for (passenger of data) {
        passenger_object = {
            id: passenger[0],
            survived: passenger[1],
            sex: passenger[2], 
            age: passenger[3],
            n_siblings_spouses: passenger[4],
            parch: passenger[5],
            fare: passenger[6],
            class: passenger[7],
            deck: passenger[8],
            embark_town: passenger[9],
            alone: passenger[10],
            confidence: passenger[11],
            predicted: passenger[12],
            is_prediction_correct: passenger[13]
        }
        instances_objects.push(passenger_object);
    }
    // delete existing instances table
    if (document.getElementById('instances_table')) {
        document.getElementById('instances_table').remove();
    }
    // re-render it
    create_instances_table(instances_objects);
    
    // change the points that are the highlight color (#EC6142)
    // back to the normal color
    var circles = document.getElementsByTagName('circle');
    for (circle of circles) {
        if (circle.style.fill == 'rgb(236, 97, 66)') {
            circle.style.fill = 'rgb(105, 179, 162)';
        }
    }
    // then change the color of the selected (returned) points
    for (passenger of instances_objects) {
        var select_statement = "circle:nth-child(" + String(passenger.id) + ")";
        d3.select(select_statement).style("fill", "rgb(236, 97, 66)");
    }
}
/**************************************************************************/

/******************* Create the nodes table upon start up *****************/
function onNodeClicked(event) {
    fetch('/filter_view', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        rerender_instances_plot(response);
    })
    .catch(function(error) {
        console.log('filter_view ran into an error:', error);
    })
}

function create_nodes_table(data) {
    // console.log("made it into the create nodes table with data:", data);

    node_columns = ["conditions", "number of samples", "number of correct samples", "ratio of correct samples"];

    // insert an html table to display the nodes of the decision tree
    var nodes_table = d3.select("#left").append("table")
                        .attr("class", "table table-sm table-hover")
                        .attr("id", "nodes-table");
    var nodes_head = nodes_table.append("thead");
    var nodes_body = nodes_table.append("tbody");
    
    nodes_head.selectAll("th").data(node_columns).enter().append("th").text(function(d) { return d; });
    
    // I want to create nodes.length number of rows
    // then for every row (tr), I want to insert four data (td) for nodes[i].condition, nodes[i].num_samples, etc
    nodes_body.selectAll("tr").data(data).enter().append("tr").on("click", onNodeClicked)
        .selectAll("td").data(function(node) {
            return [node.conditions, node.num_samples, node.num_correct, node.ratio_correct]; 
        }).enter().append("td").text(function(d) { return d; });
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


/**************************************************************************/

/*************** Create the instances table upon start up *****************/
function create_instances_table(data) {
    instances_columns = ['id', 'survived', 'sex', 'age', 'number of siblings, spouses', 
    'number of parents, children', 'fare', 'class', 'deck', 'port of embarkation', 
    'alone', 'confidence', 'predicted', 'is prediction correct'];

    var instances_table = d3.select("#bottom").append("table")
                            .attr("class", "table table-sm table-hover")
                            .attr("overflow-y", "scroll")
                            .attr("id", "instances_table");
    var instances_head = instances_table.append("thead");
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


/**************************************************************************/

/************** Create the tsne plot upon start up ************************/
function create_scatterplot(data) {
    if (data) {
        // create a basic scatterplot for the json data
        // source: https://www.d3-graph-gallery.com/graph/scatter_basic.html
        var vis_div = d3.select("#right").append("div").attr("id", "vis_div");

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
                    .attr("id", "circles_group")
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
        return;
    }
    else {
        console.log('tsne data not received');
    }
}).catch(function(error) {
    console.log("error:", error);
});
/**************************************************************************/


