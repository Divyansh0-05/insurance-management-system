import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Shield, FileText, BarChart3, Settings, Receipt, UserCircle, ClipboardList } from 'lucide-react'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/insurance', label: 'Insurance', icon: Shield },
  { to: '/admin/claims', label: 'Claims', icon: ClipboardList },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

const userLinks = [
  { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/user/insurance', label: 'Insurance', icon: Shield },
  { to: '/user/purchases', label: 'Purchases', icon: Receipt },
  { to: '/user/claims', label: 'Claims', icon: FileText },
  { to: '/user/profile', label: 'Profile', icon: UserCircle },
]

export default function Sidebar({ variant = 'user', collapsed = false, mobileOpen = false, onCloseMobile }){
  const links = variant === 'admin' ? adminLinks : userLinks
  const isAdmin = variant === 'admin'
  const accent = isAdmin
    ? 'from-cyan-400 to-blue-500 border-cyan-400/40 text-cyan-200'
    : 'from-blue-300 to-indigo-400 border-blue-300/40 text-blue-100'
  const expandedWidth = 272
  const collapsedWidth = 88

  return (
    <>
      <div
        onClick={onCloseMobile}
        className={`fixed inset-0 z-40 bg-black/45 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        style={{ width: collapsed ? collapsedWidth : expandedWidth }}
        className={`fixed inset-y-0 left-0 z-50 h-screen border-r border-white/10 bg-slate-950 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className={`h-16 border-b border-white/10 px-4 flex items-center ${collapsed ? 'justify-center' : 'justify-start'}`}>
            <div
              className={`h-9 w-9 rounded-xl border bg-gradient-to-br ${accent} flex items-center justify-center text-[11px] font-semibold`}
            >
              IMS
            </div>
            {!collapsed && <p className="ml-3 text-sm font-semibold text-slate-100">{isAdmin ? 'Admin Console' : 'User Workspace'}</p>}
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-xl transition-all duration-200 ${
                    collapsed ? 'justify-center h-11' : 'h-11 px-3'
                  } ${
                    isActive
                      ? isAdmin
                        ? 'bg-cyan-500/15 text-cyan-200 font-semibold'
                        : 'bg-blue-500/15 text-blue-100 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full ${isAdmin ? 'bg-cyan-300' : 'bg-blue-300'}`}
                      />
                    )}
                    <item.icon className={`h-4.5 w-4.5 ${collapsed ? '' : 'ml-1'}`} />
                    {!collapsed && <span className="ml-3 text-sm">{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className={`border-t border-white/10 px-4 py-3 ${collapsed ? 'text-center' : ''}`}>
            {!collapsed && <p className="text-xs text-slate-500">v1.0.0</p>}
            {collapsed && <p className="text-[10px] text-slate-500">v1</p>}
          </div>
        </div>
      </aside>
    </>
  )
}
