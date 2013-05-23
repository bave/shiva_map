var fs = require('fs');

/*
fs.readFile('shiva_car.json', function (err, data) {
    if (err) throw err;
    var cars = JSON.parse(data.toString('utf-8'));
    console.log(cars);
});
*/

function createLink(links) {
    var strs = "";
    var str = "'NODEID':[2, '#A00'],";
    for (var i=0; i<links.length; i++) {
        strs = strs + str.replace("NODEID", links[i]);
    }
    return strs
};

function createNode(node) {
    var record = "'NODENAME' : [ 'COMMENT' , LAT, LNG, { LINK_KV }, 0, 1, '#FFF', 15, undefined ]";
    record = record.replace("NODENAME", node['id']);
    record = record.replace("COMMENT", node['id']);
    record = record.replace("LAT", node['lat']);
    record = record.replace("LNG", node['lng']);
    record = record.replace("LINK_KV", createLink(node['links']));
    return record
};


var data = fs.readFileSync('shiva_car.json');
var cars = JSON.parse(data.toString('utf-8'));

var nodes = {}
for (var i=0; i<cars.length; i++) {
    var node_id = cars[i][1];
    var lat = cars[i][2];
    var lng = cars[i][3];
    var node = {}
    node['id'] = node_id;
    node['lat'] = lat;
    node['lng'] = lng;
    node['links'] = [];
    nodes[node_id] = node;
};

for (var i=0; i<cars.length; i++) {
    var from_node_id = cars[i][1];
    var to_node_id = cars[i][5];
    nodes[from_node_id]['links'].push(to_node_id);
};

console.log("var hoge = [");
for (var i in nodes) {
    console.log(createNode(nodes[i])+',');
}
console.log("];");

//console.log(createLink(nodes[99]['links']));
//console.log(nodes);
//console.log(cars);
