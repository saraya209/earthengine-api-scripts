// Extract NDVI time series from LandSAT 7 32-day NDVI for 12 NevCAN environmental monitoring stations
// http://sensor.nevada.edu/NCCP/Climate%20Monitoring/Network.aspx

// Define colors for sites
var COLOR = {
  Shp1: 'ff0000',
  Shp2: '00ffff',
  Shp3: '000000',
  Shp4: '0000ff',
  Shp5: 'ff00ff',
  Snk1: '808080',
  Snk2: '008000',
  Snk3: '00ff00',
  Snk4: '800000',
  Snk5: 'ff0000',
  Snk6: '808000',
  Snk7: '800080'
};

// Define station as 100 meter radius circles.
var Shp1i = ee.Feature(ee.Geometry.Point(-115.3558504, 36.43534537).buffer(100), {label: 'Shp1'}); 
var Shp2i = ee.Feature(ee.Geometry.Point(-115.1632973, 36.51972383).buffer(100), {label: 'Shp2'});
var Shp3i = ee.Feature(ee.Geometry.Point(-115.2040597, 36.57280807).buffer(100), {label: 'Shp3'});
var Shp4i = ee.Feature(ee.Geometry.Point(-115.2141656, 36.59025474).buffer(100), {label: 'Shp4'});
var Shp5i = ee.Feature(ee.Geometry.Point(-115.200777, 36.657641).buffer(100), {label: 'Shp5'});
var Snk1i = ee.Feature(ee.Geometry.Point(-114.058754, 39.03773).buffer(100), {label: 'Snk1'});
var Snk2i = ee.Feature(ee.Geometry.Point(-114.4082747, 38.92535708).buffer(100), {label: 'Snk2'});
var Snk3i = ee.Feature(ee.Geometry.Point(-114.1764097, 39.0206006).buffer(100), {label: 'Snk3'});
var Snk4i = ee.Feature(ee.Geometry.Point(-114.350044, 38.892167).buffer(100), {label: 'Snk4'});
var Snk5i = ee.Feature(ee.Geometry.Point(-114.331384, 38.88983893).buffer(100), {label: 'Snk5'});
var Snk6i = ee.Feature(ee.Geometry.Point(-114.309617, 39.010032).buffer(100), {label: 'Snk6'});
var Snk7i = ee.Feature(ee.Geometry.Point(-114.3089116, 38.90611409).buffer(100), {label: 'Snk7'});

var Stations = new ee.FeatureCollection([Shp1i, Shp2i, Shp3i, Shp4i, 
Shp5i, Snk1i, Snk2i, Snk3i, Snk4i, Snk5i, Snk6i, Snk7i]);

// Make a collection of NDVI images for five water years (2014-2018)
var collectionNDVI = ee.ImageCollection('LANDSAT/LE7_L1T_32DAY_NDVI');
var StationsNDVI = collectionNDVI.filterBounds(Stations)
    .filterDate('2013-10-01', '2018-09-30');
    
// Calculate mean NDVI for station area, plot chart & download tabular data
// Landsat 30m pixel resolution and one "NDVI" band
var NDVITimeSeries = Chart.image.seriesByRegion(
  StationsNDVI, Stations,
    ee.Reducer.mean(), 
    'NDVI',
    30, 
    'system:time_start', 'label');

// Fix Some Chart varialbles
NDVITimeSeries = NDVITimeSeries.setChartType('ScatterChart');
NDVITimeSeries = NDVITimeSeries.setOptions({
  title: 'NDVI over time at the NevCAN stations',
  vAxis: {
    title: 'NDVI [-1,1]'
  },
  lineWidth: 1,
  pointSize: 4,
  series: {
    1: {color: COLOR.Shp1},
    2: {color: COLOR.Shp2},
    3: {color: COLOR.Shp3},
    4: {color: COLOR.Shp4},
    5: {color: COLOR.Shp5},
    6: {color: COLOR.Snk1},
    7: {color: COLOR.Snk2},
    8: {color: COLOR.Snk3},
    9: {color: COLOR.Snk4},
    10: {color: COLOR.Snk5},
    11: {color: COLOR.Snk6},
    12: {color: COLOR.Snk7}
  }
});

print(NDVITimeSeries);