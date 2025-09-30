# MERN Stack Agent Management System

A full-stack web application for managing agents and distributing CSV/Excel data among them automatically.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Authentication**: Secure JWT-based admin login system
- **Agent Management**: Create, view, update, and delete agents
- **File Upload**: Upload CSV/Excel files with validation
- **Smart Distribution**: Automatically distribute data equally among active agents
- **Real-time Dashboard**: View all agents and their assigned data
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Comprehensive validation and error messages

## 🛠 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File upload handling
- **CSV-Parser** - CSV file processing
- **XLSX** - Excel file processing

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js
- **Git** (optional) - For cloning the repository

## 🚀 Installation

### 1. Clone or Download the Project

```bash
git clone <repository-url>
cd agent-manager
```

Or download and extract the ZIP file.

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend/frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern_agent_manager
JWT_SECRET=your_jwt_secret_key_here_make_it_complex
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend Configuration

Create a `.env` file in the `frontend/frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Method 1: Run Separately (Recommended for Development)

#### Start MongoDB
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

#### Start Backend Server
```bash
cd backend
npm run dev
```
Backend runs on: **http://localhost:5000**

#### Start Frontend Server
```bash
cd frontend/frontend
npm run dev
```
Frontend runs on: **http://localhost:3000**

### Method 2: Run Both Together

From the root directory:
```bash
npm run dev
```

## 👤 Initial Setup

### Create Admin User

Use Postman, Thunder Client, or any API client:

**Endpoint:** `POST http://localhost:5000/api/auth/register`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123456"
}
```

**Response:**
```json
{
  "_id": "...",
  "email": "admin@example.com",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123456"
}
```

### Agent Endpoints

#### Get All Agents
```http
GET /api/agents
Authorization: Bearer <token>
```

#### Create Agent
```http
POST /api/agents
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",
  "password": "password123"
}
```

#### Update Agent
```http
PUT /api/agents/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "isActive": true
}
```

#### Delete Agent
```http
DELETE /api/agents/:id
Authorization: Bearer <token>
```

### List Endpoints

#### Upload CSV/Excel
```http
POST /api/lists/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <your-file.csv>
```

#### Get All Lists
```http
GET /api/lists
Authorization: Bearer <token>
```

#### Get List by ID
```http
GET /api/lists/:id
Authorization: Bearer <token>
```

## 📁 Project Structure

```
agent-manager/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── agentController.js   # Agent CRUD operations
│   │   └── listController.js    # File upload & distribution
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Agent.js             # Agent schema
│   │   └── List.js              # Distribution schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── agents.js            # Agent routes
│   │   └── lists.js             # List routes
│   ├── uploads/                 # Temporary file storage
│   ├── .env                     # Environment variables
│   ├── server.js                # Entry point
│   └── package.json
│
├── frontend/frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── AddAgent.jsx     # Create agent form
│   │   │   ├── AgentList.jsx    # Agent table
│   │   │   ├── UploadCSV.jsx    # File upload
│   │   │   └── DistributedLists.jsx # View distributions
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── utils/
│   │   │   └── auth.js          # Auth helpers
│   │   ├── App.jsx              # Root component
│   │   ├── App.css              # Styles
│   │   └── main.jsx             # Entry point
│   ├── .env                     # Environment variables
│   ├── vite.config.js           # Vite configuration
│   └── package.json
│
└── README.md
```

## 📖 Usage Guide

### 1. Login
1. Navigate to `http://localhost:3000`
2. Enter your admin credentials
3. Click "Login"

### 2. Add Agents
1. Click on "Add Agent" tab
2. Fill in the form:
   - Name: Agent's full name
   - Email: Valid email address
   - Mobile: Number with country code (e.g., +1234567890)
   - Password: Minimum 6 characters
3. Click "Create Agent"

### 3. View Agents
1. Click on "Agents" tab
2. View all agents in a table
3. Activate/Deactivate agents using toggle button
4. Delete agents if needed

