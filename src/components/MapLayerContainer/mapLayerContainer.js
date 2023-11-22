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
    setActiveChildren(Children.toArray(children)[0].props.id)
    Children.toArray(children).map((item) => {
      if (item.props.active) {
        setActiveChildren(item.props.id)
      }
    })
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
              isActive: activeChildren,
              activeHandler: executeFunction,
            })
          }
          return child
        })}
      </div>
    </>
  )
}
