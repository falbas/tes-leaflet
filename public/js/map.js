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

L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 15,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
}).addTo(map)

// L.tileLayer('http://127.0.0.1:5500/basemap/{z}/{x}/{y}.png', {
//   maxZoom: 15,
//   attribution:
//     '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
// }).addTo(map)

// L.tileLayer
//   .wms('http://34.16.103.1/ncWMS2/wms', {
//     layers: 'Test/t2m',
//     styles: 'raster/seq-Oranges',
//     maxZoom: 19,
//     attribution:
//       '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
//   })
//   .addTo(map)

// var url_json =
//   'https://openlayers.org/en/v4.6.5/examples/data/geojson/countries.geojson'
// var json = fetch(url_json).then((r) => r.text())
// Promise.resolve(json).then((v) => {
//   var country = JSON.parse(v)
//   L.geoJson(country).addTo(map)
// })

var url_u = '/U.asc'
var url_v = '/V.asc'
var url_t = '/T.asc'
var urls = [url_u, url_v, url_t]
var promises = urls.map((url) => fetch(url).then((r) => r.text()))
Promise.all(promises).then(function (arrays) {
  //wind
  let vf = L.VectorField.fromASCIIGrids(arrays[0], arrays[1], 50)
  let windLayer = L.canvasLayer.vectorFieldAnim(vf)

  //temp
  var sf = L.ScalarField.fromASCIIGrid(arrays[2])
  let tempLayer = L.canvasLayer.scalarField(sf, {
    color: chroma.scale('OrRd').domain(sf.range),
  })

  L.control
    .layers(
      {},
      {
        Wind: windLayer,
        Temperature: tempLayer,
      }
    )
    .addTo(map)
})