### 4. Upload CSV/Excel File
1. Click on "Upload CSV" tab
2. Drag & drop or click to select file
3. Supported formats: CSV, XLS, XLSX
4. File must contain columns:
   - **FirstName** (required)
   - **Phone** (required)
   - **Notes** (optional)
5. Click "Upload and Distribute"

### 5. View Distributions
1. Click on "View Distributions" tab
2. See all uploaded files
3. Click "View Details" to see how data was distributed
4. Each agent's assigned items are shown in separate cards

## 📄 CSV File Format

Your CSV/Excel file should have these columns:

```csv
FirstName,Phone,Notes
John Doe,1234567890,New customer
Jane Smith,9876543210,Follow up required
Mike Johnson,5555555555,Existing customer
```

### Example Files

**sample-data.csv:**
```csv
FirstName,Phone,Notes
Alice Brown,1111111111,Priority customer
Bob Wilson,2222222222,Needs quote
Carol Davis,3333333333,Technical support
David Lee,4444444444,Sales inquiry
Emma Taylor,5555555555,Product demo needed
```

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process or change port in `.env`
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

#### JWT Token Invalid
**Solution:** 
1. Clear browser localStorage
2. Login again
3. Check JWT_SECRET in backend `.env`

#### File Upload Fails
**Solution:**
1. Check file format (CSV, XLS, XLSX only)
2. Ensure file size < 5MB
3. Verify file has required columns
4. Check at least one agent is active

#### Frontend Can't Connect to Backend
**Solution:**
1. Verify backend is running on port 5000
2. Check `VITE_API_URL` in frontend `.env`
3. Ensure CORS is enabled in backend

### Reset Database

```bash
# Connect to MongoDB
mongo

# Use database
use mern_agent_manager

# Drop collections
db.users.drop()
db.agents.drop()
db.lists.drop()

# Exit
exit
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can register
- [ ] User can login
- [ ] User can create agent
- [ ] User can view all agents
- [ ] User can activate/deactivate agent
- [ ] User can delete agent
- [ ] User can upload CSV file
- [ ] Data is distributed equally
- [ ] User can view distributions
- [ ] Logout works correctly

### Test Credentials

After creating admin user:
- **Email:** admin@example.com
- **Password:** admin123456

## 🎯 Features Checklist

- [x] JWT Authentication
- [x] Password Hashing (Bcrypt)
- [x] Agent CRUD Operations
- [x] CSV File Upload
- [x] Excel File Upload (XLS, XLSX)
- [x] File Validation
- [x] Equal Distribution Algorithm
- [x] Remainder Distribution
- [x] Responsive UI
- [x] Toast Notifications
- [x] Error Handling
- [x] Protected Routes
- [x] API Documentation

## 📝 Distribution Algorithm

The system uses a fair distribution algorithm:

1. **Calculate base items per agent:**
   ```
   itemsPerAgent = totalItems ÷ totalActiveAgents
   ```

2. **Calculate remainder:**
   ```
   remainder = totalItems % totalActiveAgents
   ```

3. **Distribution:**
   - Each agent gets `itemsPerAgent` items
   - First `remainder` agents get 1 extra item

**Example:**
- Total items: 27
- Active agents: 5
- Distribution: [6, 6, 5, 5, 5]

## 🔐 Security Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT secrets** (64+ characters)
3. **Hash all passwords** (Bcrypt with salt rounds ≥ 10)
4. **Validate all inputs** (Frontend & Backend)
5. **Use HTTPS in production**
6. **Implement rate limiting**
7. **Keep dependencies updated**

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)

1. Set environment variables
2. Update MongoDB URI to cloud database (MongoDB Atlas)
3. Deploy backend

### Frontend Deployment (Vercel/Netlify)

1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy `dist` folder
3. Update `VITE_API_URL` to production backend URL

## 📧 Support

For issues or questions:
- Email: support@example.com
- GitHub Issues: [Create an issue](https://github.com/yourrepo/issues)

## 👥 Contributors

- Your Name - Initial work

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- MongoDB Documentation
- React Documentation
- Express.js Documentation
- Vite Documentation

---

**Made with ❤️ using MERN Stack**

Last Updated: September 30, 2025# agent-manager
