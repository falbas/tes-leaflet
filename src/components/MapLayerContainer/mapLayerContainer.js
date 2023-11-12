export default function MapLayerContainer({ children, className }) {
  return (
    <>
      <div
        className={`flex flex-col rounded text-xs ${className}`}
      >
        {children}
      </div>
    </>
  )
}
