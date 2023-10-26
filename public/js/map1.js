var bounds = [
  [-11, 90],
  [11, 145],
]

var map = L.map('map', {
  center: [-6.17396, 106.8271],
  zoom: 6,
  minZoom: 6,
  maxBounds: bounds,
  maxBoundsViscosity: 1.0,
})

map.fitBounds(bounds)

// L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
//   maxZoom: 10,
//   attribution:
//     '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
// }).addTo(map)

L.tileLayer(
  'http://localhost:3300/api/storage/20230901/tiles/temp/{z}/{x}/{y}.png',
  {
    maxZoom: 10,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
).addTo(map)

// L.tileLayer
//   .wms('http://34.16.103.1/ncWMS2/wms', {
//     layers: 'TEST/t2m',
//     styles: 'raster/x-Rainbow',
//     maxZoom: 10,
//     attribution:
//       '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//   })
//   .addTo(map)

var url_json = '/countries.geo.json'
var json = fetch(url_json).then((r) => r.text())
Promise.resolve(json).then((v) => {
  var country = JSON.parse(v)
  L.geoJson(country, {
    style: function (feature) {
      return {
        color: 'black',
        weight: 1,
        fillOpacity: 0,
      }
    },
  }).addTo(map)
})

var url_u = 'http://localhost:3300/api/storage/20230901/U.asc'
var url_v = 'http://localhost:3300/api/storage/20230901/V.asc'
var urls = [url_u, url_v]
var promises = urls.map((url) => fetch(url).then((r) => r.text()))
Promise.all(promises).then(function (arrays) {
  let vf = L.VectorField.fromASCIIGrids(arrays[0], arrays[1], 50)
  let windLayer = L.canvasLayer.vectorFieldAnim(vf)

  L.control
    .layers(
      {},
      {
        Wind: windLayer,
      }
    )
    .addTo(map)
})
