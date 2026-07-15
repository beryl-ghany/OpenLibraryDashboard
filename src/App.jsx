import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import DashboardPage from './DashboardPage'
import DetailPage from './DetailPage'

function App() {
  const [subject, setSubject] = useState('adventure')

  return (
    <div className="shelf">
      <Sidebar subject={subject} setSubject={setSubject} />
      <main className="main-column">
        <Routes>
          <Route path="/" element={<DashboardPage subject={subject} />} />
          <Route path="/book/:olid" element={<DetailPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
