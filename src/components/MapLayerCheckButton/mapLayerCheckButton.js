'use client'

import { useState } from 'react'
import Image from 'next/image'

import checkIcon from '~/icons/check.svg'

export default function MapLayerCheckButton({ id, text }) {
  const [isActive, setIsActive] = useState(true)

  return (
    <>
      <button
        id={id}
        onClick={() => {
          setIsActive(!isActive)
        }}
        className={`flex overflow-hidden before:absolute before:w-6 before:h-8 before:bg-[rgba(0,0,0,0.3)] first:before:rounded-t-full last:before:rounded-b-full ${
          isActive && 'before:bg-blue-500'
        }`}
      >
        <div className="relative">
          <Image priority src={checkIcon} alt="" className="h-8 w-2 mx-2" />
        </div>
        <span
          className={`relative -left-2 pl-4 pr-2 text-white rounded-r-full my-auto ${
            isActive && 'bg-blue-500'
          }`}
        >
          {text}
        </span>
      </button>
    </>
  )
}
