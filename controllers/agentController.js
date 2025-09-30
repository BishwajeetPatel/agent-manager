const Agent = require('../models/Agent');
const { validationResult } = require('express-validator');

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private
const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ isActive: true }).select('-password');
    res.json(agents);
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ message: 'Server error while fetching agents' });
  }
};

// @desc    Create new agent
// @route   POST /api/agents
// @access  Private
const createAgent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, mobile, password } = req.body;

    // Check if agent already exists
    const agentExists = await Agent.findOne({ email });

    if (agentExists) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }

    // Create agent
    const agent = await Agent.create({
      name,
      email,
      mobile,
      password
    });

    if (agent) {
      res.status(201).json({
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
        isActive: agent.isActive
      });
    } else {
      res.status(400).json({ message: 'Invalid agent data' });
    }
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ message: 'Server error while creating agent' });
  }
};

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private
const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const { name, email, mobile, isActive } = req.body;

    agent.name = name || agent.name;
    agent.email = email || agent.email;
    agent.mobile = mobile || agent.mobile;
    agent.isActive = isActive !== undefined ? isActive : agent.isActive;

    const updatedAgent = await agent.save();

    res.json({
      _id: updatedAgent._id,
      name: updatedAgent.name,
      email: updatedAgent.email,
      mobile: updatedAgent.mobile,
      isActive: updatedAgent.isActive
    });
  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({ message: 'Server error while updating agent' });
  }
};

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private
const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    agent.isActive = false;
    await agent.save();

    res.json({ message: 'Agent deactivated successfully' });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ message: 'Server error while deleting agent' });
  }
};

module.exports = {
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent
};