window.onload = main;

// google chart
google.load('visualization', '1', {packages: ['columnchart']});

// ToDo
// リフレッシュの時の矢印の点滅をなくす
// memo
/*
ズームレベルと長さ・ピクセル変換表
Lv0 : 10000km = 10,000,000m,  81pix, 123,456.79012 m/pix, 0.00001 pix/m
Lv1 :  5000km =  5,000,000m,  81pix,  61,728.39506 m/pix, 0.00002 pix/m
Lv2 :  2000km =  2,000,000m,  66pix,  30,303.03030 m/pix, 0.00003 pix/m
Lv3 :  1000km =  1,000,000m,  66pix,  15,151.51515 m/pix, 0.00007 pix/m
Lv4 :   500km =    500,000m,  66pix,   7,575.75758 m/pix, 0.00013 pix/m
Lv5 :   200km =    200,000m,  53pix,   3,773.58491 m/pix, 0.00027 pix/m
Lv6 :   200km =    200,000m, 103pix,   1,941.74757 m/pix, 0.00052 pix/m
Lv7 :   100km =    100,000m, 103pix,     970.87379 m/pix, 0.00103 pix/m
Lv8 :    50km =     50,000m, 103pix,     485.43689 m/pix, 0.00206 pix/m
Lv9 :    20km =     20,000m,  84pix,     238.09524 m/pix, 0.00420 pix/m
Lv10:    10km =     10,000m,  84pix,     119.04762 m/pix, 0.00840 pix/m
Lv11:     5km =      5,000m,  84pix,      59.52381 m/pix, 0.01680 pix/m
Lv12:     2km =      2,000m,  67pix,      29.85075 m/pix, 0.02350 pix/m
Lv13:     1km =      1,000m,  67pix,      14.92537 m/pix, 0.06700 pix/m
Lv14:    500m =        500m,  67pix,       7.46269 m/pix, 0.13400 pix/m
Lv15:    200m =        200m,  54pix,       3.70370 m/pix, 0.27000 pix/m
Lv16:    200m =        200m, 106pix,       1.88679 m/pix, 0.53000 pix/m
Lv17:    100m =        100m, 106pix,       0.94340 m/pix, 1.06000 pix/m
Lv18:     50m =         50m, 106pix,       0.47170 m/pix, 2.12000 pix/m
Lv19:     20m =         20m,  85pix,       0.23529 m/pix, 4.20000 pix/m
*/

// 地図のズーム
if (zoom == undefined) {
    var zoom = 12;
}

if (elevation_marker == undefined) {
    var elevation_marker= false;
}

// 地図ののセンター
if (global_lat == undefined) {
    var global_lat = 35.553457224935244;
}

if (global_lng == undefined) {
    var global_lng = 135.9086036682129;
}

// タイムラインのインターバル
var interval = 1000;

// arcの設定
var chordal = 5;
var semi_chordal = 4;

// arrwo_eraceより小さな２点間距離の場合矢印は表示されない xxx A
var arrow_erace = 10;
// 1m         : 100
// 10m        : 10
// 100m       : 1
// 利用しない : 0

var timerID;

var voList = {};
var iconList = [
    new google.maps.MarkerImage(//0
            "icon/alpha.png",
            new google.maps.Size(1, 1),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 0),
            new google.maps.Size(1, 1)),
    new google.maps.MarkerImage(//1
            "icon/router_blue.png",
            new google.maps.Size(119, 84),
            new google.maps.Point(0, 0),
            new google.maps.Point(31, 20),
            new google.maps.Size(62, 40)),
    new google.maps.MarkerImage(//2
            "icon/router_red.png",
            new google.maps.Size(119, 84),
            new google.maps.Point(0, 0),
            new google.maps.Point(31, 20),
            new google.maps.Size(62, 40)),
    new google.maps.MarkerImage(//3
            "icon/router_gray.png",
            new google.maps.Size(119, 84),
            new google.maps.Point(0, 0),
            new google.maps.Point(31, 20),
            new google.maps.Size(62, 40)),
    new google.maps.MarkerImage(//4
            "icon/mesh_tower.png",
            new google.maps.Size(89, 128),
            new google.maps.Point(0, 0),
            new google.maps.Point(35, 80),
            new google.maps.Size(64, 92)),
    new google.maps.MarkerImage(//5
            "icon/wifi_point.png",
            new google.maps.Size(64, 69),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 27),
            new google.maps.Size(32, 35)),
    new google.maps.MarkerImage(//6
            "icon/wifi_mesh.png",
            new google.maps.Size(128, 77),
            new google.maps.Point(0, 0),
            new google.maps.Point(32, 19),
            new google.maps.Size(64, 38)),
    new google.maps.MarkerImage(//7
            "icon/fire.png",
            new google.maps.Size(62, 47),
            new google.maps.Point(0, 0),
            new google.maps.Point(31, 24),
            new google.maps.Size(62, 47)),
    new google.maps.MarkerImage(//8
            "icon/call_icon_1.gif",
            new google.maps.Size(64, 64),
            new google.maps.Point(0, 0),
            new google.maps.Point(63, 17),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//9
            "icon/call_icon_2.gif",
            new google.maps.Size(64, 64),
            new google.maps.Point(0, 0),
            new google.maps.Point(63, 17),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//10
            "icon/call_icon_3.gif",
            new google.maps.Size(64, 64),
            new google.maps.Point(0, 0),
            new google.maps.Point(63, 17),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//11
            "icon/call_icon_4.gif",
            new google.maps.Size(64, 64),
            new google.maps.Point(0, 0),
            new google.maps.Point(63, 17),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//12
            "icon/call_icon_5.gif",
            new google.maps.Size(64, 64),
            new google.maps.Point(0, 0),
            new google.maps.Point(63, 17),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//13
            "icon/house_icon.png",
            new google.maps.Size(58, 64),
            new google.maps.Point(0, 0),
            new google.maps.Point(15, 16),
            new google.maps.Size(29, 32)),
    new google.maps.MarkerImage(//14
            "icon/wifi_access2.png",
            new google.maps.Size(128, 77),
            new google.maps.Point(0, 0),
            new google.maps.Point(32, 19),
            new google.maps.Size(64, 38)),
    new google.maps.MarkerImage(//15
            "icon/car_cloud.png",
            new google.maps.Size(609, 375),
            new google.maps.Point(0, 0),
            new google.maps.Point(50, 35),
            new google.maps.Size(120, 80)),
    new google.maps.MarkerImage(//16
            "icon/car-0.png",
            new google.maps.Size(64, 64),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//17
            "icon/car-1.png",
            new google.maps.Size(64, 64),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//18
            "icon/car-2.png",
            new google.maps.Size(64, 64),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//19
            "icon/car-3.png",
            new google.maps.Size(64, 64),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//20
            "icon/111.png",
            new google.maps.Size(75, 78),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//21
            "icon/211.png",
            new google.maps.Size(75, 78),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//22
            "icon/221.png",
            new google.maps.Size(75, 78),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//23
            "icon/221.png",
            new google.maps.Size(75, 78),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//24
            "icon/222.png",
            new google.maps.Size(75, 78),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//25
            "icon/311.png",
            new google.maps.Size(75, 78),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//26
            "icon/321.png",
            new google.maps.Size(75, 78),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//27
            "icon/322.png",
            new google.maps.Size(75, 78),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//28
            "icon/331.png",
            new google.maps.Size(75, 78),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//29
            "icon/332.png",
            new google.maps.Size(75, 78),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
    new google.maps.MarkerImage(//30
            "icon/333.png",
            new google.maps.Size(75, 78),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 16),
            new google.maps.Size(32, 32)),
];

var Set = function() {}
Set.prototype.add = function(arg) { this[arg] = true; }
Set.prototype.remove = function(arg) { delete this[arg]; }

function main() {
    var latlng = new google.maps.LatLng(global_lat, global_lng);
    var opts = {
        zoom: zoom,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        scrollwheel: false,
        //draggable: false,
        disableDoubleClickZoom: true,
    }
    /*
    http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
    */

    var Styles = [
        { "featureType": "administrative",
          "stylers": [ { "visibility": "off" } ]
        },
        { "featureType": "poi",
          "stylers": [ { "visibility": "off" } ]
        },
        { "featureType": "road",
          "elementType": "labels" ,
          "stylers": [ { "visibility": "off" } ]
        },
        { "featureType": "road",
          "elementType": "geometry" ,
          "stylers": [ { "color": "#662222","visibility": "on" } ]
        },
        { "featureType": "transit",
          "stylers": [ { "visibility": "off" } ]
        },
        { "featureType": "landscape",
          "elementType": "labels",
          "stylers": [ { "visibility": "off" } ]
        },
        { "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [ { "visibility": "on" }, { "color": "#000000" } ]
        },
        { "featureType": "water",
          "stylers": [ {"visibility": "on"},
                       { "color": "#3333AA" }]
        },
    ];

    var styledMapOptions = { name: "default" };
    var map_style = new google.maps.StyledMapType(Styles, styledMapOptions);
    var map1 = new google.maps.Map(document.getElementById("map_canvas1"), opts);

    var handler1 = google.maps.event.addListener(map1, 'bounds_changed', function() {
        google.maps.event.removeListener(handler1);
        map1.mapTypes.set('default', map_style);
        map1.setMapTypeId('default');
        overlay_mapping(map1);
    });
};

function CtoI(c) {
    var default_color = '#222'
    var color_code = isColorScheme(c);
    if (color_code == undefined) { 
        return default_color;
    } else {
        return color_code;
    }
};

function isColorScheme(c) {
    if (c != undefined) {
        if (c.length == 4) {
            if (!c[0] == '#') { return undefined; }
            if (!c[1].match(/[0-F,a-f]/)) { return undefied; }
            if (!c[2].match(/[0-F,a-f]/)) { return undefied; }
            if (!c[3].match(/[0-F,a-f]/)) { return undefied; }
            return '#'+c[1]+c[2]+c[3];
        } else if (c.length == 7) {
            if (!c[0] == '#') { return undefined; }
            if (!c[1].match(/[0-F,a-f]/)) { return undefied; }
            if (!c[2].match(/[0-F,a-f]/)) { return undefied; }
            if (!c[3].match(/[0-F,a-f]/)) { return undefied; }
            if (!c[4].match(/[0-F,a-f]/)) { return undefied; }
            if (!c[5].match(/[0-F,a-f]/)) { return undefied; }
            if (!c[6].match(/[0-F,a-f]/)) { return undefied; }
            return '#'+c[1]+c[3]+c[5];
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
};

function overlay_mapping(map) {

    if (("overlay_info" in global) == false) {
        console.log("undefined overlay_info");
        return;
    }

    if (overlay_info['time'] != undefined) {
        var tick_time = overlay_info['time'];
        delete overlay_info['time'];
        var tick_field = document.getElementById("tick_time");
        if (tick_field != undefined) {
            tick_field.innerHTML = "Time: " + tick_time;
        }
    }

    if (overlay_info['information'] != undefined) {
        var info = overlay_info['information'];
        delete overlay_info['information'];
        var info_field = document.getElementById("information");
        if (info_field != undefined) {
            info_field.innerHTML = "Status: " + info;
        }
    }

    if (overlay_info['elevation'] != undefined) {
        var elevation = overlay_info['elevation'];
        delete overlay_info['elevation'];
        addFlood(map, getFloodIndex(parseInt(elevation)));
        var elevation_field = document.getElementById("elevation");
        if (elevation_field != undefined) {
            elevation_field.innerHTML = "Flood Level: " + elevation + " m";
        }
    } else {
        var elevation_field = document.getElementById("elevation");
        addFlood(map, getFloodIndex(0));
        if (elevation_field != undefined) {
            elevation_field.innerHTML = "Flood Level: " + "No Data"
        }
    }

    if (elevation_marker == true && document.getElementById('chart')) {
        var p_red = new google.maps.MarkerImage(
            'icon/red-pushpin.png'
            );
        var p_blue = new google.maps.MarkerImage(
            'icon/blue-pushpin.png'
            );
        var marker0 = new google.maps.Marker({ 
            position: new google.maps.LatLng(global_lat, global_lng),
            map: map, 
            title: "marker0", 
            draggable: true, 
            flat: false,
            icon: p_red
            }); 
        var marker1 = new google.maps.Marker({ 
            position: new google.maps.LatLng(global_lat, global_lng),
            map: map, 
            title: "marker1", 
            draggable: true,
            flat: false,
            icon: p_blue
            }); 
        var marker0_handler = google.maps.event.addListener(marker0, 'dragend', function() {
            var marker0_latlng = marker0.getPosition();
            //console.log(marker0_latlng.lat());
            //console.log(marker0_latlng.lng());
            var lng0 = marker0.getPosition().lng();
            var lng1 = marker1.getPosition().lng();
            var lat0 = marker0.getPosition().lat();
            var lat1 = marker1.getPosition().lat();
            if (lng0 <= lng1){ 
                plotElevation(marker0.getPosition(), marker1.getPosition(), 100);
            } else {
                plotElevation(marker1.getPosition(), marker0.getPosition(), 100);
            }
        });
        var marker1_handler = google.maps.event.addListener(marker1, 'dragend', function() {
            var marker1_latlng = marker1.getPosition();
            //console.log(marker1_latlng.lat());
            //console.log(marker1_latlng.lng());
            var lng0 = marker0.getPosition().lng();
            var lng1 = marker1.getPosition().lng();
            var lat0 = marker0.getPosition().lat();
            var lat1 = marker1.getPosition().lat();
            if (lng0 <= lng1) { 
                plotElevation(marker0.getPosition(), marker1.getPosition(), 100);
            } else {
                plotElevation(marker1.getPosition(), marker0.getPosition(), 100);
            }
        });
        plotElevation(marker0.getPosition(), marker1.getPosition(), 100);
    }

    for (var i in overlay_info) { voList[i] = new viewObject(map, i); }
    for (var i in overlay_info) {

        var comment = overlay_info[i][0];
        var lat     = overlay_info[i][1];
        var lng     = overlay_info[i][2];
        var links   = overlay_info[i][3];
        var radius  = overlay_info[i][4];
        var icon    = overlay_info[i][5];
        var color   = CtoI(overlay_info[i][6]).toString();
        var vis     = overlay_info[i][7];

        voList[i].setLat(lat);
        voList[i].setLng(lng);
        voList[i].setVis(vis);

        for (var j in links) {
            var line_width = links[j][0];
            var line_color = CtoI(links[j][1]).toString();
            var peer = overlay_info[j];
            if (peer != undefined) {
                var to_lat = peer[1];
                var to_lng = peer[2];
            } else {
                continue;
            }
            voList[i].addLink(j, to_lat, to_lng, line_width, line_color);
        }
        voList[i].addCircle(radius, color);
        voList[i].addIcon(icon, comment);
    }
    clearInterval(timerID);
    timerID = setInterval('doScenario()', interval);
};

function doScenario() {
    count = count + 1;
    //console.log("Scenario: "+count);

    var info_lists = time_line.shift();

    if (time_line.length == 0) {
        console.log('Scenario END!!!');
        clearInterval(timerID);
        return;
    }

    if (typeof info_lists == undefined) {
        console.log("undefined info_lists");
        clearInterval(timerID);
        return;
    }

    if (info_lists['time'] != undefined) {
        var tick_time = info_lists['time'];
        delete info_lists['time'];
        var tick_field = document.getElementById("tick_time");
        if (tick_field != undefined) {
            tick_field.innerHTML = "Time: " + tick_time;
        }
    }

    if (info_lists['information'] != undefined) {
        var info = info_lists['information'];
        delete info_lists['information'];
        var info_field = document.getElementById("information");
        if (info_field != undefined) {
            info_field.innerHTML = "Status: " + info;
        }
    }

    if (info_lists['elevation'] != undefined) {
        var elevation = info_lists['elevation'];
        delete info_lists['elevation'];
        var elevation_field = document.getElementById("elevation");
        if (elevation_field != undefined) {
            elevation_field.innerHTML = "Flood Level: " + elevation + " m";
            setFlood(getFloodIndex(parseInt(elevation)));
        }
    }

    for (var node in info_lists) {
        //console.log(node);
        if (voList[node] != undefined) {
            voList[node].changeVO(info_lists[node]);
        } else {
            console.log("(゜Д゜) " + node + " そんな子しらない...");
        }
    }

};

var count = 0;
var viewObject = Class.create();
viewObject.prototype = {
    initialize: function(map, key) {
        this.inComingLinks = new Set();
        this.map       = map;
        this.key       = key;
        this.vis       = undefined;
        this.objCircle = undefined;
        this.objLinks  = {};
        this.objIcon   = undefined;

        this.comment = undefined;
        this.lat     = undefined;
        this.lng     = undefined;
        this.links   = undefined;
        this.radius  = undefined;
        this.icon    = undefined;
        this.color   = undefined;
        this.vis     = undefined;

    },

    changeVO: function(info_list) {
        var change  = false;

        var comment = info_list[0];
        var lat     = info_list[1];
        var lng     = info_list[2];
        var links   = info_list[3];
        var radius  = info_list[4];
        var icon    = info_list[5];
        var color   = CtoI(info_list[6]).toString();
        var vis     = info_list[7];

        this.comment = comment;
        this.lat     = lat;
        this.lng     = lng;
        this.links   = links;
        this.radius  = radius;
        this.icon    = icon;
        this.color   = color;
        this.vis     = vis;

        this.setCircle(radius, color);

        for (var j in links) {
            var peer = j;
            var line_width = links[j][0];
            var line_color = CtoI(links[j][1]).toString();
            this.setLink(peer, line_width, line_color);
        }

        if (this.vis != 1) {
            for (var i in this.objLinks) {
                this.delLink(i);
            }
            this.removePeerLink();
        }

        this.changePeerLink();

        if (this.objIcon[0] == undefined) {
            this.addIcon(icon, comment);
        } else {
            this.setIcon(icon, comment);
        }
    },

    links_compare: function(a,b) {
        for (var i in a) {
            if (!b.hasOwnProperty(i)) return false;
            for (var j=0; j < a[i].length; j++) {
                if(a[i][0] != b[i][0]) return false;
                if(a[i][1] != b[i][1]) return false;
            }
            delete b[i];
        }
        for (var i in b) { return false; }
        return true;
    },


    setVis: function(vis) {
        this.vis = vis;
    },

    getVis: function() {
        return this.vis;
    },

    setIcon: function(icon, text) {
        if (icon <= 0) {
            return undefined;
        } else if (icon <= iconList.length && icon >= 1) {
            icon = parseInt(icon);
        } else {
            return undefined;
        }

        var visibility;
        if (this.vis == 0) {
            visibility = false;
        } else if (this.vis == '0') {
            visibility = false;
        } else if (this.vis == false) {
            visibility = false;
        } else if (this.vis == 'false') {
            visibility = false;
        } else if (this.vis == undefined) {
            visibility = false;
        } else {
            visibility = true;
        }
        var marker_opts = {
            position: new google.maps.LatLng(this.lat, this.lng),
            icon: iconList[icon],
            visible: visibility,
            zIndex: 10 
        }
        this.objIcon[0].setOptions(marker_opts);
        if (text != undefined) {
            this.objIcon[0].setClickable(true);
        } else {
            this.objIcon[0].setClickable(false);
        }
        var infowin = this.objIcon[1];
        if (infowin != undefined) {
            if (text != undefined) {
                this.objIcon[1].setContent(text);
                this.objIcon[1].setPosition(marker_opts["position"]);
            }
        }
    },

    addIcon: function(icon, text) {
        if (icon <= 0) {
            return undefined;
        } else if (icon <= iconList.length && icon >= 1) {
            icon = parseInt(icon);
        } else {
            return undefined;
        }

        var visibility;
        if (this.vis == 0) {
            visibility = false;
        } else if (this.vis == '0') {
            visibility = false;
        } else if (this.vis == false) {
            visibility = false;
        } else if (this.vis == 'false') {
            visibility = false;
        } else if (this.vis == undefined) {
            visibility = false;
        } else {
            visibility = true;
        }

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.lat, this.lng),
            icon: iconList[icon],
            visible: visibility,
            zIndex: 10 
        });

        if (text != undefined) {
            marker.setClickable(true);
        } else {
            marker.setClickable(false);
        }

        marker.setDraggable(false);
        marker.setMap(this.map);

        var infowin = undefined;
        if (text != undefined) {
            var infoWindowOpts = {
                position: new google.maps.LatLng(this.lat, this.lng),
                content: text
            }
            infowin = new google.maps.InfoWindow(infoWindowOpts);
            google.maps.event.addListener(marker, 'mouseover', function() {
                infowin.open(this.map);
                //console.log(infowin);
            });
            google.maps.event.addListener(marker, 'mouseout', function() {
                infowin.close(this.map);
                //console.log(infowin);
            });
            google.maps.event.addListener(marker, 'center_changed', function() {
                tmp_latlng=marker.getCenter();
                tmp_lat=tmp_latlng.lat();
                tmp_lng=tmp_latlng.lng();
                infowin.setPosition(tmp_latlng);
                infowin.setContent(text);
            });
        }
        this.objIcon = [marker, infowin];
    },

    changePeerLink: function() {
        for (var i in this.inComingLinks) {
            if (!this.inComingLinks.hasOwnProperty(i)) continue;
            voList[i].moveLink(this.key);
        }   
    },

    removePeerLink: function() {
        for (var i in this.inComingLinks) {
            if (!this.inComingLinks.hasOwnProperty(i)) continue;
            voList[i].delLink(this.key);
        }   
    },

    moveLink: function(peer) {
        var line  = this.objLinks[peer][0];
        var arrow = this.objLinks[peer][1];

        var from = new google.maps.LatLng(this.lat, this.lng);
        var to_lat = voList[peer].getLat();
        var to_lng = voList[peer].getLng();
        var to = new google.maps.LatLng(to_lat, to_lng);

        var angle = this.getAngle(from, to);
        var path = this.getArcPath(from, to, angle);

        var polyline_opts = {
            path: path,
            zIndex: 1 
        }
        line.setOptions(polyline_opts);
        this.moveArrow(peer, from, to)
    },


    setLink: function(peer, width, color) {
        if (width > 5) {
            width = 5;
        } else if (width <= 0) {
            this.delLink(peer);
            return;
        }

        if (voList[peer].getVis() == 0) {
            return undefined;
        }

        if (this.objLinks[peer] == undefined) {
            var to_lat = voList[peer].getLat();
            var to_lng = voList[peer].getLng();
            this.addLink(peer, to_lat, to_lng, width, color);
            return undefined;
        }


        var line  = this.objLinks[peer][0];
        var arrow = this.objLinks[peer][1];
        var old_w = this.objLinks[peer][2];
        var old_c = this.objLinks[peer][3];

        var from = new google.maps.LatLng(this.lat, this.lng);
        var to_lat = voList[peer].getLat();
        var to_lng = voList[peer].getLng();
        var to = new google.maps.LatLng(to_lat, to_lng);

        if (arrow != undefined) {
            arrow.setMap(null);
        }
        arrow = this.setArrow(from, to, color);

        var angle = this.getAngle(from, to);
        var path = this.getArcPath(from, to, angle);
        var polyline_opts = {
            path: path,
            strokeColor: color,
            strokeOpacity: 0.5,
            strokeWeight: width,
            clickable: false,
            editable: false,
            zIndex: 1 
        }
        line.setOptions(polyline_opts);

        this.objLinks[peer][1] = arrow;
        this.objLinks[peer][2] = width;
        this.objLinks[peer][3] = color;
    },

    addLink: function(name, to_lat, to_lng, width, color) {
        var from = new google.maps.LatLng(this.lat, this.lng);
        var to = new google.maps.LatLng(to_lat, to_lng);
        var angle = this.getAngle(from, to);
        var path = this.getArcPath(from, to, angle);
        var arrow = this.setArrow(from, to, color);

        var polyline_opts = {
            path: path,
            strokeColor: color,
            strokeOpacity: 0.5,
            strokeWeight: width,
            clickable: false,
            editable: false,
            zIndex: 1 
        }
        var line = new google.maps.Polyline(polyline_opts);
        line.setMap(this.map);
        this.objLinks[name] = [line, arrow, width, color];
        voList[name].addInCome(this.key);
    },

    delLink: function(name) {
        if (this.objLinks[name] == undefined) {
            return;
        }

        var line  = this.objLinks[name][0];
        var arrow = this.objLinks[name][1];
        var width = this.objLinks[name][2];
        var color = this.objLinks[name][3];
        if (arrow != undefined) {
            arrow.setMap(null);
        }
        if (line != undefined) {
            line.setMap(null);
        }
        this.objLinks[name][0] = null;
        this.objLinks[name][1] = null;
        this.objLinks[name][2] = null;
        this.objLinks[name][3] = null;
        delete this.objLinks[name];
        voList[name].removeInCome(this.key);
    },

    showICL: function() {
        console.log(this.inComingLinks);
    },

    addInCome: function(name) {
        this.inComingLinks.add(name);
    },

    removeInCome: function(name) {
        this.inComingLinks.remove(name);
    },

    setLat: function(lat) {
        this.lat = lat;
    },

    getLat: function() {
        return this.lat;
    },

    setLng: function(lng) {
        this.lng = lng;
    },

    getLng: function() {
        return this.lng;
    },

    getMiddlePoint: function(from, to) {
        var middle_lat = from.lat() + ((to.lat()-from.lat())/2);
        var middle_lng = from.lng() + ((to.lng()-from.lng())/2);
        var middle = new google.maps.LatLng(middle_lat, middle_lng);
        return middle;
    },

    getDistance: function(latlng1, latlng2) {
        return google.maps.geometry.spherical.computeDistanceBetween(latlng1, latlng2);
    },

    moveArrow: function(peer, from, to) {
        var arrow = this.objLinks[peer][1];
        var color = this.objLinks[peer][3];
        if (arrow != undefined) {
            arrow.setMap(null);
            this.objLinks[peer][1] = this.setArrow(from, to, color);
        }
    },

    setArrow: function(from, to, color) {
        var dist_unit = this.getDistance(from, to)/100;

        if (arrow_erace != 0) {
            if (dist_unit <= arrow_erace) {
                return undefined;
            }
        }

        var cap = dist_unit * chordal;
        var angle = this.getAngle(from, to);
        var middle = this.getMiddlePoint(from, to);
        var move_middle = this.getMovePoint(middle, cap, angle+90);
        var icon_scale = 16;
        var icon_point = icon_scale/2;

        while (angle >= 120) { angle -= 120; }
        color = color.replace(/#/g, "").toLowerCase();
        var icon = new google.maps.MarkerImage(
            "arrow/arrow_"+color+"_"+angle+".png",
            new google.maps.Size(24, 24),                   // size
            new google.maps.Point(0, 0),                    // origin
            new google.maps.Point(icon_point, icon_point),  // anchor
            new google.maps.Size(icon_scale, icon_scale)    // scale
        );
        var marker = new google.maps.Marker({
            position: move_middle,
            icon: icon,
            zIndex: 0
        });
        marker.setClickable(false);
        marker.setDraggable(false);
        marker.setMap(this.map);
        return marker;
    },

    getArcPath: function(from, to, angle) {
        var dist_unit = this.getDistance(from, to)/100;

        if (arrow_erace != 0) {
            if (dist_unit <= arrow_erace) {
                return [from, to];
            }
        }

        var cap = dist_unit * chordal;
        var semi_cap = dist_unit * semi_chordal;
        var middle = this.getMiddlePoint(from, to);
        var fm = this.getMiddlePoint(from, middle);
        var mt = this.getMiddlePoint(middle, to);
        var arc_middle = this.getMovePoint(middle, cap, angle+90);
        var arc_fm = this.getMovePoint(fm, semi_cap, angle+90);
        var arc_mt = this.getMovePoint(mt, semi_cap, angle+90);
        return [from, arc_fm, arc_middle, arc_mt, to];
    },

    getAngle: function(from, to) {
        var lat1 = (Math.PI/180)*from.lat();
        var lng1 = (Math.PI/180)*from.lng();
        var lat2 = (Math.PI/180)*to.lat();
        var lng2 = (Math.PI/180)*to.lng();

        var x = Math.sin(lng1-lng2) * Math.cos(lat2);
        var y = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lng1-lng2);
        var angle = -Math.atan2(x, y);
        if ( angle < 0.0 ) { angle  += Math.PI * 2.0; }
        angle = angle*(180.0/Math.PI);
        angle = Math.round(angle.toFixed(1)/3) * 3;
        return angle;
    },

    getMovePoint: function(latlng1, distance, degree) {
        /*
        ---- degree ----

               N:0
                |
        W:-90 --+-- E:90
                |
               S:180

        ----------------
        */
        while (degree >= 360) { degree -= 360; }
        var latlng = google.maps.geometry.spherical.computeOffset(latlng1, distance, degree);
        return latlng;
    },

    setCircle: function(radius, color) {
        var latlng = new google.maps.LatLng(this.lat, this.lng);
        var visibility;
        if (this.vis == 0) {
            visibility = false;
        } else if (this.vis == '0') {
            visibility = false;
        } else if (this.vis == false) {
            visibility = false;
        } else if (this.vis == 'false') {
            visibility = false;
        } else if (this.vis == undefined) {
            visibility = false;
        } else {
            visibility = true;
        }
        var circle_options = {
                map: this.map,
                strokeColor: color,       // ストロークの色
                strokeOpacity: 0.5,       // ストロークの透明度
                strokeWeight: 0,          // ストロークの幅
                fillColor: color,         // フィルの色
                fillOpacity: 0.35,        // フィルの透明度
                radius: radius,           // 円の大きさ
                center: latlng,
                clickable: false,
                editable: false,
                visible: visibility,
                zIndex: 2
        };
        var circle = this.objCircle;
        this.objCircle.setOptions(circle_options);

    },

    addCircle: function(radius, color) {
        var latlng = new google.maps.LatLng(this.lat, this.lng);
        var visibility;
        if (this.vis == 0) {
            visibility = false;
        } else if (this.vis == '0') {
            visibility = false;
        } else if (this.vis == false) {
            visibility = false;
        } else if (this.vis == 'false') {
            visibility = false;
        } else if (this.vis == undefined) {
            visibility = false;
        } else {
            visibility = true;
        }
        var circle_options = {
            map: this.map,
            strokeColor: color,       // ストロークの色
            strokeOpacity: 0.5,       // ストロークの透明度
            strokeWeight: 0,          // ストロークの幅
            fillColor: color,         // フィルの色
            fillOpacity: 0.35,        // フィルの透明度
            radius: radius,           // 円の大きさ
            center: latlng,
            clickable: false,
            editable: false,
            visible: visibility,
            zIndex: 2
        };
        var marker = new google.maps.Circle(circle_options);
        this.objCircle = marker;
    },
};

