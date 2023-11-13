import Script from 'next/script'

import MapLayerButton from '@/components/MapLayerButton/mapLayerButton'
import MapLayerContainer from '@/components/MapLayerContainer/mapLayerContainer'
import MapTimeControl from '@/components/MapTimeControl/mapTimeControl'
import MapPlayer from '@/components/MapPlayer/mapPlayer'

import windIcon from '~/icons/wind.svg'
import temperatureIcon from '~/icons/temperature.svg'
import humidityIcon from '~/icons/humidity.svg'
import dotIcon from '~/icons/dot.svg'

export default function Home() {
  return (
    <>
      <div id="map" className="relative z-0"></div>
      <div className="absolute top-40 left-4 text-white flex flex-col gap-2">
        <MapLayerContainer id="variableLayerController">
          <MapLayerButton id="wspd" icon={windIcon} text={'Wind'} />
          <MapLayerButton id="tc" icon={temperatureIcon} text={'Temperature'} />
          <MapLayerButton id="rh" icon={humidityIcon} text={'Humidity'} />
        </MapLayerContainer>
        <MapLayerContainer id="levelLayerController">
          <MapLayerButton id="1000" icon={dotIcon} text={'Surface'} />
          <MapLayerButton id="850" icon={dotIcon} text={'850'} />
          <MapLayerButton id="700" icon={dotIcon} text={'700'} />
        </MapLayerContainer>
        <MapLayerContainer>
          <MapLayerButton
            id="windAnimationLayerControl"
            icon={dotIcon}
            text={'Wind Animation'}
            active
          />
        </MapLayerContainer>
      </div>

      <div className="absolute bottom-20 bg-[rgba(0,0,0,0.3)] px-4 py-2 text-white">
        <MapTimeControl />
      </div>

      <div
        id="mapPlayer"
        className="absolute flex w-screen bottom-0 bg-[rgba(0,0,0,0.3)] text-white"
      >
        <MapPlayer />
      </div>

      <Script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js" />
      <Script src="//d3js.org/d3.v4.min.js" />
      <Script src="/js/leaflet.canvaslayer.field.js" />
      <Script src="/js/map.js" />
      <Script src="/js/map-control.js" />
    </>
  )
}
