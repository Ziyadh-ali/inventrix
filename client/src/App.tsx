import './App.css'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { Route, Routes } from 'react-router-dom'
import { AuthForm } from './pages/AuthForm'
import { Toaster } from 'sonner'
import { CustomerManagement } from './pages/CustomerManagement'
import { ItemManagement } from './pages/ItemManagement'
import { SaleManagement } from './pages/SaleManagement'
import { ReportsPage } from './pages/ReportPage'
import { ExportPage } from './pages/Export'
import { PublicRoute } from './protected/PublicRoute'
import { ProtectedRoute } from './protected/ProtectedRoute'

function App() {

  return (
    <>
      <Provider store={store}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path='login' element={<AuthForm />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='dashboard'>
              <Route path='customers' element={<CustomerManagement />} />
              <Route path='items' element={<ItemManagement />} />
              <Route path='sales' element={<SaleManagement />} />
              <Route path='report' element={<ReportsPage />} />
              <Route path='export' element={<ExportPage />} />
            </Route>
          </Route>
        </Routes>
        <Toaster richColors position="top-right" />
      </Provider>
    </>
  )
}

export default App
