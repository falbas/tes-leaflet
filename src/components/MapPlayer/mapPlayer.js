'use client'

import Image from 'next/image'

import leftArrowIcon from '~/icons/left-arrow.svg'
import rightArrowIcon from '~/icons/right-arrow.svg'

export default function MapPlayer() {
  return (
    <>
      <div className="flex w-full gap-2">
        <button id="btnPrev" className="bg-slate-400 rounded-full">
          <Image priority src={leftArrowIcon} alt="" className="h-8 w-8 m-2" />
        </button>
        <button id="btnNext" className="bg-slate-400 rounded-full">
          <Image priority src={rightArrowIcon} alt="" className="h-8 w-8 m-2" />
        </button>
        <div className="grow flex">
          <div className="my-auto flex flex-col w-full">
            <div className="w-full flex relative h-6">
              <div
                id="dateRangeText"
                className="flex-none absolute bg-slate-400 px-2 rounded cursor-pointer"
              >
                0
              </div>
            </div>
            <input
              id="dateRangeInput"
              type="range"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </>
  )
}
