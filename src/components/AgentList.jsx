import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { agentAPI } from '../services/api';

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await agentAPI.getAgents();
      setAgents(response.data);
    } catch (error) {
      toast.error('Failed to fetch agents');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await agentAPI.updateAgent(id, { isActive: !currentStatus });
      toast.success('Agent status updated');
      fetchAgents();
    } catch (error) {
      toast.error('Failed to update agent status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await agentAPI.deleteAgent(id);
        toast.success('Agent deleted successfully');
        fetchAgents();
      } catch (error) {
        toast.error('Failed to delete agent');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading agents...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Agent List</h2>
      {agents.length === 0 ? (
        <p>No agents found. Add your first agent!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent._id}>
                <td>{agent.name}</td>
                <td>{agent.email}</td>
                <td>{agent.mobile}</td>
                <td>
                  <span
                    className={`status-badge ${
                      agent.isActive ? 'status-active' : 'status-inactive'
                    }`}
                  >
                    {agent.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleStatus(agent._id, agent.isActive)}
                    className={`btn-small ${
                      agent.isActive ? 'btn-danger' : 'btn-success'
                    }`}
                    style={{ marginRight: '10px' }}
                  >
                    {agent.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(agent._id)}
                    className="btn-small btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AgentList;