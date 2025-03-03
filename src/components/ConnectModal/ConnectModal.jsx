import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import s from './ConnectModal.module.css';
import Loading from '../Loading/Loading';
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from 'react-hot-toast';

// Move socket initialization outside of component to prevent multiple connections
// const socket = io("http://localhost:4000", { withCredentials: true });


const ConnectModal = ({ status, setStatus, setIsModalOpen,loading,qrData,socket,handleLogin }) => {
    // const [loading, setLoading] = useState(false);
    // const [qrData, setQrData] = useState(null);
    // const [userId] = useState(6045); // Store userId in state or get from props/context
    
    const navigate = useNavigate();



//   useEffect(() => {
//     console.log(status , loading)
//     socket.on("connect", () => {
//         setLoading(false);
//         console.log("Socket Connceted")
//     });

//     socket.on("qr", (data) => {
//       setQrData(data.qrCode);
//       setStatus("QR");
//     });

//     socket.on("status", (data) => {
//       setStatus(data.status);
//       if (data.status === "READY") {
//         console.log(data.userId)
//         navigate(`/send/${data.userId}`);
//         setQrData(null); // Hide QR when ready
//       }
//     });

//     return () => {
//       socket.off("qr");
//       socket.off("status");
//     };
//   }, []);



    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div className={s.connectModal}>
            <div className={s.conncetConatiner}>
                <div className={s.popTitleConatainer}>
                    <h4>Connect to WhatsApp</h4>
                    <IoCloseCircleOutline
                        className={s.closeIcon}
                        onClick={(() => handleCloseModal())}
                    />
                </div>

                <div className={s.coantentConatainer}>
                    {loading  ? (
                        <div className={s.loadingConatainer}>
                            <Loading />
                            <h3>Hold on—panda's soaring!</h3>
                        </div>
                    ) : (
                        <>
                            {status === "SOCKET" && (
                                <div className={s.buttonContainer}>
                                    <p>Ready to connect WhatsApp</p>
                                    <button className={s.generateButton} onClick={handleLogin}>
                                        Generate QR Code
                                    </button>
                                </div>
                            )}

                            {status === "QR" && (
                                <div className={s.qrContainer}>
                                    <p>Scan this QR code with your WhatsApp</p>
                                    {qrData ? (
                                        <QRCode value={qrData} size={256} />
                                    ) : (
                                        <p>Error loading QR code. <button onClick={handleLogin}>Try Again</button></p>
                                    )}
                                </div>
                            )}

                            {status === "READY" && (
                                <div className={s.readyContainer}>
                                    <div className={s.svgContainer}>
                                        {/* Outer SVG Circle */}
                                        <svg
                                            className={`${s.svgBackground}`}
                                            width="90"
                                            height="90"
                                            viewBox="0 0 90 90"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                                            />
                                        </svg>

                                        {/* Inner SVG Icon */}
                                        <span className={s.svgIconWrapper}>
                                            <svg
                                                className={`${s.svgIcon} `}
                                                width="38"
                                                height="38"
                                                viewBox="0 0 38 38"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M5.9375 19.0004C5.9375 11.7854 11.7864 5.93652 19.0014 5.93652C26.2164 5.93652 32.0653 11.7854 32.0653 19.0004C32.0653 26.2154 26.2164 32.0643 19.0014 32.0643C11.7864 32.0643 5.9375 26.2154 5.9375 19.0004ZM19.0014 2.93652C10.1296 2.93652 2.9375 10.1286 2.9375 19.0004C2.9375 27.8723 10.1296 35.0643 19.0014 35.0643C27.8733 35.0643 35.0653 27.8723 35.0653 19.0004C35.0653 10.1286 27.8733 2.93652 19.0014 2.93652ZM24.7855 17.0575C25.3713 16.4717 25.3713 15.522 24.7855 14.9362C24.1997 14.3504 23.25 14.3504 22.6642 14.9362L17.7177 19.8827L15.3387 17.5037C14.7529 16.9179 13.8031 16.9179 13.2173 17.5037C12.6316 18.0894 12.6316 19.0392 13.2173 19.625L16.657 23.0647C16.9383 23.346 17.3199 23.504 17.7177 23.504C18.1155 23.504 18.4971 23.346 18.7784 23.0647L24.7855 17.0575Z"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                    <h1>Ready To Go!</h1>
                                    <p>WhatsApp connected successfully</p>
                                </div>
                            )}

                            {status === "DISCONNECTED" && (
                                <div className={s.errorContainer}>
                                    <p>WhatsApp disconnected. Please reconnect.</p>
                                    <button onClick={handleLogin}>Reconnect</button>
                                </div>
                            )}

                            {status === "AUTH_FAILED" && (
                                <div className={s.errorContainer}>
                                    <p>Authentication failed. Please try again.</p>
                                    <button onClick={handleLogin}>Retry</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConnectModal;