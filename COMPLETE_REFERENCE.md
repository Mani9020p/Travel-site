# 📋 COMPLETE REFERENCE GUIDE

## 🎯 YOUR TRAVEL WEBSITE SYSTEM - COMPLETE SETUP

Your travel website backend and frontend are now **FULLY INTEGRATED** and **RUNNING**.

---

## 🌐 URLS TO USE

| Purpose | URL |
|---------|-----|
| **Admin Dashboard** | http://localhost:5175/admin |
| **Public Website** | http://localhost:5175 |
| **Backend API** | http://localhost:5000 |

---

## 🔐 LOGIN CREDENTIALS

### Admin Panel Access
- **URL**: http://localhost:5175/admin
- **Username**: `admin`
- **Password**: `admin123`

**⚠️ Important**: Change these credentials in production!

---

## 📊 WHAT'S INCLUDED

### ✅ Backend (Flask Python Server)
- Running on: `http://localhost:5000`
- Database: JSON files (`data.json`)
- Enquiries: Excel file (`enquiries.xlsx`)
- File uploads: `uploads/` folder
- Authentication: JWT tokens
- All endpoints secured and documented

### ✅ Frontend (React Website)
- Running on: `http://localhost:5175`
- Admin Panel: Full CRUD operations
- Public Site: Display and enquiry submission
- Real-time API integration
- Responsive design

### ✅ File Storage
```
uploads/
├── home/         (Home page photos)
├── packages/     (Package images)
└── videos/       (Promotional videos)
```

### ✅ Data Storage
- `data.json` - All packages and content
- `enquiries.xlsx` - User enquiries in Excel format

---

## 🎛️ ADMIN PANEL FEATURES

### 1. Enquiries Management
- View all user enquiries
- See customer name and contact
- Track package interests
- Delete enquiries

### 2. Home Photos
- Upload new photos
- View all photos
- Delete photos
- Photos appear in home page slider

### 3. High-Selling Packages
- Create new packages
- Edit existing packages
- Delete packages
- Upload package photos
- Set price, duration, description, includes
- All changes instant on public site

### 4. All Tour Packages
- Create, read, update, delete packages
- Full package management
- Same features as high-selling packages

### 5. About & History Content
- Edit About Us section
- Edit History section
- Save changes to backend
- Automatically appear on public site

### 6. Video Management
- Upload promotional videos
- Set YouTube embed URLs
- Manage video content
- Display on About page

---

## 🌍 PUBLIC WEBSITE FEATURES

### Home Page
- Image slider (from uploaded photos)
- High-selling packages display
- Easy navigation

### Packages Section
- Browse high-selling packages
- Browse all packages
- View package details
- Book enquiry button

### About Section
- About Us text
- History information
- Promotional video

### Enquiry Form
- Submit tour interests
- Provide contact information
- Confirmation message after submit

---

## 🔄 DATA FLOW

```
User Interaction on Public Site
            ↓
JSON data sent to Backend API
            ↓
Backend validates and processes
            ↓
Data saved to:
├─ data.json (packages, content)
└─ enquiries.xlsx (user enquiries)
            ↓
Admin can view/manage in Admin Panel
            ↓
Changes automatically reflect on Public Site
```

---

## 🧪 TESTING CHECKLIST

- [ ] Access admin panel: http://localhost:5175/admin
- [ ] Login with admin/admin123
- [ ] Create a test package
- [ ] Upload a test photo
- [ ] Update About Us content
- [ ] Go to public site
- [ ] See your changes reflected
- [ ] Submit a test enquiry
- [ ] Verify in admin panel

---

## 🔧 CONFIGURATION FILES

### Backend Configuration
**File**: `src/services/backend/app.py`

Key settings:
```python
app.config['SECRET_KEY'] = 'your-secret-key-change-this'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max

ADMIN_CREDENTIALS = {
    'admin': generate_password_hash('admin123')  # Change this!
}
```

### Frontend Configuration
**File**: `src/services/api.js`

Key setting:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 📁 PROJECT STRUCTURE

```
travel/
├── src/
│   ├── AdminPanel.jsx           (Admin dashboard component)
│   ├── MainSite.jsx             (Public website component)
│   ├── App.jsx                  (Router setup)
│   ├── services/
│   │   ├── api.js              (API client)
│   │   └── backend/
│   │       ├── app.py          (Flask server) ← RUNNING
│   │       ├── requirements.txt (Python dependencies)
│   │       └── venv/            (Python environment)
│   └── styles/                  (CSS files)
├── uploads/                     (File storage)
│   ├── home/
│   ├── packages/
│   └── videos/
├── node_modules/                (npm dependencies)
├── data.json                    (Package database)
├── enquiries.xlsx              (User enquiries)
├── package.json
├── vite.config.js
├── index.html
└── README/Documentation files
```

---

## 🚀 START SYSTEM (If Stopped)

### Terminal 1 - Backend
```bash
cd "/home/maniicecream/Documents/travel /src/services/backend"
source venv/bin/activate
python app.py
```

Expected output:
```
Running on http://127.0.0.1:5000
```

### Terminal 2 - Frontend
```bash
cd "/home/maniicecream/Documents/travel "
npm run dev
```

Expected output:
```
Local: http://localhost:5175/
```

---

## 🔐 SECURITY FEATURES

### Current Implementation
- ✅ JWT Authentication
- ✅ Password Hashing (werkzeug)
- ✅ CORS Enabled (for localhost)
- ✅ Secure File Upload Handling
- ✅ Input Validation
- ✅ 24-hour token expiry

