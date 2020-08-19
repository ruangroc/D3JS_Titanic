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

column_names = ["conditions", "number of samples", "number of correct samples", "ratio of correct samples"];

// insert an html table to display the nodes of the decision tree
var table = d3.select("body").append("table");
var head = d3.select("table").append("thead").append("tr");
var body = d3.select("table").append("tbody");

head.selectAll("th").data(column_names).enter().append("th").text(function(d) { return d; });

// I want to create nodes.length number of rows
// then for every row (tr), I want to insert four data (td) for nodes[i].condition, nodes[i].num_samples, etc
body.selectAll("tr").data(nodes).enter().append("tr")
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

// insert another hmtl table to display all the instances in the Titanic csv