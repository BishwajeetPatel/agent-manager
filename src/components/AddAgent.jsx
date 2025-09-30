import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { agentAPI } from '../services/api';

const AddAgent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    countryCode: '+91',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const agentData = {
        ...formData,
        mobile: `${formData.countryCode}${formData.mobile}`,
      };
      
      await agentAPI.createAgent(agentData);
      toast.success('Agent added successfully!');
      
      setFormData({
        name: '',
        email: '',
        mobile: '',
        countryCode: '+91',
        password: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Add New Agent</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter agent name"
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Mobile Number *</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                style={{ width: '80px' }}
                placeholder="+91"
              />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                placeholder="Enter mobile number"
                style={{ flex: 1 }}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              minLength="6"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Adding Agent...' : 'Add Agent'}
        </button>
      </form>
    </div>
  );
};

export default AddAgent;