import Script from 'next/script'

export default function Home() {
  return (
    <>
      <div id="map"></div>

      <Script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js" />
      <Script src="/map.js" />
      {/* <script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js" defer></script>
      <script src="/map.js" defer></script> */}
    </>
  )
}
