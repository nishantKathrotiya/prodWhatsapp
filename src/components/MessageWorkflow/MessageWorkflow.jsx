import React, { useState } from 'react'
import s from './MessageWorkflow.module.css';

import { IoPencil, IoCloseCircleOutline, IoCheckmarkDone,IoArrowForward,IoArrowBack} from "react-icons/io5";
import VerifyStudent from '../VerifyStudent/VerifyStudent';
import SlectMessage from '../SlectMessage/SlectMessage';
import { toast } from 'react-hot-toast';
import { sendMessages } from '../../Services/Operations/Message.js';
import Suceess from '../Sucess/Sucess.jsx'
import MessagesOverview from '../MessagesOverview/MessagesOverview.jsx';

import Loading from '../Loading/Loading'

const MessageWorkflow = ({ selectedIds, setModal }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false);

    const handleMessageChange = (newMessage, type) => {
        setMessage(newMessage);
        setMessageType(type);
    };

    const handleSendMessage = async () => {
        if (!message) {
            toast.error('Please select or create a message');
            return;
        }

        sendMessages(selectedIds,message,setLoading,setActiveStep)
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return <VerifyStudent selectedIds={selectedIds} />;
            case 1:
                return <SlectMessage onMessageChange={handleMessageChange} />;
            case 2:
                return (
                   <MessagesOverview selectedIds={selectedIds} message={message} messageType={messageType} />
                );
            case 3:
                return <Suceess />;
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

                <div className={s.componentContainer}>
                    {
                        loading ? (
                            <Loading />
                        ) : (
                            <>
                                {renderStepContent(activeStep)}
                                <div className={s.btnContainer}>
                                    {activeStep === 0 && (
                                        <button onClick={() => setModal(false)}>
                                            <IoPencil className={s.btnIcon} />
                                            Edit Selection
                                        </button>
                                    )}
                                    {(activeStep !== 0) && (activeStep !== 3) && (
                                        <button onClick={() => setActiveStep(prevStep => prevStep - 1)}>
                                            <IoArrowBack className={s.btnIcon} />
                                            Go Back
                                        </button>
                                    )}
                                    {(activeStep !== 2) && (activeStep !== 3) && (
                                        <button onClick={() => setActiveStep(prevStep => prevStep + 1)} className={s.nextBtn}>
                                            Next
                                            <IoArrowForward className={s.btnIcon} />
                                        </button>
                                    )}
                                    {activeStep === 2 && (
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={loading}
                                            className={`${s.sendBtn} ${loading  ? s.disabled : ''}`}
                                        >
                                            {loading ? (
                                                <div className={s.pandaContainer}>
                                                    <div className={s.pandaAnimation}></div>
                                                    <span>Sending...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <IoCheckmarkDone className={s.btnIcon} />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {activeStep === 3 && (
                                        <button
                                            onClick={() => setModal(false)}
                                            className={s.sendBtn}
                                        >
                                            <span className={s.centerClose}>
                                                <IoCloseCircleOutline  className={s.btnIcon} />
                                                Close
                                            </span>
                                        </button>
                                    )}

                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default MessageWorkflow;