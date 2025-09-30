import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuth, getUser } from '../utils/auth';
import AddAgent from './AddAgent';
import AgentList from './AgentList';
import UploadCSV from './UploadCSV';
import DistributedLists from './DistributedLists';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [activeTab, setActiveTab] = useState('agents');

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>Agent Manager Dashboard</h1>
        <div className="nav-right">
          <span className="user-info">Welcome, {user?.name || user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'agents' ? 'active' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            Agent List
          </button>
          <button
            className={`tab ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Add Agent
          </button>
          <button
            className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload CSV
          </button>
          <button
            className={`tab ${activeTab === 'distributed' ? 'active' : ''}`}
            onClick={() => setActiveTab('distributed')}
          >
            Distributed Lists
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'agents' && <AgentList />}
          {activeTab === 'add' && <AddAgent />}
          {activeTab === 'upload' && <UploadCSV />}
          {activeTab === 'distributed' && <DistributedLists />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;