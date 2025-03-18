import React, { useState } from 'react'
import s from './Titlebar.module.css'
import { FaSquareWhatsapp, FaWhatsapp } from "react-icons/fa6";
import { RiMenu2Fill } from "react-icons/ri";
import { disconnectWhtsapp } from '../../Services/Operations/Message';
import { useDispatch, useSelector } from 'react-redux';

const Titlebar = ({handleToggleClick, setIsModalOpen }) => {
    const {status} = useSelector((state)=>state.profile)
    const dispatch = useDispatch()
    const disconnectHandler = ()=>{
        //API Caller
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

                    <button className={`${s.square} ${s.squareConncted}`} onClick={() => {disconnectHandler()}
                    }>
                        <FaWhatsapp className={`${s.whatsappIcon} ${s.wpConncted}`} />
                        <p className={s.pConnected}>Disconnect</p>
                    </button>
                ) : (

                    <button className={`${s.square} ${s.squareDisconncted}`} onClick={() => setIsModalOpen(true)}>
                        <FaWhatsapp className={`${s.whatsappIcon} ${s.wpDisconnected}`} />
                        <p className={s.pDisconnected}>Connect</p>
                    </button>
                )}

                <div className={s.circle}>H</div>
            </div>
        </div>
        // className={`${s.whatsappIcon} ${s.wpConncted}`}
    )
}

export default Titlebar