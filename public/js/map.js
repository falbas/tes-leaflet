var map = L.map('map').setView([-6.17396, 106.8271], 10)
L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
}).addTo(map)

windLayer()

function windLayer() {
  var url_u = '/U.asc'
  var url_v = '/V.asc'
  var urls = [url_u, url_v]
  var promises = urls.map((url) => fetch(url).then((r) => r.text()))
  Promise.all(promises).then(function (arrays) {
    let vf = L.VectorField.fromASCIIGrids(arrays[0], arrays[1], 50)
    let layer = L.canvasLayer.vectorFieldAnim(vf).addTo(map)
    map.fitBounds(layer.getBounds())

    layer.on('click', function (e) {
      if (e.value !== null) {
        let vector = e.value
        let v = vector.magnitude().toFixed(2)
        let d = vector.directionTo().toFixed(0)
        let html = `${v} m/s to ${d}&deg`
        let popup = L.popup().setLatLng(e.latlng).setContent(html).openOn(map)
      }
    })
  })
}
