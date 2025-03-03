import React from 'react'
import s from './Titlebar.module.css'
import { FaSquareWhatsapp, FaWhatsapp } from "react-icons/fa6";
import { RiMenu2Fill } from "react-icons/ri";

const Titlebar = ({ handleToggleClick , setIsModalOpen}) => {
    return (
        <div className={s.titleBarConatienr}>
            <div className={s.titleBarLeftConatiner}>
                <button onClick={handleToggleClick}>
                    <RiMenu2Fill className={s.menuIcon} />
                </button>
            </div>

            <div className={s.titleBarRightConatiner}>
                <button className={`${s.square} ${s.squareConncted}`} onClick={()=>setIsModalOpen(true)}>
                    <FaWhatsapp className={`${s.whatsappIcon} ${s.wpConncted}`} />
                    <p className={`${s.squareConncted}`}>Connected</p>
                </button>
                <div className={s.circle}>H</div>
            </div>
        </div>
    )
}

export default Titlebar