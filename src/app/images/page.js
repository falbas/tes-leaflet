'use client'

import { useState } from 'react'
import Script from 'next/script'

import MapLayerButton from '@/components/MapLayerButton/mapLayerButton'
import MapLayerContainer from '@/components/MapLayerContainer/mapLayerContainer'
import MapLayerCheckButton from '@/components/MapLayerCheckButton/mapLayerCheckButton'
import MapLayerCheckContainer from '@/components/MapLayerCheckContainer/mapLayerCheckContainer'
import MapTimeControl from '@/components/MapTimeControl/mapTimeControl'
import MapPlayer from '@/components/MapPlayer/mapPlayer'
import MapColorbar from '@/components/MapColorbar/mapColorbar'

import windIcon from '~/icons/wind.svg'
import temperatureIcon from '~/icons/temperature.svg'
import humidityIcon from '~/icons/humidity.svg'
import dotIcon from '~/icons/dot.svg'

export default function Home() {
  const [colorbar, setColorbar] = useState('/wspd_color.txt')

  const colorbarHandler = (c) => {
    setColorbar(c)
  }

  return (
    <>
      <div id="map" className="relative z-0"></div>
      <div className="absolute top-40 left-4 text-white flex flex-col gap-2">
        <MapLayerContainer id="variableLayerController">
          <MapLayerButton
            id="wspd"
            icon={windIcon}
            text={'Wind'}
            onClick={() => {
              colorbarHandler('/wspd_color.txt')
            }}
          />
          <MapLayerButton
            id="tc"
            icon={temperatureIcon}
            text={'Temperature'}
            onClick={() => {
              colorbarHandler('/tc_color.txt')
            }}
          />
          <MapLayerButton
            id="rh"
            icon={humidityIcon}
            text={'Humidity'}
            onClick={() => {
              colorbarHandler('/rh_color.txt')
            }}
          />
        </MapLayerContainer>
        <MapLayerContainer id="levelLayerController">
          <MapLayerButton id="1000" icon={dotIcon} text={'1000'} />
          <MapLayerButton id="850" icon={dotIcon} text={'850'} />
          <MapLayerButton id="700" icon={dotIcon} text={'700'} />
        </MapLayerContainer>
        <MapLayerCheckContainer>
          <MapLayerCheckButton
            id="windAnimationLayerControl"
            text={'Wind Animation'}
          />
        </MapLayerCheckContainer>
      </div>

      <div className="absolute bottom-20 bg-[rgba(0,0,0,0.3)] px-4 py-2 text-white">
        <MapTimeControl />
      </div>

      <div
        id="mapPlayer"
        className="absolute flex w-screen bottom-0 bg-[rgba(0,0,0,0.3)] text-white p-4 gap-4"
      >
        <MapPlayer />
        <MapColorbar colorbar={colorbar} />
      </div>

      <Script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js" />
      <Script src="//d3js.org/d3.v4.min.js" />
      <Script src="//npmcdn.com/geotiff@0.3.6/dist/geotiff.js" />
      <Script src="/dist/main2.js" strategy="lazyOnload" />
    </>
  )
}
