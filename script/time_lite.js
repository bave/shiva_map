#!/usr/bin/env node

var lat = 35.553457224935244;
var lng = 135.9086036682129;
var param = {};

function toRad(count) {
    return (count/360) * 2*Math.PI;
};

console.log("var overlay_info = { 'router1': [ 'router1', 35.523, 135.774, { 'router2':[2, '#A00'] }, 0, 1, '#000', 1, undefined ], 'router2': [ 'router2', 35.523, 135.784, { 'router1':[2, '#A00'] }, 0, 1, '#000', 1, undefined ] };");

console.log("var time_line = [");

for (var i=0; i<=3600; i=i+5) {
    param['time']      = i.toString();
    param['elevation'] = "hoge";
    param['stat']      = "hoge";
    /*
    param['r1_lat']    = 35.523
    param['r1_lng']    = 135.774;
    param['r2_lat']    = 36.523
    param['r2_lng']    = 136.774;
    */
    param['r1_lat']    = (Math.cos(toRad(i))*0.01)+lat;
    param['r1_lng']    = (Math.sin(toRad(i))*0.01)+lng;
    param['r2_lat']    = (Math.cos(toRad(i+180))*0.01)+lat;
    param['r2_lng']    = (Math.sin(toRad(i+180))*0.01)+lng;

    var time_lines = "{ 'time': '%(time)s', 'elevation': '%(elevation)s', 'information': '%(stat)s', 'router1': [ 'router1', %(r1_lat)s, %(r1_lng)s, { 'router2':[2, '#FFF'] }, 0, 1, '#000', 1, undefined ], 'router2': [ 'router2', %(r2_lat)s, %(r2_lng)s, { 'router1':[2, '#FFF'] }, 0, 1, '#000', 1, undefined ] },"
    console.log(require('sprintf').sprintf(time_lines, param));
}
console.log("];");
