
function plotElevation(latlng0, latlng1, sampling) {

  elevator = new google.maps.ElevationService();
  chart = new google.visualization.ColumnChart(document.getElementById('chart'));

  var path = [latlng0, latlng1];
  var pathRequest = { 'path': path, 'samples': sampling };

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
      chart.draw(data, { height: 200, legend: 'none', titleY: 'Elevation (m)'});
  });
}

//var whitney = new google.maps.LatLng(36.578581, -118.291994);
