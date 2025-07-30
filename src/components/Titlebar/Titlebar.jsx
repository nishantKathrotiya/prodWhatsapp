import React from 'react'
import s from './Titlebar.module.css'
import { FaWhatsapp } from "react-icons/fa6";
import { RiMenu2Fill } from "react-icons/ri";
import { disconnectWhtsapp } from '../../Services/Operations/Message';
import { useDispatch, useSelector } from 'react-redux';

const Titlebar = ({handleToggleClick, setIsModalOpen }) => {
    const {status} = useSelector((state)=>state.profile)
    const dispatch = useDispatch()
    const disconnectHandler = ()=>{
        console.log("Disconnecting")
        dispatch(disconnectWhtsapp());
    }
    return (
        <div className={s.titleBarConatienr}>
            <div className={s.titleBarLeftConatiner}>
                <button onClick={handleToggleClick}>
                    <RiMenu2Fill className={s.menuIcon} />
                </button>
            </div>

            <div className={s.titleBarRightConatiner}>
                {status === "READY" ? (
                    <button className={`${s.connectButton} ${s.connected}`} onClick={disconnectHandler}>
                        <FaWhatsapp className={s.whatsappIcon} />
                        <span>Disconnect</span>
                    </button>
                ) : (
                    <button className={`${s.connectButton} ${s.disconnected}`} onClick={() => setIsModalOpen(true)}>
                        <FaWhatsapp className={s.whatsappIcon} />
                        <span>Connect</span>
                    </button>
                )}
            </div>
        </div>
    )
}

export default Titlebar