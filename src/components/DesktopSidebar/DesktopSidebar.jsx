import React from 'react'
import s from './DesktopSidebar.module.css'
import { Link } from 'react-router-dom'


const DesktopSidebar = () => {
  return (
    <div className={s.DesktopSidebarContainer}>
        <h1>Dashboard</h1>
        <Link to="/admin/students">Students</Link>
    </div>
  )
}

export default DesktopSidebar