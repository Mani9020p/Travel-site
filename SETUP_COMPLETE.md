# ✅ COMPLETE SETUP & RUNNING GUIDE

## 🎯 Current Status

✅ **Backend**: Running on http://localhost:5000  
✅ **Frontend**: Running on http://localhost:5175  
✅ **Ready to Use**: YES

---

## 🌐 ACCESS YOUR APPLICATION

### 1. PUBLIC WEBSITE
**URL**: http://localhost:5175

**Features**:
- View home page with image slider
- Browse high-selling tour packages
- Browse all tour packages
- Read About Us & History sections
- Watch promotional video
- Submit tour enquiry form

---

### 2. ADMIN PANEL
**URL**: http://localhost:5175/admin

**Default Login Credentials**:
- **Username**: `admin`
- **Password**: `admin123`

**Admin Features**:
- 📬 View user enquiries
- 🖼️ Manage home section photos
- 📦 Create/Edit/Delete high-selling packages
- 📦 Create/Edit/Delete all tour packages
- 📝 Update About Us & History content
- 🎥 Upload promotional videos
- 💾 All data securely stored

---

## 📋 SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                   TRAVEL WEBSITE SYSTEM                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend (React + Vite)          Backend (Flask)       │
│  Port: 5175                       Port: 5000            │
│  ├─ MainSite.jsx        ←API→     ├─ Authentication     │
│  ├─ AdminPanel.jsx      ←API→     ├─ Packages CRUD      │
│  └─ api.js              ←API→     ├─ Images Upload      │
│                                    ├─ Enquiries         │
│                                    └─ Content Mgmt      │
│                                                         │
│  Data Storage                                           │
│  ├─ data.json (Packages, Images, Videos)                │
│  ├─ enquiries.xlsx (User Enquiries)                     │ 
│  └─ uploads/ (Photos & Videos)                          │ 
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 HOW IT WORKS

### Admin Workflow
1. Admin opens http://localhost:5175/admin
2. Logs in with username: `admin`, password: `admin123`
3. Can manage:
   - Home photos (upload, delete)
   - Tour packages (create, edit, delete, upload images)
   - Content (About Us, History)
   - Videos (upload YouTube embed URLs)
4. All changes saved to backend database
5. Changes appear on public website automatically

### User Workflow
1. User visits http://localhost:5175
2. Browses packages and content
3. Submits enquiry through form
4. Data sent to backend and stored in Excel file
5. Admin can view in admin panel

---

## 🔐 LOGIN CREDENTIALS

| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `admin123` |
| **Location** | http://localhost:5175/admin |

⚠️ **For Production**: Change these credentials in `src/services/backend/app.py`

---

## 📂 FILE & FOLDER STRUCTURE

```
travel/
├── src/
│   ├── AdminPanel.jsx              # Admin dashboard
│   ├── AdminPanel.css
│   ├── MainSite.jsx                # Public website
│   ├── App.jsx                     # Router
│   ├── App.css
│   ├── main.jsx                    # Entry point
│   ├── index.css
│   └── services/
│       ├── api.js                  # API client
│       └── backend/
│           ├── app.py              # Flask server ⭐ RUNNING
│           ├── requirements.txt    # Python dependencies
│           └── venv/               # Virtual environment
├── uploads/                        # User uploaded files
│   ├── home/                       # Home section photos
│   ├── packages/                   # Package photos
│   └── videos/                     # Promotional videos
├── node_modules/                   # Frontend dependencies
├── package.json
├── vite.config.js
├── data.json                       # Package & content data
├── enquiries.xlsx                  # User enquiries (Excel)
└── SETUP_COMPLETE.md               # This file
```

---

## 🚀 TO START THE SYSTEM (From Scratch)

### Step 1: Open Terminal 1 (Backend)
```bash
cd "/home/maniicecream/Documents/travel /src/services/backend"
source venv/bin/activate
python app.py
```

**Expected output**:
```
Running on http://127.0.0.1:5000
```

### Step 2: Open Terminal 2 (Frontend)
```bash
cd "/home/maniicecream/Documents/travel "
npm run dev
```

**Expected output**:
```
Local: http://localhost:5175/
```

### Step 3: Open Browser
- **Admin**: http://localhost:5175/admin
- **Public Site**: http://localhost:5175

---

## 🧪 TESTING THE SYSTEM

### Test 1: Admin Login
- Go to: http://localhost:5175/admin
- Username: `admin`
- Password: `admin123`
- ✅ Should login and show admin dashboard

### Test 2: Create a Package
1. Go to Admin Panel
2. Click "High-Selling Packages" or "All Packages"
3. Fill in package details:
   - Name: "Test Package"
   - Price: "$100"
   - Duration: "2 days"
   - Description: "Test package"
   - Includes: "Guide, Transport"
