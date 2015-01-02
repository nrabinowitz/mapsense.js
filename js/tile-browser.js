function topoToGeo(url, callback) {
  function convert(topology, object, layer, features) {
    if (false) {
      object.geometries.forEach(function(g) {
        convert(topology, g, layer, features);
      });
    }
    else {
      var feature = topojson.feature(topology, object);
      feature.properties = { layer: layer };
      if (object.properties) {
        Object.keys(object.properties).forEach(function(property) {
          feature.properties[property] = object.properties[property];
        });
      }
      features.push(feature);
    }
  }

  return po.queue.json(url, function(topology) {
    var features = [];
    for (var o in topology.objects) {
      convert(topology, topology.objects[o], o, features);
    }
    callback({
      type: 'FeatureCollection',
      features: features
    });
  });
}

var po = org.polymaps;

var mapDiv = d3.select('.mapDiv');

var requestParams = {
  invertTileY: true,
  invertY: false,
  zoom: 3,
  s: 5,
  ringSpan: 7,
  srid: 4326
};

var TILE_SIZE = 256;
var ZOOM_MIN = 1,
    ZOOM_MAX = 16;

var url = "http://staging-tiles.mapsense.co/tilist/tile/citrus/{Z}/{X}/{Y}.topojson?";
url += Object.keys(requestParams).map(function(k) {
  return k + '=' + requestParams[k];
}).join('&');

var map = po.map()
  .container(mapDiv.append('svg')
    .style('width', '100%')
    .node())
  .tileSize({ x: TILE_SIZE, y: TILE_SIZE })
  .add(po.drag())
  .add(po.wheel())
  .add(po.touch())
  .add(po.arrow())
  .center({lon: -122.397231960, lat: 37.788079})
  .zoomRange([16, 16])
  .zoom(16);

var gj = po.d3GeoJson(topoToGeo)
  .url(url)
  .attr('class', "onePath")
  .tile(true)
  .clip(true);

map.add(gj);

