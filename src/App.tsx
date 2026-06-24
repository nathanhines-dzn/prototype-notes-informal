import { useEffect } from 'react'
import { AppShell } from './components/layout/AppShell'
import { SettingsModal } from './components/SettingsModal'
import { usePrototype } from './context/PrototypeContext'
import { CompletionPage } from './pages/CompletionPage'
import { CreateObservationPage } from './pages/CreateObservationPage'
import { CyclePage } from './pages/CyclePage'

function PrototypeApp() {
  const { currentStep, stepIndex } = usePrototype()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [stepIndex])

  if (currentStep.type === 'create') {
    return (
      <AppShell>
        <CreateObservationPage />
        <SettingsModal />
      </AppShell>
    )
  }

  if (currentStep.type === 'cycle') {
    return (
      <AppShell showSidebar showMetaBar>
        <CyclePage />
        <SettingsModal />
      </AppShell>
    )
  }

  return (
    <AppShell showSidebar showMetaBar>
      <CompletionPage />
      <SettingsModal />
    </AppShell>
  )
}

export default function App() {
  return <PrototypeApp />
}
