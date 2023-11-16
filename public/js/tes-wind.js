const uvUrl = [
  'http://localhost/leaflet-be/tmp2/2023110800/2023110800/1000/u/u.tif',
  'http://localhost/leaflet-be/tmp2/2023110800/2023110800/1000/v/v.tif',
]

const promises = uvUrl.map((url) => fetch(url).then((r) => r.arrayBuffer()))
Promise.all(promises).then((arrays) => {
  let vf = L.VectorField.fromGeoTIFFs(arrays[0], arrays[1], 50)
  let layer = L.canvasLayer.vectorFieldAnim(vf).addTo(map)

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
