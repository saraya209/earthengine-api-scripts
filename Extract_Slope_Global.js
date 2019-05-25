/* 
Extract slope from SRTM 30m DEM for list soil organic matter 
sampling points globaly.
*/
// Load ISCN shapefile
var iscn = ee.FeatureCollection("users/<user_name>/<file>");

// Load the SRTM 30m DEM raster.
var srtm = ee.Image('USGS/SRTMGL1_003');

// Calculate slope (in degrees).
var slope = ee.Terrain.slope(srtm);
//var aspect = ee.Terrain.aspect(srtm);

// Display the result (OPTIONAL).
//Map.addLayer(srtm, {min: -30, max :6000}, 'DEM');
//Map.addLayer(slope, {min: 0, max :1}, 'slope'); // narrow view range for global view.
//Map.addLayer(aspect, {min: 0, max :365}, 'aspect');
//Map.addLayer(iscn, {},'ISCN');

// Add reducer output (first() of a cell) to the Features in the collection.
var slopeFirstFeatures = slope.reduceRegions({
  collection: iscn,
  reducer: ee.Reducer.first(),
  scale: 30,
});

// Export the FeatureCollection to a CSV file.
Export.table.toDrive({
  collection: slopeFirstFeatures,
  description:'iscn_pt_slopes',
  fileFormat: 'CSV'
});
