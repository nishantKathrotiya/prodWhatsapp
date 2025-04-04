import React, { useState } from 'react';
import s from './SlectMessage.module.css';
import { IoIosInformationCircleOutline } from "react-icons/io";

const SlectMessage = ({ onMessageChange }) => {
    const [selectedMessage, setSelectedMessage] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [isCustom, setIsCustom] = useState(false);

    const messageTemplates = [
        {
            id: 'absent',
            title: 'Absent student',
            message: 'Dear Parent, Your ward was absent on {date} during {time}. Please ensure regular attendance for better academic performance.'
        },
        {
            id: 'fees',
            title: 'Fees pending',
            message: 'Dear Parent, This is to inform you that the academic fees for your ward is pending. Kindly clear the dues at the earliest to avoid any inconvenience.'
        },
        {
            id: 'fail',
            title: 'Fail student',
            message: 'Dear Parent, We regret to inform you that your ward has not met the minimum passing criteria. Please schedule a meeting with the counselor to discuss improvement strategies.'
        },
        {
            id: 'meeting',
            title: 'Parents meeting',
            message: 'Dear Parent, You are cordially invited for a parent-teacher meeting on {date} at {time}. Your presence will be highly appreciated.'
        },
        {
            id: 'cie',
            title: 'CIE absent student',
            message: 'Dear Parent, Your ward was absent for the CIE examination on {date}. Please contact the examination department immediately to discuss the next steps.'
        }
    ];

    const handleMessageChange = (e) => {
        const value = e.target.value;
        if (value === 'custom') {
            setIsCustom(true);
            setSelectedMessage('');
            onMessageChange(customMessage, 'Custom Message');
        } else {
            setIsCustom(false);
            const template = messageTemplates.find(t => t.id === value);
            if (template) {
                setSelectedMessage(template.message);
                onMessageChange(template.message, template.title);
            }
        }
    };

    const handleCustomMessageChange = (e) => {
        const value = e.target.value;
        setCustomMessage(value);
        onMessageChange(value, 'Custom Message');
    };

    return (
        <div className={s.container}>
            <div className={s.titleContainer}>
                <h4>Select Message Template</h4>
            </div>

            <div className={s.messageContainer}>
                <div className={s.selectContainer}>
                    <select 
                        value={isCustom ? 'custom' : messageTemplates.find(t => t.message === selectedMessage)?.id || ''}
                        onChange={handleMessageChange}
                        className={s.messageSelect}
                    >
                        <option value="">-- Select Message --</option>
                        {messageTemplates.map((template) => (
                            <option key={template.id} value={template.id}>{template.title}</option>
                        ))}
                        <option value="custom">Custom Message</option>
                    </select>
                </div>

                <div className={s.previewContainer}>
                    {isCustom ? (
                        <textarea
                            value={customMessage}
                            onChange={handleCustomMessageChange}
                            placeholder="Type your custom message here..."
                            className={s.customMessageInput}
                        />
                    ) : (
                        <div className={s.messagePreview}>
                            {selectedMessage ? (
                                <>
                                    <h4>Message Preview:</h4>
                                    <p>{selectedMessage}</p>
                                </>
                            ) : (
                                <div className={s.emptyPreview}>
                                    <p>Select a message template to preview</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SlectMessage;