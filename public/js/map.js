const bounds = [
  [-11, 90],
  [11, 145],
]
const map_be_url = 'https://falbas.net/api/storage'

const today = new Date('2023-09-01')
const date = []
for (let i = 0; i <= 2; i++) {
  const d = new Date(today)
  d.setDate(today.getDate() + i)
  date.push(
    String(d.getFullYear()) +
      String(d.getMonth() + 1).padStart(2, '0') +
      String(d.getDate()).padStart(2, '0')
  )
}

const baseLayers = date.map((d, i) => {
  windLayerHandler([`${map_be_url}/${d}/U.asc`, `${map_be_url}/${d}/V.asc`], i)

  return {
    baseLayer: L.tileLayer(`${map_be_url}/${d}/tiles/temp/{z}/{x}/{y}.png`),
    windLayer: null,
  }
})

const map = L.map('map', {
  center: [-6.17396, 106.8271],
  zoom: 6,
  minZoom: 6,
  maxZoom: 10,
  maxBounds: bounds,
  maxBoundsViscosity: 1.0,
  zoomControl: false,
})
map.fitBounds(bounds)

baseLayers[0].baseLayer.addTo(map)

let activeWindLayer = null
setTimeout(() => {
  activeWindLayer = baseLayers[0].windLayer.addTo(map)
}, 1000)

let activeBaseLayer = baseLayers[0].baseLayer
function layerHandler(l) {
  for (const layer of baseLayers) {
    if (layer === l) {
      activeBaseLayer.remove()
      layer.baseLayer.addTo(map)
      activeBaseLayer = layer.baseLayer

      activeWindLayer.remove()
      layer.windLayer.addTo(map)
      activeWindLayer = layer.windLayer
    }
  }
}

const inputDateRange = document.getElementById('dateRange')
const btnPrev = document.getElementById('btnPrev')
const btnNext = document.getElementById('btnNext')

const dateRange = {
  value: 0,
  min: 0,
  max: 2,
}

inputDateRange.setAttribute('value', dateRange.value.toString())
inputDateRange.setAttribute('min', dateRange.min.toString())
inputDateRange.setAttribute('max', dateRange.max.toString())

btnNext.addEventListener('click', () => {
  if (dateRange.value < dateRange.max) {
    dateRange.value += 1
    inputDateRange.value = dateRange.value.toString()
    layerHandler(baseLayers[dateRange.value])
  }
})

btnPrev.addEventListener('click', () => {
  if (dateRange.value > dateRange.min) {
    dateRange.value -= 1
    inputDateRange.value = dateRange.value.toString()
    layerHandler(baseLayers[dateRange.value])
  }
})

inputDateRange.addEventListener('input', () => {
  dateRange.value = parseInt(inputDateRange.value)
  layerHandler(baseLayers[parseInt(inputDateRange.value)])
})

const url_json = '/countries.geo.json'
const json = fetch(url_json).then((r) => r.text())
Promise.resolve(json).then((v) => {
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
})

function windLayerHandler(urls, i) {
  const promises = urls.map((url) => fetch(url).then((r) => r.text()))
  Promise.all(promises).then(function (arrays) {
    const vf = L.VectorField.fromASCIIGrids(arrays[0], arrays[1], 50)
    baseLayers[i].windLayer = L.canvasLayer.vectorFieldAnim(vf)
  })
}
