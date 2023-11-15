const mapBeUrl = 'http://localhost/leaflet-be'

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

mapControl.activeLayer = L.tileLayer(
  `${mapBeUrl}/${mapControl.initialTime}/${getDateStr(
    mapControl.predictionTime[mapControl.predictionTimeActive]
  )}/${mapControl.level}/${mapControl.variable}/tiles/{z}/{x}/{y}.png`,
  { tms: true }
).addTo(map)

async function setWindLayer() {
  const uvUrl = [
    `${mapBeUrl}/${mapControl.initialTime}/${getDateStr(
      mapControl.predictionTime[mapControl.predictionTimeActive]
    )}/${mapControl.level}/wind/U.asc`,
    `${mapBeUrl}/${mapControl.initialTime}/${getDateStr(
      mapControl.predictionTime[mapControl.predictionTimeActive]
    )}/${mapControl.level}/wind/V.asc`,
  ]
  mapControl.windLayer = await windAnimationLayerHandler(uvUrl)
  mapControl.windLayer.addTo(map)
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
  dateRangeText.innerText = getDateStr(
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

async function windAnimationLayerHandler(urls) {
  const promises = urls.map((url) => fetch(url).then((r) => r.text()))
  return Promise.all(promises).then(function (arrays) {
    const vf = L.VectorField.fromASCIIGrids(arrays[0], arrays[1], 50)
    const layer = L.canvasLayer.vectorFieldAnim(vf)
    return layer
  })
}

async function changeLayer() {
  const nextLayer = L.tileLayer(
    `${mapBeUrl}/${mapControl.initialTime}/${getDateStr(
      mapControl.predictionTime[mapControl.predictionTimeActive]
    )}/${mapControl.level}/${mapControl.variable}/tiles/{z}/{x}/{y}.png`,
    { tms: true }
  ).addTo(map)
  mapControl.activeLayer = nextLayer

  const uvUrl = [
    `${mapBeUrl}/${mapControl.initialTime}/${getDateStr(
      mapControl.predictionTime[mapControl.predictionTimeActive]
    )}/${mapControl.level}/wind/U.asc`,
    `${mapBeUrl}/${mapControl.initialTime}/${getDateStr(
      mapControl.predictionTime[mapControl.predictionTimeActive]
    )}/${mapControl.level}/wind/V.asc`,
  ]
  const nextWindLayer = await windAnimationLayerHandler(uvUrl)
  nextWindLayer.addTo(map)
  if (!mapControl.windLayer.isVisible()) {
    nextWindLayer.hide()
  }
  mapControl.windLayer.hide()
  mapControl.windLayer = nextWindLayer
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
  dateRangeText.innerText = getDateStr(
    mapControl.predictionTime[mapControl.predictionTimeActive]
  )
}
