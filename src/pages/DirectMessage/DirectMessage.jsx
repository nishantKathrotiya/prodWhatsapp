import React, { useState } from 'react';
import s from './DirectMessage.module.css';
import { FaFileExcel, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { IoDownloadOutline } from "react-icons/io5";
import { toast } from 'react-hot-toast';
import { uploadContacts, sendMessages, downloadTemplate as downloadTemplateAPI } from '../../Services/Operations/DirectMessage';

const DirectMessage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [sending, setSending] = useState(false);
  const [totalContacts, setTotalContacts] = useState(0);
  const [fileId, setFileId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0
  });

  const downloadTemplate = async (type) => {
    try {
      await downloadTemplateAPI(type);
    } catch (error) {
      console.error('Error downloading template:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileExt = selectedFile.name.split('.').pop().toLowerCase();
      
      if (
        fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        fileType === 'application/vnd.ms-excel' ||
        fileType === 'text/csv' ||
        fileExt === 'csv'
      ) {
        setFile(selectedFile);
        toast.success('File selected successfully');
      } else {
        toast.error('Please select a valid Excel or CSV file');
        e.target.value = '';
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setTotalContacts(0);
    setFileId(null);
    setStats({ total: 0, success: 0, failed: 0 });
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
    toast.success('File removed successfully');
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await uploadContacts(formData);
      setTotalContacts(response.totalContacts);
      setFileId(response.fileId);
      toast.success(`File processed successfully. Total contacts: ${response.totalContacts}`);
      setUploading(false);
    } catch (error) {
      toast.error('Error processing file: ' + error.message);
      setUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!fileId) {
      toast.error('Please upload a contacts file first');
      return;
    }

    try {
      setSending(true);
      const response = await sendMessages(fileId, message.trim());
      setStats({
        total: response.total,
        success: response.success,
        failed: response.failed
      });
      toast.success(`Messages sent successfully! Success: ${response.success}, Failed: ${response.failed}`);
      setSending(false);
    } catch (error) {
      toast.error('Error sending messages: ' + error.message);
      setSending(false);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.content}>
        <div className={s.header}>
          <h1>Direct Message</h1>
          <p>Send messages directly to multiple contacts</p>
        </div>

        <div className={s.uploadSection}>
          <h2>Upload Contacts</h2>
          <p>Upload an Excel or CSV file containing contact numbers</p>
          
          <div className={s.templateSection}>
            <div className={s.templateButtons}>
              <button className={s.templateBtn} onClick={() => downloadTemplate('xlsx')}>
                <IoDownloadOutline className={s.icon} />
                Download Excel Template
              </button>
              <button className={s.templateBtn} onClick={() => downloadTemplate('csv')}>
                <IoDownloadOutline className={s.icon} />
                Download CSV Template
              </button>
            </div>
            <p className={s.templateInfo}>Use our template to ensure correct data format</p>
          </div>

          <div className={s.fileUploadContainer}>
            <input
              type="file"
              id="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className={s.fileInput}
            />
            <label htmlFor="file" className={s.fileLabel}>
              {file ? (
                <div className={s.fileInfo}>
                  <span>{file.name}</span>
                  <button 
                    className={s.removeFileBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      removeFile();
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <>
                  <FaFileExcel className={s.fileIcon} />
                  <span>Choose Excel or CSV File</span>
                </>
              )}
            </label>
          </div>

          {file && !totalContacts && (
            <button 
              className={s.uploadBtn}
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Processing...' : 'Process File'}
            </button>
          )}
        </div>

        {totalContacts > 0 && (
          <div className={s.messageSection}>
            <h2>Enter Message</h2>
            <p>Total contacts to send: {totalContacts}</p>
            
            <div className={s.messageInput}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
                rows="4"
              />
              <button 
                className={s.sendBtn}
                onClick={handleSendMessage}
                disabled={sending || !message.trim()}
              >
                <FaPaperPlane className={s.sendIcon} />
                {sending ? 'Sending...' : 'Send Messages'}
              </button>
            </div>
          </div>
        )}

        {stats.total > 0 && (
          <div className={s.statsSection}>
            <h2>Message Statistics</h2>
            <div className={s.statsGrid}>
              <div className={s.statCard}>
                <h3>Total Messages</h3>
                <p>{stats.total}</p>
              </div>
              <div className={`${s.statCard} ${s.success}`}>
                <h3>Successfully Sent</h3>
                <p>{stats.success}</p>
              </div>
              <div className={`${s.statCard} ${s.failed}`}>
                <h3>Failed</h3>
                <p>{stats.failed}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMessage; 