export default function MapLayerCheckContainer({ children, className, id }) {
  return (
    <>
      <div id={id} className={`flex flex-col rounded text-xs ${className}`}>
        {children}
      </div>
    </>
  )
}
