import React, { useState } from 'react'
import s from './MessageWorkflow.module.css';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { IoCloseCircleOutline } from "react-icons/io5";
import VerifyStudent from '../VerifyStudent/VerifyStudent';
import SlectMessage from '../SlectMessage/SlectMessage';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../Services/Connect';
import { STUDENTS_ENDPOINS } from '../../Services/Api';

const MessageWorkflow = ({ selectedIds, setModal }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const steps = ['Verify Students', 'Select The Message', 'Preview & Send'];

    const handleMessageChange = (newMessage) => {
        setMessage(newMessage);
    };

    const handleSendMessage = async () => {
        if (!message) {
            toast.error('Please select or create a message');
            return;
        }

        setLoading(true);
        try {
            const response = await apiConnector(
                'POST',
                STUDENTS_ENDPOINS.SEND_MESSAGE,
                {
                    studentIds: selectedIds.map(student => student.studentId),
                    message: message
                }
            );

            if (response.data.success) {
                toast.success('Messages sent successfully!');
                setModal(false);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to send messages');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return <VerifyStudent selectedIds={selectedIds} />;
            case 1:
                return <SlectMessage onMessageChange={handleMessageChange} />;
            case 2:
                return (
                    <div className={s.previewContainer}>
                        <div className={s.statsContainer}>
                            <h3>Message Preview</h3>
                            <div className={s.stats}>
                                <div className={s.statItem}>
                                    <span className={s.statLabel}>Total Students:</span>
                                    <span className={s.statValue}>{selectedIds.length}</span>
                                </div>
                                <div className={s.statItem}>
                                    <span className={s.statLabel}>Message Type:</span>
                                    <span className={s.statValue}>{message ? 'Custom' : 'Template'}</span>
                                </div>
                            </div>
                        </div>
                        <div className={s.messagePreview}>
                            <h4>Message Content:</h4>
                            <p>{message || 'No message selected'}</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={s.workFlowContainer}>
            <div className={s.workFlowBox}>
                <div className={s.workFlowTitleContainer}>
                    <h2>Send The Messages</h2>
                    <IoCloseCircleOutline className={s.fixIcon} onClick={() => setModal(false)} />
                </div>

                <Stepper activeStep={activeStep} alternativeLabel className={s.stepper}>
                    {steps.map((label) => (
                        <Step key={label} className={s.step}>
                            <StepLabel className={s.stepperLabel}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <div className={s.componentContainer}>
                    {renderStepContent(activeStep)}
                    <div className={s.btnContainer}>
                        {activeStep === 0 && <button onClick={() => setModal(false)}>Edit</button>}
                        {activeStep !== 0 && <button onClick={() => setActiveStep(prevStep => prevStep - 1)}>Go Back</button>}
                        {activeStep !== 2 && <button onClick={() => setActiveStep(prevStep => prevStep + 1)}>Next</button>}
                        {activeStep === 2 && (
                            <button 
                                onClick={handleSendMessage} 
                                disabled={loading}
                                className={loading ? s.disabled : ''}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageWorkflow;