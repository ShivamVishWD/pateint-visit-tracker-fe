import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { Topbar } from './components/layout/Topbar'
import { Sidebar } from './components/layout/Sidebar'
import { Toast } from './components/ui/Toast'
import { VisitsPage } from './components/visits/VisitsPage'
import { CliniciansPage } from './components/clinicians/CliniciansPage'
import { PatientsPage } from './components/patients/PatientsPage'
import { LoginPage } from './components/auth/LoginPage'
import { ConfirmDialog } from './components/ui/ConfirmDialog'

function App() {
  const { activePage, isAuthenticated } = useAppStore()

  useEffect(() => {
    const titles: Record<string, string> = {
      visits: 'Visits | Patient Visit Tracker',
      clinicians: 'Clinicians | Patient Visit Tracker',
      patients: 'Patients | Patient Visit Tracker',
      login: 'Sign In | Patient Visit Tracker',
    }
    document.title = titles[activePage] ?? 'Patient Visit Tracker'
  }, [activePage])

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toast />
        <ConfirmDialog />
      </>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-surface">
          {activePage === 'visits' && <VisitsPage />}
          {activePage === 'clinicians' && <CliniciansPage />}
          {activePage === 'patients' && <PatientsPage />}
        </main>
      </div>
      <Toast />
      <ConfirmDialog />
    </div>
  )
}


export default App
