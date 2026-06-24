import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { FeedbackButton } from './FeedbackButton'
import { Header } from './Header'
import { ObservationMetaBar } from './ObservationMetaBar'
import { PrototypeActionButtons } from './PrototypeActionButtons'
import { Sidebar } from './Sidebar'

type AppShellProps = {
  children: ReactNode
  showSidebar?: boolean
  showMetaBar?: boolean
}

export function AppShell({
  children,
  showSidebar = false,
  showMetaBar = false,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-teachstone-bg">
      <Header />

      {showSidebar ? (
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            {showMetaBar && <ObservationMetaBar />}
            <main className="h-full w-full flex-1">{children}</main>
          </div>
        </div>
      ) : (
        <main className="h-full w-full flex-1">{children}</main>
      )}

      <Footer />

      <div className="fixed bottom-6 left-6 flex flex-col items-start gap-3">
        <FeedbackButton />

        <PrototypeActionButtons />
      </div>
    </div>
  )
}
