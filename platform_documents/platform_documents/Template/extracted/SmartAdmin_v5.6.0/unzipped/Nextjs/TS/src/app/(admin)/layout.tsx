'use client'
import React, { useEffect, useState } from 'react'
import Footer from '@/layouts/components/Footer'
import SettingsDrawer from '@/layouts/components/SettingsDrawer'
import Sidenav from '@/layouts/components/sidenav'
import Topbar from '@/layouts/components/topbar'
import Loader from '@/components/Loader'

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return <Loader height="100vh" />

  return (
    <div className="app-wrap">
      <Topbar />
      <Sidenav />
      <main className="app-body">
        <div className="app-content">{children}</div>
        <Footer />
      </main>

      <SettingsDrawer />
    </div>
  )
}

export default MainLayout
