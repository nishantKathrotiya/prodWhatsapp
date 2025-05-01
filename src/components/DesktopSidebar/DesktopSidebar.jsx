import React from 'react'
import s from './DesktopSidebar.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { IoSchoolOutline, IoTimeOutline, IoHomeOutline, IoPersonAddOutline, IoLogOutOutline, IoPersonCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Services/Operations/Auth';

const DesktopSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user} = useSelector((state) => state.profile);
  
  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  return (
    <div className={s.DesktopSidebarContainer}>
        <h1>CareLink</h1>
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
        <div className={s.bottomSection}>
          <div className={s.profileSection}>
            
            <div className={s.profileInfo}>
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.email}</p>
            </div>
          </div>
          <button className={s.logoutButton} onClick={handleLogout}>
            <IoLogOutOutline className={s.navIcon} />
            <span>Logout</span>
          </button>
        </div>
    </div>
  )
}

export default DesktopSidebar