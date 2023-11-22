import { map } from './map2'

const mapBeUrl = process.env.NEXT_PUBLIC_TILES_URL

const dateRangeText = document.getElementById('dateRangeText')
const dateRangeInput = document.getElementById('dateRangeInput')
const btnPrev = document.getElementById('btnPrev')
const btnNext = document.getElementById('btnNext')
const variableLayerController = document
  .getElementById('variableLayerController')
  .getElementsByTagName('button')
const levelLayerController = document
  .getElementById('levelLayerController')
  .getElementsByTagName('button')
const windAnimationLayerControl = document.getElementById(
  'windAnimationLayerControl'
)
const initialTime = document.getElementById('initialTime')
const initialHour = document.getElementById('initialHour')
const initialTimeList = document
  .getElementById('initialTimeList')
  .getElementsByTagName('button')
const initialHourList = document
  .getElementById('initialHourList')
  .getElementsByTagName('button')

const mapControl = {
  variable: 'wspd',
  level: '1000',
  initialTime: initialTime.value + initialHour.value,
  predictionTimeActive: 0,
  predictionTime: [],
  min: 0,
  max: 24,
  step: 1,
  activeLayer: null,
  windLayer: null,
}

predTimeHandler()

for (let i = 0; i < variableLayerController.length; i++) {
  variableLayerController[i].addEventListener('click', () => {
    const activeVariable = variableLayerController[i].getAttribute('id')
    mapControl.variable = activeVariable
    changeLayer()
  })
}

for (let i = 0; i < levelLayerController.length; i++) {
  levelLayerController[i].addEventListener('click', () => {
    const activeLevel = levelLayerController[i].getAttribute('id')
    mapControl.level = activeLevel
    changeLayer()
  })
}

windAnimationLayerControl.addEventListener('click', () => {
  if (mapControl.windLayer.isVisible()) {
    mapControl.windLayer.hide()
  } else {
    mapControl.windLayer.show()
  }
})

// mapControl.activeLayer = window.L.tileLayer(
//   `${mapBeUrl}/${mapControl.initialTime}/${getDateStr(
//     mapControl.predictionTime[mapControl.predictionTimeActive]
//   )}/${mapControl.level}/${mapControl.variable}/{z}/{x}/{y}.png`,
//   { tms: true }
// ).addTo(map)

async function setVariableLayer() {
  const layer = await variableLayerHandler()
  if (layer !== null) {
    mapControl.activeLayer = layer
    mapControl.activeLayer.addTo(map)
  }
}
setVariableLayer()

async function setWindLayer() {
  const layer = await windAnimationLayerHandler()
  if (layer !== null) {
    mapControl.windLayer = layer
    mapControl.windLayer.addTo(map)
  }
}
setWindLayer()

for (let i = 0; i < initialTimeList.length; i++) {
  initialTimeList[i].addEventListener('click', () => {
    mapControl.initialTime = initialTimeList[i].value + initialHour.value
    predTimeHandler()
    changeLayer()
  })
}

for (let i = 0; i < initialHourList.length; i++) {
  initialHourList[i].addEventListener('click', () => {
    mapControl.initialTime = initialTime.value + initialHourList[i].value
    predTimeHandler()
    changeLayer()
  })
}

dateRangeInput.setAttribute('value', mapControl.predictionTimeActive.toString())
dateRangeInput.setAttribute('min', mapControl.min.toString())
dateRangeInput.setAttribute('max', mapControl.max.toString())
dateRangeInput.setAttribute('step', mapControl.step.toString())

let textPosition = 0
dateRangeInput.addEventListener('input', () => {
  mapControl.predictionTimeActive = parseInt(dateRangeInput.value)
  playerHandler(mapControl.predictionTimeActive)
})

btnNext.addEventListener('click', () => {
  if (mapControl.predictionTimeActive < mapControl.max) {
    playerHandler((mapControl.predictionTimeActive += 1))
  }
})

btnPrev.addEventListener('click', () => {
  if (mapControl.predictionTimeActive > mapControl.min) {
    playerHandler((mapControl.predictionTimeActive -= 1))
  }
})

function playerHandler(v) {
  dateRangeInput.value = v
  dateRangeText.innerText = getWibStr(
    mapControl.predictionTime[mapControl.predictionTimeActive]
  )
  textPosition = (v / 24) * 100
  if (textPosition < 50) {
    dateRangeText.style.left = textPosition + '%'
    dateRangeText.style.right = null
  } else {
    dateRangeText.style.right = 100 - textPosition + '%'
    dateRangeText.style.left = null
  }
  changeLayer()
}

function getDateStr(d) {
  return (
    String(d.getFullYear()) +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0') +
    String(d.getHours()).padStart(2, '0')
  )
}

