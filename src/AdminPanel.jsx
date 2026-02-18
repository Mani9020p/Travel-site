import { useState, useEffect } from 'react'
import './AdminPanel.css'
import apiService from './services/api'

function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('enquiries')
  
  // Data states
  const [enquiries, setEnquiries] = useState([])
  const [homeImages, setHomeImages] = useState([])
  const [highSellingPackages, setHighSellingPackages] = useState([])
  const [allPackages, setAllPackages] = useState([])
  const [aboutContent, setAboutContent] = useState('')
  const [aboutVideo, setAboutVideo] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const token = apiService.getToken()
    if (token) {
      setIsLoggedIn(true)
      loadAllData()
    }
  }, [])

  // Form states
  const [newPackageName, setNewPackageName] = useState('')
  const [newPackagePrice, setNewPackagePrice] = useState('')
  const [newPackageDesc, setNewPackageDesc] = useState('')
  const [newPackageDuration, setNewPackageDuration] = useState('')
  const [newPackageIncludes, setNewPackageIncludes] = useState('')
  const [newPackageImage, setNewPackageImage] = useState(null)
  const [editingPackageId, setEditingPackageId] = useState(null)
  const [editingPackageType, setEditingPackageType] = useState(null)
  
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const result = await apiService.login(loginUsername, loginPassword)
    
    if (result.token) {
      setIsLoggedIn(true)
      setLoginUsername('')
      setLoginPassword('')
      loadAllData()
    } else {
      setError(result.message || 'Invalid credentials')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    apiService.logout()
    setIsLoggedIn(false)
    setError('')
  }

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [enq, home, hs, all, about] = await Promise.all([
        apiService.getEnquiries(),
        apiService.getHomeImages?.() || { success: true, data: [] },
        apiService.getHighSellingPackages?.() || { success: true, data: [] },
        apiService.getPackages?.() || { success: true, data: [] },
        apiService.getAbout?.() || { success: true, data: { content: '', video: '' } }
      ])
      
      if (enq.success) setEnquiries(enq.data || [])
      if (home.success) setHomeImages(home.data || [])
      if (hs.success) setHighSellingPackages(hs.data || [])
      if (all.success) setAllPackages(all.data || [])
      if (about.success) {
        setAboutContent(about.data?.content || '')
        setAboutVideo(about.data?.video || '')
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load admin data')
    }
    setLoading(false)
  }

  // ===== PACKAGE FUNCTIONS =====
  const handleCreateOrUpdatePackage = async (isHighSelling = false) => {
    if (!newPackageName || !newPackagePrice || !newPackageDesc) {
      setError('Please fill all fields')
      return
    }
    
    setLoading(true)
    
    try {
      const packageData = {
        name: newPackageName,
        price: newPackagePrice,
        description: newPackageDesc
      }

      if (!isHighSelling) {
        packageData.duration = newPackageDuration
        packageData.includes = (newPackageIncludes || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      }
      
      if (editingPackageId) {
        // Update
        const endpoint = isHighSelling ? 'updateHighSellingPackage' : 'updatePackage'
        const result = await apiService[endpoint]?.(editingPackageId, packageData) || { success: true }
        
        if (result.success) {
          setSuccessMessage('Package updated successfully!')
          resetPackageForm()
          loadAllData()
        } else {
          setError('Failed to update package')
        }
      } else {
        // Create
        const endpoint = isHighSelling ? 'createHighSellingPackage' : 'createAllPackage'
        const result = await apiService[endpoint]?.(packageData) || { success: true }
        
        if (result.success) {
          setSuccessMessage('Package created successfully!')
          resetPackageForm()
          loadAllData()
        } else {
          setError('Failed to create package')
        }
      }
      
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError('Error saving package')
    }
    
    setLoading(false)
  }

  const resetPackageForm = () => {
    setNewPackageName('')
    setNewPackagePrice('')
    setNewPackageDesc('')
    setNewPackageDuration('')
    setNewPackageIncludes('')
    setNewPackageImage(null)
    setEditingPackageId(null)
    setEditingPackageType(null)
  }

  const handleEditPackage = (pkg, isHighSelling) => {
    setNewPackageName(pkg.name)
    setNewPackagePrice(pkg.price)
    setNewPackageDesc(pkg.description)
    setNewPackageDuration(pkg.duration || '')
    setNewPackageIncludes(Array.isArray(pkg.includes) ? pkg.includes.join(', ') : (pkg.includes || ''))
    setEditingPackageId(pkg.id)
    setEditingPackageType(isHighSelling ? 'high-selling' : 'all')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeletePackage = async (id, isHighSelling = false) => {
    if (!confirm('Are you sure you want to delete this package?')) return
    
    setLoading(true)
    const endpoint = isHighSelling ? 'deleteHighSellingPackage' : 'deleteAllPackage'
    const result = await apiService[endpoint]?.(id) || { success: true }
    
    if (result.success) {
      setSuccessMessage('Package deleted successfully!')
      loadAllData()
      setTimeout(() => setSuccessMessage(''), 3000)
    }
    setLoading(false)
  }

  const handleDeleteEnquiry = async (id) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return

    setLoading(true)
    const result = await apiService.deleteEnquiry?.(id) || { success: true }

    if (result.success) {
      setSuccessMessage('Enquiry deleted successfully!')
      loadAllData()
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      setError(result.message || 'Failed to delete enquiry')
    }
    setLoading(false)
  }

  const handleUploadPackageImage = async (packageId, file, isHighSelling = false) => {
    if (!file) return
    
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    
    const endpoint = isHighSelling ? 'uploadHighSellingPackageImage' : 'uploadPackageImage'
    const result = await apiService[endpoint]?.(packageId, file) || { success: true }
    
    if (result.success) {
      setSuccessMessage('Image uploaded successfully!')
      loadAllData()
      setTimeout(() => setSuccessMessage(''), 3000)
    }
    setLoading(false)
  }

  // ===== ABOUT/VIDEO FUNCTIONS =====
  const handleUpdateAbout = async () => {
    if (!aboutContent.trim()) {
      setError('Please enter content')
      return
    }
    
    setLoading(true)
    const result = await apiService.updateAbout?.({ content: aboutContent, video: aboutVideo }) || { success: true }
    
    if (result.success) {
      setSuccessMessage('About content updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
    setLoading(false)
  }

  const handleUploadAboutVideo = async (file) => {
    if (!file) return
    
    setLoading(true)
    const result = await apiService.uploadAboutVideo?.(file) || { success: true }
    
    if (result.success) {
      setSuccessMessage('Video uploaded successfully!')
      setAboutVideo(result.data?.video || result.data?.url || '')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
    setLoading(false)
  }

  const handleHomeImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setLoading(true)
    const result = await apiService.uploadHomeImage?.(file) || { success: true }
    
    if (result.success) {
      setSuccessMessage('Image uploaded successfully!')
      loadAllData()
      setTimeout(() => setSuccessMessage(''), 3000)
    }
    setLoading(false)
  }

  const handleDeleteImage = async (id) => {
    if (!confirm('Delete this image?')) return
    
    setLoading(true)
    const result = await apiService.deleteHomeImage?.(id) || { success: true }
    
    if (result.success) {
      setSuccessMessage('Image deleted successfully!')
      loadAllData()
      setTimeout(() => setSuccessMessage(''), 3000)
    }
    setLoading(false)
  }

  const handleDownloadEnquiriesExcel = async () => {
    setLoading(true)
    const result = await apiService.downloadEnquiriesExcel?.()

    if (result?.success && result.blob) {
      const fileUrl = URL.createObjectURL(result.blob)
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = result.filename || 'enquiries.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(fileUrl)
      setSuccessMessage('Enquiries Excel downloaded successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      setError(result?.message || 'Failed to download enquiries file')
    }

    setLoading(false)
  }

  // ===== LOGIN SCREEN =====
  if (!isLoggedIn) {
    return (
      <div className="admin-container">
        <div className="login-card">
          <form onSubmit={handleLogin}>
            <h1 className="login-title">Admin Panel</h1>
            
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
    )
  }

  // ===== ADMIN DASHBOARD =====
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Travel Website Admin Panel</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="admin-nav">
        <button className={activeTab === 'enquiries' ? 'active' : ''} onClick={() => setActiveTab('enquiries')}>
          📧 Enquiries
        </button>
        <button className={activeTab === 'home-images' ? 'active' : ''} onClick={() => setActiveTab('home-images')}>
          🖼️ Home Images
        </button>
        <button className={activeTab === 'high-selling' ? 'active' : ''} onClick={() => setActiveTab('high-selling')}>
          ⭐ High-Selling Packages
        </button>
        <button className={activeTab === 'all-packages' ? 'active' : ''} onClick={() => setActiveTab('all-packages')}>
          📦 All Packages
        </button>
        <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>
          ℹ️ About & History
        </button>
      </div>

      <div className="admin-content">
        {/* Enquiries Section */}
        {activeTab === 'enquiries' && (
          <div className="section">
            <div className="section-header-row">
              <h2>Customer Enquiries</h2>
              <button
                type="button"
                className="export-enquiries-btn"
                onClick={handleDownloadEnquiriesExcel}
                disabled={loading}
              >
                Download Excel
              </button>
            </div>
            <div className="enquiries-list">
              {enquiries.length === 0 ? (
                <p className="empty-message">No enquiries yet</p>
              ) : (
                enquiries.map((enquiry) => (
                  <div key={enquiry.id} className="enquiry-item">
                    <div className="enquiry-header">
                      <h3>{enquiry.name}</h3>
                      <div className="enquiry-controls">
                        <span className="enquiry-date">{new Date(enquiry.timestamp).toLocaleDateString()}</span>
                        <button
                          type="button"
                          className="enquiry-delete-btn"
                          onClick={() => handleDeleteEnquiry(enquiry.id)}
                          disabled={loading}
                          aria-label="Delete enquiry"
                          title="Delete enquiry"
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                    <p><strong>Email:</strong> {enquiry.email}</p>
                    {enquiry.contact && <p><strong>Contact:</strong> {enquiry.contact}</p>}
                    {enquiry.package && <p><strong>Package:</strong> {enquiry.package}</p>}
                    <p><strong>Message:</strong> {enquiry.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Home Images Section */}
        {activeTab === 'home-images' && (
          <div className="section">
            <h2>Home Page Images</h2>
            <div className="upload-area">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleHomeImageUpload}
                disabled={loading}
              />
              <p>Upload images to display on home page</p>
            </div>
            <div className="images-grid">
              {homeImages.length === 0 ? (
                <p className="empty-message">No images uploaded yet</p>
              ) : (
                homeImages.map((img) => (
                  <div key={img.id} className="image-card">
                    <img src={img.url} alt="Home" />
                    <button 
                      onClick={() => handleDeleteImage(img.id)}
                      disabled={loading}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* High-Selling Packages Section */}
        {activeTab === 'high-selling' && (
          <div className="section">
            <h2>High-Selling Packages</h2>
            <div className="package-form">
              <h3>{editingPackageId && editingPackageType === 'high-selling' ? 'Update Package' : 'Create New Package'}</h3>
              <div className="form-group">
                <label>Package Name</label>
                <input
                  type="text"
                  value={newPackageName}
                  onChange={(e) => setNewPackageName(e.target.value)}
                  placeholder="e.g., Bali Paradise"
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="text"
                  value={newPackagePrice}
                  onChange={(e) => setNewPackagePrice(e.target.value)}
                  placeholder="e.g., $1299"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newPackageDesc}
                  onChange={(e) => setNewPackageDesc(e.target.value)}
                  placeholder="Package details..."
                  rows="4"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleCreateOrUpdatePackage(true)}
                  disabled={loading}
                  className="create-btn"
                  style={{ flex: 1 }}
                >
                  {editingPackageId && editingPackageType === 'high-selling' ? 'Update' : 'Create'} Package
                </button>
                {editingPackageId && (
                  <button 
                    onClick={resetPackageForm}
                    disabled={loading}
                    className="cancel-btn"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="packages-grid">
              {highSellingPackages.length === 0 ? (
                <p className="empty-message">No high-selling packages yet</p>
              ) : (
                highSellingPackages.map((pkg) => (
                  <div key={pkg.id} className="package-card">
                    {pkg.image && <img src={pkg.image} alt={pkg.name} className="package-image" />}
                    <div className="package-content">
                      <h3>{pkg.name}</h3>
                      <p className="price">{pkg.price}</p>
                      <p className="description">{pkg.description}</p>
                    </div>
                    <div className="package-actions">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleUploadPackageImage(pkg.id, e.target.files[0], true)}
                        disabled={loading}
                        style={{ width: '100%', marginBottom: '8px' }}
                      />
                      <button 
                        onClick={() => handleEditPackage(pkg, true)}
                        disabled={loading}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePackage(pkg.id, true)}
                        disabled={loading}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* All Packages Section */}
        {activeTab === 'all-packages' && (
          <div className="section">
            <h2>All Packages</h2>
            <div className="package-form">
              <h3>{editingPackageId && editingPackageType === 'all' ? 'Update Package' : 'Create New Package'}</h3>
              <div className="form-group">
                <label>Package Name</label>
                <input
                  type="text"
                  value={newPackageName}
                  onChange={(e) => setNewPackageName(e.target.value)}
                  placeholder="e.g., Europe Tour"
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="text"
                  value={newPackagePrice}
                  onChange={(e) => setNewPackagePrice(e.target.value)}
                  placeholder="e.g., $1999"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newPackageDesc}
                  onChange={(e) => setNewPackageDesc(e.target.value)}
                  placeholder="Package details..."
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={newPackageDuration}
                  onChange={(e) => setNewPackageDuration(e.target.value)}
                  placeholder="e.g., 6 Days / 5 Nights"
                />
              </div>
              <div className="form-group">
                <label>Includes (comma separated)</label>
                <input
                  type="text"
                  value={newPackageIncludes}
                  onChange={(e) => setNewPackageIncludes(e.target.value)}
                  placeholder="e.g., Flight, Hotel, Breakfast, Transfers"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleCreateOrUpdatePackage(false)}
                  disabled={loading}
                  className="create-btn"
                  style={{ flex: 1 }}
                >
                  {editingPackageId && editingPackageType === 'all' ? 'Update' : 'Create'} Package
                </button>
                {editingPackageId && (
                  <button 
                    onClick={resetPackageForm}
                    disabled={loading}
                    className="cancel-btn"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="packages-grid">
              {allPackages.length === 0 ? (
                <p className="empty-message">No packages yet</p>
              ) : (
                allPackages.map((pkg) => (
                  <div key={pkg.id} className="package-card">
                    {pkg.image && <img src={pkg.image} alt={pkg.name} className="package-image" />}
                    <div className="package-content">
                      <h3>{pkg.name}</h3>
                      <p className="price">{pkg.price}</p>
                      <p className="description">{pkg.description}</p>
                      {pkg.duration && <p className="description"><strong>Duration:</strong> {pkg.duration}</p>}
                      {Array.isArray(pkg.includes) && pkg.includes.length > 0 && (
                        <p className="description"><strong>Includes:</strong> {pkg.includes.join(', ')}</p>
                      )}
                    </div>
                    <div className="package-actions">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleUploadPackageImage(pkg.id, e.target.files[0], false)}
                        disabled={loading}
                        style={{ width: '100%', marginBottom: '8px' }}
                      />
                      <button 
                        onClick={() => handleEditPackage(pkg, false)}
                        disabled={loading}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePackage(pkg.id, false)}
                        disabled={loading}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* About & History Section */}
        {activeTab === 'about' && (
          <div className="section">
            <h2>About Us & History</h2>
            <div className="content-form">
              <h3>About Content</h3>
              <textarea
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                placeholder="Enter about us content..."
                rows="8"
              />
              
              <h3 style={{ marginTop: '30px' }}>Background Video</h3>
              <div className="video-upload">
                <input 
                  type="file" 
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && handleUploadAboutVideo(e.target.files[0])}
                  disabled={loading}
                />
                <p>Upload a video to display on the page</p>
              </div>
              
              {aboutVideo && (
                <div className="video-preview">
                  <h4>Video Preview</h4>
                  <video width="300" controls>
                    <source src={aboutVideo} type="video/mp4" />
                  </video>
                </div>
              )}
              
              <button 
                onClick={handleUpdateAbout}
                disabled={loading}
                className="save-btn"
              >
                Save All Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