function debugCircle(map, lat, lng, radius, color) {
    var latlng = new google.maps.LatLng(lat, lng);
    var circle_options = {
        map: map,
        strokeColor: color,
        strokeOpacity: 0.5,
        strokeWeight: 0,
        fillColor: color,
        fillOpacity: 0.35,
        radius: radius,
        center: latlng,
        clickable: false,
        editable: false,
        visible: true,
        zIndex: 2
    };
    var marker = new google.maps.Circle(circle_options);
};

function plotElevation(latlng0, latlng1, sampling) {

    if (document.getElementById('chart')) {
        chart = new google.visualization.ColumnChart(document.getElementById('chart'));
    } else {
        return; 
    }
    elevator = new google.maps.ElevationService();

    var path = [latlng0, latlng1];
    var pathRequest = { 'path': path, 'samples': sampling };

    if (latlng0.lat() != latlng1.lat() && latlng0.lng() != latlng1.lng()) {
        elevator.getElevationAlongPath(pathRequest, function (ret, status) {
            if (status != google.maps.ElevationStatus.OK) { console.log('error'); return; }
            var elevations = ret;
            var elevationPath = [];
            for (var i = 0; i < ret.length; i++) {
                elevationPath.push(elevations[i].location);
            } 
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Sampling');
            data.addColumn('number', 'Elevation');
            for (var i = 0; i < ret.length; i++) {
                data.addRow(['', elevations[i].elevation]);
            }
            document.getElementById('chart').style.display = 'block';
            var h = document.getElementById("chart").clientHeight;
            chart.draw(data, { height: h, legend: 'none', titleY: 'Elevation (m)'});
        });
    } else {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Sampling');
        data.addColumn('number', 'Elevation');
        for (var i = 0; i < 1; i++) {
            data.addRow(['', 0]);
        }
        document.getElementById('chart').style.display = 'block';
        var h = document.getElementById("chart").clientHeight;
        chart.draw(data, { height: h, legend: 'none', titleY: 'Elevation (m)'});
    }
}

