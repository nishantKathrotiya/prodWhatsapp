import React, { useState, useEffect } from 'react';
import s from './DashboardLayout.module.css';
import { Menu, X } from 'lucide-react';

const DashboardLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Check if the screen is mobile size
    useEffect(() => {

        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();

        window.addEventListener('resize', checkIfMobile);
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const handleToggleClick = () => {
        if (isMobile) {
            // For mobile: toggle sidebar visibility
            setIsMobileSidebarOpen(!isMobileSidebarOpen);
        } else {
            // For desktop: toggle sidebar width
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    return (
        <div className={s.layoutContainer}>
            {/* Desktop Sidebar */}
            {!isMobile && (
                <div
                    className={`${s.layoutSidebar} ${isSidebarCollapsed ? s.collapsed : ''}`}
                >
                    {isSidebarCollapsed ? (
                        <div className={s.collapsedContent}>
                            {/* Icons only for collapsed state */}
                            <div className={s.sidebarIcon}>📊</div>
                            <div className={s.sidebarIcon}>📈</div>
                            <div className={s.sidebarIcon}>⚙️</div>
                        </div>
                    ) : (
                        <>
                            {/* Full sidebar content */}
                            <h3>Dashboard</h3>
                            <div className={s.menuItem}>📊 Overview</div>
                            <div className={s.menuItem}>📈 Analytics</div>
                            <div className={s.menuItem}>⚙️ Settings</div>
                        </>
                    )}
                </div>
            )}

            {/* Mobile Sidebar (overlay) */}
            {isMobile && isMobileSidebarOpen && (
                <div className={s.mobileSidebar}>
                    <div className={s.mobileCloseWrapper}>
                        <button className={s.closeButton} onClick={() => setIsMobileSidebarOpen(false)}>
                            <X size={24} />
                        </button>
                    </div>
                    <h3>Dashboard</h3>
                    <div className={s.menuItem}>📊 Overview</div>
                    <div className={s.menuItem}>📈 Analytics</div>
                    <div className={s.menuItem}>⚙️ Settings</div>
                </div>
            )}

            <div className={s.layoutMainContainer}>
                <div className={s.layoutTitlebar}>
                    <div className={s.titlebarContent}>
                        <button
                            className={s.toggleButton}
                            onClick={handleToggleClick}
                        >
                            <Menu size={24} />
                        </button>
                        <h2>Title Bar</h2>
                    </div>
                </div>
                <div className={s.layoutContent}>
                    <div className={s.scr}>Test</div>
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {isMobile && isMobileSidebarOpen && (
                <div className={s.overlay} onClick={() => setIsMobileSidebarOpen(false)} />
            )}
        </div>
    );
};

export default DashboardLayout;