'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

import leftArrowIcon from '~/icons/left-arrow.svg'
import rightArrowIcon from '~/icons/right-arrow.svg'

export default function MapPlayer() {
  // const dateRangeText = useRef()
  // const dateRange = useRef()
  // const [rangeValue, setRangeValue] = useState(0)
  // const [pointerPos, setPointterPos] = useState(0)

  // useEffect(() => {
  //   if (pointerPos < 50) {
  //     dateRangeText.current.style.left = pointerPos + '%'
  //     dateRangeText.current.style.right = null
  //   } else {
  //     dateRangeText.current.style.right = 100 - pointerPos + '%'
  //     dateRangeText.current.style.left = null
  //   }
  // }, [pointerPos, rangeValue])

  // function rangeHandler(v) {
  //   setRangeValue(v)
  //   setPointterPos((v / 24) * 100)
  // }

  return (
    <>
      <div className="m-4 flex w-full gap-2">
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
            {/* <div className="w-full flex relative h-6">
              <div
                ref={dateRangeText}
                className="flex-none absolute bg-slate-400 px-2 rounded cursor-pointer"
              >
                <span>{Math.floor(rangeValue)}</span>
              </div>
            </div>
            <input
              ref={dateRange}
              id="dateRange"
              type="range"
              min="0"
              max="24"
              step="0.01"
              value={rangeValue}
              onChange={(e) => {
                rangeHandler(e.target.value)
              }}
              className="w-full"
            /> */}
          </div>
        </div>
      </div>
    </>
  )
}
