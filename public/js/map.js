const bounds = [
  [-15, 90],
  [11, 145],
]

const map = L.map('map', {
  center: [-6.17396, 106.8271],
  zoom: 5,
  minZoom: 5.3,
  maxZoom: 10,
  maxBounds: bounds,
  maxBoundsViscosity: 1.0,
  zoomControl: false,
})
map.fitBounds(bounds)
map.createPane('country-line')
map.getPane('country-line').style.zIndex = 640
map.getPane('country-line').style.pointerEvents = 'none'
map.createPane('labels')
map.getPane('labels').style.zIndex = 650
map.getPane('labels').style.pointerEvents = 'none'

const bgLayer = L.tileLayer(
  'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
  {
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }
).addTo(map)

Promise.resolve(fetch('/indonesia-bg.geojson').then((r) => r.text())).then(
  (v) => {
    const country = JSON.parse(v)
    L.geoJson(country, {
      style: function () {
        return {
          color: 'black',
          weight: 1,
          fillOpacity: 0,
        }
      },
    }).addTo(map)
  }
)

const labelLayer = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
  { pane: 'labels' }
).addTo(map)
