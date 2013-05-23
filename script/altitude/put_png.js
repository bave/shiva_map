#!/usr/bin/env node
var fs = require('fs');
var image = require('image');
var sync = require('synchronize');

if (process.argv.length != 3) {
    console.log("need a 1 argument that is elevation level..");
    return;
}

/*
Lv0 : 10000km -> 81pix, 123,456.79012 m/pix, 0.00001 pix/m
Lv1 :  5000km -> 81pix,  61,728.39506 m/pix, 0.00002 pix/m
Lv2 :  2000km -> 66pix,  30,303.03030 m/pix, 0.00003 pix/m
Lv3 :  1000km -> 66pix,  15,151.51515 m/pix, 0.00007 pix/m
Lv4 :   500km -> 66pix,   7,575.75758 m/pix, 0.00013 pix/m
Lv5 :   200km -> 53pix,   3,773.58491 m/pix, 0.00027 pix/m
Lv6 :   200km ->103pix,   1,941.74757 m/pix, 0.00052 pix/m
Lv7 :   100km ->103pix,     970.87379 m/pix, 0.00103 pix/m
Lv8 :    50km ->103pix,     485.43689 m/pix, 0.00206 pix/m
Lv9 :    20km -> 84pix,     238.09524 m/pix, 0.00420 pix/m
Lv10:    10km -> 84pix,     119.04762 m/pix, 0.00840 pix/m
Lv11:     5km -> 84pix,      59.52381 m/pix, 0.01680 pix/m
Lv12:     2km -> 67pix,      29.85075 m/pix, 0.02350 pix/m
Lv13:     1km -> 67pix,      14.92537 m/pix, 0.06700 pix/m
Lv14:    500m -> 67pix,       7.46269 m/pix, 0.13400 pix/m
Lv15:    200m -> 54pix,       3.70370 m/pix, 0.27000 pix/m
Lv16:    200m ->106pix,       1.88679 m/pix, 0.53000 pix/m
Lv17:    100m ->106pix,       0.94340 m/pix, 1.06000 pix/m
Lv18:     50m ->106pix,       0.47170 m/pix, 2.12000 pix/m
Lv19:     20m -> 85pix,       0.23529 m/pix, 4.20000 pix/m
*/

function write_png(data, limit, filename) {

    var img_w = data[0].length;
    var img_h = data.length;
    var img_ch = 4;
    var img_size = img_w * img_h * img_ch;

    var img_buf = new Buffer(img_size);

    /*
    for (var i=0; i<img_size; i++) {
            img_buf[i] = 255;
    }
    */

    for (var h = 0; h < img_h; h++) {
        for (var w = 0; w < img_w; w++) {
            var c = 0;
            //console.log(w);
            var elevation = data[h][w];
            //console.log(elevation);
            while (c <= 3) {
                var i = (h * img_w + w) * 4 + c;
                if (i%4 == 0) {
                    //console.log("red");
                    img_buf[i] = 0;
                } else if (i%4 == 1) {
                    //console.log("green");
                    img_buf[i] = 0;
                } else if (i%4 == 2) {
                    //console.log("blue");
                    img_buf[i] = 255;
                } else if (i%4 == 3) {
                    //console.log("alpha");
                    if (elevation > limit) {
                        img_buf[i] = 255;
                    } else {
                        img_buf[i] = 128;
                    }
                } else {
                    console.log("hoge");
                }
                c++;
            }
        }
    }

    var png_img = new image('png', 'rgba').encodeSync(img_buf, img_w, img_h);

    fs.writeFileSync(filename , png_img.toString('binary'), 'binary');

    return;
}

function latlng2distance(lat0, lng0, lat1, lng1) {
    var r_earth = 6378.137;
    var lat_diff_rad = Math.PI/180*(lat0-lat1);
    var lng_diff_rad = Math.PI/180*(lng0-lng1);
    var North_South_distance = r_earth * lat_diff_rad;
    var East_West_distance = Math.cos( Math.PI / 180 * lat0) * r_earth * lng_diff_rad;
    return Math.sqrt(Math.pow(East_West_distance ,2) + Math.pow(North_South_distance, 2));
}

var sleep = function(ms){ sync.await(setTimeout(sync.defer(), ms)) }
var hoge = fs.readFileSync('zoom16.json').toString('utf8');
var hoge_json = JSON.parse(hoge);
//console.log(hoge_json.length);
//console.log(hoge_json[0].length);
//console.log(hoge_json[0].length*hoge_json.length*4);
write_png(hoge_json, process.argv[2],"elevation" + process.argv[2] + ".png");

/*
sync.fiber(function(){
    var range = [0, 1, 3, 5, 7];
    for (var i in range) {
        console.log(range[i]);
        write_png(hoge_json, range[i],"elevation" + range[i] + ".png");
        sleep(1000);
    }
});
*/

