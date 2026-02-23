import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'

export default function AdminLayout(){
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true))
  const expandedWidth = 272
  const collapsedWidth = 88

  function handleToggleSidebar(){
    if(!isDesktop){
      setMobileOpen((prev) => !prev)
      return
    }
    setCollapsed((prev) => !prev)
  }

  useEffect(() => {
    function handleResize(){
      setIsDesktop(window.innerWidth >= 1024)
      if(window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="h-screen overflow-hidden bg-[#0a0f1d]">
      <Sidebar variant="admin" collapsed={collapsed} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div
        className="h-screen flex flex-col transition-[margin] duration-300"
        style={{ marginLeft: isDesktop ? (collapsed ? collapsedWidth : expandedWidth) : 0 }}
      >
        <Navbar onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
