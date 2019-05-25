/* 
Export all NAIP images (from 2003 to date) over the longterm NRI Project field in Five Points, CA 
http://wsrec.ucanr.edu/
*/

// Create a geometry representing region of interest--The experimental plot.
var ctPlot = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-120.1213453709762, 36.34245366928299],
          [-120.1213453709762, 36.33896547906951],
          [-120.12022823107549, 36.33896547906951],
          [-120.12022823107549, 36.34245366928299]]]);

// Load NAIP image collection for region, different times.
var naip03_17 = ee.ImageCollection('USDA/NAIP/DOQQ')
  .filterBounds(ctPlot)
  .filterDate('2003-01-01', '2019-05-24');
  //.select(['R', 'G', 'B', 'N']);

// Use `ExportCol` function...
/* 
 * Author: Rodrigo E. Principe
 * License: Apache 2.0

PURPOSE:
This function Exports all images from one Collection
PARAMETERS:
col = collection that contains the images (ImageCollection) (not optional)
folder = the folder where images will go (str) (not optional)
scale = the pixel's scale (int) (optional) (defaults to 1000) (for Landsat use 30)
type = data type of the exported image (str) (option: "float", "byte", "int", "double") (optional) (defaults to "float")
nimg = number of images of the collection (can be greater than the actual number) (int) (optional) (defaults to 500)
maxPixels = max number of pixels to include in the image (int) (optional) (defults to 1e10)
region = the region where images are on (Geometry.LinearRing or Geometry.Polygon) (optional) (defaults to the image footprint)
Be careful with the region parameter. If the collection has images 
in different regions I suggest not to set that parameter
EXAMPLE:
ExportCol(myLandsatCol, "Landsat_imgs", 30)
*/

var ExportCol = function(col, folder, scale, region) {
    var type =  "float";
    var nimg =  500;
    scale = scale || 1;
    //maxPixels = maxPixels || 1e10;

    var colList = col.toList(nimg);
    var n = colList.size().getInfo();

    for (var i = 0; i < n; i++) {
      var img = ee.Image(colList.get(i));
      var id = img.id().getInfo();
      region = region || img.geometry().bounds().getInfo()["coordinates"];

      var imgtype = {"float":img.toFloat(), 
                     "byte":img.toByte(), 
                     "int":img.toInt(),
                     "double":img.toDouble()
                    }

      Export.image.toDrive({
        image: imgtype[type],
        description: id,
        folder: folder,
        fileNamePrefix: id,
        region: region,
        scale: scale})
    }
  };
  
ExportCol(naip03_17, "FivePoint_images", 1, ctPlot);
 
 
// **SINGLE EXPORT 
// Export the image to an Earth Engine asset.
//Export.image.toAsset({
//  image: naip03_17,
//  description: 'FivePoint_2003to2017',
//  assetId: 'CT03_17',
//  scale: 1,
//  region: ctPlot
//});

  
// Export the image to Drive.
//Export.image.toDrive({
//  image: naip2016_1,
//  description: 'imageToDriveExample',
//  scale: 1,
//  region: ctPlot
//});


// **DISPLAY ON MAP**
// Parameters to display
var trueParams = {bands: ['R','G','B']}
var falseParams = {bands: ['N','R','G']}

// Load selected image: 
var naip_1 = ee.Image(naip03_17.first());

// Display images
Map.centerObject(ctPlot, 16);
Map.addLayer(naip_1, trueParams, 'first image');

var mydate = ee.Date(naip_1.get('system:time_start'));
print('Timestamp: ', mydate); // ee.Date
