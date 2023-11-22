'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function MapLayerButton({
  id,
  icon,
  text,
  isActive,
  activeHandler,
  onClick,
  active = false,
}) {
  const [isHover, setIsHover] = useState(false)

  const onClickHandler = () => {
    if (onClick) {
      onClick()
    }
    if (activeHandler) {
      activeHandler(id)
    }
  }

  return (
    <>
      <button
        id={id}
        onClick={onClickHandler}
        onMouseEnter={() => {
          setIsHover(true)
        }}
        onMouseLeave={() => {
          setIsHover(false)
        }}
        className={`flex overflow-hidden before:absolute before:w-6 before:h-8 before:bg-[rgba(0,0,0,0.3)] first:before:rounded-t-full last:before:rounded-b-full ${
          (isHover || isActive == id) && 'before:bg-blue-500'
        }`}
      >
        <div className="relative">
          <Image priority src={icon} alt="" className="h-8 w-2 mx-2" />
        </div>
        <span
          className={`relative -left-2 pl-4 pr-2 text-white rounded-r-full my-auto ${
            (isHover || isActive == id) && 'bg-blue-500'
          }`}
        >
          {text}
        </span>
      </button>
    </>
  )
}