function getWibStr(d) {
  const dd = new Date(d)
  dd.setHours(dd.getHours() + 7)
  const day = dd.getDate()
  // prettier-ignore
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const month = monthNames[dd.getMonth()]
  const hours = String(dd.getHours()).padStart(2, '0')
  const minutes = String(dd.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${hours}:${minutes}`
}

async function variableLayerHandler() {
  return fetch('/xlat.tif')
    .then((r) => r.arrayBuffer())
    .then(function (buffer) {
      const s = L.ScalarField.fromGeoTIFF(buffer)
      const latLngBounds = [
        [s.yllCorner, s.xllCorner],
        [s.yurCorner, s.xurCorner],
      ]
      const img = `${mapBeUrl}/${mapControl.initialTime}/${getDateStr(
        mapControl.predictionTime[mapControl.predictionTimeActive]
      )}/${mapControl.level}/${mapControl.variable}/${mapControl.variable}.jpg`
      // const img =
      //   'https://storage.googleapis.com/tiles-pi-project-392410/2023110800/2023110800/1000/tc/tc.jpg'
      try {
        return fetch(img).then((r) => {
          if (r.ok) {
            const layer = L.imageOverlay(img, latLngBounds, {
              pane: 'variable',
            })
            return layer
          } else {
            return null
          }
        })
      } catch (err) {}
    })
}

async function windAnimationLayerHandler() {
  const uvUrl = [
    `${mapBeUrl}/${mapControl.initialTime}/${getDateStr(
      mapControl.predictionTime[mapControl.predictionTimeActive]
    )}/${mapControl.level}/u/u.tif`,
    `${mapBeUrl}/${mapControl.initialTime}/${getDateStr(
      mapControl.predictionTime[mapControl.predictionTimeActive]
    )}/${mapControl.level}/v/v.tif`,
  ]

  const promises = uvUrl.map(async (url) => {
    try {
      return await fetch(url).then((r) => r.arrayBuffer())
    } catch (err) {}
  })
  return Promise.all(promises).then(function (arrays) {
    try {
      const vf = window.L.VectorField.fromGeoTIFFs(arrays[0], arrays[1], 50)
      const layer = window.L.canvasLayer.vectorFieldAnim(vf)
      return layer
    } catch (err) {
      return null
    }
  })
}

async function changeLayer() {
  // const nextLayer = window.L.tileLayer(
  //   `${mapBeUrl}/${mapControl.initialTime}/${getDateStr(
  //     mapControl.predictionTime[mapControl.predictionTimeActive]
  //   )}/${mapControl.level}/${mapControl.variable}/{z}/{x}/{y}.png`,
  //   { tms: true }
  // )
  // nextLayer.addTo(map)
  // mapControl.activeLayer = nextLayer

  const nextVariableLayer = await variableLayerHandler()
  if (nextVariableLayer !== null) {
    map.getPane('variable').style.display = 'block'
    nextVariableLayer.addTo(map)
    mapControl.activeLayer = nextVariableLayer
  } else {
    if (mapControl.activeLayer !== null) {
      map.getPane('variable').style.display = 'none'
    }
  }

  const nextWindLayer = await windAnimationLayerHandler()
  if (nextWindLayer !== null) {
    nextWindLayer.addTo(map)
    if (mapControl.windLayer !== null) {
      if (!mapControl.windLayer.isVisible()) {
        nextWindLayer.hide()
      }
      mapControl.windLayer.hide()
    }
    mapControl.windLayer = nextWindLayer
  } else {
    if (mapControl.windLayer !== null) {
      mapControl.windLayer.hide()
    }
    mapControl.windLayer = null
  }
}

function predTimeHandler() {
  mapControl.predictionTime = []
  for (let i = 0, j = 0; i < 25; i++, j += 3) {
    let ds = mapControl.initialTime
    ds = `${ds.substring(0, 4)}-${ds.substring(4, 6)}-${ds.substring(6, 8)}`
    let d = new Date(ds)
    d.setHours(mapControl.initialTime.substring(8, 10))
    d.setHours(d.getHours() + j)
    mapControl.predictionTime.push(d)
  }
  dateRangeText.innerText = getWibStr(
    mapControl.predictionTime[mapControl.predictionTimeActive]
  )
}

async function onClickLayerHandler(e) {
  const uvUrl = [
    `/xlat.tif`,
    `/xlong.tif`,
    `${mapBeUrl}/${mapControl.initialTime}/${getDateStr(
      mapControl.predictionTime[mapControl.predictionTimeActive]
    )}/${mapControl.level}/${mapControl.variable}/${mapControl.variable}.tif`,
  ]

  const promises = uvUrl.map(async (url) => {
    try {
      return await fetch(url).then((r) => r.arrayBuffer())
    } catch (err) {}
  })
  return Promise.all(promises).then(function (arrays) {
    const vf = window.L.VectorField.fromGeoTIFFs(arrays[0], arrays[1])
    const v = window.L.ScalarField.fromGeoTIFF(arrays[2])
    const latlon = vf.grid
    const vv = v.grid

    let nlat = 9999
    for (let i = 0; i < latlon.length; i++) {
      if (nlat >= Math.abs(latlon[i][0].u - e.latlng.lat)) {
        nlat = Math.abs(latlon[i][0].u - e.latlng.lat)
      } else {
        nlat = i
        break
      }
    }
    let nlon = 9999
    for (let i = 0; i < latlon[0].length; i++) {
      if (nlon >= Math.abs(latlon[0][i].v - e.latlng.lng)) {
        nlon = Math.abs(latlon[0][i].v - e.latlng.lng)
      } else {
        nlon = i
        break
      }
    }
    return vv[nlat][nlon]
  })
}

map.on('click', async (e) => {
  const v = await onClickLayerHandler(e)

  let unit
  switch (mapControl.variable) {
    case 'wspd':
      unit = 'm/s'
      break
    case 'tc':
      unit = 'c'
      break
    case 'rh':
      unit = '%'
      break
  }

  window.L.popup()
    .setLatLng(e.latlng)
    .setContent(`${Math.round(v)} ${unit}`)
    .openOn(map)
})