4. Click "Add Package"
5. ✅ Package should appear in list

### Test 3: Upload Image
1. Go to "Home Photos" tab
2. Click "Choose File" and select an image
3. Click "Add Photo"
4. ✅ Image should appear in the gallery

### Test 4: Submit Enquiry
1. Go to public site: http://localhost:5175
2. Click "Book Enquiry" on any package
3. Fill in name, contact, package name
4. Click "Submit"
5. Go to admin panel → Enquiries tab
6. ✅ Enquiry should appear in admin panel

### Test 5: Update Content
1. Go to Admin Panel → "About & History"
2. Edit About Us Content
3. Click "Save About Content"
4. Refresh public site and check About section
5. ✅ Content should be updated

---

## 📊 API ENDPOINTS

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/login | Admin authentication |
| GET | /api/home-images | Get home photos |
| POST | /api/home-images | Upload home photo |
| DELETE | /api/home-images/{id} | Delete home photo |
| GET | /api/high-selling-packages | Get high-selling packages |
| POST | /api/high-selling-packages | Create package |
| PUT | /api/high-selling-packages/{id} | Update package |
| DELETE | /api/high-selling-packages/{id} | Delete package |
| GET | /api/all-packages | Get all packages |
| POST | /api/all-packages | Create package |
| PUT | /api/all-packages/{id} | Update package |
| DELETE | /api/all-packages/{id} | Delete package |
| POST | /api/enquiries | Submit enquiry |
| GET | /api/enquiries | Get all enquiries |
| GET | /api/about | Get about content |
| PUT | /api/about | Update about content |
| POST | /api/videos | Upload video |

---

## 🔧 CONFIGURATION

### Change Admin Password
Edit `src/services/backend/app.py`:
```python
ADMIN_CREDENTIALS = {
    'admin': generate_password_hash('your-new-password')
}
```

### Change Backend Port
Edit `src/services/backend/app.py` (last line):
```python
app.run(debug=True, host='0.0.0.0', port=5000)  # Change 5000 to another port
```

### Change Frontend Port
```bash
npm run dev -- --port 3000
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Cannot GET /admin"
**Solution**: Make sure frontend is running and you're on correct port (5175)

### Issue: "Connection refused" for API
**Solution**: Make sure backend is running on port 5000

### Issue: Cannot upload images
**Solution**: 
- Check `uploads/` folder exists
- Check write permissions: `chmod -R 755 uploads/`

### Issue: "Port already in use"
**Solution**: 
```bash
# Kill process using port
lsof -i :5000  # Find backend
lsof -i :5175  # Find frontend

# Then kill by PID
kill -9 <PID>
```

### Issue: "ModuleNotFoundError" in backend
**Solution**:
```bash
cd src/services/backend
source venv/bin/activate
pip install -r requirements.txt
```

---

## 💾 DATA STORAGE

### Where is Data Stored?

| Data Type | Location | Format |
|-----------|----------|--------|
| Packages | `data.json` | JSON |
| Enquiries | `enquiries.xlsx` | Excel |
| Home Photos | `uploads/home/` | Images |
| Package Photos | `uploads/packages/` | Images |
| Videos | `uploads/videos/` | Video files |

### Accessing Files
- Windows: Open file explorer and navigate to the folder
- Mac/Linux: Use `ls -la` command or file manager

---

## 🔒 SECURITY NOTES

### Current Setup (Development)
- JWT authentication for admin
- Password hashing
- CORS enabled for localhost
- File upload validation

### For Production
1. ⚠️ Change default admin credentials
2. ⚠️ Change SECRET_KEY in app.py
3. ⚠️ Use environment variables
4. ⚠️ Enable HTTPS/SSL
5. ⚠️ Use real database (PostgreSQL/MongoDB)
6. ⚠️ Add rate limiting
7. ⚠️ Remove debug mode
8. ⚠️ Add input validation

---

## 📝 QUICK REFERENCE

### Start Everything
**Terminal 1**:
```bash
cd "/home/maniicecream/Documents/travel /src/services/backend"
source venv/bin/activate && python app.py
```

**Terminal 2**:
```bash
cd "/home/maniicecream/Documents/travel " && npm run dev
```

### Access Links
- Admin: http://localhost:5175/admin
- Public: http://localhost:5175
- Backend API: http://localhost:5000/api

### Login
- Username: `admin`
- Password: `admin123`

---

## ✅ EVERYTHING IS READY!

Your travel website system is now:
- ✅ Fully integrated (frontend + backend)
- ✅ Properly configured
- ✅ Running and accessible
- ✅ Ready to manage data
- ✅ Secured with authentication

**Start using it now!** 🚀

---

**Last Updated**: February 9, 2026
**System Status**: ✅ OPERATIONAL
