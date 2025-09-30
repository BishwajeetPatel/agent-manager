import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { listAPI } from '../services/api';

const DistributedLists = () => {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDistributions();
  }, []);

  const fetchDistributions = async () => {
    try {
      const response = await listAPI.getLists();
      setDistributions(response.data);
    } catch (error) {
      toast.error('Failed to fetch distributions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading distributions...</p>
      </div>
    );
  }

  if (distributions.length === 0) {
    return (
      <div className="card">
        <h2>Distributed Lists</h2>
        <p>No distributions found. Upload a CSV file to create distributions.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Distributed Lists</h2>
      
      {distributions.map((dist, index) => (
        <div key={dist._id} style={{ marginBottom: '40px' }}>
          <h3>Distribution #{index + 1}</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Uploaded on: {new Date(dist.uploadedAt).toLocaleString()}
          </p>

          <div className="distribution-grid">
            {dist.agentDistributions.map((agentDist) => (
              <div key={agentDist.agent._id} className="agent-card">
                <h3>{agentDist.agent.name}</h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  {agentDist.agent.email}
                </p>
                <div className="count-badge">
                  {agentDist.items.length} items assigned
                </div>

                <div>
                  {agentDist.items.map((item, idx) => (
                    <div key={idx} className="list-item">
                      <p><strong>Name:</strong> {item.firstName}</p>
                      <p><strong>Phone:</strong> {item.phone}</p>
                      <p><strong>Notes:</strong> {item.notes || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DistributedLists;