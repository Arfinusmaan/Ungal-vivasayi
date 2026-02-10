import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Billing from './pages/Billing.jsx'
import Admin from './pages/Admin.jsx'
import Invoice from './pages/Invoice.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/invoice" element={<Invoice />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
