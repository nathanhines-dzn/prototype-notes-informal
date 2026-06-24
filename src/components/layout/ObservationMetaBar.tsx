import { usePrototype } from '../../context/PrototypeContext'

export function ObservationMetaBar() {
  const { observationMeta } = usePrototype()

  return (
    <div className="border-b border-gray-200 bg-[#f0fbff] px-20 py-4">
      <div className="grid max-w-5xl grid-cols-2 gap-x-8 gap-y-2 text-base text-teachstone-slate">
        <div>
          <span className="font-medium">Observation Date:</span> {observationMeta.date}
        </div>
        <div>
          <span className="font-medium">Center Name:</span> {observationMeta.center}
        </div>
        <div>
          <span className="font-medium">Observation Tool:</span> {observationMeta.tool}
        </div>
        <div>
          <span className="font-medium">Classroom:</span> {observationMeta.classroom}
        </div>
      </div>
    </div>
  )
}
