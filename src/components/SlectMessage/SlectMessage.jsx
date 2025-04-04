import React, { useState } from 'react';
import s from './SlectMessage.module.css';
import { IoIosInformationCircleOutline } from "react-icons/io";

const SlectMessage = () => {
    const [selectedMessage, setSelectedMessage] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [isCustom, setIsCustom] = useState(false);

    const messageTemplates = [
        'Absent student',
        'Fees pending',
        'Fail student',
        'Parents meeting',
        'CIE absent student'
    ];

    const handleMessageChange = (e) => {
        const value = e.target.value;
        if (value === 'custom') {
            setIsCustom(true);
            setSelectedMessage('');
        } else {
            setIsCustom(false);
            setSelectedMessage(value);
        }
    };

    return (
        <div className={s.container}>
            <div className={s.titleContainer}>
                <h4>Select Message Template</h4>
                <p><IoIosInformationCircleOutline className={s.iconFix} /> Select or create a custom message</p>
            </div>

            <div className={s.messageContainer}>
                <div className={s.selectContainer}>
                    <select 
                        value={isCustom ? 'custom' : selectedMessage}
                        onChange={handleMessageChange}
                        className={s.messageSelect}
                    >
                        <option value="">-- Select Message --</option>
                        {messageTemplates.map((msg, index) => (
                            <option key={index} value={msg}>{msg}</option>
                        ))}
                        <option value="custom">Custom Message</option>
                    </select>
                </div>

                <div className={s.previewContainer}>
                    {isCustom ? (
                        <textarea
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            placeholder="Type your custom message here..."
                            className={s.customMessageInput}
                        />
                    ) : (
                        <div className={s.messagePreview}>
                            {selectedMessage || 'Select a message template to preview'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SlectMessage;