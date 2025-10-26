# AI Email Assistant - Complete Setup Guide

This guide will help you run both the backend and frontend of the AI Email Assistant application.

## 🚀 Quick Start (5 minutes)

### Prerequisites Checklist
- [ ] Python 3.8+ installed
- [ ] Node.js 14+ and npm installed
- [ ] OpenAI API key ready
- [ ] MongoDB installed (or use MongoDB Atlas)

## Part 1: Backend Setup

### Step 1: Navigate to Backend Directory
```powershell
cd d:\DownloadLT\UIT\jib\my_ai_agent\backend
```

### Step 2: Create Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### Step 3: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step 4: Configure Environment

Create a `.env` file in the backend directory:

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional - MongoDB (defaults to localhost if not set)
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB=email_assistant

# Optional - Development settings
FLASK_ENV=development
DEBUG=True
```

**Get your OpenAI API key**: https://platform.openai.com/api-keys

### Step 5: Start MongoDB

**Option A - Local MongoDB:**
```powershell
# If MongoDB is installed as a service, it should already be running
# Check status:
Get-Service MongoDB

# If not running, start it:
Start-Service MongoDB
```

**Option B - MongoDB Atlas (Cloud):**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Step 6: Start Backend Server
```powershell
python run.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### Step 7: Test Backend (Optional)
Open a new terminal and run:
```powershell
cd d:\DownloadLT\UIT\jib\my_ai_agent\backend
.\venv\Scripts\Activate.ps1
python test_api.py
```

## Part 2: Frontend Setup

### Step 1: Open New Terminal
Keep the backend running and open a new PowerShell terminal.

### Step 2: Navigate to Frontend Directory
```powershell
cd d:\DownloadLT\UIT\jib\my_ai_agent\frontend
```

### Step 3: Install Dependencies
```powershell
npm install
```

This will install:
- React 18.2.0
- Axios 1.6.0
- Lucide React 0.263.1
- React Scripts 5.0.1

### Step 4: Verify Environment File
Ensure `.env` file exists with:
```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### Step 5: Start Frontend Server
```powershell
npm start
```

Your browser should automatically open to `http://localhost:3000`

## ✅ Verification

### Check Backend Health
Open browser to: http://localhost:5000/health

You should see:
```json
{
  "status": "healthy",
  "database": "connected",
  "ai_service": "available",
  "timestamp": "2024-01-15T10:30:00"
}
```

### Check Frontend
The app at `http://localhost:3000` should show:
- 🎨 Purple gradient background
- 📧 "AI Email Assistant" header
- 🟢 Green health indicator
- Three tabs: Process Email, Email List, Statistics

## 📧 Test the Application

### 1. Process Your First Email

Click the sample buttons to load test emails:

**Try "Urgent Work Email":**
- Category: Work
- Importance: High (70+)
- Tone: Formal, Urgent
- Generates 3 reply versions

**Try "Personal Message":**
- Category: Personal
- Importance: Medium (40-60)
- Tone: Casual, Friendly

**Try "Newsletter":**
- Category: Newsletter
- Importance: Low (0-30)
- Tone: Promotional

### 2. View Email List
- Click "Email List" tab
- See all processed emails
- Filter by category or importance
- Search by keywords
- Expand emails for details

### 3. Check Statistics
- Click "Statistics" tab
- View total emails
- See important ratio
- Category breakdown chart

## 🛠 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'flask'`
```powershell
# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Problem**: `openai.AuthenticationError: Invalid API key`
```powershell
# Check .env file has correct API key
notepad .env
# Restart the server
python run.py
```

**Problem**: `pymongo.errors.ServerSelectionTimeoutError`
```powershell
# Check if MongoDB is running
Get-Service MongoDB
# Or check MongoDB Atlas connection string
```

**Problem**: `Address already in use (Port 5000)`
```powershell
# Kill the process using port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
# Or change port in run.py to 5001
```

### Frontend Issues

**Problem**: `npm: command not found`
- Install Node.js from https://nodejs.org/

**Problem**: `Error: Cannot find module 'react'`
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

**Problem**: Blank page at localhost:3000
- Open browser console (F12)
- Check for errors
- Verify backend is running
- Check network tab for failed API calls

**Problem**: CORS errors
- Backend should have CORS enabled (already configured)
- Check backend console for CORS-related messages
- Verify `REACT_APP_API_URL` in `.env`

**Problem**: "Network Error" when processing email
```powershell
# Backend might not be running
# Check: http://localhost:5000/health
# Restart backend if needed
```

## 📂 Port Summary

| Service | Port | URL |
|---------|------|-----|
| Backend API | 5000 | http://localhost:5000 |
| Frontend Dev | 3000 | http://localhost:3000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

## 🔧 Development Workflow

### Standard Development
1. Start MongoDB
2. Start backend (`python run.py`)
3. Start frontend (`npm start`)
4. Make changes
5. Backend auto-reloads
6. Frontend hot-reloads

### Testing Changes
```powershell
# Backend: Run test script
cd backend
python test_api.py

# Frontend: Check browser console
# Press F12 in browser
```

### Stopping Services
```powershell
# Stop backend: Ctrl+C in backend terminal
# Stop frontend: Ctrl+C in frontend terminal
# Stop MongoDB: Stop-Service MongoDB (if needed)
```

## 📊 Understanding the Flow

1. **User submits email** → Frontend EmailForm
2. **POST /api/v1/email/process** → Backend API
3. **EmailCoordinator orchestrates** → 5 AI agents
   - ReaderAgent: Parse email
   - ClassifierAgent: Categorize
   - SummarizerAgent: Generate summary
   - DecisionAgent: Score importance
   - ReplyAgent: Generate replies
4. **Save to MongoDB** → Database
5. **Return results** → Frontend
6. **Display in EmailResult** → User sees analysis

## 🎯 What's Next?

### Customize the System

**Add More Categories:**
Edit `backend/data/email_categories.json`

**Adjust Importance Scoring:**
Edit `backend/tools/importance_scorer.py`

**Change Reply Tones:**
Edit `backend/data/tone_templates.json`

**Modify UI Colors:**
Edit `frontend/src/styles/` CSS files

### Deploy to Production

**Backend:**
- Use Gunicorn for production server
- Set up proper MongoDB cluster
- Add authentication/authorization
- Enable HTTPS
- Set `DEBUG=False`

**Frontend:**
```powershell
npm run build
# Deploy build/ folder to Vercel, Netlify, etc.
```

## 📚 Additional Resources

- **Backend Documentation**: `backend/README.md`
- **Architecture Guide**: `backend/ARCHITECTURE.md`
- **Quick Start**: `backend/QUICKSTART.md`
- **Frontend Guide**: `frontend/README.md`

## 🆘 Getting Help

If you encounter issues:

1. Check this guide first
2. Review the error message carefully
3. Check backend logs (terminal output)
4. Check frontend console (F12 in browser)
5. Verify all services are running
6. Try restarting services

## ✨ Features Recap

### AI-Powered Features
✅ Automatic email categorization (7 categories)
✅ Intelligent importance scoring (0-100)
✅ Smart summarization with key points
✅ Tone analysis (formal, urgent, etc.)
✅ Action item extraction
✅ Suggested reply generation (3 versions)

### UI Features
✅ Modern, responsive design
✅ Real-time processing
✅ Email list with filtering
✅ Statistics dashboard
✅ Sample email templates
✅ Copy-to-clipboard for replies
✅ Health status indicator

---

**🎉 Congratulations! Your AI Email Assistant is ready to use!**

Start processing emails and see the AI agents in action! 🤖✨
