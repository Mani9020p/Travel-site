import { Routes, Route } from 'react-router-dom'
import MainSite from './MainSite'
import AdminPanel from './AdminPanel'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  )
}

export default App
