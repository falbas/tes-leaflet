import Script from 'next/script'

export default function Home() {
  return (
    <>
      <div id="map"></div>

      <Script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js" />
      <Script src="//d3js.org/d3.v4.min.js" />
      <Script src="/js/leaflet.canvaslayer.field.js" />
      <Script src="/js/map.js" />
    </>
  )
}
