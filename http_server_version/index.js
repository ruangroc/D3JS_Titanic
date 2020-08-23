var nodes = [
    {
        conditions: [" survived <= 0.5"],
        num_samples: 300,
        num_correct: 240,
        ratio_correct: 0.8
    },
    {
        conditions: [" survived <= 0.5", " sex <= 0.5"],
        num_samples: 182,
        num_correct: 161,
        ratio_correct: 0.88
    },
    {
        conditions: [" survived <= 0.5", " sex > 0.5", " deck <= 0.5"],
        num_samples: 162,
        num_correct: 159,
        ratio_correct: 0.98
    },
    {
        conditions: [" survived <= 0.5", " sex > 0.5", " deck > 0.5", " deck <= 3.5"],
        num_samples: 158,
        num_correct: 157,
        ratio_correct: 0.99
    },
    {
        conditions: [" survived <= 0.5", " sex > 0.5", " deck > 0.5", " deck <= 3.5", " deck <= 2.5"],
        num_samples: 17,
        num_correct: 16,
        ratio_correct: 0.94
    },
    {
        conditions: [" survived > 0.5", " sex <= 0.5"],
        num_samples: 118,
        num_correct: 79,
        ratio_correct: 0.67
    },
    {
        conditions: [" survived > 0.5", " sex <= 0.5", " age <= 58.5"],
        num_samples: 76,
        num_correct: 74,
        ratio_correct: 0.97
    },
    {
        conditions: [" survived > 0.5", " sex <= 0.5", " age <= 58.5", " class <= 1.5"],
        num_samples: 75,
        num_correct: 74,
        ratio_correct: 0.98
    },
    {
        conditions: [" survived > 0.5", " sex <= 0.5", " age <= 58.5", " class > 1.5", " age <= 33.5"],
        num_samples: 17,
        num_correct: 16,
        ratio_correct: 0.94
    },
    // Prof. Kahng says the blue nodes should still count only values[0] for correctness
    {
        conditions: [" survived > 0.5", " sex > 0.5", " parch <= 1.5"],
        num_samples: 42,
        num_correct: 5,
        ratio_correct: 0.12
    },
    {
        conditions: [" survived > 0.5", " sex > 0.5", " parch <= 1.5", " deck <= 5.0"],
        num_samples: 39,
        num_correct: 3,
        ratio_correct: 0.08
    },
    {
        conditions: [" survived > 0.5", " sex > 0.5", " parch <= 1.5", " deck <= 5.0", " fare <= 26.469"],
        num_samples: 19,
        num_correct: 3,
        ratio_correct: 0.16
    },
    {
        conditions: [" survived <= 0.5", " sex <= 0.5", " n_siblings_spouses <= 6.0"],
        num_samples: 20,
        num_correct: 2,
        ratio_correct: 0.1
    },
    {
        conditions: [" survived <= 0.5", " sex <= 0.5", " n_siblings_spouses <= 6.0", " n_siblings_spouses <= 2.0"],
        num_samples: 19,
        num_correct: 1, 
        ratio_correct: 0.05
    }
];

node_columns = ["conditions", "number of samples", "number of correct samples", "ratio of correct samples"];

// insert an html table to display the nodes of the decision tree
var nodes_table = d3.select("body").append("table");
var nodes_head = nodes_table.append("thead").append("tr");
var nodes_body = nodes_table.append("tbody");

nodes_head.selectAll("th").data(node_columns).enter().append("th").text(function(d) { return d; });

// I want to create nodes.length number of rows
// then for every row (tr), I want to insert four data (td) for nodes[i].condition, nodes[i].num_samples, etc
nodes_body.selectAll("tr").data(nodes).enter().append("tr")
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

var instances = []
d3.csv("titanic_test_results.csv", function(data) {
    instances.push(strings_to_nums(data));
}).then(function() { 
    // console.log(instances); 
    // console.log("instances[0]", instances[0]);
    // each instances[i] is a row

    // insert another hmtl table to display all the instances in the Titanic csv
    instances_columns = ['id', 'survived', 'sex', 'age', 'number of siblings and spouses', 
        'number of parents and children', 'fare', 'class', 'deck', 'port of embarkation', 
        'alone', 'confidence', 'predicted', 'is prediction correct'];

    var instances_table = d3.select("body").append("table");
    var instances_head = instances_table.append("thead").append("tr");
    var instances_body = instances_table.append("tbody");

    instances_head.selectAll("th").data(instances_columns)
    .enter().append("th").text(function(d) { return d; });
    
    instances_body.selectAll("tr").data(instances).enter().append("tr")
    .selectAll("td").data(function(d) {
        return [d.id, d.survived, d.sex, d.age, d.n_siblings_spouses, d.parch, 
                d.fare, d.class, d.deck, d.embark_town, d.alone, d.confidence, 
                d.predicted, d.is_prediction_correct]; 
    }).enter().append("td").text(function(d) { return d; })
});

function display_data(data) {
    if (data) {
        // d3.select("body").append("div").text(data);

        // create a basic scatterplot for the json data
        // source: https://www.d3-graph-gallery.com/graph/scatter_basic.html
        var vis_div = d3.select("body").append("div");

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

        json_data = JSON.parse(data);
        
        // I guess I could put all the objects into an array instead...
        var data_array = [];
        // for (item in json_data) {
        //     console.log(item);
        //     data_array.push(item);
        // }
        Object.values(json_data).forEach(val => data_array.push(val));
        
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

document.getElementById('fileInput')
    .addEventListener('change', function selectedFileChanged() {
        if (this.files.length === 0) {
            console.log('No file selected.');
            return;
        }
        console.log(this.files);
        const reader = new FileReader();
        reader.onload = function fileReadCompleted() {
            // when the reader is done, the content is in reader.result.
            console.log(reader.result);
            display_data(reader.result);
        };
        reader.readAsText(this.files[0]);
    });


