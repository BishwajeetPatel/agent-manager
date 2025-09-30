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
        <div className="navbar-brand">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
              <path d="M16 10C13.79 10 12 11.79 12 14C12 16.21 13.79 18 16 18C18.21 18 20 16.21 20 14C20 11.79 18.21 10 16 10ZM16 22C12.67 22 10 20.33 10 18.33C10 16.33 12.67 14.67 16 14.67C19.33 14.67 22 16.33 22 18.33C22 20.33 19.33 22 16 22Z" fill="white"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#667eea"/>
                  <stop offset="1" stopColor="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>Agent Manager Dashboard</h1>
        </div>
        <div className="nav-right">
          <div className="user-badge">
            <span className="user-avatar">{user?.email?.charAt(0).toUpperCase()}</span>
            <span className="user-info">Welcome, {user?.name || user?.email}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M11 11L14 8M14 8L11 5M14 8H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="tabs-wrapper">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'agents' ? 'active' : ''}`}
              onClick={() => setActiveTab('agents')}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15 15.75V14.25C15 13.4544 14.6839 12.6913 14.1213 12.1287C13.5587 11.5661 12.7956 11.25 12 11.25H6C5.20435 11.25 4.44129 11.5661 3.87868 12.1287C3.31607 12.6913 3 13.4544 3 14.25V15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 8.25C10.6569 8.25 12 6.90685 12 5.25C12 3.59315 10.6569 2.25 9 2.25C7.34315 2.25 6 3.59315 6 5.25C6 6.90685 7.34315 8.25 9 8.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Agent List
            </button>
            <button
              className={`tab ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => setActiveTab('add')}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3.75V14.25M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add Agent
            </button>
            <button
              className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 11.25V13.5C15.75 13.8978 15.592 14.2794 15.3107 14.5607C15.0294 14.842 14.6478 15 14.25 15H3.75C3.35218 15 2.97064 14.842 2.68934 14.5607C2.40804 14.2794 2.25 13.8978 2.25 13.5V11.25M12.75 6L9 2.25M9 2.25L5.25 6M9 2.25V11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Upload CSV
            </button>
            <button
              className={`tab ${activeTab === 'distributed' ? 'active' : ''}`}
              onClick={() => setActiveTab('distributed')}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 6H15M3 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Distributed Lists
            </button>
          </div>
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
