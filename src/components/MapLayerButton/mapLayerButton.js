'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function MapLayerButton({ id, icon, text, active }) {
  const [isHover, setIsHover] = useState(false)

  return (
    <>
      <button
        id={id}
        onMouseEnter={() => {
          setIsHover(true)
        }}
        onMouseLeave={() => {
          setIsHover(false)
        }}
        className={`flex overflow-hidden before:absolute before:w-6 before:h-8 before:bg-[rgba(0,0,0,0.3)] first:before:rounded-t-full last:before:rounded-b-full ${
          (isHover || active) && 'before:bg-blue-500'
        }`}
      >
        <div className="relative">
          <Image priority src={icon} alt="" className="h-8 w-2 mx-2" />
        </div>
        <span
          className={`relative -left-2 pl-4 pr-2 text-white rounded-r-full my-auto ${
            (isHover || active) && 'bg-blue-500'
          }`}
        >
          {text}
        </span>
      </button>
    </>
  )
}