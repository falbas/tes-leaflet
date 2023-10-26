const bounds = [
  [-11, 90],
  [11, 145],
]
const map_be_url = 'https://falbas.net/api/storage'

const map = L.map('map', {
  center: [-6.17396, 106.8271],
  zoom: 6,
  minZoom: 6,
  maxBounds: bounds,
  maxBoundsViscosity: 1.0,
})

map.fitBounds(bounds)

L.tileLayer(`${map_be_url}/20230901/tiles/temp/{z}/{x}/{y}.png`, {
  maxZoom: 10,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)

const url_json = '/countries.geo.json'
const json = fetch(url_json).then((r) => r.text())
Promise.resolve(json).then((v) => {
  const country = JSON.parse(v)
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

const url_u = `${map_be_url}/20230901/U.asc`
const url_v = `${map_be_url}/20230901/V.asc`
const urls = [url_u, url_v]
const promises = urls.map((url) => fetch(url).then((r) => r.text()))
Promise.all(promises).then(function (arrays) {
  const vf = L.VectorField.fromASCIIGrids(arrays[0], arrays[1], 50)
  const windLayer = L.canvasLayer.vectorFieldAnim(vf)

  L.control
    .layers(
      {},
      {
        Wind: windLayer,
      },
      {
        collapsed: false,
      }
    )
    .addTo(map)
})
