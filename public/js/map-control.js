const mapBeUrl = 'http://localhost:3300/api'

// L.tileLayer(
//   `${mapBeUrl}/storage/2023110700/2023110700/1000/tc/tiles/{z}/{x}/{y}.png`,
//   { tms: true }
// ).addTo(map)

const dateRangeText = document.getElementById('dateRangeText')
const dateRangeInput = document.getElementById('dateRangeInput')
const btnPrev = document.getElementById('btnPrev')
const btnNext = document.getElementById('btnNext')
const initialTime = document.getElementById('initialTime')
const initialTimeList = document.getElementById('initialTimeList')

function getDateStr(d) {
  return (
    String(d.getFullYear()) +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0') +
    String(d.getHours()).padStart(2, '0')
  )
}

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

let initialTimeActive = 0
for (let i = 0; i <= dates.length - 1; i++) {
  if (i === dates.length - 1) {
    initialTime.innerText = getDateStr(dates[i][0])
    initialTimeActive = i
    initialTimeList.innerHTML += `<button onClick="timeControlHandler(${i})" style="padding-left:0.5rem;padding-right:0.5rem;border-radius:0.25rem;background-color:rgb(71 85 105)">${getDateStr(
      dates[i][0]
    )}</button>`
  } else {
    initialTimeList.innerHTML += `<button onClick="timeControlHandler(${i})" style="padding-left:0.5rem;padding-right:0.5rem;border-radius:0.25rem">${getDateStr(
      dates[i][0]
    )}</button>`
  }
}

const dateRange = {
  value: 0,
  min: 0,
  max: 24,
  step: 1,
}

let activeLayer = L.tileLayer(
  `${mapBeUrl}/storage/${getDateStr(dates[initialTimeActive][0])}/${getDateStr(
    dates[initialTimeActive][dateRange.value]
  )}/1000/tc/tiles/{z}/{x}/{y}.png`,
  { tms: true }
).addTo(map)

initialTimeList.style.display = 'none'
initialTime.addEventListener('click', () => {
  initialTimeList.style.display =
    initialTimeList.style.display === 'flex' ? 'none' : 'flex'
})

function timeControlHandler(i) {
  initialTimeList.style.display = 'none'
  initialTime.innerText = getDateStr(dates[i][0])
  initialTimeList.childNodes[initialTimeActive].style.backgroundColor = null
  initialTimeList.childNodes[i].style.backgroundColor = 'rgb(71 85 105)'
  initialTimeActive = i
  dateRangeText.innerText = getDateStr(
    dates[initialTimeActive][dateRange.value]
  )

  const nextLayer = L.tileLayer(
    `${mapBeUrl}/storage/${getDateStr(
      dates[initialTimeActive][0]
    )}/${getDateStr(
      dates[initialTimeActive][dateRange.value]
    )}/1000/tc/tiles/{z}/{x}/{y}.png`,
    { tms: true }
  ).addTo(map)
  activeLayer.remove()
  activeLayer = nextLayer
}

dateRangeInput.setAttribute('value', dateRange.value.toString())
dateRangeInput.setAttribute('min', dateRange.min.toString())
dateRangeInput.setAttribute('max', dateRange.max.toString())
dateRangeInput.setAttribute('step', dateRange.step.toString())

dateRangeText.innerText = getDateStr(dates[initialTimeActive][0])

let textPosition = 0
dateRangeInput.addEventListener('input', () => {
  dateRange.value = parseInt(dateRangeInput.value)
  playerHandler(dateRange.value)
})

btnNext.addEventListener('click', () => {
  if (dateRange.value < dateRange.max) {
    playerHandler((dateRange.value += 1))
  }
})

btnPrev.addEventListener('click', () => {
  if (dateRange.value > dateRange.min) {
    playerHandler((dateRange.value -= 1))
  }
})

function playerHandler(v) {
  dateRangeInput.value = v
  dateRangeText.innerText = getDateStr(dates[initialTimeActive][v])
  textPosition = (v / 24) * 100
  if (textPosition < 50) {
    dateRangeText.style.left = textPosition + '%'
    dateRangeText.style.right = null
  } else {
    dateRangeText.style.right = 100 - textPosition + '%'
    dateRangeText.style.left = null
  }

  const nextLayer = L.tileLayer(
    `${mapBeUrl}/storage/${getDateStr(
      dates[initialTimeActive][0]
    )}/${getDateStr(
      dates[initialTimeActive][dateRange.value]
    )}/1000/tc/tiles/{z}/{x}/{y}.png`,
    { tms: true }
  ).addTo(map)
  activeLayer.remove()
  activeLayer = nextLayer
}