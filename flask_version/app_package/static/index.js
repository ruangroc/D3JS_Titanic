/*************** Re-render the instances table and scatterplot ************/
function rerender_instances_plot(data) {
    console.log("rerendering function has this data:", data);

    // data = an array of arrays, each array representing a row
    // the original create instances table expects an array of objects
    // the original create scatterplot expects an object of objects
    // maybe remove the original items, massage the data into objects, then call the original functions?
    instances_data = []
    instances_objects = []
    tsne_data = []
    tsne_objects = {}

    console.log("data length:", data.length);
    for (var i = 0; i < data.length; i++) {
        instances_data.push(data[i].slice(0,14));
        tsne_data.push(data[i].slice(14,17));
    }

    for (passenger of instances_data) {
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

    for (point of tsne_data) {
        console.log("point of tsne_data:", point);
        tsne_objects[String(point[0])] = {
            'tsne1': point[1],
            'tsne2': point[2]
        }
    }
    console.log("tsne objects:", tsne_objects);
    // delete existing svg
    if (document.getElementById('vis_div')) {
        document.getElementById('vis_div').remove();
    }
    // re-render it
    create_scatterplot(tsne_objects);

}
/**************************************************************************/

/******************* Create the nodes table upon start up *****************/
function onNodeClicked(event) {
    console.log('onNodeClicked event:', event);
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
        // console.log('filter view response:', response);
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
    // console.log("made it into create instances table with data:", data);

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
    // console.log("made it into create scatterplot with data:", data);

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
        return;
    }
    else {
        console.log('tsne data not received');
    }
}).catch(function(error) {
    console.log("error:", error);
});


/**************************************************************************/



/**************************************************************************/
/**************************************************************************/

/**************************************************************************/
/**************************************************************************/