function getElevation(latlng) {
    var elevator = new google.maps.ElevationService();

    var positionalRequest = {
        'locations': latlng
    }

    elevator.getElevationForLocations(positionalRequest, _getElevation); 

    function _getElevation(results, status) {
        if (status == google.maps.ElevationStatus.OK) {
            if (results[0]) {
                //console.log(results[0].elevation);
                return undefined;
            } else {
                //console.log("cant get elevation data!!");
                return undefined;
            }
        } else {
            //console.log("bad status of getElecationForLocations");
            return undefined;
        }
    };
}


var global = ( function() { return this; } ).apply( null, [] );

function StartStop() {
    /*
    var stop  = '<input type="button" value="STOP"  onclick="StartStop()">';
    var start = '<input type="button" value="START" onclick="StartStop()">';
    */
    var form = document.getElementById("start_stop");
    if (form["0"].value == "START") {
        form["0"].value = "STOP";
        timerID = setInterval('doScenario()', interval);
    } else if (form["0"].value == "STOP") {
        form["0"].value = "START";
        clearInterval(timerID);
    }
}


/*
 * following code is 1 snap source for flood level visualization
 */

var flood_matte;
  var flood_lat13 = 35.709609132129956; //補正後 
//var flood_lat13 = 35.709409132129956; //補正前
  var flood_lng13 = 135.76320688934326; //補正後
