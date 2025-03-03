import React, { useState, useEffect } from 'react';
import s from './DashboardLayout.module.css';
import { Menu, X } from 'lucide-react';
import DesktopSidebar from '../DesktopSidebar/DesktopSidebar';
import Titlebar from '../Titlebar/Titlebar';
import MobileSidebar from '../MobileSidebar/MobileSidebar';
import ConnectModal from '../ConnectModal/ConnectModal';
import {toast} from 'react-hot-toast'
import {io} from 'socket.io-client'

const DashboardLayout = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [status, setStatus] = useState("INITIALIZING");
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [socket,setSocket] = useState(null);
    // const navigate = useNavigate();
    const [userId] = useState(6045); 



    useEffect(() => {
        if (isModalOpen) {
            // Initialize socket when modal is opened
            const newSocket = io("http://localhost:4000", { withCredentials: true });
            setSocket(newSocket);

            // Handle socket connection and events
            newSocket.on("connect", () => {
                toast.success("Connected")
                setLoading(false);
                setStatus("SOCKET")
                console.log("Socket Connected");
            });

            newSocket.on("status", (data) => {
                setStatus(data.status);
                setLoading(false);
                if (data.status === "READY") {
                    console.log("WhatsApp connected!");
                }
            });

            newSocket.on("qr", (data) => {
                setLoading(false)
                setQrData(data.qrCode);
                setStatus("QR");
            });

            // Clean up on modal close
            return () => {
                newSocket.disconnect();
                console.log("Socket Disconnected");
            };
        } else {
            if (socket) {
                socket.disconnect();
                console.log("Socket Disconnected due to modal closing");
            }
        }
    }, [isModalOpen]); 

    const handleLogin = ()=>{
        setStatus("INTIALIZING");
        setLoading(true);
        socket.emit('login',userId)
   }


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
            setIsMobileSidebarOpen(!isMobileSidebarOpen);
        } else {
            // For desktop: completely hide/show sidebar
            setIsSidebarVisible(!isSidebarVisible);
        }
    };

    return (
        <div className={s.layoutContainer}>
            {/* Desktop Sidebar - only shown when visible */}
            {!isMobile && isSidebarVisible && (
                <div className={s.layoutSidebar}>
                    <DesktopSidebar />
                </div>
            )}

            {/* Mobile Sidebar (overlay) */}
            {isMobile && isMobileSidebarOpen && (
                <div className={s.mobileSidebar}>
                    <MobileSidebar setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
                </div>
            )}

            {/* Title Bar Content Container*/}
            <div className={`${s.layoutMainContainer} ${!isMobile && !isSidebarVisible ? s.fullWidth : ''}`}>
                <Titlebar handleToggleClick={handleToggleClick} setIsModalOpen={setIsModalOpen}/>
                <div className={s.layoutContent}>
                    <div className={s.scr}>Test</div>
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {isMobile && isMobileSidebarOpen && (
                <div className={s.overlay} onClick={() => setIsMobileSidebarOpen(false)} />
            )}

            {/* Connect & Disconnect Popup*/}
            {
                isModalOpen && <ConnectModal status={status}  setStatus={setStatus} setIsModalOpen={setIsModalOpen} loading={loading} qrData={qrData} socket={socket} handleLogin={handleLogin}/>
            }
            
        </div>
    );
};

export default DashboardLayout;