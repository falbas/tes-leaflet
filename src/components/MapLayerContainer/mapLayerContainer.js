'use client'

import {
  useState,
  useEffect,
  Children,
  isValidElement,
  cloneElement,
} from 'react'

export default function MapLayerContainer({ children, className, id }) {
  const [activeChildren, setActiveChildren] = useState(null)

  useEffect(() => {
    const firstChild = Children.toArray(children)
    setActiveChildren(firstChild[0].props.id)
  }, [])

  const executeFunction = (id) => {
    setActiveChildren(id)
  }

  return (
    <>
      <div id={id} className={`flex flex-col rounded text-xs ${className}`}>
        {Children.map(children, (child) => {
          if (isValidElement(child)) {
            return cloneElement(child, {
              active: activeChildren,
              activeHandler: executeFunction,
            })
          }
          return child
        })}
      </div>
    </>
  )
}
