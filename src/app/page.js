import Script from 'next/script'

export default function Home() {
  return (
    <>
      <div id="map" className="relative z-0"></div>
      <div className="absolute bottom-0 z-10 flex w-screen">
        <button id="btnPrev" className="bg-slate-400 p-4 rounded ml-1 flex-none">
          {'<'}
        </button>
        <button id="btnNext" className="bg-slate-400 p-4 rounded ml-1 flex-none">
          {'>'}
        </button>
        <input id="dateRange" type="range" className="grow mx-2" />
      </div>

      <Script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js" />
      <Script src="//d3js.org/d3.v4.min.js" />
      <Script src="/js/leaflet.canvaslayer.field.js" />
      <Script src="/js/map.js" />
    </>
  )
}
