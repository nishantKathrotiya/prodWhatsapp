import React, { useState } from 'react'
import s from './MessageWorkflow.module.css';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { IoCloseCircleOutline } from "react-icons/io5";
import VerifyStudent from '../VerifyStudent/VerifyStudent';


const MessageWorkflow = ({ selectedIds,setModal }) => {
    const [activeStep , setActiveStep] = useState(0);

    const steps = ['Verify Stuudents', 'Select The Message', 'Let the Magic Begin'];
    const render = {
        0:<VerifyStudent setActiveStep={setActiveStep} selectedIds={selectedIds} setModal={setModal}/>,
        1: <h1>Hello</h1>
    }

    return (
        <div className={s.workFlowContainer}>
            <div className={s.workFlowBox}>
                <div className={s.workFlowTitleContainer}>
                    <h2>Send The Messages</h2>
                    <IoCloseCircleOutline className={s.fixIcon} onClick={()=>setModal(false)} />
                </div>

                <Stepper activeStep={activeStep} alternativeLabel className={s.stepper}>
                    {steps.map((label) => (
                        <Step key={label} className={s.step}>
                            <StepLabel className={s.stepperLabel}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <div className={s.componentContainer}>
                    {render[activeStep]}
                </div>
            </div>
        </div>
    )

}

export default MessageWorkflow