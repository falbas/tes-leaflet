'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

import chevronUpIcon from '~/icons/chevron-up.svg'

export default function MapTimeControl() {
  const [initialTime, setInitialTime] = useState([])
  const [initialTimeVisible, setInitialTimeVisible] = useState(false)
  const [initialTimeActive, setInitialTimeActive] = useState(9)
  const [initialHour, setInitialHour] = useState(['12', '00'])
  const [initialHourVisible, setInitialHourVisible] = useState(false)
  const [initialHourActive, setInitialHourActive] = useState(1)

  useEffect(() => {
    const it = []
    let date = new Date('2023-11-14')
    for (let i = 0; i < 10; i++) {
      it.unshift(date)
      let d = new Date(date)
      d.setDate(d.getDate() - 1)
      date = d
    }
    setInitialTime(it)
  }, [])

  const getDateStr = (d) => {
    if (d === undefined) return
    return (
      String(d.getFullYear()) +
      String(d.getMonth() + 1).padStart(2, '0') +
      String(d.getDate()).padStart(2, '0')
    )
  }

  return (
    <>
      <div className="flex gap-2">
        <div>Initial Time</div>
        <div className="bg-slate-400 rounded px-2 flex gap-1 relative">
          <button
            id="initialTime"
            value={getDateStr(initialTime[initialTimeActive])}
            onClick={() => {
              setInitialTimeVisible(!initialTimeVisible)
            }}
            className="flex"
          >
            <Image
              priority
              src={chevronUpIcon}
              alt=""
              className="h-4 w-4 my-auto"
            />
            {getDateStr(initialTime[initialTimeActive])}
          </button>
          <div className="absolute w-full left-0 bottom-full bg-slate-500 flex rounded justify-center">
            <div
              id="initialTimeList"
              className={`py-1 flex-col ${
                initialTimeVisible ? 'flex' : 'hidden'
              }`}
            >
              {initialTime.map((item, idx) => (
                <button
                  onClick={() => {
                    setInitialTimeActive(idx)
                    setInitialTimeVisible(false)
                  }}
                  value={getDateStr(item)}
                  key={idx}
                  className="px-2"
                >
                  {getDateStr(item)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-slate-400 rounded px-2 flex gap-1 relative">
          <button
            id="initialHour"
            value={initialHour[initialHourActive]}
            onClick={() => setInitialHourVisible(!initialHourVisible)}
            className="flex"
          >
            <Image
              priority
              src={chevronUpIcon}
              alt=""
              className="h-4 w-4 my-auto"
            />
            {initialHour[initialHourActive]}
          </button>
          <div className="absolute w-full left-0 bottom-full bg-slate-500 flex rounded justify-center">
            <div
              id="initialHourList"
              className={`py-1 flex-col ${
                initialHourVisible ? 'flex' : 'hidden'
              }`}
            >
              {initialHour.map((item, idx) => (
                <button
                  onClick={() => {
                    setInitialHourActive(idx)
                    setInitialHourVisible(false)
                  }}
                  value={item}
                  key={idx}
                  className="px-2"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
