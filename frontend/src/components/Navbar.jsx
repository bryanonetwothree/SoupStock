/**
 * Navbar.jsx
 * Top navigation bar. Shows the app name and links to all pages.
 * Stays visible on mobile – uses icons + short labels.
 */

import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-xs font-semibold transition-colors duration-150 ` +
    (isActive
      ? 'text-soup-600 bg-soup-100'
      : 'text-gray-500 hover:text-soup-500 hover:bg-soup-50')

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍲</span>
          <span className="font-display font-bold text-lg text-soup-600 hidden sm:block">
            SoupStock
          </span>
        </NavLink>

        {/* Navigation links */}
        <div className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            <span className="text-lg">🧊</span>
            <span>My Fridge</span>
          </NavLink>
          <NavLink to="/shopping-check" className={linkClass}>
            <span className="text-lg">🛒</span>
            <span>Check List</span>
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
