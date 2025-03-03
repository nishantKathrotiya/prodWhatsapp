import React from 'react'
import s from './MobileSidebar.module.css'
import { Menu, X } from 'lucide-react';
const MobileSidebar = ({setIsMobileSidebarOpen}) => {
  return (
    <div>
       <div className={s.mobileCloseWrapper}>
                        <button className={s.closeButton} onClick={() => setIsMobileSidebarOpen(false)}>
                            <X size={24} />
                        </button>
                    </div>
                    <h3>Dashboard</h3>
                    <div className={s.menuItem}>📊 Overview</div>
    </div>
  )
}

export default MobileSidebar