'use client'

import { useState, useEffect, useRef } from 'react'

export default function MapColorbar({ colorbar }) {
  const colorbarRef = useRef()

  const [colors, setColors] = useState([])

  useEffect(() => {
    const fetchColor = async () => {
      const response = await fetch(colorbar)
      const result = await response.text()
      const c = result.split(/\r?\n/).map((c) => {
        const cc = c.split(' ')
        return {
          value: cc[0],
          color: `rgb(${cc[1]},${cc[2]},${cc[3]})`,
        }
      })
      setColors(c)
      colorbarRef.current.innerHTML = ''
    }
    fetchColor()
  }, [colorbar])

  useEffect(() => {
    if (colorbarRef.current.children.length === 0) {
      colors.map((item, idx) => {
        // prettier-ignore
        colorbarRef.current.innerHTML += 
        `<div style="position:relative;display:flex;height:100%;width:100%;background-color:${item.color}">
          <span style="position:relative;margin-top:auto;margin-bottom:auto">${item.value}</span>
        </div>`
      })
    }
  }, [colors])

  return (
    <>
      <div className="m-auto w-[600px] my-auto">
        <div
          ref={colorbarRef}
          className="rounded-full h-6 flex overflow-hidden text-xs text-slate-950 font-bold"
        ></div>
      </div>
    </>
  )
}
