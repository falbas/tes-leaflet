import Image from 'next/image'

import chevronUpIcon from '~/icons/chevron-up.svg'

export default function MapTimeControl() {
  return (
    <>
      <div className="flex gap-2">
        <div>Initial Time</div>
        <div className="bg-slate-400 rounded px-2 flex gap-1 relative">
          <Image
            priority
            src={chevronUpIcon}
            alt=""
            className="h-4 w-4 my-auto"
          />
          <button id="initialTime">0000000000</button>
          <div className="absolute w-full left-0 bottom-full bg-slate-500 flex rounded justify-center">
            <div id="initialTimeList" className="py-1 flex flex-col">
              {/* <button className="px-2">2023110800</button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
