import React from 'react'
import s from './VerifyStudent.module.css'
import { IoIosInformationCircleOutline } from "react-icons/io";
import Tooltip from '@mui/material/Tooltip';

const VerifyStudent = ({ setActiveStep, selectedIds, setModal }) => {

    return (
        <div className={s.conatainer}>
            <div className={s.titleContainer}>
                <h4>Total {selectedIds.length} Students selected</h4>
                <p><IoIosInformationCircleOutline className={s.iconFix} /> Hover on Id to verify the name</p>
            </div>
            <div className={s.informationContainer}>
                <div className={s.extraWrapper}>
                    {selectedIds.map((entry, index) => (
                        <Tooltip title={entry.name} arrow placement="top">
                            <p key={index}>{entry.studentId}</p>
                        </Tooltip>
                    ))}
                </div>

            </div>
            <div className={s.btnContainer}>
                <button onClick={() => setModal(false)}>Edit</button>
                <button onClick={() => setActiveStep(1)}>Next</button>
            </div>
        </div >
    )
}

export default VerifyStudent