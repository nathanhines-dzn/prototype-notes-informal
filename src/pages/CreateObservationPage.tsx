import type { ReactNode } from 'react'
import { InformalObservationOptions } from '../components/InformalObservationOptions'
import { usePrototype } from '../context/PrototypeContext'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-base text-teachstone-slate">
        {label}
        {required ? '*' : ''}
      </label>
      {children}
    </div>
  )
}

function InputLike({ value, placeholder }: { value?: string; placeholder?: string }) {
  return (
    <div className="flex h-10 items-center justify-between rounded border border-gray-300 bg-white px-4 text-base text-gray-500">
      <span>{value ?? placeholder}</span>
      <span className="text-gray-400">▾</span>
    </div>
  )
}

export function CreateObservationPage() {
  const { activeFlow, goNext, includeAllDimensions, focusedDimensionIds } = usePrototype()
  const { createForm } = activeFlow
  const canCreate = includeAllDimensions || focusedDimensionIds.length > 0

  return (
    <div className="flex h-full w-full flex-col items-center justify-start px-20 py-[42px]">
      <h1 className="mb-4 w-full max-w-[900px] text-left text-2xl font-bold text-teachstone-slate">
        {createForm.title}
      </h1>

      <div className="mx-auto w-full max-w-5xl rounded-lg bg-white p-8 shadow-sm">
        <div
          role="note"
          aria-labelledby="prototype-notice-heading"
          className="mb-8 rounded border border-amber-200 bg-[#FFFBEB] border-l-4 border-l-amber-500 px-4 py-3 text-sm text-amber-900"
        >
          <p id="prototype-notice-heading" className="mb-1 font-semibold text-amber-950">
            Please Read
          </p>
          <p>
            This prototype mirrors our data collection workflow in myTeachstone, but it is
            currently a visual preview. The form inputs below and other buttons in this site are not
            functional.{' '}
            <span className="font-medium">Click Create Observation to start.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
          <Field label="Observation Date" required>
            <InputLike placeholder="Select a date" />
          </Field>
          <Field label="Number of Cycles" required>
            <InputLike value="3" />
          </Field>
          <Field label="Center" required>
            <InputLike placeholder="Search for an option" />
          </Field>
          <Field label="Classroom" required>
            <InputLike placeholder="Search for an option" />
          </Field>
          <Field label="Educator(s)" required>
            <InputLike placeholder="Separate names with commas" />
          </Field>
          <Field label="Observation Tool">
            <InputLike value="Pre-K–3rd" />
          </Field>
          <Field label="Language">
            <InputLike value="English" />
          </Field>
          <Field label="Grade / Age Level">
            <InputLike placeholder="Select an option" />
          </Field>
          <Field label="Job ID">
            <InputLike placeholder="Type the job identifier" />
          </Field>
          <Field label="Observation Time Zone">
            <InputLike value="(GTM-07:00) America / Los Angeles" />
          </Field>
        </div>

        {createForm.showEnvironmentCheckbox && (
          <label className="mt-8 flex items-center gap-3 text-sm text-teachstone-slate">
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-teachstone-teal" />
            Include CLASS Environment
          </label>
        )}

        {createForm.showDimensionFocusOptions && <InformalObservationOptions />}

        <div className="mt-10 flex justify-end gap-4">
          <button type="button" className="rounded px-6 py-2 text-sm text-teachstone-slate">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (canCreate) {
                goNext()
              }
            }}
            disabled={!canCreate}
            className="rounded bg-teachstone-teal px-6 py-2 text-sm font-medium text-white hover:bg-[#016688] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create Observation
          </button>
        </div>
      </div>
    </div>
  )
}
