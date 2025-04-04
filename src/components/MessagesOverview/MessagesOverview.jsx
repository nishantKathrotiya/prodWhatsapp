import React from 'react'
import s from './MessagesOverview.module.css'

const MessagesOverview = ({selectedIds,message,messageType}) => {
    return (
        <div className={s.previewContainer}>
            <div className={s.stats}>
                <div className={s.statItem}>
                    <span className={s.statLabel}>Total Students:</span>
                    <span className={s.statValue}>{selectedIds.length}</span>
                </div>
                <div className={s.statItem}>
                    <span className={s.statLabel}>Message Type:</span>
                    <span className={s.statValue}>{messageType || 'Not Selected'}</span>
                </div>
            </div>
            <div className={s.messagePreview}>
                <h4>Message Content:</h4>
                <p>{message || 'No message selected'}</p>
            </div>
        </div>
    )
}

export default MessagesOverview