//var flood_lng13 = 135.76350688934326; //補正前

var flood_lat16 = 35.61568610262084;
var flood_lng16 = 135.91731548309326;

function setFlood(index) {
    if (zoom == 13) {
        var marker_opts = {
            position: new google.maps.LatLng(flood_lat13, flood_lng13),
            icon: floodList13[index],
            visible: true,
            zIndex: 0
        };
        flood_matte.setOptions(marker_opts);
        return;
    } else if(zoom == 16) {
        var marker_opts = {
            position: new google.maps.LatLng(flood_lat16, flood_lng16),
            icon: floodList16[index],
            visible: true,
            zIndex: 0
        };
        flood_matte.setOptions(marker_opts);
        return;
    } else {
        return;
    }
};

function addFlood(map, index) {
    if (zoom == 13) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(flood_lat13, flood_lng13),
            icon: floodList13[index],
            visible: true,
            zIndex: 0 
        });
        marker.setClickable(false);
        marker.setDraggable(false);
        marker.setMap(map);
        flood_matte = marker;
        return;
    } else if (zoom == 16) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(flood_lat16, flood_lng16),
            icon: floodList16[index],
            visible: true,
            zIndex: 0 
        });
        marker.setClickable(false);
        marker.setDraggable(false);
        marker.setMap(map);
        flood_matte = marker;
        return;
    } else {
        return;
    }
};

function getFloodIndex(level) {
    return level;
};
