/**
 * App.jsx
 * Root component. Sets up routing and the shared layout (Navbar + page area).
 */

import { Routes, Route } from 'react-router-dom'
import Navbar        from './components/Navbar'
import Dashboard     from './pages/Dashboard'
import ShoppingCheck from './pages/ShoppingCheck'

export default function App() {
  return (
    <div className="min-h-screen bg-soup-50 font-body">
      <Navbar />

      <main>
        <Routes>
          <Route path="/"                element={<Dashboard />} />
          <Route path="/shopping-check"  element={<ShoppingCheck />} />
          {/* Fallback: redirect unknown URLs to home */}
          <Route path="*"                element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}
