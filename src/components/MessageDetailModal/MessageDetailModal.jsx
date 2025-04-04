import React from 'react';
import './MessageDetailModal.css';
import { IoCloseOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";

const MessageDetailModal = ({ message, onClose }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="messageModalBackdrop" onClick={onClose}>
      <div className="messageModalContent" onClick={(e) => e.stopPropagation()}>
        <div className="messageModalHeader">
          <h2>Message Details</h2>
          <button className="closeBtn" onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>
        
        <div className="messageModalBody">
          <div className="detailSection">
            <h3>Message Information</h3>
            <div className="detailRow">
              <span className="detailLabel">Message ID:</span>
              <span className="detailValue">{message.id}</span>
            </div>
            <div className="detailRow">
              <span className="detailLabel">Date Sent:</span>
              <span className="detailValue">{formatDate(message.sentDate)}</span>
            </div>
            <div className="detailRow">
              <span className="detailLabel">Sent By:</span>
              <span className="detailValue">{message.sentBy}</span>
            </div>
            <div className="detailRow">
              <span className="detailLabel">Status:</span>
              <span className={`detailValue statusText ${message.status === 'Delivered' ? 'success' : 'error'}`}>
                {message.status === 'Delivered' ? (
                  <IoCheckmarkCircleOutline />
                ) : (
                  <IoCloseCircleOutline />
                )}
                {message.status}
              </span>
            </div>
          </div>
          
          <div className="detailSection">
            <h3>Recipient Information</h3>
            <div className="detailRow">
              <span className="detailLabel">Student ID:</span>
              <span className="detailValue">{message.studentId}</span>
            </div>
            <div className="detailRow">
              <span className="detailLabel">Student Name:</span>
              <span className="detailValue">{message.studentName}</span>
            </div>
          </div>
          
          <div className="messageContentSection">
            <h3>Message Content</h3>
            <div className="messageContent">
              {message.messageContent}
            </div>
          </div>
        </div>
        
        <div className="messageModalFooter">
          <button className="closeModalBtn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailModal; 