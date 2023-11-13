const mapBeUrl = 'http://localhost/leaflet-be'

const dateRangeText = document.getElementById('dateRangeText')
const dateRangeInput = document.getElementById('dateRangeInput')
const btnPrev = document.getElementById('btnPrev')
const btnNext = document.getElementById('btnNext')
const initialTime = document.getElementById('initialTime')
const initialTimeList = document.getElementById('initialTimeList')
const variableLayerController = document
  .getElementById('variableLayerController')
  .getElementsByTagName('button')
const levelLayerController = document
  .getElementById('levelLayerController')
  .getElementsByTagName('button')
const windAnimationLayerControl = document.getElementById(
  'windAnimationLayerControl'
)

const mapControl = {
  variable: 'wspd',
  level: '1000',
  initialTime: 0,
  predictionTime: 0,
  min: 0,
  max: 24,
  step: 1,
  activeLayer: null,
  windLayer: null,
}

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

const prevDayCount = 10
const today = new Date('2023-11-08')
today.setHours(0)
// const today = new Date()
// today.setHours(12)
let d = new Date(today)
const dates = []
for (let i = 0; i <= prevDayCount - 1; i++) {
  let dt = []
  let dd = new Date(d)
  for (let j = 0; j < 25; j++) {
    dt.push(dd)
    dd = new Date(dd)
    dd.setHours(dd.getHours() + 3)
  }
  dates.push(dt)
  d = new Date(d)
  d.setHours(d.getHours() - 12)
}
dates.reverse()

for (let i = 0; i <= dates.length - 1; i++) {
  if (i === dates.length - 1) {
    initialTime.innerText = getDateStr(dates[i][0])
    mapControl.initialTime = i
    initialTimeList.innerHTML += `<button onClick="timeControlHandler(${i})" style="padding-left:0.5rem;padding-right:0.5rem;border-radius:0.25rem;background-color:rgb(71 85 105)">${getDateStr(
      dates[i][0]
    )}</button>`
  } else {
    initialTimeList.innerHTML += `<button onClick="timeControlHandler(${i})" style="padding-left:0.5rem;padding-right:0.5rem;border-radius:0.25rem">${getDateStr(
      dates[i][0]
    )}</button>`
  }
}

mapControl.activeLayer = L.tileLayer(
  `${mapBeUrl}/${getDateStr(dates[mapControl.initialTime][0])}/${getDateStr(
    dates[mapControl.initialTime][mapControl.predictionTime]
  )}/${mapControl.level}/${mapControl.variable}/tiles/{z}/{x}/{y}.png`,
  { tms: true }
).addTo(map)

async function setWindLayer() {
  const uvUrl = [
    `${mapBeUrl}/${getDateStr(dates[mapControl.initialTime][0])}/${getDateStr(
      dates[mapControl.initialTime][mapControl.predictionTime]
    )}/${mapControl.level}/wind/U.asc`,
    `${mapBeUrl}/${getDateStr(dates[mapControl.initialTime][0])}/${getDateStr(
      dates[mapControl.initialTime][mapControl.predictionTime]
    )}/${mapControl.level}/wind/V.asc`,
  ]
  mapControl.windLayer = await windAnimationLayerHandler(uvUrl)
  mapControl.windLayer.addTo(map)
}
setWindLayer()

initialTimeList.style.display = 'none'
initialTime.addEventListener('click', () => {
  initialTimeList.style.display =
    initialTimeList.style.display === 'flex' ? 'none' : 'flex'
})

function timeControlHandler(i) {
  initialTimeList.style.display = 'none'
  initialTime.innerText = getDateStr(dates[i][0])
  initialTimeList.childNodes[mapControl.initialTime].style.backgroundColor =
    null
  initialTimeList.childNodes[i].style.backgroundColor = 'rgb(71 85 105)'
  mapControl.initialTime = i
  dateRangeText.innerText = getDateStr(
    dates[mapControl.initialTime][mapControl.predictionTime]
  )

  changeLayer()
}

dateRangeInput.setAttribute('value', mapControl.predictionTime.toString())
dateRangeInput.setAttribute('min', mapControl.min.toString())
dateRangeInput.setAttribute('max', mapControl.max.toString())
dateRangeInput.setAttribute('step', mapControl.step.toString())

dateRangeText.innerText = getDateStr(dates[mapControl.initialTime][0])

let textPosition = 0
dateRangeInput.addEventListener('input', () => {
  mapControl.predictionTime = parseInt(dateRangeInput.value)
  playerHandler(mapControl.predictionTime)
})

btnNext.addEventListener('click', () => {
  if (mapControl.predictionTime < mapControl.max) {
    playerHandler((mapControl.predictionTime += 1))
  }
})

btnPrev.addEventListener('click', () => {
  if (mapControl.predictionTime > mapControl.min) {
    playerHandler((mapControl.predictionTime -= 1))
  }
})

function playerHandler(v) {
  dateRangeInput.value = v
  dateRangeText.innerText = getDateStr(dates[mapControl.initialTime][v])
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
    `${mapBeUrl}/${getDateStr(dates[mapControl.initialTime][0])}/${getDateStr(
      dates[mapControl.initialTime][mapControl.predictionTime]
    )}/${mapControl.level}/${mapControl.variable}/tiles/{z}/{x}/{y}.png`,
    { tms: true }
  ).addTo(map)
  mapControl.activeLayer.remove()
  mapControl.activeLayer = nextLayer

  const uvUrl = [
    `${mapBeUrl}/${getDateStr(dates[mapControl.initialTime][0])}/${getDateStr(
      dates[mapControl.initialTime][mapControl.predictionTime]
    )}/${mapControl.level}/wind/U.asc`,
    `${mapBeUrl}/${getDateStr(dates[mapControl.initialTime][0])}/${getDateStr(
      dates[mapControl.initialTime][mapControl.predictionTime]
    )}/${mapControl.level}/wind/V.asc`,
  ]
  const nextWindLayer = await windAnimationLayerHandler(uvUrl)
  nextWindLayer.addTo(map)
  if (!mapControl.windLayer.isVisible()) {
    nextWindLayer.hide()
  }
  mapControl.windLayer.hide()
  mapControl.windLayer = nextWindLayer
  console.log(mapControl.windLayer.isVisible())
}
