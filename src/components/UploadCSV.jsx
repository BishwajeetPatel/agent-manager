import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { listAPI } from '../services/api';

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile) {
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      
      const isValidType = validTypes.includes(selectedFile.type) || 
                         selectedFile.name.match(/\.(csv|xlsx|xls)$/i);
      
      if (isValidType) {
        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (selectedFile.size > maxSize) {
          toast.error('File size should not exceed 10MB');
          return;
        }
        
        setFile(selectedFile);
        toast.info(`File selected: ${selectedFile.name}`);
      } else {
        toast.error('Please upload only CSV, XLS, or XLSX files');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await listAPI.uploadList(formData);
      toast.success('File uploaded and distributed successfully!');
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
      console.log('Distribution:', response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload file';
      toast.error(errorMessage);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
    toast.info('File removed');
  };

  return (
    <div className="card">
      <h2>Upload CSV/Excel File</h2>
      
      <div
        className={`upload-area ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <div className="upload-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#FEF3C7"/>
            <path d="M32 20V36M32 20L26 26M32 20L38 26M20 36V40C20 41.0609 20.4214 42.0783 21.1716 42.8284C21.9217 43.5786 22.9391 44 24 44H40C41.0609 44 42.0783 43.5786 42.8284 42.8284C43.5786 42.0783 44 41.0609 44 40V36" 
                  stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p style={{ fontSize: '16px', fontWeight: '500', marginTop: '15px', marginBottom: '5px' }}>
          Drag & drop your CSV/Excel file here
        </p>
        <p style={{ color: '#999', fontSize: '14px' }}>or click to browse</p>
        <input
          id="file-input"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {file && (
        <div className="file-info" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
          border: '1px solid #667eea30',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: '#667eea', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              {file.name.endsWith('.csv') ? 'CSV' : 'XLS'}
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', fontWeight: '600', fontSize: '15px' }}>
                {file.name}
              </p>
              <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFile();
            }}
            style={{
              padding: '8px 16px',
              background: '#ff4757',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#ee5a6f'}
            onMouseOut={(e) => e.target.style.background = '#ff4757'}
          >
            Remove
          </button>
        </div>
      )}

      <button
        onClick={handleUpload}
        className="btn-primary"
        disabled={!file || uploading}
        style={{ 
          marginTop: '20px',
          opacity: (!file || uploading) ? 0.6 : 1,
          cursor: (!file || uploading) ? 'not-allowed' : 'pointer'
        }}
      >
        {uploading ? (
          <>
            <span style={{ display: 'inline-block', marginRight: '10px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" fill="none" strokeDasharray="30" strokeLinecap="round"/>
              </svg>
            </span>
            Uploading...
          </>
        ) : (
          'Upload and Distribute'
        )}
      </button>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: '#f0f7ff', 
        borderRadius: '8px',
        border: '1px solid #d0e7ff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: '10px' }}>
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z" fill="#2563eb"/>
          </svg>
          <h3 style={{ margin: 0, color: '#1e40af', fontSize: '16px', fontWeight: '600' }}>
            File Format Requirements
          </h3>
        </div>
        <ul style={{ paddingLeft: '20px', margin: '10px 0 0 0', color: '#1e3a8a' }}>
          <li style={{ marginBottom: '8px' }}>
            File must contain columns: <strong>FirstName</strong>, <strong>Phone</strong>, <strong>Notes</strong>
          </li>
          <li style={{ marginBottom: '8px' }}>
            Column names are case-sensitive and should match exactly
          </li>
          <li style={{ marginBottom: '8px' }}>
            Accepted formats: <strong>CSV</strong>, <strong>XLS</strong>, <strong>XLSX</strong>
          </li>
          <li style={{ marginBottom: '8px' }}>
            Maximum file size: <strong>10MB</strong>
          </li>
          <li>
            Data will be distributed equally among active agents
          </li>
        </ul>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UploadCSV;
