import React from 'react'
import s from './DesktopSidebar.module.css'
import { Link, useLocation } from 'react-router-dom'
import { IoSchoolOutline, IoTimeOutline, IoHomeOutline, IoPersonAddOutline } from "react-icons/io5";

const DesktopSidebar = () => {
  const location = useLocation();
  
  return (
    <div className={s.DesktopSidebarContainer}>
        <h1>Dashboard</h1>
        <nav className={s.navMenu}>
          <Link 
            to="/admin" 
            className={`${s.navLink} ${location.pathname === '/admin' ? s.active : ''}`}
          >
            <IoHomeOutline className={s.navIcon} />
            <span>Home</span>
          </Link>
          <Link 
            to="/admin/students" 
            className={`${s.navLink} ${location.pathname === '/admin/students' ? s.active : ''}`}
          >
            <IoSchoolOutline className={s.navIcon} />
            <span>Students</span>
          </Link>
          <Link 
            to="/admin/directmessage" 
            className={`${s.navLink} ${location.pathname === '/admin/directmessage' ? s.active : ''}`}
          >
            <IoTimeOutline className={s.navIcon} />
            <span>Direct Message</span>
          </Link>
          <Link 
            to="/admin/addstudents" 
            className={`${s.navLink} ${location.pathname === '/admin/addstudents' ? s.active : ''}`}
          >
            <IoPersonAddOutline className={s.navIcon} />
            <span>Add Students</span>
          </Link>
          <Link 
            to="/admin/history" 
            className={`${s.navLink} ${location.pathname === '/admin/history' ? s.active : ''}`}
          >
            <IoTimeOutline className={s.navIcon} />
            <span>Message History</span>
          </Link>
        </nav>
    </div>
  )
}

export default DesktopSidebar