### Production Recommendations
1. Change admin password
2. Use environment variables
3. Enable HTTPS/SSL
4. Implement database (PostgreSQL)
5. Add rate limiting
6. Remove debug mode
7. Add comprehensive logging

---

## 📊 API ENDPOINTS

### Authentication
```
POST /api/auth/login
├─ Send: { "username": "admin", "password": "admin123" }
└─ Returns: { "token": "jwt-token-here" }
```

### Home Images
```
GET    /api/home-images          Get all home images
POST   /api/home-images          Upload home image (auth required)
DELETE /api/home-images/<id>     Delete home image (auth required)
```

### Packages (High-Selling)
```
GET    /api/high-selling-packages              Get all
POST   /api/high-selling-packages              Create (auth required)
PUT    /api/high-selling-packages/<id>        Update (auth required)
DELETE /api/high-selling-packages/<id>        Delete (auth required)
POST   /api/high-selling-packages/<id>/image  Upload image (auth required)
```

### Packages (All)
```
GET    /api/all-packages              Get all
POST   /api/all-packages              Create (auth required)
PUT    /api/all-packages/<id>        Update (auth required)
DELETE /api/all-packages/<id>        Delete (auth required)
POST   /api/all-packages/<id>/image  Upload image (auth required)
```

### Enquiries
```
POST /api/enquiries                   Submit enquiry
GET  /api/enquiries                   Get all (auth required)
```

### Content Management
```
GET  /api/about             Get about content
PUT  /api/about             Update content (auth required)
```

### Videos
```
POST /api/videos            Upload video (auth required)
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Cannot connect to backend"
**Solution**:
- Check backend is running on port 5000
- Check no firewall blocking port 5000
- Restart backend: `python app.py`

### Issue: "Login fails"
**Solution**:
- Username must be: `admin` (exact)
- Password must be: `admin123` (exact)
- Space matters - no extra spaces
- Check caps lock

### Issue: "Uploads not working"
**Solution**:
- Check uploads/ folder exists
- Check write permissions: `chmod -R 755 uploads/`
- Check file size under 50MB
- Supported types: png, jpg, jpeg, gif, mp4, webm

### Issue: "Port already in use"
**Solution**:
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in app.py
# Change: app.run(..., port=5000)
```

### Issue: "Module not found"
**Solution**:
```bash
cd src/services/backend
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: "Can't see changes on public site"
**Solution**:
- Hard refresh browser: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache completely
- Wait 2-3 seconds for API to respond

---

## 💡 TIPS & TRICKS

### Bulk Upload
- Upload multiple images one by one
- Click "Add Photo" after each upload

### Package Management
- Copy existing package details to create similar packages
- Use organized naming convention

### Enquiry Tracking
- Check enquiries regularly for customer interest
- Export Excel file for reports

### Content Updates
- Keep About Us text concise
- Use professional video URLs
- Test video embed URLs before saving

---

## 📈 PERFORMANCE TIPS

1. **Optimize Images**: Compress images before upload
2. **Clean Old Files**: Delete unused photos periodically
3. **Monitor Storage**: Check uploads/ folder size
4. **Database Backup**: Keep backup of data.json
5. **Regular Updates**: Keep packages and content fresh

---

## 🎓 LEARNING RESOURCES

### Backend (Flask)
- Framework: Flask 3.0.0
- Authentication: PyJWT 2.11.0
- File handling: Werkzeug 3.0.1
- Excel: openpyxl 3.1.2
- CORS: Flask-CORS 4.0.0

### Frontend (React)
- Framework: React 19.2.0
- Build: Vite 7.2.5
- Routing: React Router DOM 7.13.0
- API calls: Fetch API (built-in)

---

## 📞 HELP & SUPPORT

### Check These First
1. **SYSTEM_STATUS.txt** - Quick status overview
2. **START_HERE.md** - Quick start guide
3. **SETUP_COMPLETE.md** - Complete setup info
4. **SETUP_GUIDE.md** - API documentation
5. **INTEGRATION_SUMMARY.md** - Technical details

### Common Fixes
- Restart both servers
- Clear browser cache
- Check console for error messages
- Verify ports are correct
- Check file permissions

---

## ✅ VERIFICATION

### Backend
- [ ] Running on http://localhost:5000
- [ ] Check: Send POST to /api/auth/login
- [ ] Response: Should return token on success

### Frontend
- [ ] Running on http://localhost:5175
- [ ] Admin panel loads: http://localhost:5175/admin
- [ ] Login form visible with username/password fields

### Integration
- [ ] Login successful with admin/admin123
- [ ] Can create new package
- [ ] Can upload image
- [ ] Can submit enquiry
- [ ] Data appears in admin panel

---

## 🎊 CONCLUSION

Your travel website system is:
- ✅ **Fully Integrated** (Frontend + Backend)
- ✅ **Completely Configured** (All settings ready)
- ✅ **Currently Running** (Both servers active)
- ✅ **Ready to Use** (Login and start managing!)
- ✅ **Well Documented** (Multiple guides available)

### Next Steps
1. Open http://localhost:5175/admin
2. Login with admin/admin123
3. Start managing your travel packages!

---

**Last Updated**: February 9, 2026  
**System Status**: ✅ FULLY OPERATIONAL  
**Version**: 1.0.0  

🌍 **Happy Travel Website Management!** 🚀
