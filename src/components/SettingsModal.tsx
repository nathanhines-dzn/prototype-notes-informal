import { FLOWS } from '../config/flows'
import { usePrototype } from '../context/PrototypeContext'

export function SettingsModal() {
  const { settingsOpen, setSettingsOpen, activeFlowId, setActiveFlow } = usePrototype()

  if (!settingsOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="settings-title" className="text-xl font-semibold text-teachstone-navy">
          Prototype Settings
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Switching flow will restart the prototype from the create observation screen.
        </p>

        <fieldset className="mt-6 space-y-3">
          <legend className="mb-2 text-sm font-medium text-teachstone-slate">Observation flow</legend>
          {FLOWS.map((flow) => (
            <label
              key={flow.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50"
            >
              <input
                type="radio"
                name="flow"
                value={flow.id}
                checked={activeFlowId === flow.id}
                onChange={() => {
                  setActiveFlow(flow.id)
                  setSettingsOpen(false)
                }}
                className="h-4 w-4 accent-teachstone-teal"
              />
              <span className="text-base text-teachstone-navy">{flow.label}</span>
            </label>
          ))}
        </fieldset>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setSettingsOpen(false)}
            className="rounded bg-teachstone-teal px-5 py-2 text-sm font-medium text-white hover:bg-[#016688]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
