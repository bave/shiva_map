window.onload = main;


/*
var zoom = 13;
global_lat = 35.59213346684348;
global_lng = 135.93555450439453;
*/

var zoom = 16;
var global_lat = 35.60228811992942;
var global_lng = 135.93928813934326;

var voList = {};
var Set = function() {}
Set.prototype.add = function(arg) { this[arg] = true; }
Set.prototype.remove = function(arg) { delete this[arg]; }

function getDistance(latlng1, latlng2) {
    return google.maps.geometry.spherical.computeDistanceBetween(latlng1, latlng2);
}

function main() {
    var latlng = new google.maps.LatLng(global_lat, global_lng);
    var opts = {
        zoom: zoom,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        //scrollwheel: false,
        //draggable: false,
        disableDoubleClickZoom: true,
    }

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
          "stylers": [ { "color": "#FF0000","visibility": "on" } ]
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
                       { "color": "#00FF00" }]
        },
    ];

    var styledMapOptions = { name: "default" };
    var map_style = new google.maps.StyledMapType(Styles, styledMapOptions);
    var map1 = new google.maps.Map(document.getElementById("map_canvas1"), opts);

    var handler1 = google.maps.event.addListener(map1, 'bounds_changed', function() {
        google.maps.event.removeListener(handler1);

        map1.mapTypes.set('default', map_style);
        map1.setMapTypeId('default');

        /*
        console.log("NorthEast");
        console.log("lat");
        console.log(map1.getBounds().getNorthEast().lat());
        console.log("lng");
        console.log(map1.getBounds().getNorthEast().lng());
        console.log("SouthWest");
        console.log("lat");
        console.log(map1.getBounds().getSouthWest().lat());
        console.log("lng");
        console.log(map1.getBounds().getSouthWest().lng());
        */

        var nw = new google.maps.LatLng(
            map1.getBounds().getNorthEast().lat(),
            map1.getBounds().getSouthWest().lng()
            );

        var ne = new google.maps.LatLng(
            map1.getBounds().getNorthEast().lat(),
            map1.getBounds().getNorthEast().lng()
            );

        var se = new google.maps.LatLng(
            map1.getBounds().getSouthWest().lat(),
            map1.getBounds().getNorthEast().lng()
            );

        var sw = new google.maps.LatLng(
            map1.getBounds().getSouthWest().lat(),
            map1.getBounds().getSouthWest().lng()
            );

        console.log("左上");
        console.log(nw.lat());
        console.log(nw.lng());
        console.log("右下");
        console.log(se.lat());
        console.log(se.lng());
        console.log("横の距離");
        console.log(getDistance(nw, ne));
        console.log("縦の距離");
        console.log(getDistance(nw, sw));
        console.log("横のピクセル数");
        console.log(document.getElementById("map_canvas1").offsetWidth);
        console.log("縦のピクセル数");
        console.log(document.getElementById("map_canvas1").offsetHeight);

    });

    var handler2 = google.maps.event.addListener(map1, 'click', function(hoge) {
        document.getElementById("lat_field").innerHTML = "lat: "+hoge.latLng.lat();
        document.getElementById("lng_field").innerHTML = "lng: "+hoge.latLng.lng();
    });
};

