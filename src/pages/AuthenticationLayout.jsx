import React, { useState } from 'react';
import s from './test.module.css'
import { Outlet } from 'react-router-dom'
import grid from '../assets/grid.svg'

const AuthenticationLayout = () => {
    return (
        <div className={s.loginContainer}>
            <div className={s.leftConatainer}>
                <Outlet />
            </div>

            <div className={s.rightConatainer}>
                <div className={s.bgContiner}>
                    <img src={grid} alt="" className={s.topImg} />
                    <img src={grid} alt="" className={s.bottomImg} />
                </div>
                <div className={s.rightContentBox}>
                    <div className={s.contentHolder}>
                        <h1 style={{ fontWeight: 400 }}>DEPSTAR</h1>
                        <p className={s.tagline}>Matching Pace with the Advancing World</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default AuthenticationLayout