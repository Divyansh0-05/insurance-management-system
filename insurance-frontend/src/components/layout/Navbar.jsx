import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, LogOut, ChevronDown, ShieldCheck, User } from 'lucide-react'
import useAuth from '../../hooks/useAuth'

function getPageTitle(pathname){
  if(pathname.includes('/dashboard')) return 'Dashboard'
  if(pathname.includes('/insurance')) return 'Insurance'
  if(pathname.includes('/purchases')) return 'Purchases'
  if(pathname.includes('/claims')) return 'Claims'
  if(pathname.includes('/profile')) return 'Profile'
  if(pathname.includes('/users')) return 'User Management'
  if(pathname.includes('/reports')) return 'Reports & Analytics'
  if(pathname.includes('/settings')) return 'Settings'
  return 'Overview'
}

export default function Navbar({ onToggleSidebar }){
  const navigate = useNavigate()
  const location = useLocation()
  const { role, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const isAdmin = role === 'admin'
  const pageTitle = useMemo(() => getPageTitle(location.pathname), [location.pathname])

  function handleLogout(){
    logout()
    navigate('/', { replace: true })
  }

  useEffect(() => {
    function handleOutsideClick(event){
      if(menuRef.current && !menuRef.current.contains(event.target)){
        setMenuOpen(false)
      }
    }
    window.addEventListener('mousedown', handleOutsideClick)
    return () => window.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-slate-100">{pageTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3" ref={menuRef}>
          {isAdmin && (
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-500/15 px-2.5 py-1 text-xs font-medium text-cyan-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </span>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="h-10 px-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors inline-flex items-center gap-2"
          >
            <span className="h-7 w-7 rounded-full bg-white/15 inline-flex items-center justify-center text-slate-100">
              <User className="h-4 w-4" />
            </span>
            <span className="hidden sm:block text-sm text-slate-200">Profile</span>
            <ChevronDown className={`h-4 w-4 text-slate-300 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-4 sm:right-6 top-14 w-56 rounded-xl border border-white/15 bg-slate-900 shadow-lg shadow-black/50 p-1.5">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full h-10 px-3 rounded-lg text-left text-sm text-red-300 hover:bg-red-500/15 transition-colors inline-flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
