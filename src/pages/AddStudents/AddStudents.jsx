import React, { useState, useEffect } from 'react';
import s from './AddStudents.module.css';
import { IoDocumentTextOutline, IoDownloadOutline, IoCloudUploadOutline, IoCheckmarkDoneSharp } from 'react-icons/io5';
import { FaFileExcel, FaFileCsv, FaRocket, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const BACKEND_URL = import.meta.env.BACKEND_URL ?? "http://localhost:4000";

const UPLOAD_ENDPOINTS = {
  UPLOAD_STUDENTS: BACKEND_URL + "/api/v1/upload/students",
  PROCESSING_STATUS: BACKEND_URL + "/api/v1/upload/status",
  DONWLAOD_TEMPLATE: BACKEND_URL + "/api/v1/upload/template"
};

const AddStudents = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [fileId, setFileId] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileExt = selectedFile.name.split('.').pop().toLowerCase();

      if (
        (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          fileType === 'application/vnd.ms-excel' ||
          fileType === 'text/csv' ||
          fileExt === 'csv')
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
    setUploadStatus(null);
    setProcessingStatus(null);
    setFileId(null);
    // Reset the file input
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
      const response = await axios.post(UPLOAD_ENDPOINTS.UPLOAD_STUDENTS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus({
        success: true,
        message: 'File uploaded successfully!',
        fileId: response.data.fileId
      });
      setUploading(false);
      setProcessing(true);

      // Start polling for processing status
      pollProcessingStatus(response.data.fileId);
    } catch (error) {
      toast.error('Error uploading file: ' + error.message);
      setUploading(false);
    }
  };

  const pollProcessingStatus = async (fileId) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get(`${UPLOAD_ENDPOINTS.PROCESSING_STATUS}/${fileId}`);

        if (response.data.status === 'completed') {
          clearInterval(pollInterval);
          setProcessing(false);
          setProcessingStatus({
            success: true,
            totalRecords: response.data.totalRecords,
            message: `Successfully processed ${response.data.totalRecords} student records`
          });
          toast.success(`Successfully processed ${response.data.totalRecords} student records`);
        } else if (response.data.status === 'failed') {
          clearInterval(pollInterval);
          setProcessing(false);
          setProcessingStatus({
            success: false,
            message: 'Error processing file: ' + response.data.error
          });
          toast.error('Error processing file: ' + response.data.error);
        }
      } catch (error) {
        clearInterval(pollInterval);
        setProcessing(false);
        toast.error('Error checking processing status');
      }
    }, 2000); // Poll every 2 seconds
  };

  const downloadTemplate = (format) => {
    window.open(`${UPLOAD_ENDPOINTS.DONWLAOD_TEMPLATE}?format=${format}`, '_blank');
  };

  return (
    <div className={s.addStudentsContainer}>
      <div className={s.contentBox}>
        <h1>Add Students</h1>
        <p className={s.subtitle}>Upload an Excel or CSV file to add multiple students at once</p>

        <div className={s.uploadSection}>
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

          <div className={s.uploadBox}>
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
          </div>

          <button
            className={s.uploadBtn}
            onClick={handleUpload}
            disabled={!file || uploading || processing}
          >
            {uploading ? 'Uploading...' : processing ? 'Processing...' : 'Upload File'}
          </button>
        </div>

        {(uploadStatus || processingStatus) && (
          <div className={s.statusSection}>
            {uploadStatus && (
              <div className={`${s.statusCard} ${uploadStatus.success ? s.success : s.error}`}>
                <IoCheckmarkDoneSharp className={s.statusIcon} />
                <div className={s.statusContent}>
                  <h3>File Upload Status</h3>
                  <p>{uploadStatus.message}</p>
                </div>
              </div>
            )}

            {processingStatus && (
              <div className={`${s.statusCard} ${processingStatus.success ? s.success : s.error}`}>
                <IoCheckmarkDoneSharp className={s.statusIcon} />
                <div className={s.statusContent}>
                  <h3>Processing Status</h3>
                  <p>{processingStatus.message}</p>
                  {processingStatus.totalRecords && (
                    <p className={s.recordCount}>
                      Total Records: {processingStatus.totalRecords}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStudents;