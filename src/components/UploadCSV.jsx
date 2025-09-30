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
      
      if (validTypes.includes(selectedFile.type) || 
          selectedFile.name.match(/\.(csv|xlsx|xls)$/i)) {
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
      
      console.log('Distribution:', response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
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
        <div className="upload-icon">📁</div>
        <p>Drag & drop your CSV/Excel file here</p>
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
        <div className="file-info">
          <p><strong>Selected File:</strong> {file.name}</p>
          <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        className="btn-primary"
        disabled={!file || uploading}
        style={{ marginTop: '20px' }}
      >
        {uploading ? 'Uploading...' : 'Upload and Distribute'}
      </button>

      <div style={{ marginTop: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
        <h3 style={{ marginBottom: '10px' }}>File Format Requirements:</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>File must contain columns: FirstName, Phone, Notes</li>
          <li>Accepted formats: CSV, XLS, XLSX</li>
          <li>Data will be distributed equally among active agents</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadCSV;